const mongoose = require('mongoose');

const OrgSchema = mongoose.Schema({
    organizationName:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:false
    },

});


const Organization = module.exports = mongoose.model('Org',OrgSchema);