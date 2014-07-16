var async = require('async');
var request = require('request');
var config = require('../config');
var weibo = config.weibo;

exports.route = function(app) {
    app.get('/diaries', function(req, res) {
        //var perpage = 2;
        //var page = req.param('page') || 1;
        //req.models.Diary.find({}, { offset: (page-1) * perpage }, perpage, function(err, diaries) {
        req.models.Diary.find({}, function(err, diaries) {
            if (err) return res.json(err);
            res.render('diaries', { cur: 'list', diaries: diaries});
        });
    });

    app.get('/diary/new', function(req, res) {
        res.render('edit_diary', { cur: 'new', diary : {}});
    });

    app.get('/diary/:diary_id', function(req, res) {
        var diary_id = req.param('diary_id');
        if (!diary_id) return res.json("日记未找到");

        req.models.Diary.get(diary_id, function(err, diary) {
            if (err) return res.json(err);
            res.render('diary', { cur: 'list', diary : diary});
        });
    });

    app.get('/diary/:diary_id/edit', function(req, res) {
        var diary_id = req.param('diary_id');
        if (!diary_id) return res.json("日记未找到");

        req.models.Diary.get(diary_id, function(err, diary) {
            if (err) return res.json(err);
            res.render('edit_diary', { cur: 'new', diary : diary});
        });
    });

    app.post('/diary/', function(req, res) {
        var title = req.param('title') || '';
        var content = req.param('content') || '';
        var diary_id = req.param('diary_id');
        async.waterfall([
            function(next){
                if (!diary_id) return next(null, null);
                req.models.Diary.get(diary_id, function(err, diary) {
                    if (err) return next(err);
                    diary.title = title;
                    diary.content = content;
                    diary.save(next);
                });
            },
            function(diary, next){
                if (diary_id) return next(null, diary);
                req.models.Diary.create({
                    user_id : req.session.uid,
                    title : title,
                    content : content,
                    date : new Date(),
                }, next);
            }
        ], function (err, diary) {
            if (err) return res.json(err);
            var respon = {action:"saved", diary_id:diary.diary_id};
            if (diary_id) 
                respon.action = "updated";
            res.json(respon);
        });
    });
};
