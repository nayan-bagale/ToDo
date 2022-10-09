const bcrypt = require('bcrypt')

const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')

exists = async ($) => {
    let match = await AuthSchema.find({ email: $ })
    return (match.length == 0 ?  false : true) //return true if already exist account
}


async function sign_up_DB(email, password) {

    if(await exists(email) == true){return `${email} already exists`}

    hash = await bcrypt.hashSync(password, 10)        
    let AS = new AuthSchema({
        email: email,
        hash: hash
    })
    await AS.save()

    let _ = await AuthSchema.find({ email: email })

    let DS = new DataSchema({
        user_id: _[0]._id
    })
    await DS.save()

    let TS = new TokenSchema({
        user_id: _[0]._id
    })
    await TS.save()

    return `${email} Account Created Succesfully`
  }

module.exports = sign_up_DB