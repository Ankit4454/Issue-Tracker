const Project = require('../models/project');

module.exports.projectForm = function(req,res){
    if(req.xhr){
        return res.status(200).json({
            data:{
                title: 'Create Project'
            }
        });
    }
}

module.exports.createProject = function(req,res){
    Project.create({
        projectName: req.body.projectName,
        description: req.body.description,
        author: req.body.author
    }).then(function(data){
        if(req.xhr){
            return res.status(200).json({
                data: {
                    message: 'Project Created'
                }
            }); 
        }
    }).catch(function(err){
        console.log(`Error while creating project: ${err}`);
    });
}

module.exports.project = function(req,res){
    Project.findById(req.query.id).populate({ path: 'issues', options: { sort: { createdAt: -1 } } }).exec().then(function(data){
        if(req.xhr){
            return res.status(200).json({
                data: {
                    title: data.projectName,
                    project: data
                }
            });
        }
        return res.render('projectDetails', {
            title: data.projectName,
            project: data
        });
    }).catch(function(err){
        console.log(`Error while fetching a project: ${err}`);
    });
}