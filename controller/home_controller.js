const Project = require('../models/project');

module.exports.home = function(req,res){
    Project.find({}).sort('-createdAt').then(function(data){
        if(req.xhr){
            return res.status(200).json({
                data:{
                    title: 'Home',
                    projects: data
                }
            });
        }
        return res.render('home', {
            title: 'Home',
            projects: data
        });
    }).catch(function(err){
        console.log(`Error while fetching projects: ${err}`);
    });
}