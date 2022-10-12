const { v4: uuidv4 } = require('uuid')
const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')
// const tokenexpire = require('../utility/tokenexpiry.js')

createToken = async (id) => {
    let GenerateToken = uuidv4()
    await TokenSchema.findByIdAndUpdate(id, { token: GenerateToken, tokenexpire: Date.now() + (1000 * 60 * 60 * 24) })
    return GenerateToken
}

async function tokencheck(email) {
    let $ = await AuthSchema.find({ email: email })
    let _ = await TokenSchema.find({ user_id: $[0]._id})
    let token

    // let result = await tokenexpire(_[0].token)

    if (!(_[0].token)){     //if TOKEN is not exist
        token = await createToken(_[0]._id)
        console.log('Not existed token created new one') 
    }

    if ((_[0].token)){      //if Token is exist then create new one
        token = await createToken(_[0]._id)
        console.log('existed token changed to new one')
    }
    return token
}

module.exports = tokencheck