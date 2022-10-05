const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const auth = require('./routers/auth.js')


app.use('/',express.static('static'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(bodyParser.json())

app.use('/auth', auth);

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


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on localhost:%d in %s mode", this.address().port, app.settings.env);
  });