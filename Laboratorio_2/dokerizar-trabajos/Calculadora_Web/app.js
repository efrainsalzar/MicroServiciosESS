const express = require('express');
const app = express();
const port = 3000;

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Ruta para mostrar el formulario
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para cargar la plantilla del formulario
app.get('/sumar', (req,resp) => {
    resp.render('sumar');
});

app.get('/restar', (req,resp) => {
    resp.render('restar');
});

app.get('/multiplicar', (req,resp) => {
    resp.render('multiplicar');
});

app.get('/dividir', (req,resp) => {
    resp.render('dividir');
})

// Rutas para introducir los valores a calcular
app.post('/sumar', (req,resp) => {
    const num1 = parseInt(req.body.num1);
    const num2 = parseInt(req.body.num2);
    const respuesta = num1 + num2;
    resp.render('resultado', {respuesta});
});

app.post('/restar', (req,resp) => {
    const num1 = parseInt(req.body.num1);
    const num2 = parseInt(req.body.num2);
    const respuesta = num1 - num2;
    resp.render('resultado', {respuesta});
});

app.post('/multiplicar', (req,resp) => {
    const num1 = parseInt(req.body.num1);
    const num2 = parseInt(req.body.num2);
    const respuesta = num1 * num2;
    resp.render('resultado', {respuesta});
});
app.post('/dividir', (req,resp) => {
    const num1 = parseInt(req.body.num1);
    const num2 = parseInt(req.body.num2);
    const respuesta = num1 / num2;
    resp.render('resultado', {respuesta});
});
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port} http://localhost:${port}`);
});