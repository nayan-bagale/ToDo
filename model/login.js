const bcrypt = require('bcrypt')

const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')

exists = async ($) => {
    let match = await AuthSchema.find({ email: $ })
    return (match.length == 0 ? false : match)
}

async function login_DB(email, password) {
    let match = await exists(email)
    if (match == false) { return `${email} is not exists` }

    const $ = await bcrypt.compare(password, match[0].hash)
    return (($) ? `logged in` : `Password is wrong`)
}


module.exports = login_DB