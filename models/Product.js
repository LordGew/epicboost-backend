const {model, Schema} = require("mongoose");


const productSchema = new Schema({
    name: {
         type: String,
         required: true
        },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    stock: {
        type: Number, 
        required: true, 
        default: 1 
    },
    createdAT: {
        type: Date, 
        default: Date.now
    }
});

module.exports = model("Product", productSchema);