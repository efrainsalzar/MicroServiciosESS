import logging
import os

# Crear carpeta para logs
log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
os.makedirs(log_dir, exist_ok=True)

log_file = os.path.join(log_dir, "app.log")

# Crear un logger personalizado
custom_logger = logging.getLogger("reserva_logger")
custom_logger.setLevel(logging.INFO)

# Evitar que los logs se propaguen al logger raíz
custom_logger.propagate = False

# Verificar si ya tiene handlers (para evitar logs duplicados si se importa varias veces)
if not custom_logger.handlers:
    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    file_handler.setFormatter(formatter)
    custom_logger.addHandler(file_handler)

def log_event(message, user="Anónimo"):
    ip = "Desconocida"
    full_message = f"[{user}] [{ip}] {message}"
    custom_logger.info(full_message)
