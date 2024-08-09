const express = require('express')
const PDFDocument = require("pdfkit-table");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const conn = require('./connection')
const { login, signUp, makeOrder, checkPurchaseId, purchaseUpdate, updateProfile, checkOrganization } = require('./types')
const app = express()
// const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');
const port = 3000
const secretKey = 'shyam-dudh-dairy&anomalyenterprise'
const HeaderUrl = './reports/basefiles/Header.jpg'
const FooterUrl = './reports/basefiles/Footer.jpg'
// const path_to_store = "user_profiles/"

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


//************      Ini storage        ************

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         return cb(null, path_to_store)
//     },
//     filename: function (req, file, cb) {
//         return cb(null, `${Date.now()}-${file.originalname}`)
//     },
// })

// const upload = multer({
//     storage,
//     limits: { fileSize: 5000000 },
//     fileFilter: function (req, file, cb) {
//         checkFileType(file, cb);
//     }
// })

//************      helper functions start        ************

function authenticate(req, res, next) {

    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, secretKey, async (err, result) => {
        if (err) {
            res.status(401).json({ message: "You are not authorized" })
            return
        }
        if (result) {
            const checkUser = await checkUserExists(result).then(response => { return response }).catch(err => { res.status(500).json({ message: err.message }) })
            if (checkUser)
                next()
            else {
                res.status(403).json({ message: "You are not authorized" })
                return
            }
        }
    })
}

// use to convert data into printable format for table
function convertDataToPrintableFormat(data) {
    let formatedData = []
    let count = 0
    let convert = []
    data.map(singleData => {
        let tmp = []
        tmp.push(formatDate(singleData.purchase_date))
        tmp.push(singleData.litre)
        tmp.push(singleData.fat)
        tmp.push(singleData.amount)
        count++
        if (count == 20) {
            formatedData.push(convert)
            convert = []
            count = 0
        } else {
            convert.push(tmp)
        }
    })
    if (convert.length != 0)
        formatedData.push(convert)
    return formatedData
}

//use to print table
function printTable(pdfDoc, data, y) {

    ; (async function createTable() {
        // table
        const table = {
            title: '',
            headers: ['Purchase Date', 'Litre', 'Fat', 'Amount'],
            rows: data,
        };

        const options = {
            x: 60,
            y: y,
            prepareHeader: () => pdfDoc.font('Helvetica-Bold').fontSize(12),
            prepareRow: (row, i) => pdfDoc.font('Helvetica').fontSize(12)
        };

        // the magic (async/await)
        await pdfDoc.table(table, options);

    })();

}

// print text in pdf
function printData(pdfDoc, text, x, y) {
    pdfDoc.fontSize(16).font('Times-Roman').text(text, x, y);
}

//set header and footer in pdf
function setHeaderFooter(pdfDoc, headerUrl, FooterUrl) {
    pdfDoc.image(headerUrl, 0, 0,
        {
            fit: [pdfDoc.page.width, 300],
        })
    pdfDoc.image(FooterUrl, 0, pdfDoc.page.height - 100,
        {
            fit: [pdfDoc.page.width, 300],
        })
}

// formate date into dd-mm-yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

// checking file type

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only! (jpeg, jpg, png)');
    }
}

// get user id from token
function getUserIdFromToken(req) {

    const sql = "SELECT user_id FROM user WHERE email = ?"
    return new Promise((resolve, reject) => {

        const token = req.headers.token.split(' ')[1]
        jwt.verify(token, secretKey, (err, result) => {
            if (err) {
                res.status(401).json({ message: "You are not authorized" })
                return
            }
            if (result) {
                conn.query(sql, [result], (err, res) => {
                    if (err) {
                        reject({ code: 411, message: "Some error occurred" })
                    } else {
                        resolve({ data: res[0]['user_id'] })
                    }
                })
            }
        })
    })
}


// check purchase status

function checkPurchaseStatus(result) {

    const due_date = result.due_date
    const current_date = new Date()

    if (due_date <= current_date && result.payment_status == "pending") {
        result.payment_status = "overdue"
    }

}

