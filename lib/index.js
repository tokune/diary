var async = require('async');
var request = require('request');
var config = require('../config');
var weibo = config.weibo;

exports.route = function(app) {
    app.get('/', function(req, res) {
        var u = req.param('u') || '';
        var ctx = {};
        req.session.uid = '1644274944';
        if (req.session.uid && req.session.uid === config.uid)
            return res.redirect("/diaries/");

        var redirect_uri = encodeURIComponent(weibo.oauth_link);
        res.render('login', { cur: 'login', link: "https://api.weibo.com/oauth2/authorize?client_id="+weibo.key+"&response_type=code&redirect_uri="+redirect_uri });
    });

    app.get('/oauth', function(req, res) {
        var code = req.param('code') || '';
        var redirect_uri = encodeURIComponent(weibo.oauth_link);
        var token_url = "https://api.weibo.com/oauth2/access_token?client_id="+weibo.key+
        "&client_secret="+weibo.secret+"&grant_type=authorization_code&redirect_uri="+redirect_uri+"&code="+code;

        request.post(token_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var token = JSON.parse(body);
                if (token.uid !== config.uid) return res.json({err:"access denied"});

                req.session.uid = token.uid;
                req.models.User.create({
                    name : token.uid,
                    data : {},
                }, function(err) {
                    if (err) return res.json(err);
                    res.redirect("/");
                });
            }
        });
    });
};
