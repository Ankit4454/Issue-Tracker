const Issue = require('../models/issue');
const Project = require('../models/project');

module.exports.issueLogs = function(req,res){
    Issue.find({}).sort('-createdAt').then(function(data){
        if(req.xhr){
            return res.status(200).json({
                data:{
                    title: 'Issue Logs',
                    issues: data
                }
            });
        }
    }).catch(function(err){
        console.log(`Erro while fetching issues: ${err}`);
    });
}

module.exports.createIssue = function(req,res){
    Issue.create({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        project: req.body.project,
        labels: req.body.labels
    }).then(async function(data){
        let project = await Project.findById(req.body.project);
        project.issues.push(data._id);
        project.save();
        if(req.xhr){
            return res.status(200).json({
                data: {
                    issue: data
                },
                message: 'Issue Created'
            });
        }
    }).catch(function(err){
        console.log(`Error while creating a Issue: ${err}`);
    });
}

module.exports.filterIssues = function(req,res){
    let conditions = {};

    if(req.query.filterProject){
        conditions.project = req.query.filterProject;
    }

    if(req.query.issueAuthor && req.query.issueAuthor !== '-1'){
        conditions.author = req.query.issueAuthor;
    }

    if(req.query.issueLabels){
        conditions.labels = {$in: req.query.issueLabels};
    }

    Issue.find(conditions).sort('-createdAt').exec().then(function(data){
        if(req.xhr){
            return res.status(200).json({
                data:{
                    issues: data
                }
            });
        }
    }).catch(function(err){
        console.log(`Error while filtering Issues: ${err}`);
    });
}

module.exports.searchIssues = function(req,res){
    let conditions = {};

    if(req.query.searchProject){
        conditions.project = req.query.searchProject;
    }

    if(req.query.issueTitle){
        conditions.title = {$regex: req.query.issueTitle, $options: 'i'};
    }

    if(req.query.issueDescription){
        conditions.description = {$regex: req.query.issueDescription, $options: 'i'};
    }

    Issue.find(conditions).sort('-createdAt').exec().then(function(data){
        if(req.xhr){
            return res.status(200).json({
                data:{
                    issues: data
                }
            });
        }
    }).catch(function(err){
        console.log(`Error while searching Issues: ${err}`);
    });
}

module.exports.deleteIssue = function(req,res){
    let issueId = req.query.issueId;
    let projectId = req.query.projectId;

    Issue.deleteOne({_id: issueId}).then(async function(data){
        let project = await Project.findById(projectId);
        let index = project.issues.indexOf(issueId);
        if (index > -1) { 
            project.issues.splice(index, 1); 
        }
        project.save();
        if(req.xhr){
            return res.status(200).json({
                data: {
                    deleted: data.acknowledged,
                    issueId: issueId
                },
                message: 'Issue Deleted'
            });
        }
    }).catch(function(err){
        console.log(`Error while deleting a Issue: ${err}`);
    });
}