//get customer I'd 
function getCustomerId(email) {

    const sql = "SELECT customer_id FROM customers WHERE email=?"
    return new Promise((resolve, reject) => {
        conn.query(sql, [email], (err, result) => {
            if (err) {
                reject({ code: err.code, message: err.message })
            } else {
                resolve(result[0]["customer_id"])
            }
        })
    })
}
//check user exisits or not
function checkCustomerExists(email) {
    const sql = "SELECT COUNT(email) FROM customers WHERE email=?"
    return new Promise((resolve, reject) => {
        conn.query(sql, [email], (err, result) => {
            if (err) {
                reject({ code: err.code, message: err.message })
            } else {
                resolve((result[0]["COUNT(email)"] >= 1) ? true : false)
            }
        })
    })
}

function checkUserExists(email) {
    const sql = "SELECT COUNT(email) FROM user WHERE email=?"
    return new Promise((resolve, reject) => {
        conn.query(sql, [email], (err, result) => {
            if (err) {
                reject({ code: err.code, message: err.message })
            } else {
                resolve((result[0]["COUNT(email)"] >= 1) ? true : false)
            }
        })
    })
}
//************          helper functions end       ************



//************          routes start        ************
// login route
app.post("/login", (req, res) => {
    const data = req.body
    const parseData = login.safeParse(data)

    if (!parseData.success) {
        res.status(411).json(parseData.error.issues[0].message)
        return
    }

    const email = parseData.data.email
    const password = parseData.data.password
    const query = "SELECT password FROM user WHERE email=?"

    conn.query(query, [email], (err, result) => {

        if (err) {
            res.status(403).json({ message: "Data can not be inserted" })
            return
        }

        const checkPassword = result[0].password

        if (!bcrypt.compareSync(password, checkPassword)) {
            res.status(401).json({ message: "Password is incorrect" })
            return
        } else {
            const token = jwt.sign(email, secretKey)
            res.status(200).json({ token })
            return
        }
    })
})

// singup route
app.post('/signup', async (req, res) => {

    const data = req.body
    const parseData = signUp.safeParse(data)

    if (!parseData.success) {
        res.status(411).json(parseData.error.issues[0].message)
        return
    }

    const email = parseData.data.email
    const checkUser = await checkUserExists(email).then(response => { return response }).catch(err => { res.status(500).json({ message: err.message }) })

    if (checkUser) {
        res.status(403).json({ message: "User is already registed with this email" })
        return
    }

    const username = parseData.data.username
    const password = bcrypt.hashSync(parseData.data.password, 10)

    const sql = "INSERT INTO user(name,email,password,standard_price) VALUES (?,?,?,?)"
    conn.query(sql, [username, email, password, 10], (err, result) => {
        if (err) {
            res.status(403).json({ message: "Data can not be inserted" })
            return
        } else {
            res.status(200).json({ message: "Registration done successfully" })
            return
        }
    })

})

// get customer route
app.get('/getcustomers', authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const sql = "SELECT name,mobile_no,organization,email FROM customers WHERE user_id =?"

    conn.query(sql, [userId],(err, result) => {
        if (err) {
            res.status(403).json({ message: "Data can not be inserted" })
            return
        } else {
            res.status(200).json({ data: result })
            return
        }
    })
})

app.post('/makepurchase', authenticate, async (req, res) => {

    const data = req.body
    const parseData = makeOrder.safeParse(data)

    if (!parseData.success) {
        res.status(411).json(parseData.error.issues[0].message)
        return
    }

    const email = parseData.data.email
    const checkCustomer = await checkCustomerExists(email).then(response => { return response }).catch(err => { res.status(500).json({ message: err.message }) })

    if (!checkCustomer) {
        const customer_name = parseData.data.customer_name
        const mobile_no = parseData.data.phone_number
        const organization = parseData.data.organization
        const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })

        const query = "INSERT INTO customers(user_id,name,mobile_no,organization,email) VALUES(?,?,?,?,?)"

        conn.query(query, [userId, customer_name, mobile_no, organization, email], (err, result) => {
            if (err) {
                res.status(403).json({ message: "Data cannot be inserted" })
            }
        })
    }

    const customerId = await getCustomerId(parseData.data.email).then(userid => { return userid }).catch(err => { res.status(500).json({ message: err.message }) })
    const due_date = parseData.data.due_date
    const litre = parseData.data.litre
    const fat = parseData.data.fat
    const fat_price = parseData.data.fat_price
    const discount = parseData.data.discount
    const amount = parseData.data.amount
    const remainder_type = parseData.data.remainder_type
    const additional_notes = parseData.data.additional_notes

    const query = "INSERT INTO purchase(customer_id, litre, fat, fat_price, discount, amount, due_date,remainder_type, payment_status, additional_notes) VALUES(?,?,?,?,?,?,?,?,?,?)"

    conn.query(query, [customerId, litre, fat, fat_price, discount, amount, due_date, remainder_type, 'pending', additional_notes], (err, result) => {

        if (err) {
            console.log(err)
            res.status(403).json({ message: "Order can't placed" })
            return
        } else {
            res.status(200).json({ message: "Order placed successfully" })
            return
        }

    })
})

