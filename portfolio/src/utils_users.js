const insertData = require("./utils_db").insertData;

/** generates a password
 * @param {number} length password length
 * @param {BufferEncoding} type password encoding
 * @returns {string} generated password
 */
function generatePassword(length, type = 'base64') {
    return crypto.randomBytes(length).toString(type).replace(/\W/g, '_').toLowerCase();
  }


// user will be saved to db - we're explicitly asking postgres to return back helpful info from the row created
const createUser = (user) => {
    return insertData(
      "INSERT INTO utilisateurs (nom, m2p_hash) VALUES (?, ?) RETURNING id, nom, created_at",
      [user.username, user.password_digest, new Date()]
    )
    .then((data) => data.rows[0])
  }
  
  // crypto to create a random, secure token
  const createToken = () => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, data) => {
        err ? reject(err) : resolve(data.toString('base64'))
      })
    })
  }

  module.exports = {

  }