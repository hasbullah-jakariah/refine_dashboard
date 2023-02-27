import Property from "../mongodb/models/Property.js";
import User from "../mongodb/models/User.js"
import * as dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";

dotenv.config();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const getAllProperties = async (req, res) => {
    const {_end, _start, _sort, _order, title_like ="", propertyType =""} =req.query;
    const query = {};

    if(propertyType !== ""){
        query.propertyType = propertyType;
    }
    if(title_like){
        query.title = {$regex : title_like, $options : "i"}
    }
    try {
        const count = await Property.countDocuments({query})
        const property = await Property
        .find(query)
        .limit(_end)
        .skip(_start)
        .sort({[_sort] : _order})

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");


        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

const getPropertyDetail = async (req, res) => {
    const {id} = req.params;
    const propertyExist = await Property.findOne({_id : id}).populate("creator");

    if(propertyExist){
        res.status(200).json(propertyExist);
    }else {
        res.status(404).json({message : "Property not found"});
    }

};

const createProperty = async (req, res) => {
    try {
        
        const {title, description,propertyType, location,price,photo, email} = req.body;
    
        // memulai session baru
        const session = await mongoose.startSession();
        session.startTransaction();
    
        const user = await User.findOne({email}).session(session);
    
        if(!user) throw new Error("User not found");
    
        const photoUrl = await cloudinary.uploader.upload(photo);
    
        const newProperty = await Property.create({
            title,
            description,
            location,
            propertyType,
            price,
            photo :photoUrl.url,
            creator : user._id,
        });
    
        user.allProperties.push(newProperty._id);
    
        await user.save({ session});
        await session.commitTransaction();
    
    
        res.status(200).json({message : "create property is successfull"})
    } catch (error) {
        res.status;(500).json({message : error.message})
    }
};

const updateProperty = async (req, res) => {
    try {
        const {id} = req.params
        const {title, propertyType, location, photo, price, description} = req.body;

        const photoUrl = await cloudinary.uploader.upload(photo)
        
        await Property.findByIdAndUpdate({_id : id}, {
            title,
            price,
            description,
            propertyType,
            location,
            photo : photoUrl.url || photo
        })

        res.status(200).json({message : "Property updated successfully"});
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

const deleteProperty = async (req, res) => {
    try {
        const {id} = req.params;

        const propertyDelete = await Property.findById({_id : id}).populate("creator");

        if(!propertyDelete) throw new Error("Property not found")

        const session = await mongoose.startSession();
        session.startTransaction();
        propertyDelete.remove({session});
        propertyDelete.creator.allProperties.pull(propertyDelete);
        
        await propertyDelete.creator.save({session});
        await session.commitTransaction();


        res.status(200).json({essage : "Property deleted successfully"})
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

export {
    getAllProperties,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty,
};