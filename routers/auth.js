const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')

const MONGO_URI = 'mongodb+srv://TodoDB:5huJjriJVGx6M6q9@cluster0.3my8gxr.mongodb.net/?retryWrites=true&w=majority'
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
    const { email, password } = req.body
    const result = await login_DB(email, password)
    if (result != 'logged in'){
        res.send(result)
        return
    }

    let NewToken = await token(email)
    let data = await UserData(NewToken)
    
    res.send(`${JSON.stringify(data)}`)
})

router.post('/sign-up', async (req, res) => {
    const { email, password } = req.body
    let match = await sign_up_DB(email, password)
    console.log(match)
    res.send(match)
})


module.exports = router;