var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'charge';
    var block = {
        app: app,
        group: 'app',
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        user_id: {
            type: 'string'
        },
        shopping_cart: {
            type: 'object',
            subtype: {
                type: 'json'
            }
        },
        payment_type: {
            type: 'string',
            values: ['stripe', 'paypal', 'square']
        },
        payment_amount: {
            type: 'string'
        },
        payment_result: {
            type: 'object',
            subtype: {
                type: 'json'
            }
        },
        status: {
            type: 'string',
            values: ['active', 'inactive', 'complete']
        },
        create_date: {
            type: 'date'
        },
        create_by: {
            type: 'string'
        },
        edit_date: {
            type: 'date'
        },
        edit_by: {
            type: 'string'
        }
    };
    
    block.listFields = [
        { name:'user_id', display:'User', flex:2, sort:'asc' },
        { name:'payment_type', display:'Payment Type', flex:2 },
        { name:'payment_amount', display:'Payment Amount', flex:2 },
        { name:'status', display:'Status', flex:2 },
        { name:'create_date', display:'Create Date', flex:2 }
    ];
    
    // block.data
    block.data.getChargeData = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var condition = { _id:parameter.id };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            callback && callback(error, docs, info);
        });
    };
    
    block.data.processPayment = function(req, res, basket) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var loginUser = req.session && req.session.user;
        // use stripe for payment processing
        var stripe = require('stripe')(app.setting.payment.stripe_secret_key);
        var stripeToken = parameter.stripeToken;
        var amount = parameter.amount;
        var charge = stripe.charges.create({
            amount: amount, // amount in cents
            currency: 'usd',
            source: stripeToken,
            description: "reactcms charge"
        }, function(error, charge) {
            var payment = {
                user_id: loginUser._id,
                payment_result: charge,
                shopping_cart: basket,
                payment_type: 'stripe',
                payment_amount: charge.amount,
                status: 'active',
                create_date: new Date()
            };
            block.data.savePayment(req, res, payment, function(error, docs, info) {
                callback && callback(error, docs, info);
            });
        });
    };
    
    block.data.savePayment = function(req, res, payment) {
        var callback = arguments[3] || null;
        block.data.add(req, res, payment, function(error, docs, info) {
            callback && callback(error, docs, info);
        });
    };
    
    // block.page
    block.page.getChargeReceipt = function(req, res) {
        var parameter = tool.getReqParameter(req);
        block.data.getChargeData(req, res, null, function(error, docs, info) {
            var charge = docs && docs[0] || null;
            var page = app.getPage(req);
            page.charge = charge;
            res.render('charge/receipt', { page:page });
        });
    };
    
    // data route
    
    /*
    app.server.all('/data/baskets/add/:productid', block.data.checkLogin);
    app.server.post('/data/baskets/add/:productid', block.data.addToBasket);
    app.server.all('/data/baskets/show', block.data.checkLogin);
    app.server.get('/data/baskets/show/:userId', block.data.getUserBasket);
    */
    
    // page route
    app.server.all('/charges/*', block.page.checkLogin);
    app.server.get('/charge/:id', block.page.getChargeReceipt);
    app.server.all('/receipt/*', block.page.checkLogin);
    app.server.get('/receipt/:id', block.page.getChargeReceipt);
    
    return block;
};

