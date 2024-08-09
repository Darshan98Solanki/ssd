const mysql = require("mysql2")
const conn = mysql.createConnection({
    "user": "u830888577_sddMJA",
    "database" : "u830888577_sddApplication",
    "password" : "SddMja@2023",
    "host" : "srv1274.hstgr.io" 
})

conn.connect((err) => {
    if (err)
        throw err
})

module.exports = conn