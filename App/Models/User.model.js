const mongoose = require('mongoose');
const { Schema, model } = mongoose;


let userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String, 
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'recruiter'],
       required: true,
    },
    profile:{
        bio:{type: String},
        skills: [{ type: String }],
        resume: { type: String }, // URL or path to the resume file
        company:{type: Schema.Types.ObjectId, ref: 'Company'},
        profilePicture: { type: String, default: ''}
    },
    experience:{
        type: [{
            jobTitle: String,
            companyName: String,
            startDate: Date,
            endDate: Date,
            description: String
        }]
    },
    education: [{
    institute: String,
    degree: String,
    year: Number
  }]
},{ timestamps: true });

let User = model('User', userSchema);

module.exports = User;