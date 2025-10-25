const mongoose = require('mongoose');
const { Schema, model } = mongoose;


let applicationSchema = new Schema({
    job:{
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applicants:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
}, {timestamps: true});

let Application = model('Application', applicationSchema);

module.exports = Application;