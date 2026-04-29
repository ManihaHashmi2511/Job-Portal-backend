const mongoose = require('mongoose');
const { Schema, model } = mongoose;


let companySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
    },
    location:{
        type: String,
    },
    website:{
        type: String,
    },
    logo:{
        type: String, // URL or path to the logo file
        default: ''
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{timestamps: true});

let Company = model('Company', companySchema);

module.exports = Company;