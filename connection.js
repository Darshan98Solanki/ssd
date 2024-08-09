const mysql = require("mysql2")

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "srv1274.hstgr.io",
    user: "u830888577_sddMJA",
    password: "SddMja@2023",
    database: "u830888577_sddApplication",
})

// const conn = mysql.createConnection({
//     "user": "u830888577_sddMJA",
//     "database" : "u830888577_sddApplication",
//     "password" : "SddMja@2023",
//     "host" : "srv1274.hstgr.io" 
// })

pool.getConnection((err) => {
    if (err)
        throw err
})

module.exports = pool