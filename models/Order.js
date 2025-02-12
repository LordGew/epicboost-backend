const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            quantyty: {type: Number, required: true, default: 1},
        },
    ],
    total: {type: Number, required: true},
    paymentMethod: {type: String, required: true},
    status: {
        type: String, 
        enum: ["Pending", "Paid", "Sent", "Delivered"], 
        default: "Pending"
    },
    
},
{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);