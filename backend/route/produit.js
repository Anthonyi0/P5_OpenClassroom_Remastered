const express = require('express');
const router = express.Router();

const produitCtrl = require('../controllers/produit');

router.get('/', produitCtrl.getAllProduits);
router.get('/:id', produitCtrl.getOneProduit);
router.post('/order', produitCtrl.orderProduits);

module.exports = router;