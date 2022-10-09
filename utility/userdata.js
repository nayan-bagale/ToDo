const { AuthSchema, DataSchema, TokenSchema } = require('../model/schema.js')

async function UserData(Token) { // To find userdata using Token
    let $ = await TokenSchema.find({ token: Token })
    let _ = await DataSchema.find({ user_id: $[0].user_id })
    let {name, email} = await AuthSchema.findById($[0].user_id )

    const obj = {
        name: name,
        email: email,
        photo: _[0].photo,
        token: Token
    }

    console.log(obj)
    return obj
}

module.exports = UserData