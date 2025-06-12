from flask import Blueprint
from app.controllers.reserva_controller import get_reservas, create_reserva, cancelar_reserva

reserva_bp = Blueprint('reserva_bp', __name__)

# Aquí "get_users" es la función importada, no la que defines.
reserva_bp.route('/get_reserva', methods=['GET'])(get_reservas)
reserva_bp.route('/create_reserva', methods=['POST'])(create_reserva)
reserva_bp.route('/cancel_reserva/<int:reserva_id>', methods=['PUT'])(cancelar_reserva)
