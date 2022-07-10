const express = require('express');
const cart = require('../repositories/cart');

const router = express.Router();

const cartsRepo = require('../repositories/cart');
const productsRepo = require('../repositories/products');

const cartShowTemplate = require('../views/carts/show');

//recieve a post requuest for adding item to cart
router.post('/cart/products', async (req, res) => {
  //Figure out the cart
  let cart;
  if (!req.session.cartId) {
    //We dont have a cart, we need to create one,
    //and store the cartId on the req.session.cartId property

    cart = await cartsRepo.create({ items: [] });

    req.session.cartId = cart.id;
  } else {
    //we have a cart so let get it from the repository add items

    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingItem) {
    //increment qty and save cart
    existingItem.quantity++;
  } else {
    //add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  // increment quantity or add new item to array
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.redirect('/cart');
});

router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);

    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);

  await cartsRepo.update(req.session.cartId, { items });

  res.redirect('/cart');
});
module.exports = router;
