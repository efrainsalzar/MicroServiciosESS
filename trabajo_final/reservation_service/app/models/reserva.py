from datetime import datetime
from app import db

class Reserva(db.Model):
    __tablename__ = 'reservas'

    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, nullable=False)
    medico_id = db.Column(db.Integer, nullable=False)
    especialidad_id = db.Column(db.String(50), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False)
    duracion = db.Column(db.Integer, default=60, nullable=False)  # 60 minutos
    estado = db.Column(db.String(20), default='activa', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Reserva {self.id} - Paciente: {self.paciente_id} Médico: {self.medico_id} Fecha: {self.fecha_hora}>"
