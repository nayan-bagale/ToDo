const { v4: uuidv4 } = require('uuid')
const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')
const tokenexpire = require('../utility/tokenexpiry.js')

async function tokencheck(email) {
    let $ = await AuthSchema.find({ email: email })
    let _ = await TokenSchema.find({ user_id: $[0]._id})

    await tokenexpire(_[0].token)

     if (!(_[0].token)){     //if TOKEN is not exist
        await TokenSchema.findByIdAndUpdate(_[0]._id, { token: uuidv4(), tokenexpire: Date.now() + (300 * 1000) })
        console.log('Not existed token added new one')
        
        
    }

    if ((_[0].token)){
        await TokenSchema.findByIdAndUpdate(_[0]._id, { token: uuidv4(), tokenexpire: Date.now() + (300 * 1000) })
        console.log('existed token changed to new one')
    }

}

module.exports = tokencheck