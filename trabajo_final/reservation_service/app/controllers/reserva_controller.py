from flask import jsonify, request, g
import requests
from app.middlewares.auth import token_required
from app.models import Reserva
from app import db
from datetime import datetime
from app.logger import log_event

import pika
import json

def enviar_notificacion(tipo, datos):
    try:
        # Configurar credenciales de RabbitMQ
        credentials = pika.PlainCredentials(
            username=os.getenv('RABBITMQ_USER', 'admin'),
            password=os.getenv('RABBITMQ_PASS', 'admin')
        )
        
        # Configurar parámetros de conexión
        parameters = pika.ConnectionParameters(
            host=os.getenv('RABBITMQ_HOST', 'rabbitmq'),
            port=5672,
            virtual_host='/',
            credentials=credentials
        )
        
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        
        # Declarar la cola (asegurar que existe)
        channel.queue_declare(queue='notificaciones', durable=True)

        mensaje = {
            'tipo': tipo,
            'datos': datos
        }

        channel.basic_publish(
            exchange='',
            routing_key='notificaciones',
            body=json.dumps(mensaje),
            properties=pika.BasicProperties(delivery_mode=2)
        )

        print(f"[NOTIFICACIÓN] Enviada: {mensaje}")
        connection.close()
        
    except Exception as e:
        print(f"[NOTIFICACIÓN] Error al enviar notificación: {e}")
        # Opcional: registrar en logs más detallados
        import traceback
        print(f"[NOTIFICACIÓN] Traceback: {traceback.format_exc()}")

#USER_SERVICE_URL = "http://localhost:3000/api"
#AGENDA_SERVICE_URL = "http://localhost:4000/graphql"
#USER_SERVICE_URL = "http://localhost:3001/api"
#AGENDA_SERVICE_URL = "http://localhost:4001/graphql"
USER_SERVICE_URL = "http://user_service:3000/api"
AGENDA_SERVICE_URL = "http://agenda_service:4000/graphql"


# ======================= UTILS =======================

def get_user_by_id(user_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/get_id/{user_id}")
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"[ERROR] Servicio de usuarios: {e}")
        return None

def is_authenticated_paciente():
    """Valida que el usuario esté autenticado y sea un paciente."""
    user_id = getattr(g, 'id', None)
    user_role = getattr(g, 'role', None)
    if not user_id or user_role != "paciente":
        return None, jsonify({"error": "Solo los pacientes autenticados pueden realizar esta acción"}), 403
    return user_id, None, None

def get_medicos_disponibles(especialidad_nombre, fecha_iso, jwt_token):
    query = """
    query ObtenerMedicosDisponibles($especialidad: String!, $fecha: String!) {
        getMedicosDisponibles(especialidad: $especialidad, fecha: $fecha) {
            medico_id
            nombre
            especialidades {
                id
                nombre
            }
            horarios_disponibles {
                dia
                horas
            }
        }
    }
    """

    variables = {
        "especialidad": especialidad_nombre,
        "fecha": fecha_iso
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {jwt_token}"
    }

    try:
        response = requests.post(
            AGENDA_SERVICE_URL,
            json={"query": query, "variables": variables},
            headers=headers
        )

        if response.status_code != 200:
            return None, f"Error de red: {response.status_code}"

        data = response.json()

        if "errors" in data:
            # Puedes formatear los errores si quieres más detalle
            return None, data["errors"]

        return data["data"]["getMedicosDisponibles"], None

    except Exception as e:
        return None, str(e)

# ======================= ENDPOINTS =======================

@token_required
def get_reservas():
    user_id, error_response, status = is_authenticated_paciente()
    if error_response:
        return error_response, status
    
    paciente = get_user_by_id(user_id)
    paciente_nombre = paciente.get("name", "Desconocido") if paciente else "Desconocido"

    log_event(f"Paciente '{paciente_nombre}' (ID: {user_id}) solicitó sus reservas.")

    reservas = Reserva.query.filter_by(paciente_id=user_id).all()

    reservas_list = []
    for r in reservas:
        medico = get_user_by_id(r.medico_id)
        medico_nombre = medico.get("name", "Desconocido") if medico else "Desconocido"

        reservas_list.append({
            "id": r.id,
            #"paciente_id": r.paciente_id,
            "paciente_nombre": paciente_nombre,
            #"medico_id": r.medico_id,
            "medico_nombre": medico_nombre,
            "especialidad": r.especialidad_id,
            #"especialidad_nombre": especialidad_nombre,
            "fecha_hora": r.fecha_hora.isoformat(),
            "duracion": r.duracion,
            "estado": r.estado,
            #"creada_en": r.created_at.isoformat(),
            #"actualizada_en": r.updated_at.isoformat()
        })

    return jsonify(reservas_list), 200


