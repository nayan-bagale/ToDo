const express = require('express')
const app = express()
const router = express.Router()
const path = require('path')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './user_img')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')
const ValidateToken = require('../utility/tokenexpiry.js')
const data = require('../utility/userdata.js')

app.use(express.json())

// router.post('/:token/profile-img', upload.single('image'), (req, res) => {
//     console.log(req.files)
//     res.status(200).send('success')
// })

router.get('/:token', validate, async (req, res) => {
    res.send(JSON.stringify(await data(req.params.token)))
})

router.post('/:token', validate, async (req, res) => {
    const { name, email, photo } = req.body
    let $ = await TokenSchema.find({ token: req.params.token })
    let _ = await AuthSchema.findOneAndUpdate({ id: $[0].user_id }, { name: name, email: email })
    res.status(200).send({ message: 'Data Synced', error: false })
})


router.post('/:token/setting', validate, async (req, res) => {
    let $ = await TokenSchema.find({ token: req.params.token })
    let _ = await DataSchema.findOneAndUpdate({ user_id: $[0].user_id }, { settings: req.body })
    res.status(200).send('Settings Changed')
})

router.get('/:token/todo', validate, async (req, res) => {
    let $ = await TokenSchema.find({ token: req.params.token })
    let _ = await DataSchema.find({ user_id: $[0].user_id })
    const {todo_data} = _[0] 
    res.status(200).send(todo_data)
})

router.post('/:token/todo', validate, async (req, res) => {
    console.log(req.body)
    let $ = await TokenSchema.find({ token: req.params.token })
    let _ = await DataSchema.findOneAndUpdate({ user_id: $[0].user_id }, {todo_data: req.body})
    res.status(200).send({ message: 'Todo Synced', error: false })
})


async function validate(req, res, next) {
    if (await ValidateToken(req.params.token)) {
        console.log(req.params.token + ' Token expired')
        res.status(401).json({
            message: 'Unauthorised',
            error: true
        })
        return
    }
    next()
}

module.exports = router