// get biilles
app.get('/getbills', authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })

    const query = "SELECT p.purchase_id,c.customer_id,c.name,p.amount,p.due_date,p.payment_status,p.remainder_type,p.additional_notes FROM customers c INNER JOIN purchase p ON p.customer_id = c.customer_id AND c.user_id = ?"

    conn.query(query, [userId], (err, result) => {

        if (err) {
            res.status(403).json({ message: "Some error occurred" })
            return
        } else {
            result.map(result => checkPurchaseStatus(result))
            res.status(200).json({ data: result })
            return
        }

    })
})

// forgot password
app.post("/forgot_password", async (req, res) => {


    const data = req.body
    const parseData = login.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }
    const email = parseData.data.email
    const checkUser = await checkCustomerExists(email).then(response => { return response }).catch(err => { res.status(500).json({ message: err.message }) })

    if (checkUser) {

        const password = bcrypt.hashSync(parseData.data.password, 10)
        const sql = "UPDATE user SET password = ? WHERE email = ?"

        conn.query(sql, [password, email], (err, result) => {
            if (err) {
                res.status(403).json({ message: "Data can not be inserted" })
                return
            } else {
                res.status(403).json({ message: "Password updated successfully..." })
            }
        })

    } else {
        res.status(403).json({ message: "User not found" })
    }
})

// get single customer data from purchase id

app.get('/getcustomerdata', authenticate, (req, res) => {

    const data = req.body
    const parseData = checkPurchaseId.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }

    const purchaseId = parseData.data.purchaseId
    const sql = "SELECT c.customer_id, p.purchase_id,c.name, c.mobile_no,c.organization,c.email,p.litre,p.fat,p.fat_price,p.discount,p.amount,p.due_date,p.remainder_type,p.additional_notes FROM purchase p INNER JOIN customers c ON c.customer_id = p.customer_id AND p.purchase_id = ?"

    conn.query(sql, [purchaseId], (err, result) => {
        if (err) {
            res.status(403).json({ message: "Some error occured" })
            return
        } else {
            result[0].due_date = new Date(result[0].due_date).toISOString().split('T')[0]
            res.status(200).json({ data: result })
            return
        }
    })
})

//update purchase order
app.put('/updatepurchase', authenticate, async (req, res) => {

    const data = req.body
    const parseData = purchaseUpdate.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }

    const customerId = parseData.data.customerId
    const purchaseId = parseData.data.purchaseId
    const email = parseData.data.email
    const customer_name = parseData.data.customer_name
    const phone_number = parseData.data.phone_number
    const organization = parseData.data.organization
    const litre = parseData.data.litre
    const fat = parseData.data.fat
    const fat_price = parseData.data.fat_price
    const discount = parseData.data.discount
    const amount = parseData.data.amount
    const due_date = parseData.data.due_date
    const remainder_type = parseData.data.remainder_type
    const additional_notes = parseData.data.additional_notes


    const updateCustomer = "UPDATE customers SET name=?,mobile_no=?,organization=?,email=? WHERE customer_id=?"

    conn.query(updateCustomer, [customer_name, phone_number, organization, email, customerId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occurred" })
            return
        }
    })

    const updatePurchase = "UPDATE purchase SET litre=?, fat=?, fat_price=?, discount=?, amount=?, due_date=?,remainder_type=?,additional_notes=? WHERE purchase_id=?"

    conn.query(updatePurchase, [litre, fat, fat_price, discount, amount, due_date, remainder_type, additional_notes, purchaseId], (err, result) => {

        if (err) {
            res.status(411).json({ message: "Some error occurred" })
            return
        }
    })

    res.status(200).json({ message: "Record Updated successfully" })
    return

})

// delete puchase order
app.delete('/deletepuchaseorder', authenticate, (req, res) => {

    const data = req.body
    const parseData = checkPurchaseId.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }

    const purchaseId = parseData.data.purchaseId
    const sql = "DELETE FROM purchase WHERE purchase_id = ?"

    conn.query(sql, [purchaseId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occured" })
            return
        } else {
            res.status(200).json({ message: "Purchase order removed successfully..." })
            return
        }
    })
})

