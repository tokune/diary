module.exports = { 
    define: function (db, models, next) {
        models.User= db.define("users", {
            user_id : {type:"number", key:true},
            name : String,
            data : Object,
        }); 
        models.Diary = db.define("diarys", {
            diary_id : {type:"number", key:true},
            user_id : Number,
            title : String,
            content : String,
            date : {type:"date", time: true},
        }); 
        models.Image = db.define("images", {
            img_id : {type:"number", key:true},
            diary_id : Number,
            url : String,
            data : String,
        }); 
        next();
    }   
}
