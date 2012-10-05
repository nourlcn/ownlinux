
/*
 * GET home page.
 */

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index', {title:"shouye"});
    });
        
    app.get('/signup', function(req, res){
        res.render('signup', {title:"Signup ye"});
    });
    
    app.post('/signup', function(req, res){
        if(req.body['password-repeat'] != req.body['password']){
            return res.redirect('/signup');
        }
        
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        
        var newUser = new User({
            name: req.body.name,
            password: password,
        });
        
        
    });
};
