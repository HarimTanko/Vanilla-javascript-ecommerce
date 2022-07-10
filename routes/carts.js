const express = require('express');

const router = express.Router();

//recieve a post requuest for adding item to cart
router.post('/cart/products', async (req, res) => {
  console.log(req.body.productId);

  res.send(`Added product with id ${req.body.productId}`);
});
module.exports = router;
