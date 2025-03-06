const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// calculadora
app.post('/calcular', (req, res) => {
  const { a, b, operacion } = req.body;
  let resultado;

  const num1 = parseInt(a);
  const num2 = parseInt(b);

  switch (operacion) {
    case 'sumar':
      resultado = num1 + num2;
      break;
    case 'restar':
      resultado = num1 - num2;
      break;
    case 'multiplicar':
      resultado = num1 * num2;
      break;
    case 'dividir':
      if (num2 !== 0) {
        resultado = num1 / num2;
      } else {
        resultado = 'Error';
      }
      break;
    default:
      resultado = 'Operación no valida';
      break;
  }

  res.send(`<h1>Resultado: ${resultado}</h1><br><a href="/">Volver</a>`);
});

// Levanta el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
