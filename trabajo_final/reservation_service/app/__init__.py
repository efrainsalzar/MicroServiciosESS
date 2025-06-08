import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Primero carga configuración base (Config)
    app.config.from_object(Config)
    
    # Sobrescribe con variables de entorno si existen
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', app.config.get('SQLALCHEMY_DATABASE_URI'))
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', app.config.get('SECRET_KEY'))
    app.config['DEBUG'] = os.getenv('DEBUG', str(app.config.get('DEBUG', False))).lower() in ('true', '1', 'yes')
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Importar modelos (para migraciones)
    from app.models import Reserva
    
    # Registrar rutas
    from app.routes import register_routes
    register_routes(app)
    
    return app
