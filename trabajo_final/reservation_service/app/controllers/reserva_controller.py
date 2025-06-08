from flask import jsonify, request
from app.models import Reserva
from app import db
from datetime import datetime


def get_reservas():
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
    reserva = Reserva.query.get(reserva_id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    reserva.estado = "cancelada"
    db.session.commit()

    return jsonify({"mensaje": f"Reserva {reserva.id} cancelada con éxito"})