app.put("/paymentdone", authenticate, (req, res) => {

    const data = req.body
    const parseData = checkPurchaseId.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }

    const purchaseId = parseData.data.purchaseId
    const sql = "UPDATE purchase SET payment_status='paid' WHERE purchase_id=?"

    conn.query(sql, [purchaseId], (err, result) => {

        if (err) {
            res.status(411).json({ message: "Some error occured" })
            return
        } else {
            res.status(200).json({ message: "Payment done" })
            return
        }
    })
})

//showing the customers in calander
app.get("/getusers_for_calendar", authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const query = "SELECT c.name,p.due_date,p.payment_status FROM customers c INNER JOIN purchase p ON p.customer_id = c.customer_id AND c.user_id = ?"

    conn.query(query, [userId], (err, result) => {

        if (err) {
            res.status(411).json({ message: "Some error occured" })
            return
        } else {
            res.status(200).json({ message: result })
            return
        }
    })
})

// show count of paid pendding and overdue counts
app.get("/getcalendar_count_status", authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const sql = "SELECT p.due_date, p.payment_status FROM customers c INNER JOIN purchase p ON p.customer_id = c.customer_id AND c.user_id = ?;"

    conn.query(sql, [userId], (err, result) => {

        if (err) {
            res.status(4114).json({ message: "Some error occurred" })
            return
        } else {
            result.map(result => checkPurchaseStatus(result))
            let paid = 0, overdue = 0, pending = 0
            result.map(result => result.payment_status == "paid" ? paid++ : result.payment_status == "pending" ? pending++ : overdue++)
            res.status(200).json({ data: { paid: paid, overdue: overdue, pending: pending } })
            return
        }
    })
})

