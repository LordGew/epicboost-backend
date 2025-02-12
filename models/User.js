const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    f_name: { 
        type: String, 
        required: true },
    l_name: { 
        type: String, 
        required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true },
    password: { 
        type: String, 
        required: true },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
      },
    avatar: { 
        type: String, 
        typeof: String, 
        default: "img.png" },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
},
    { timestamps: true });

module.exports = model("User", userSchema)