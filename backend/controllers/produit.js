const uuid = require('uuid/v1');
const Produit = require('../model/Produit');

exports.getAllProduits = (req, res, next) => {
    Produit.find().then(
    (produits) => {
      const mappedProduits = produits.map((produit) => {
        produit.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + produit.imageUrl;
        return produit;
      });
      res.status(200).json(mappedProduits);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  );
};

exports.getOneProduit = (req, res, next) => {
    Produit.findById(req.params.id).then(
    (produit) => {
      if (!produit) {
        return res.status(404).send(new Error('Produit not found!'));
      }
      produit.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + produit.imageUrl;
      res.status(200).json(produit);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  )
};

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */
exports.orderProduits = (req, res, next) => {
  if (!req.body.contact ||
      !req.body.contact.firstName ||
      !req.body.contact.lastName ||
      !req.body.contact.address ||
      !req.body.contact.city ||
      !req.body.contact.email ||
      !req.body.products) {
    return res.status(400).send(new Error('Bad request!'));
  }
  let queries = [];
  for (let productId of req.body.products) {
    const queryPromise = new Promise((resolve, reject) => {
        Produit.findById(productId).then(
        (produit) => {
          if (!produit) {
            reject('Produit not found: ' + productId);
          }
          produit.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + produit.imageUrl;
          resolve(produit);
        }
      ).catch(
        () => {
          reject('Database error!');
        }
      )
    });
    queries.push(queryPromise);
  }
  Promise.all(queries).then(
    (produits) => {
      const orderId = uuid();
      return res.status(201).json({
        contact: req.body.contact,
        products: produits,
        orderId: orderId
      })
    }
  ).catch(
    (error) => {
      console.log(error)
      return res.status(500).json(new Error(error));
    }
  );
};