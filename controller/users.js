const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');

const User = require("../model/User");
const { findOne } = require("../model/User");



const getUsers = async(req, res, next) => {
    let user; 
    try{
        user = await User.find({}, "-password");
    }
    catch(err){
        return next(new HttpError("something went wrong", 422));
    }
    
    if(user.length === 0){
        return next(new HttpError("no user exists"));
    }
    res.status(200).json({users:user});
}



const signUp = async(req, res,  next) => { 
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new HttpError("please enter valid email and password", 422));

    }
    const {name, email, password, image} = req.body;
    
    let user; 
    try{
        user = await User.findOne({ email: email })


    }catch(err){
        return next(new HttpError("something went wrong, please try again later",422));

    }

    if(user){
        return next(new HttpError("user is already exist, please login instead"));

    }
    const createdUser = new User({
        name,
        email,
        password,
        image:"https://www.placecage.com/200/300",
        places:[]
    }) 

    try{
        await createdUser.save();
        res.status(201).json({msg:"created user successfully", user: createdUser});

    }
    catch(err){
        return next(new HttpError("signing up failed, please try again"))

    }

}


const login = async(req, res, next) => {
    const {email, password} = req.body;

    let user; 
    try{
        user = await User.findOne({email: email})
        
    }
    catch(err){
        return next(new HttpError("something went wrong, please try again", 422));
    }
    
    if(!user || user.password !== password){
        return next(new HttpError("invalid credentails  , please login again ", 422));
    }
    res.status(200).json({msg:"LOGGED IN", user: user});

}


exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;