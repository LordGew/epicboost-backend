 const Product = require("../models/Product");

 //obtener todos los productos
 exports.getProducts = async(req, res)=>{
    try{
        const products = await Product.find();
        res.json(products);
    }catch(error){
        res.status(500).json({msg: "Error geting products"});
        console.log(error);
    }
 };


 //obtener producto por ID
 exports.getProductsByID = async(req, res) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({msg: "No product found"});
        res.json(product);

    }catch(error){
        res.status(500).json({msg: "Error geting a product"});
        console.log(error);
    }
 }


 //crear nuevo producto
 exports.createProduct = async(req, res)=>{
    try{
        const {name, description, price,image, category, stock} = req.body;
        const newProduct = new Product ({name, description, price, image, category, stock});
        await newProduct.save();
        res.status(201).json(newProduct);
    }catch(error){
        res.status(500).json({msg: "Error to create a product"});
        console.log(error);
    
    }
 };

 //actualizar un producto por ID
 exports.updateProduct = async (req, res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, req.body,
            {new : true});
        if(!updatedProduct) return res.status(400).json({msg: "No product found"});
        res.json(updatedProduct);

    }catch(error){
        res.status(500).json({msg: "Error updating product"});
        console.log(error);
        
    }
 };

 //eliminar product by id
 exports.deleteProductByID = async (req, res) => {
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct) return res.status(404).json({msg: "product not found"})
        res.json({msg: "Poruduct deleted"})   

    }catch(error){
        console.log(error);
        res.status(500).json({msg: "Error deleting product"})
    }
    
 }
