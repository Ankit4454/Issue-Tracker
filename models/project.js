const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    issues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issue'
        }
    ]
},{
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;