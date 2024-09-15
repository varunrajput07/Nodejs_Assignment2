const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');

const upload = require('../app').upload;

router.get('/', async(req, res) => {
    const products = await Product.find().populate('category');
    res.render('products/index', { products });
});

router.get('/new', async(req, res) => {
    const categories = await Category.find();
    res.render('products/new', { categories });
});

router.post('/', upload.array('images', 5), async(req, res) => {
    const newProduct = new Product(req.body);
    newProduct.images = req.files.map(file => file.filename);
    await newProduct.save();
    res.redirect('/products');
});

router.get('/:id/edit', async(req, res) => {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find();
    res.render('products/edit', { product, categories });
});

router.put('/:id', upload.array('images', 5), async(req, res) => {
    const updatedProduct = await Product.findById(req.params.id);
    updatedProduct.name = req.body.name;
    updatedProduct.price = req.body.price;
    updatedProduct.category = req.body.category;
    if (req.files.length > 0) {
        updatedProduct.images = req.files.map(file => file.filename);
    }
    await updatedProduct.save();
    res.redirect('/products');
});

router.delete('/:id', async(req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

module.exports = router;