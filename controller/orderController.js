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
            Products : items,
            total: totalPrice,
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

const updateOrder = async (req, res) => {
    try{
        const orderId = req.params.id;
        const updateData = req.body;
        const updatedOrder  = await Order.findByIdAndUpdate(orderId, updateData, {new: true})
        if(!updatedOrder){
            return res.status(404).json({ msg: "Order not found" }); 
        }
        res.json(updatedOrder);
    } catch(error){

        console.error(error);
        res.status(500).json({ msg: "Error updating the order" });
    }
};

const deleteOrder = async (req, res) => {
    try{
        const orderId = req.params.id;

        const deleteOrder = await Order.findByIdAndDelete(orderId);


        if(!deleteOrder) {
            return res.status(404).json({ msg: "Order not found" });
        }
        res.json({ msg: "Order deleted successfully" });

        
    }catch(error){
        console.error(error);
        res.status(500).json({ msg: "Error deleting the order" }); 
    }
    
};

const getUserOrders = async(req, res) =>{
try{
    const userID = req.user._id;

    const orders = await Order.find({user: userID});
    return res.json({orders});
}catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error fetching user orders" });
};
}
module.exports = { 
    createOrder ,
    updateOrder,
    deleteOrder,
    getUserOrders
};