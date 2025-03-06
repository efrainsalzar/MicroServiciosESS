const express = require('express');
const app = express();
const port = 3000;

// Configuración de EJS
app.set('view engine', 'ejs');

// Middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Ruta principal que muestra el formulario
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para procesar el formulario y mostrar la tabla de operaciones
app.post('/generar-tabla', (req, res) => {
  const { operacion, numero, inicio, fin } = req.body;

  // Convertir los valores a números
  const num = parseInt(numero);
  const start = parseInt(inicio);
  const end = parseInt(fin);

  // Generar la tabla según la operación seleccionada
  let tabla = [];
  for (let i = start; i <= end; i++) {
    let resultado;
    let operacionTexto;

    switch (operacion) {
      case 'suma':
        resultado = num + i;
        operacionTexto = '+';
        break;
      case 'resta':
        resultado = num - i;
        operacionTexto = '-';
        break;
      case 'multiplicacion':
        resultado = num * i;
        operacionTexto = '*';
        break;
      case 'division':
        if (i === 0) {
          resultado = 'No se puede dividir por cero';
        } else {
          resultado = num / i;
        }
        operacionTexto = '/';
        break;
      default:
        resultado = 'Operación no válida';
    }

    tabla.push({ numero: num, operacion: operacionTexto, valor: i, resultado });
  }

  // Renderizar la tabla con el resultado
  res.render('resultado', { tabla });
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
