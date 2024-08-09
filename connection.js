const mysql = require("mysql2")
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shyam_dudh_dairy'
})

conn.connect((err)=>{
    if(err)
        throw err
})

module.exports = conn