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

//get all data
router.get('/', (req , res, next)=>{
    productModel.find().exec()
    .then(doc =>{
        const response = {
            count : doc.length,
            products: doc.map(product=>{
                return {
                    productName : product.productName,
                    productPrice: product.productPrice,
                    productImage: product.productImage,
                    _id:product._id
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(error =>{
        res.status(500).json({
            message: error
        })
    })
})

//insert data
router.post('/', upload.single('productImage'), (req, res, next)=>{
    const product = new productModel({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productImage: req.file.path
    })
    product.save()
    .then(product=>{
        res.status(200).json(product)
    })
    .catch(error =>{
        res.status(500).json({
            message: error
        })
    })
})
//get data from id
router.get('/:productId', (req,res,next)=>{
    productModel.remove({_id: req.params.productId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'Get product by id successful',
            result: result
        })
    })
    .catch(error =>{
        res.status(500).json({
            message:'Get product by id not found!',
            error: error
        })
    })

})


//delete data from id
router.delete('/:productId',(req,res,next)=>{
    productModel.findByIdAndDelete(req.params.productId)
    .then(result =>{
        res.status(200).json({
            message: 'Delete product successful',
            result: result
        })
    })
    .catch(error =>{
        res.status(500).json({
            message:'Delete product not found!',
            error: error
        })
    })
})

//update data from id
router.put('/:productId',(req,res,next)=>{
    productModel.findByIdAndUpdate({_id:req.params.productId},{
        $set:{
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productImage: req.file.path
        }
    })
    .then(result =>{
        res.status(201).json({
            message: 'Update product successful',
            result: result
        })
    })
    .catch(error =>{
        res.status(500).json({
            message:'Update product not found!',
            error :error
        })
    })
})


module.exports = router