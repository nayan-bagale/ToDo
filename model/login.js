const bcrypt = require('bcrypt')

const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')

exists = async ($) => {
    let match = await AuthSchema.find({ email: $ })
    return (match.length == 0 ? false : match) // if email is matched then return match else return false
}

async function login_DB(email, password) {
    let match = await exists(email)
    if (match == false) { return `${email} is not found` } // if email not found return

    const $ = await bcrypt.compare(password, match[0].hash)
    return (($) ? `logged in` : `Password is wrong`) // if password is matched then return else return wrong pass
}


module.exports = login_DB