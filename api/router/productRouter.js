const express = require('express')
const router = express.Router()
const productModel = require('./../model/productModel')
const multer = require('multer')
const mongoose = require('mongoose')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads');
    },
    filename: function(req, file , cb){
        cb(null , new Date().toISOString()+file.originalname);
    }
});
const fileFilter = (req, file , cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null , true);
    }else{
        cb(null , false);
    }
};
const upload = multer({
    storage:storage,
    limits :{
    fileSize: 1024 * 1024 *5
    },
    fileFilter: fileFilter
});


router.get('/', (req , res, next)=>{
    console.log('Hello')
    res.send('Hello')
})


router.post('/', upload.single('productImage'), (req, res, next)=>{
    const product = new productModel({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productImage: req.file.path
    })
    product.save()
    .then()
    .catch()
})
module.exports = router