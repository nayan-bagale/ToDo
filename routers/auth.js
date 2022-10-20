const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
require('dotenv').config()


const MONGO_URI = process.env.MONGO_URI
const sign_up_DB = require('../model/sign_up.js')
const login_DB = require('../model/login.js')
const token = require('../utility/token.js')
const UserData = require('../utility/userdata.js')

mongoose
    .connect(MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDb Connection Succesed.")
    })
    .catch((err) => {
        console.log(err)
    })


app.use(express.json())

let data = [{
    name: 'Nayan Bagale',
    email: '1',
    pass: '$2b$10$ojmZKNjofScVMSJpOUR3NOKL7Y/AZm6Bu6mOAOfghqqI.TuSb17V6',
    photo: './img/IMG_20220628_233248_656.jpg'
}]


router.post('/login', async (req, res) => {
    const { email, password, remeber_me } = req.body
    const result = await login_DB(email, password)
    if (result.error){
        console.log(result)
        res.status(200).send(result)
        return
    }

    let NewToken = await token(email)
    let data = await UserData(NewToken)
    
    res.status(200).send(`${JSON.stringify(data)}`)
})

router.post('/sign-up', async (req, res) => {
    let result = await sign_up_DB(req.body) // req.body { name, email, password }
    console.log(result)
    if (result.error){
        res.status(200).send(result)
        return
    }

    res.status(200).send(result)
})


//Complete it 
function Validation(data){
    const { email, password } = data

    function ValidateEmail(inputText) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (inputText == '') {
            return { message: 'Email is required', error: true }
        }
        else if (inputText.match(mailformat)) {
            return { message: 'Valid Email Address', error: false }
        }
        else {
            return { message: 'Invalid Email Address', error: true }
        }
    }

    function ValidatePassword(inputText) {
        if (inputText == '') {
            return { message: 'Password is required', error: true }
        } else if (inputText.length <= 8) {
            return { message: 'Password length must be atleast 8 characters', error: true }
        } else {
            return { message: 'Valid Password', error: false }
        }
    }

}




module.exports = router;