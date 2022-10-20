const { v4: uuidv4 } = require('uuid')
const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')

checkexpire = async (Existing_timestamp, Session_token) => {

    if (Date.now() >= Existing_timestamp){
        console.log('session expired')
        // await TokenSchema.findOneAndUpdate({ token: Session_token}, { token: uuidv4(), tokenexpire: Date.now() + (300 * 1000) })
        return true // if session is expired 
    }else{
        console.log('not expired')
        return false //if session is not expired
    }
}

async function tokenexpire(token) {
    let $ = await TokenSchema.find({token: token})
    if($.length == 0) return `Not-found` // if token is not found in database of TokenSchema
    return await checkexpire($[0].tokenexpire, $[0].token)
}

module.exports = tokenexpire