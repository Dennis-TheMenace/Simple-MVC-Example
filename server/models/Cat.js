const mongoose = require('mongoose');

let CatModel = {};

//Name, # of beds, createdDate
const CatSchema = new mongoose.Schema(
{
    name: 
    {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    bedsOwned:
    {
        type: Number,
        min: 0,
        requires: true,
    },
    createdDate:
    {
        type: Date,
        default: Date.now,

    },
});

CatModel = mongoose.model('Cat', CatSchema);

module.exports = CatModel;