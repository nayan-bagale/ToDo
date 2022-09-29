const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const port = process.env.PORT || 3000

app.use('/',express.static('static'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let bgcolor = [{
    id: 'color1',
    colorcode: 'linear-gradient(to left, #C4E0E5, #4CA1AF)'
},
{
    id: 'color2',
    colorcode: 'linear-gradient(to right, #FFDD00, #FBB034)'
},
{
    id: 'color3',
    colorcode: 'linear-gradient(to right, #F53844, #42378F)'
},
{
    id: 'color4',
    colorcode: 'linear-gradient(to right, #2C3E50, #000000)'
},
{
    id: 'color5',
    colorcode: 'linear-gradient(to right, #A71D31, #3F0D12)'
},
{
    id: 'color6',
    colorcode: 'linear-gradient(135deg, rgba(57,57,50,1) 6%, rgba(0,0,0,1) 92%)'
}]

app.get('/theme', (req, res) => {
    res.json(bgcolor)
})


const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

app.post('/login', async (req, res) => {
    console.log(req.body)
    await delay(2000)
    res.send('success')
})

app.post('/sign-up', async (req, res) =>{
    console.log(req.body)
    await delay(2000)
    res.send('success')
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });