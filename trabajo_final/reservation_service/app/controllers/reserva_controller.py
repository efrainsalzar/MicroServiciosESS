from flask import jsonify, request
from app.middlewares.auth import token_required
from app.models import Reserva
from app import db
from flask import g
from datetime import datetime


def get_reservas():
    """
    Retorna todas las reservas sin autenticación (público).
    """
    reservas = Reserva.query.all()
    reservas_list = [{
        "id": r.id,
        "paciente_id": r.paciente_id,
        "medico_id": r.medico_id,
        "fecha_hora": r.fecha_hora.isoformat(),
        "duracion": r.duracion,
        "estado": r.estado,
        "creada_en": r.created_at.isoformat(),
        "actualizada_en": r.updated_at.isoformat()
    } for r in reservas]
    
    return jsonify(reservas_list)


def post_reserva():
    """
    Crear una nueva reserva a partir de JSON recibido.
    """
    data = request.get_json()
    try:
        nueva_reserva = Reserva(
            paciente_id=data['paciente_id'],
            medico_id=data['medico_id'],
            fecha_hora=datetime.fromisoformat(data['fecha_hora']),
            duracion=data.get('duracion', 60),
            estado=data.get('estado', 'activa')
        )
        db.session.add(nueva_reserva)
        db.session.commit()

        return jsonify({
            "id": nueva_reserva.id,
            "paciente_id": nueva_reserva.paciente_id,
            "medico_id": nueva_reserva.medico_id,
            "fecha_hora": nueva_reserva.fecha_hora.isoformat(),
            "duracion": nueva_reserva.duracion,
            "estado": nueva_reserva.estado
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


def cancelar_reserva(reserva_id):
    """
    Cancela una reserva cambiando su estado a 'cancelada'.
    """
    reserva = Reserva.query.get(reserva_id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    reserva.estado = "cancelada"
    db.session.commit()

    return jsonify({"mensaje": f"Reserva {reserva.id} cancelada con éxito"})



@token_required
def get_reservas_private():
    """
    Retorna las reservas solo si el token JWT es válido.
    Filtra las reservas según el rol y el usuario del token.
    """
    # Asumiendo que el decorador añade estos atributos a request
    user_id = getattr(g, 'id', None)  
    user_role = getattr(g, 'role', None)  # Es un string, ej: "admin", "paciente", "medico"

    if not user_id or not user_role:
        return jsonify({"error": "Usuario no autenticado"}), 401

    # Ejemplo de filtrado simple según rol
    if user_role == "admin":
        # Admin ve todas las reservas
        reservas = Reserva.query.all()
    elif user_role == "paciente":
        # Paciente ve solo sus reservas
        reservas = Reserva.query.filter_by(paciente_id=user_id).all()
    elif user_role == "medico":
        # Médico ve solo reservas asociadas a él
        reservas = Reserva.query.filter_by(medico_id=user_id).all()
    else:
        return jsonify({"error": "Rol no autorizado"}), 403

    reservas_list = [{
        "id": r.id,
        "paciente_id": r.paciente_id,
        "medico_id": r.medico_id,
        "fecha_hora": r.fecha_hora.isoformat(),
        "duracion": r.duracion,
        "estado": r.estado
    } for r in reservas]

    return jsonify(reservas_list)

