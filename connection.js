const mysql = require("mysql2")
const conn = mysql.createConnection({
    host: 'srv1274.hstgr.io',
    user: 'u830888577sddMJA',
    password: 'Anomaly@2023',
    database: 'u830888577_sddApplication'
})

conn.connect((err)=>{
    if(err)
        throw err
})

module.exports = conn