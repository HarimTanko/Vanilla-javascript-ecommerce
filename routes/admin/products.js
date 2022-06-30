const express = require('express');
const ProductsRepository = require('../../repositories/products');

const router = express.Router();

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {});

module.exports = router;
