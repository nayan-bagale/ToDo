const express = require('express')
const app = express()
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const mongoose = require('mongoose')

const MONGO_URI = 'mongodb+srv://TodoDB:5huJjriJVGx6M6q9@cluster0.3my8gxr.mongodb.net/?retryWrites=true&w=majority'
const sign_up_DB = require('../model/sign_up.js')
const login_DB = require('../model/login.js')

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

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const result = await login_DB(email, password)
    if (result != 'logged in'){
        res.send(result)
        return
    }

    // let token = uuidv4()
    // console.log(req.body)

    // if(match == undefined){
    //     res.send('Not Found')
    //     return
    // }

    // data[match].token = token

    // const _ = {
    //     name: data[match].name,
    //     email: data[match].email,
    //     photo: data[match].photo,
    //     token: token
    // }

    // console.log(data[match])
    res.send('Successfully Logged In')
})

router.post('/sign-up', async (req, res) => {
    const { email, password } = req.body
    console.log(await sign_up_DB(email, password))
    res.send('done')
})


module.exports = router;