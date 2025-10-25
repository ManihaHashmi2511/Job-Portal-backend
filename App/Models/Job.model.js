const mongoose = require('mongoose');
const { Schema, model } = mongoose;


let jobSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    requirements:{
        type: [String] // Array of strings for requirements    
    },
    jobType:{
        type: String,
        required: true,
    },
    experience:{
        type: String,
        required: true,
    },
    position:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    salary:{
        type: String,
        required: true,
    },
    companyId:{
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    postedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    application:[{
        type: Schema.Types.ObjectId,
        ref: 'Application',
    }]
},{ timestamps: true });

let Job = model('Job', jobSchema);

module.exports = Job;