// get profile daat
app.get("/get_profile_data", async (req, res) => {

    const userId = await getUserIdFromToken(req).then(id => { return id.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const sql = "SELECT name, email, standard_price, location FROM user WHERE user_id = ?"

    conn.query(sql, [userId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occured" })
            return
        } else {
            res.status(200).json({ data: result })
        }
    })

})

// update profile
app.put('/update_profile', authenticate, async (req, res) => {

    const data = req.body
    const parseData = updateProfile.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    } else {
        const username = parseData.data.username
        const location = parseData.data.location
        const standardPrice = parseData.data.standardPrice
        const userId = await getUserIdFromToken(req).then(id => { return id.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
        const sql = "UPDATE user SET name=?, standard_price=?, location=? WHERE user_id=?"

        conn.query(sql, [username, standardPrice, location, userId], (err, result) => {
            if (err) {
                res.status(411).json({ message: "Some error occured" })
                return
            } else {
                res.status(200).json({ message: "Profile updated successfully" })
                return
            }
        })
    }
});

// app.get("/getprofile_image", authenticate, async (req, res) => {

//     const options = {
//         root: path.join(__dirname)
//     }

//     const userId = await getUserIdFromToken(req).then(id => { return id.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
//     const sql = "SELECT user_profile FROM user WHERE user_id=?"

//     conn.query(sql, [userId], (err, result) => {
//         if (err) {
//             res.status(411).json({ message: "Some error occured" })
//             return
//         } else {
//             const filename = result[0].user_profile
//             res.sendFile(filename, options, (err) => {
//                 if (err) {
//                     res.status(411).json({ message: "Something went wrong" })
//                     return
//                 }
//             })
//         }
//     })
// })


app.get("/get_standard_price", authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(id => { return id.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const sql = "SELECT standard_price FROM user WHERE user_id=?"

    conn.query(sql, [userId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occured" })
            return
        } else {
            res.status(200).json({ standardPrice: (result[0]["standard_price"]) })
            return
        }
    })

})

app.get("/getreport", authenticate, async (req, res) => {

    const data = req.body
    const parseData = checkPurchaseId.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }

    const purchaseId = parseData.data.purchaseId
    const query = "SELECT c.name, c.mobile_no,c.organization,c.email,p.litre,p.fat,p.fat_price,p.amount,p.due_date FROM purchase p INNER JOIN customers c ON c.customer_id = p.customer_id AND p.purchase_id = ?"
    conn.query(query, [purchaseId], (error, result) => {
        if (error) {
            res.status(411).json({ message: "Some error occurred" })
            return
        } else {
            result[0].due_date = formatDate(result[0].due_date)
            res.status(200).json({ data: result })
            return
            // const doc = new PDFDocument();
            // let filename = 'example.pdf';
            // // Remove spaces from the filename
            // filename = encodeURIComponent(filename) + '.pdf';

            // // Set response headers
            // res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
            // res.setHeader('Content-type', 'application/pdf');

            // // Pipe the PDF into the response
            // doc.pipe(res);

            // // Add content to the PDF
            // setHeaderFooter(doc, HeaderUrl, FooterUrl)

            // const name = result[0].name
            // const mobile_no = result[0].mobile_no
            // const organization = result[0].organization
            // const email = result[0].email
            // const litre = result[0].litre
            // const fat = result[0].fat
            // const fat_price = result[0].fat_price
            // const amount = result[0].amount
            // const due_date = result[0].due_date
            // let x = 210, y = 280

            // printData(doc, "Name : " + name, x, y)
            // y += 25
            // printData(doc, "Mobile No : " + mobile_no, x, y)
            // y += 25
            // printData(doc, "Organization : " + organization, x, y)
            // y += 25
            // printData(doc, "Email : " + email, x, y)
            // y += 25
            // printData(doc, "Litre : " + litre, x, y)
            // y += 25
            // printData(doc, "Fat : " + fat, x, y)
            // y += 25
            // printData(doc, "Fat Price : " + fat_price, x, y)
            // y += 25
            // printData(doc, "Total Amount : " + amount, x, y)
            // y += 25
            // printData(doc, "Due Date : " + formatDate(due_date), x, y)
            // y += 25

            // // Finalize the PDF and end the stream
            // doc.end();
        }
    })
})

//get full report details
app.get('/get_full_report', async (req, res) => {
    const data = req.body
    const parseData = checkOrganization.safeParse(data)

    if (!parseData.success) {
        res.status(200).json({ message: parseData.error.issues[0].message })
        return
    } else {

        const organization = parseData.data.organization
        const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
        const getUserData = "SELECt name, mobile_no, email FROM customers WHERE organization = ? AND user_id = ?"

        conn.query(getUserData, [organization, userId], (err, customerData) => {
            if (err) {
                res.status(411).json({ message: "Some error occurred..." })
                return
            } else {
                const query = "SELECT p.fat,p.purchase_date,p.amount,p.litre FROM customers c INNER JOIN purchase p ON c.customer_id = p.customer_id AND p.payment_status != 'paid' AND c.organization = ? AND c.user_id = ?"

                conn.query(query, [organization, userId], (err, result) => {
                    if (err) {
                        res.status(411).json({ message: "Some lol occurred..." })
                        return
                    } else {
                        if (result.length == 0) {
                            res.status(200).json({ message: "No such organization found like " + organization })
                            return
                        } else {
                            result.map(result => {result.purchase_date = formatDate(result.purchase_date)})
                            customerData = {"userdata":customerData[0], "purchases":result}
                            // console.log(customerData)
                            res.status(200).json(customerData)
                            return
                            // const printTableData = convertDataToPrintableFormat(result)
                            // const doc = new PDFDocument();
                            // let filename = 'example.pdf';
                            // // Remove spaces from the filename
                            // filename = encodeURIComponent(filename) + '.pdf';

                            // // Set response headers
                            // res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
                            // res.setHeader('Content-type', 'application/pdf');

                            // setHeaderFooter(doc, HeaderUrl, FooterUrl)
                            // const name = customerData[0].name
                            // const mobile_no = customerData[0].mobile_no
                            // const email = customerData[0].email

                            // let x = 100, y = 180

                            // printData(doc, "Name : " + name, x, y)
                            // y += 25
                            // printData(doc, "Mobile No : " + mobile_no, x, y)
                            // x = 300
                            // y = 180
                            // printData(doc, "Organization : " + organization, x, y)
                            // y += 25
                            // printData(doc, "Email : " + email, x, y)
                            // y += 30

                            // // Pipe the PDF into the response
                            // doc.pipe(res);

                            // for (var i = 0; i < printTableData.length; i++) {
                            //     printTable(doc, printTableData[i], y)
                            //     y = 200

                            //     if (i < printTableData.length - 1) {
                            //         doc.addPage()
                            //         setHeaderFooter(doc, HeaderUrl, FooterUrl)
                            //     }
                            // }

                            // // Finalize the PDF and end the stream
                            // doc.end();
                        }
                    }
                })
            }
        })
    }
})


app.listen(port)