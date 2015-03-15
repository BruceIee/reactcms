var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {
    
    var moduleName = 'user';
    var block = {
        app: app,
        model: null
    };
    block.data = tool.object(require('basedata')(app, moduleName));
    block.page = tool.object(require('basepage')(app, moduleName, block.data));
    
    block.model = {
        username: {
            type: 'string',
            optional: true
        },
        firstname: {
            type: 'string',
            optional: true
        },
        lastname: {
            type: 'string',
            optional: true
        },
        email: {
            type: 'string',
            subtype: {
                type: 'email'
            },
            optional: false,
            option: {
                unique: true
            }
        },
        salt: {
            type: 'string',
            subtype: {
                type:'random'
            },
            auto: true
        },
        password: {
            type: 'string',
            subtype: {
                type: 'password'
            }
        },
        status: {
            type: 'string'
        }
    };
    
    // data
    block.data.addUser = function(req, res) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        // user email is lower case
        parameter.email = parameter.email.toLowerCase();
        tool.setReqParameter(req, parameter);
        var condition = {email: parameter.email};
        var filter = {}
        block.data.get(req, res, condition, filter, function(error, docs, info) {
            var item = docs && docs[0] || null;
            if (item) {
                error = new Error('user exists for email ' + parameter.email);
                info = { message:'Error in adding a new user' };
                app.cb(error, docs, info, req, res, callback);
            }
            else {
                block.data.addUserNext(req, res, null, callback);         
            }
        });
    };
    
    block.data.addUserNext = function(req, res, next, callback) {
        var user = tool.getReqParameter(req);
        user.username = user.username || user.email;
        block.data.add(req, res, user, function(error, docs, info) {
            var user = docs && docs[0];
            if (req.session) {
                req.session.user = user;
            }
            app.cb(error, docs, info, req, res, callback);
        });
    };
    
    block.data.login = function(req, res, next) {
        var callback = arguments[3] || null;
        var parameter = tool.getReqParameter(req);
        var email = parameter.email || '';
        var condition = { email:email };
        var filter = {};
        block.data.get(req, res, condition, filter, function(error, docs, info){
            authenticated = false;
            var user = docs && docs[0] || null;
            if (user) {
                var password = tool.hash(parameter.password + user.salt);
                var message = '';
                if (password === user.password) {
                    message = email + ' passes login';
                    authenticated = true;
                } else {
                    message = email + ' fails login';
                }
            }
            info = { success:authenticated, message:message };
            app.cb(error, user, info, req, res, callback);
        })
    };
    
    
    // page
    block.page.getIndex = function(req, res) {
        block.data.getWeb(req, res, null, function(error, docs, info) {
            var page = { title:'User List', docs:docs };
            page.controller = "users";
            res.render('user/index', { page:page });
        });
    };
    
    block.page.login = function(req, res) {
        var page = app.getPage(req);
        page.title = 'User Login';
        page.controller = "users";
        res.render('user/login', { page:page });
    };
    
    block.page.loginPost = function(req, res) {
        var parameter = tool.getReqParameter(req);
        block.data.login(req, res, null, function(error, user, info) {
            if (info.success) {
                if (req.session) {
                    delete user.salt;
                    delete user.password;
                    console.log('save user in session:', user);
                    req.session.user = user;
                }
                var nextUrl = parameter.redirect || '/';
                res.redirect(nextUrl);
            } else {
                var text = 'Login failed';
                info = {
                    message: 'Incorrect username or password'
                };
                app.renderInfoPage(new Error(text), null, info, req, res);
            }
        });
    };
    
    block.page.signup = function(req, res) {
        var page = app.getPage(req);
        page.title = 'User Signup';
        page.controller = "users";
        res.render('user/signup', { page:page });
    };
    
    block.page.signupPost = function(req, res) {
        var parameter = tool.getReqParameter(req);
        block.data.addUser(req, res, null, function(error, docs, info) {
            if (error) {
                app.renderInfoPage(error, docs, info, req, res);
            } else {
                var user = docs && docs[0];
                var nextUrl = parameter.redirect || '/';
                res.redirect(nextUrl);
            }
        });
    };
    
    block.page.logout = function(req, res) {
        if (req.session) {
            req.session.user = null;
        }
        var nextUrl = '/';
        res.redirect(nextUrl);
    };
    
    block.page.getProfile = function(req, res) {
        var page = app.getPage(req);
        page.title = 'User Profile';
        page.controller = "users";
        res.render('user/profile', { page:page });
    };
    
    // page route
    app.server.get('/' + moduleName, block.page.getIndex);
    app.server.get('/' + moduleName + '/login', block.page.login);
    app.server.post('/' + moduleName + '/login', block.page.loginPost);
    app.server.get('/' + moduleName + '/signup', block.page.signup);
    app.server.post('/' + moduleName + '/signup', block.page.signupPost);
    app.server.get('/' + moduleName + '/logout', block.page.logout);
    app.server.get('/' + moduleName + '/:username/profile', block.page.getProfile);
    
    return block;
};

