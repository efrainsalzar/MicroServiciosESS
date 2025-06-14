const express = require('express');
const amqp = require('amqplib/callback_api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6000;

// Configuración
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'admin';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'admin';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3000/api';

// Función para escribir logs
function writeLog(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Escribir al archivo de log
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(path.join(logsDir, 'notifications.log'), logMessage);
}

// Función para obtener información del usuario
async function getUserInfo(userId) {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/get_id/${userId}`);
        return response.data;
    } catch (error) {
        writeLog(`Error obteniendo información del usuario ${userId}: ${error.message}`);
        return null;
    }
}

// Función para procesar notificaciones
async function procesarNotificacion(mensaje) {
    try {
        const { tipo, datos } = mensaje;
        
        writeLog(`Procesando notificación tipo: ${tipo}`);
        
        switch (tipo) {
            case 'reserva_creada':
                await procesarReservaCreada(datos);
                break;
                
            case 'reserva_cancelada':
                await procesarReservaCancelada(datos);
                break;
                
            default:
                writeLog(`Tipo de notificación no reconocido: ${tipo}`);
        }
        
    } catch (error) {
        writeLog(`Error procesando notificación: ${error.message}`);
    }
}

async function procesarReservaCreada(datos) {
    const { reserva_id, paciente_id, medico_id, especialidad_id, fecha_hora, estado } = datos;
    
    // Obtener información del paciente y médico
    const paciente = await getUserInfo(paciente_id);
    const medico = await getUserInfo(medico_id);
    
    const pacienteNombre = paciente?.name || 'Desconocido';
    const medicoNombre = medico?.name || 'Desconocido';
    
    const fechaFormateada = new Date(fecha_hora).toLocaleString('es-ES');
    
    // Simular envío de notificaciones (en un caso real, aquí enviarías emails, SMS, etc.)
    const notificacionPaciente = `¡Hola ${pacienteNombre}! Tu reserva con el Dr. ${medicoNombre} para ${especialidad_id} el ${fechaFormateada} ha sido confirmada. ID de reserva: ${reserva_id}`;
    
    const notificacionMedico = `Dr. ${medicoNombre}, tienes una nueva reserva con el paciente ${pacienteNombre} para ${especialidad_id} el ${fechaFormateada}. ID de reserva: ${reserva_id}`;
    
    writeLog(`NOTIFICACIÓN PACIENTE: ${notificacionPaciente}`);
    writeLog(`NOTIFICACIÓN MÉDICO: ${notificacionMedico}`);
    
    // Aquí podrías integrar con servicios reales de email/SMS
    // await enviarEmail(paciente.email, 'Reserva Confirmada', notificacionPaciente);
    // await enviarSMS(paciente.telefono, notificacionPaciente);
}

async function procesarReservaCancelada(datos) {
    const { reserva_id, paciente_id, fecha_hora, motivo } = datos;
    
    const paciente = await getUserInfo(paciente_id);
    const pacienteNombre = paciente?.name || 'Desconocido';
    
    const fechaFormateada = new Date(fecha_hora).toLocaleString('es-ES');
    
    const notificacion = `Hola ${pacienteNombre}, tu reserva (ID: ${reserva_id}) programada para el ${fechaFormateada} ha sido cancelada. Motivo: ${motivo}`;
    
    writeLog(`NOTIFICACIÓN CANCELACIÓN: ${notificacion}`);
    
    // Aquí podrías integrar con servicios reales de email/SMS
    // await enviarEmail(paciente.email, 'Reserva Cancelada', notificacion);
}

// Configurar conexión a RabbitMQ
function conectarRabbitMQ() {
    const connectionString = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:5672`;
    
    amqp.connect(connectionString, (error0, connection) => {
        if (error0) {
            writeLog(`Error conectando a RabbitMQ: ${error0.message}`);
            // Reintentar conexión después de 5 segundos
            setTimeout(conectarRabbitMQ, 5000);
            return;
        }
        
        writeLog('Conectado a RabbitMQ exitosamente');
        
        connection.createChannel((error1, channel) => {
            if (error1) {
                writeLog(`Error creando canal: ${error1.message}`);
                return;
            }
            
            const queue = 'notificaciones';
            
            channel.assertQueue(queue, { durable: true });
            channel.prefetch(1); // Procesar un mensaje a la vez
            
            writeLog(`Esperando mensajes en la cola '${queue}'...`);
            
            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    try {
                        const contenido = msg.content.toString();
                        const mensaje = JSON.parse(contenido);
                        
                        writeLog(`Mensaje recibido: ${contenido}`);
                        
                        await procesarNotificacion(mensaje);
                        
                        // Confirmar que el mensaje fue procesado
                        channel.ack(msg);
                        writeLog('Mensaje procesado exitosamente');
                        
                    } catch (error) {
                        writeLog(`Error procesando mensaje: ${error.message}`);
                        // Rechazar el mensaje y no reintentarlo
                        channel.nack(msg, false, false);
                    }
                }
            });
        });
        
        // Manejar cierre de conexión
        connection.on('close', (err) => {
            writeLog('Conexión a RabbitMQ cerrada, reintentando...');
            setTimeout(conectarRabbitMQ, 5000);
        });
        
        connection.on('error', (err) => {
            writeLog(`Error en conexión RabbitMQ: ${err.message}`);
        });
    });
}

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'notification_service',
        timestamp: new Date().toISOString()
    });
});

// Endpoint para obtener logs recientes
app.get('/logs', (req, res) => {
    try {
        const logsPath = path.join(__dirname, 'logs', 'notifications.log');
        if (fs.existsSync(logsPath)) {
            const logs = fs.readFileSync(logsPath, 'utf8');
            const lines = logs.split('\n').filter(line => line.trim() !== '');
            const recentLogs = lines.slice(-50); // Últimas 50 líneas
            res.json({ logs: recentLogs });
        } else {
            res.json({ logs: [] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    writeLog(`Servicio de notificaciones iniciado en puerto ${PORT}`);
    
    // Esperar un poco antes de conectar a RabbitMQ para que esté listo
    setTimeout(conectarRabbitMQ, 3000);
});

// Manejar cierre graceful
process.on('SIGINT', () => {
    writeLog('Cerrando servicio de notificaciones...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    writeLog('Cerrando servicio de notificaciones...');
    process.exit(0);
});