const express = require('express');
const router = express.Router();

var Shopping = require('../models/shopping');

var passport = require('passport');

var Product = require('../models/product');
var Order = require('../models/order');

//Creating a code to index the product on search
var stream = Product.synchronize();
var count = 0;

stream.on('data', function(){
  count++;
});

stream.on('close', function(){
  console.log("Indexed " + count + " documents.\n")
});

stream.on('error', function(err){
  console.log(err);
});

//Creating a search route
router.post("/search", function(req, res, next){
  console.log("Done post request from search bar");
  res.redirect('/search?q=' + req.body.q);
});

//Creating a search code to make search items available
router.get('/search', function(req, res, next){
  if(req.query.q){
    Product.search({
      query_string: {query: req.query.q}
    }, function(err, results){
      results:
      if(err) return next(err);
      var data = results.hits.hits.map(function(hit){
        return hit;
      });
      console.log("Search result is\n");
      console.log(data);
      res.render('searchresult', {
        query: req.query.q,
        data: data
      });
    });
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];

    Product
        .find()
        .exec(function(err, products){
            if(err) return next(err);
            res.render('index', {
                products: products
            });
        });

});

//Helps to find, populate and execute the product through ProductID
router.get('/products/:id', function(req, res, next){
    Product
        .find({category: req.params.id})
        .populate('category')
        .exec(function(err, products){
            if(err) return next(err);
            res.render('main/category', {
                products: products
            });
        });
});

router.get('/product/:id', function (req, res, next) {
    Product.findById({_id: req.params.id}, function (err, product) {
        if(err) return next(err);
        res.render('main/product',{
            product: product
        });
    });

});

//Creating a shop route with ShopID and helps to display the purchased product
router.get('/shop/:id', function(req, res, next){
    console.log("Log message from /shop:id\n");
    var productId = req.params.id;
    var shopping = new Shopping(req.session.shopping ? req.session.shopping : {});

    Product.findById(productId, function(err, product){
        if (err){
            return res.redirect('/');
        }
        shopping.add(product, product.id);
        req.session.shopping = shopping;
        //console.log(req.session.shopping);
        res.redirect('back');
    });
});

//Creating a code to increment the quantity of product through ProductID
router.get('/shop-incr/:id', function(req, res, next){
    console.log("******** Called shop-incr *******\n");

    var productId = req.params.id;
    var shopping = new Shopping(req.session.shopping ? req.session.shopping : {});

    Product.findById(productId, function(err, product){
        if (err){
            return res.redirect('/');
        }
        shopping.increment(product, product.id);
        req.session.shopping = shopping;
        console.log(req.session.shopping);
        res.redirect('/shoppingList');
    });
});

//Creating a code to decrement the quantity of product through ProductID
router.get('/shop-decr/:id', function(req, res, next){
    console.log("******** Called shop-dec *******\n");

    var productId = req.params.id;
    var shopping = new Shopping(req.session.shopping ? req.session.shopping : {});

    Product.findById(productId, function(err, product){
        if (err){
            return res.redirect('/');
        }
        shopping.decrement(product, product.id);
        req.session.shopping = shopping;
        console.log(req.session.shopping);
        res.redirect('/shoppingList');
    });

});

router.get('/shop-rm/:id', function(req, res, next){
    console.log("******** Called shop-dec *******\n");

    var productId = req.params.id;
    var shopping = new Shopping(req.session.shopping ? req.session.shopping : {});

    Product.findById(productId, function(err, product){
        if (err){
            return res.redirect('/');
        }
        shopping.remove(product, product.id);
        req.session.shopping = shopping;
        console.log(req.session.shopping);
        res.redirect('/shoppingList');
    });

});


/* GET Shopping List */
router.get('/shoppingList', function(req, res, next){
   if(!req.session.shopping){
       return res.render('shoppingList', {products:null});
   }
   var shopping = new Shopping(req.session.shopping);
   res.render('shoppingList', {products:shopping.shoppingArr(), totalPrice:shopping.totalPrice});
});

/* Creating the Buy route */
router.get('/buy', userInside, function(req, res, next){
    if(!req.session.shopping){
        res.redirect('/shoppingList', {products:null});
    }
    var shopping = new Shopping(req.session.shopping);
    var errMsg = req.flash('error')[0];
    res.render('buy', {total: shopping.totalPrice, csrfToken: req.csrfToken(), errMsg: errMsg, noError: !errMsg});
});

/* Using Stripe for payment */
router.post('/buy', userInside, function(req, res, next){
    if(!req.session.shopping){
        return res.redirect('/shoppingList', {products:null});
    }
    var shopping = new Shopping(req.session.shopping);

    var stripe = require("stripe")("sk_test_2oiX3qGHeqycWqqrfk6Br9Yg");

    stripe.charges.create({
        amount: shopping.totalPrice*100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge"
    }, function(err, charge) {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/buy');
        }
        var order = new Order({
            user: req.user,
            shopping: shopping,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result){
            req.flash('success', 'Your products have been sent to shipping');
            req.session.shopping = null;
            res.redirect('/user/profile');
        });

    });
});

module.exports = router;


//If user is logged in then he/she can view his previous records due to the session
function userInside(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.prevUrl = req.url;
    res.redirect('/user/login');
}
