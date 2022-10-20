const bcrypt = require('bcrypt')

const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')

exists = async ($) => {
    let match = await AuthSchema.find({ email: $ })
    console.log($)
    console.log(match)
    return (match.length == 0 ?  false : true) //return true if already exist account
}


async function sign_up_DB(data) {

    const { name, email, password } = data

    if(await exists(email)){return {
        message: `${email} is Already exists`,
        error: true
    }}

    hash = await bcrypt.hashSync(password, 10)        
    let AS = new AuthSchema({
        name: name,
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

    return {
        message: `${email} Account Created Succesfully`,
        error: false
    }
  }

module.exports = sign_up_DB