@token_required
def create_reserva():
    user_id, error_response, status = is_authenticated_paciente()
    if error_response:
        return error_response, status

    auth_header = request.headers.get("Authorization", "")
    jwt_token = auth_header.split(" ")[1] if " " in auth_header else auth_header

    paciente = get_user_by_id(user_id)
    paciente_nombre = paciente.get("name", "Desconocido") if paciente else "Desconocido"

    data = request.get_json()
    medico_id = data.get("medico_id")
    fecha_hora_str = data.get("fecha_hora")
    especialidad_nombre = data.get("especialidad_nombre")

    log_event(f"Paciente '{paciente_nombre}' (ID: {user_id}) intenta crear reserva para médico {medico_id}, especialidad '{especialidad_nombre}' en fecha {fecha_hora_str}.")

    if not medico_id or not fecha_hora_str or not especialidad_nombre:
        log_event(f"Paciente '{paciente_nombre}' (ID: {user_id}) faltan campos obligatorios en la solicitud de reserva.")
        return jsonify({"error": "Faltan campos obligatorios: medico_id, fecha_hora o especialidad_nombre"}), 400

    try:
        fecha_hora = datetime.fromisoformat(fecha_hora_str)
        fecha_iso = fecha_hora.date().isoformat()  # solo fecha para la consulta

        medicos_disponibles, error = get_medicos_disponibles(especialidad_nombre, fecha_iso, jwt_token)
        if error:
            log_event(f"Error al obtener médicos disponibles: {error}")
            return jsonify({"error": error}), 400

        # Buscar el médico solicitado dentro de los disponibles
        medico_encontrado = next((m for m in medicos_disponibles if m["medico_id"] == medico_id), None)
        if not medico_encontrado:
            log_event(f"Médico {medico_id} no disponible para especialidad '{especialidad_nombre}' y fecha {fecha_iso}.")
            return jsonify({"error": "Médico no disponible para esa especialidad en la fecha"}), 400

        # Buscar la especialidad en el médico
        especialidad = next(
            (e for e in medico_encontrado.get("especialidades", []) if e["nombre"].lower() == especialidad_nombre.lower()),
            None
        )
        if not especialidad:
            log_event(f"Especialidad '{especialidad_nombre}' no encontrada en médico {medico_id}.")
            return jsonify({"error": "Especialidad no encontrada en el médico"}), 400

        especialidad_id = especialidad["nombre"]

        nueva_reserva = Reserva(
            paciente_id=user_id,
            medico_id=medico_id,
            especialidad_id=especialidad_id,
            fecha_hora=fecha_hora,
            duracion=data.get("duracion", 60),
            estado=data.get("estado", "activa")
        )
        db.session.add(nueva_reserva)
        db.session.commit()

        enviar_notificacion("reserva_creada", {
            "reserva_id": nueva_reserva.id,
            "paciente_id": nueva_reserva.paciente_id,
            "medico_id": nueva_reserva.medico_id,
            "especialidad_id": nueva_reserva.especialidad_id,
            "fecha_hora": nueva_reserva.fecha_hora.isoformat(),
            "estado": nueva_reserva.estado
        })

        log_event(f"Reserva creada exitosamente: ID {nueva_reserva.id} para paciente '{paciente_nombre}' (ID: {user_id}).")


        return jsonify({
            "id": nueva_reserva.id,
            "paciente_id": nueva_reserva.paciente_id,
            "medico_id": nueva_reserva.medico_id,
            "especialidad_id": nueva_reserva.especialidad_id,
            "fecha_hora": nueva_reserva.fecha_hora.isoformat(),
            "duracion": nueva_reserva.duracion,
            "estado": nueva_reserva.estado
        }), 201

    except Exception as e:
        db.session.rollback()
        log_event(f"Error al crear reserva para paciente '{paciente_nombre}' (ID: {user_id}): {str(e)}")
        return jsonify({"error": f"Error al crear reserva: {str(e)}"}), 400
    



@token_required
def cancelar_reserva(reserva_id):
    user_id, error_response, status = is_authenticated_paciente()
    if error_response:
        return error_response, status

    paciente = get_user_by_id(user_id)
    paciente_nombre = paciente.get("name", "Desconocido") if paciente else "Desconocido"

    log_event(f"Paciente '{paciente_nombre}' (ID: {user_id}) intenta cancelar reserva ID {reserva_id}.")

    reserva = Reserva.query.get(reserva_id)
    if not reserva:
        log_event(f"Reserva ID {reserva_id} no encontrada para cancelar.")
        return jsonify({"error": "Reserva no encontrada"}), 404

    if reserva.paciente_id != user_id:
        log_event(f"Paciente '{paciente_nombre}' (ID: {user_id}) no tiene permiso para cancelar reserva ID {reserva_id}.")
        return jsonify({"error": "No tienes permiso para cancelar esta reserva"}), 403

    if reserva.estado == "cancelada":
        log_event(f"Reserva ID {reserva_id} ya estaba cancelada.")
        return jsonify({"mensaje": "La reserva ya está cancelada"}), 200

    reserva.estado = "cancelada"
    db.session.commit()

    enviar_notificacion("reserva_cancelada", {
        "reserva_id": reserva.id,
        "paciente_id": reserva.paciente_id,
        "fecha_hora": reserva.fecha_hora.isoformat(),
        "motivo": "Cancelación solicitada por el paciente"
    })    

    log_event(f"Reserva ID {reserva_id} cancelada exitosamente por paciente '{paciente_nombre}' (ID: {user_id}).")

    return jsonify({"mensaje": f"Reserva {reserva.id} cancelada con éxito"}), 200

