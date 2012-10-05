/*
 * GET home page.
 */

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index', {title: "Index", user: req.session.user});
    });
        
    app.get('/signup', function(req, res){
        res.render('signup', {title:"Signup"});
    });
    
    app.post('/signup', function(req, res){
        if(req.body['password-repeat'] != req.body['password']){
            return res.redirect('/signup');
        }
        
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        var User = require('../models/user.js');
        
        var newUser = new User({
            name: req.body.username,
            password: password,
        });
               
        User.get(newUser.name, function(err, user){
				if(user)
					err = "Username already exits.";
				
				if(err){
					req.flash('error', err);
					return res.redirect('/signup');
				}
				
				newUser.save(function(err){
					if(err){
						req.flash('error', err);
						return res.redirect('/signup');
					}
					
					req.session.user = newUser;
					res.redirect('/');
				});
		});        
    });
    
    app.get('/login', function(req, res){
		return res.render('login',{title: "Login"});
	});
    
    app.post('/login', function(req, res){
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        var User = require('../models/user.js');
        
        User.get(req.body.username, function(err, user){
			if (!user){
				req.flash('error', 'User not exist');
				return res.redirect('/404');
			}
			
			if (user.password != password){
				req.flash('error', 'password wrong');
				return res.redirect('/passwdwrong');
			}
			
			req.session.user = user;
			res.redirect('/');
		});
	});
	
	app.get('/logout', function(req, res){
		req.session.user = null;
		res.redirect('/login');
	});
};
