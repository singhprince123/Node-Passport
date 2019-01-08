module.exports = {
    ensureAuthentication: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }else {
            req.flash('error_msg', 'Please Log In.');
            res.redirect('/users/login');
        }
    }
}