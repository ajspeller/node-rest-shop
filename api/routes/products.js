/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:products');

const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .then((result) => {
      debug(`From database:\n${result}`);
      // if (result.length >= 0) {
      res.status(200).json(result);
      // } else {
      //   res.status(404).json({
      //     message: 'No entries found.'
      //   });
      // }
    })
    .catch((err) => {
      debug(`From database:\n${err}`);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then((result) => {
      debug(result);
      res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
      });
    })
    .catch((err) => {
      debug(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:productId', (req, res, next) => {
  const {
    productId
  } = req.params;
  Product.findById(productId)
    .then((result) => {
      debug(`From database:\n${result}`);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: 'The ObjectId is invalid.'
        });
      }
    }).catch((err) => {
      debug(`From database:\n${err}`);
      res.status(500).json({
        error: err
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const idToUpdate = {
    _id: id
  };
  const updateOps = {};
  const UO = {
    $set: updateOps
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update(idToUpdate, UO)
    .exec()
    .then((result) => {
      debug(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      debug(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:productId', (req, res, next) => {
  const {
    productId
  } = req.params;
  const removeId = {
    _id: productId
  };
  Product.remove(removeId)
    .then((result) => {
      debug(`From database:\n${result}`);
      res.status(200).json(result);
    })
    .catch((err) => {
      debug(`From database:\n${err}`);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;