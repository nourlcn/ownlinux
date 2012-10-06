/*
 * GET home page.
 */

module.exports = function(app){
   	var User = require('../models/user.js');
   	var Post = require('../models/post.js');
   	   		
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
    
    app.post('/login', function(req, res){
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        
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
	
	app.post('/post', function(req, res){
		var current_user = req.session.user;
		var post = new Post(current_user.name, req.body.post_content);
		
		post.save(function(err){
			if (err){
				req.flash('error','save post error');
				return res.redirect('/');
			}											
			req.flash('success', 'save success');
			res.redirect('/u/' + current_user.name);
		});
	});
	
	app.get('/', function(req, res){
        res.render('index', {title: "Test Title"});
    });
        
    app.get('/signup', function(req, res){
        res.render('signup', {title:"Signup"});
    });
    
    app.get('/login', function(req, res){
		return res.render('login',{title: "Login"});
	});
	
	app.get('/post', function(req, res){
		if (!req.session.user){
			req.flash('error','Please login');
			return res.redirect('/login');
		}
		
		res.render('post', {title: "post page title"});
	});
	
	app.get('/u/:user', function(req, res){
		User.get(req.params.user, function(err, user){
			if (!user){
				req.flash('error', 'user not exist');
				return res.redirect('/post');
			}
			
			Post.get(user.name, function(err, posts){
				if (err){
					req.flash('error', err);
					return res.redirect('/post');
				}
				
				res.render('user', {posts: posts, title: user.name});
			});
		});
	});
	
	app.get('/logout', function(req, res){
		req.session.user = null;
		res.redirect('/login');
	});
};
