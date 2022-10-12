const { v4: uuidv4 } = require('uuid')
const { TokenSchema } = require('../model/schema.js')

createToken = async (Session_token) => {
    let NewToken = uuidv4()
    await TokenSchema.findOneAndUpdate({ token: Session_token }, { token: NewToken, tokenexpire: Date.now() + (1000 * 60 * 60 * 24) })
    return NewToken
}

module.exports = createToken