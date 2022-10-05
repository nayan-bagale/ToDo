const { v4: uuidv4 } = require('uuid')
const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')

checkexpire = async (Existing_timestamp, Session_token) => {

    if (Date.now() >= Existing_timestamp){
        console.log('session expired')
        await TokenSchema.findOneAndUpdate({ token: Session_token}, { token: uuidv4(), tokenexpire: Date.now() + (300 * 1000) })
    }else{
        console.log('not expired')
    }
}

async function tokenexpire(token) {
    let $ = await TokenSchema.find({token: token})
    if(!$) return `Not Exist token`
    await checkexpire($[0].tokenexpire, $[0].token)
    
}

module.exports = tokenexpire