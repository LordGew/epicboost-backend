const Order = require("../models/Order");
const Product = require("../models/Product");


const createOrder = async (req, res) => {
    try{
        const userID = req.user._id
        const { items, totalPrice, paymentMethod} = req.body;
        if(!items || items.length === 0){
            return res.status(400).json({msg: "No product on the order"});

        }
        //crear la nueva orden
        const order = new Order({
            user: userID,
            items,
            totalPrice,
            paymentMethod,
            status: 'Pending',
        });
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    }catch(error){ 
        console.log(error);
        res.status(500).json({msg: "Error creating a order"});
        
    }
};
module.exports = { createOrder };