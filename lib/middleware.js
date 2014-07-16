var config = require('../config');

exports.login_middleware = function(req, res, next) {
    if (req.path === '/' || req.path === '/oauth') return next();
    if (req.session.uid === config.uid) return next();
    res.redirect('/');
};
