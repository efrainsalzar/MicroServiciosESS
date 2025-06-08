from flask import Flask
from .reserva_routes import reserva_bp

def register_routes(app: Flask):
    app.register_blueprint(reserva_bp)
