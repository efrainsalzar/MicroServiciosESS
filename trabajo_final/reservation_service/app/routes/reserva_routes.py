from flask import Blueprint
from app.controllers.reserva_controller import get_reservas, post_reserva, cancelar_reserva, get_reservas_private, get_user_by_id, post_reserva

reserva_bp = Blueprint('reserva_bp', __name__)

# Aquí "get_users" es la función importada, no la que defines.
reserva_bp.route('/get_reserva', methods=['GET'])(get_reservas)
reserva_bp.route('/create_reserva', methods=['POST'])(post_reserva)
reserva_bp.route('/cancel_reserva/<int:reserva_id>', methods=['PUT'])(cancelar_reserva)
reserva_bp.route('/get_reserva_private', methods=['GET'])(get_reservas_private)
reserva_bp.route('/get_id/<int:user_id>', methods=['GET'])(get_user_by_id)
reserva_bp.route('/create_post_reserva', methods=['POST'])(post_reserva)