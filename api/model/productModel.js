const { Double } = require('mongodb')
const mongodb = require('mongoose')
const productSchema = new mongodb.Schema({
    _id: mongodb.Schema.Types.ObjectId,
    productName: {
        type: String,
        required: true
    },
    productPrice :{
        type: Number,
        required: true
    },
    productImage :{
        type : String,
        required: true
    },
    date :{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongodb.model('products', productSchema)