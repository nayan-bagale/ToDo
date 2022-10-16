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

router.post('/:token/setting', validate, async (req, res) => {
    let $ = await TokenSchema.find({ token: req.params.token })
    let _ = await DataSchema.findOneAndUpdate({ user_id: $[0].user_id }, { settings: req.body })
    res.status(200).send('done')
})

router.get('/:token/todo', validate, async (req, res) => {
    let $ = await TokenSchema.find({ token: req.params.token })
    let _ = await DataSchema.find({ user_id: $[0].user_id })
    const {todo_data} = _[0] 
    console.log(todo_data)
    res.send(todo_data)
})

router.post('/:token/todo', validate, async (req, res) => {
    console.log(req.body)
    let $ = await TokenSchema.find({ token: req.params.token })
    let _ = await DataSchema.findOneAndUpdate({ user_id: $[0].user_id }, {todo_data: req.body})
    res.send('Success')
})


async function validate(req, res, next) {
    if (await ValidateToken(req.params.token)) {
        console.log(req.params.token + 'Token expired')
        res.status(201).json({
            error: 'Unauthorised'
        })
        return
    }
    next()
  }

module.exports = router