const Producto = require('./productModel');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.update(req.body);
        res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
