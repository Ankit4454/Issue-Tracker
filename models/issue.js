const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: {
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
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    labels: [
        {
            type: String,
            trim: true
        }
    ]
},{
    timestamps: true
});

const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;