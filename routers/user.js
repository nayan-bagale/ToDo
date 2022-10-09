const express = require('express')
const app = express()
const router = express.Router()

const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')
const ValidateToken = require('../utility/tokenexpiry.js')
const data = require('../utility/userdata.js')

app.use(express.json())



router.get('/:token', validate, async (req, res) => {
    res.send(JSON.stringify(await data(req.params.token)))
})

router.put('/:token', validate, async (req, res) => {
    const { name, email, photo } = req.body

    console.log(name, email)
    res.send('scceess')
})



async function validate(req, res, next) {
    if (await ValidateToken(req.params.token)) {
        console.log('expired')
        res.send('Token Not Valid')
        return
    }
    next()
  }

module.exports = router