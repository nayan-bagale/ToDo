const mongoose = require('mongoose')


const userAuth = new mongoose.Schema({
    name: {
        type: String,
        default: undefined
    },

    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
},
    { timestamps: true })

const AuthSchema = mongoose.model("Authentication", userAuth)

const userData = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    todo_data: []
})

const DataSchema = mongoose.model("UserData", userData)

const usertoken = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },

    token: {
        type: String,
        default: undefined
    },

    tokenexpire: {
        type: Number,
        default: undefined
    }

})

const TokenSchema = mongoose.model("UserToken", usertoken)

module.exports = { AuthSchema, DataSchema, TokenSchema }