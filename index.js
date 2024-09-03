const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const conn = require('./connection.js')
const { login, signUp, makeOrder, checkPurchaseId, purchaseUpdate, updateProfile, checkOrganization, addCustomer, checkSingleFetchOrder, checkAdvancedPayment } = require('./types')
const app = express()
const port = 3000
const PDFDocument = require('pdfkit-table')
const fs = require('fs');
const path = require('path');
const secretKey = 'shyam-dudh-dairy&anomalyenterprise'

app.use(express.json())

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

function closeConnection(conn) {
    process.on('SIGINT', () => {
        conn.end((err) => {
            if (err) {
                console.error('Error closing connection pool:', err.stack);
            } else {
                console.log('Connection pool closed');
            }
            process.exit();
        });
    });
}

function setHeaderFooter(pdfDoc) {
    pdfDoc.image('./reports/basefiles/Header.jpg', 0, 0,
        {
            fit: [pdfDoc.page.width, 300]
        })
    pdfDoc.image('./reports/basefiles/Footer.jpg', 0, pdfDoc.page.height - 100,
        {
            fit: [pdfDoc.page.width, 300],
        })
}

//functions to generate pdf
function generatePDF(data, callback) {
    const pdfDoc = new PDFDocument();
    const filePath = path.join(__dirname, 'reports', 'SampleDocument.pdf');

    const stream = fs.createWriteStream(filePath);
    pdfDoc.pipe(stream);

    const fontPath = path.join(__dirname, 'reports', 'basefiles', 'NotoSansGujarati-VariableFont_wdth,wght.ttf');
    pdfDoc.registerFont('GujaratiFont', fontPath);

    // Set header/footer, if needed
    setHeaderFooter(pdfDoc);

    pdfDoc.font('GujaratiFont').fontSize(20).text(data, 100, 500);
    pdfDoc.end();

    // Wait for the PDF file to be fully written
    stream.on('finish', () => {
        callback(null, filePath); // Pass null for no error
    });

    stream.on('error', (err) => {
        callback(err); // Pass error if stream fails
    });
}

// formate date into dd-mm-yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
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
function getCustomerIdFromOrganization(organization) {
    const sql = "SELECT customer_id FROM customers WHERE organization=?"
    return new Promise((resolve, reject) => {
        conn.query(sql, [organization], (err, result) => {
            if (err) {
                reject({ code: err.code, message: err.message })
            } else {
                resolve({ data: result[0]["customer_id"] })
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

// check organization is registered or not
function checkOrganizationRegistration(organization) {

    const sql = "SELECT COUNT(organization) FROM customers WHERE organization=?"
    return new Promise((resolve, reject) => {
        conn.query(sql, [organization], (err, result) => {
            if (err) {
                reject({ code: err.code, message: err.message })
            } else {
                resolve((result[0]["COUNT(organization)"] >= 1) ? true : false)
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
            res.status(403).json({ message: "Some server error occured" })
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
    closeConnection(conn)
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
    const checkUser = await checkUserExists(email).then(response => { return response }).catch(err => { res.status(500).json({ message: "Some error ocucured" }) })

    if (checkUser) {
        res.status(403).json({ message: "User is already registed with this email" })
        return
    }

    const username = parseData.data.username
    const password = bcrypt.hashSync(parseData.data.password, 10)

    const sql = "INSERT INTO user(name,email,password,standard_price_cow,standard_price_buffalo) VALUES (?,?,?,?,?)"
    conn.query(sql, [username, email, password, 10, 10], (err, result) => {
        if (err) {
            res.status(403).json({ message: "Data can not be inserted" })
            return
        } else {
            res.status(200).json({ message: "Registration done successfully" })
            return
        }
    })
    closeConnection(conn)
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
                res.status(403).json({ message: "Password can not be updated..." })
                return
            } else {
                res.status(403).json({ message: "Password updated successfully..." })
                return
            }
        })

    } else {
        res.status(403).json({ message: "User not found" })
        return
    }
    closeConnection(conn)
})

//add customer
app.post("/add_customer", authenticate, async (req, res) => {

    const data = req.body
    const parseData = addCustomer.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ "error": parseData.error.issues[0].message })
        return
    }

    const organization = parseData.data.organization
    const checkOrganization = await checkOrganizationRegistration(organization).then(response => { return response }).catch(err => { res.status(500).json({ message: "Somer error occured" }) })

    if (!checkOrganization) {
        const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(500).json({ message: "Some error occured" }) })
        const name = parseData.data.name
        const phone_number = parseData.data.phone_number
        const email = parseData.data.email

        const query = "INSERT INTO customers(user_id,name,mobile_no,organization,email) VALUES(?,?,?,?,?)"

        conn.query(query, [userId, name, phone_number, organization, email], (err, result) => {
            if (err) {
                res.status(403).json({ message: "Data cannot be inserted" })
                return
            } else {
                res.status(200).json({ message: "customer added successfully" })
                return
            }
        })
    } else {
        res.status(401).json({ message: "Organization already in use" })
        return
    }
    closeConnection(conn)
})

app.get("/get_organizations", authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(500).json({ message: "Some error occured" }) })
    const query = "SELECT name,organization FROM customers WHERE user_id = ?"

    conn.query(query, [userId], (err, result) => {
        if (err) {
            res.status(403).json({ message: "Some error occure load organization" })
            return
        } else {
            res.status(200).json({ data: result })
            return
        }
    })
    closeConnection(conn)
})

//Get standard price
app.get("/get_standard_price", authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(id => { return id.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const sql = "SELECT standard_price_cow,standard_price_buffalo FROM user WHERE user_id=?"

    conn.query(sql, [userId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occured" })
            return
        } else {
            res.status(200).json({ standardPriceCow: (result[0]["standard_price_cow"]), standardPriceBuffalo: (result[0]["standard_price_buffalo"]) })
            return
        }
    })
    closeConnection(conn)
})

//make purchase order
app.post('/make_purchase', authenticate, async (req, res) => {

    const data = req.body
    const parseData = makeOrder.safeParse(data)

    if (!parseData.success) {
        res.status(411).json(parseData.error.issues[0].message)
        return
    }

    const organization = parseData.data.organization
    const customerId = await getCustomerIdFromOrganization(organization).then(response => { return response.data }).catch(err => { res.status(500).json({ message: "Some error occured" }) })
    const milk_type = parseData.data.which
    const litre = parseData.data.litre
    const fat = parseData.data.fat
    const fat_price = parseData.data.fat_price
    const amount = parseData.data.amount
    const advanced_amount = parseData.data.advance_amount
    const due_date = parseData.data.due_date
    const when = parseData.data.when
    const query = "INSERT INTO purchase(customer_id,milk_type,litre,fat,fat_price,amount,advance_amount,due_date,when_,payment_status,purchase_time) VALUES(?,?,?,?,?,?,?,?,?,?,CONVERT_TZ(NOW(), @@session.time_zone, '+05:30'))"
    conn.query(query, [customerId, milk_type, litre, fat, fat_price, amount, advanced_amount, due_date, when, 'pending'], (err, result) => {
        if (err) {
            res.status(403).json({ message: "Order can't placed" })
            return
        } else {
            res.status(200).json({ message: "Order placed successfully" })
            return
        }
    })
    closeConnection(conn)
})

// fetch single bill
app.get("/fetch_single_bill", authenticate, (req, res) => {

    const data = req.body
    const parseData = checkSingleFetchOrder.safeParse(data)

    if (!parseData.success) {
        res.status(411).json(parseData.error.issues[0].message)
        return
    }

    const organization = parseData.data.organization
    const when = parseData.data.when
    const purchase_date = parseData.data.purchase_date
    const query = "SELECT p.purchase_id,c.name,c.organization,p.fat_price,p.when_,p.milk_type,DATE_FORMAT(p.due_date, '%Y-%m-%d') as due_date,p.litre,p.fat,p.amount,p.advance_amount FROM customers c INNER JOIN purchase p ON p.customer_id = c.customer_id AND c.organization=? AND p.purchase_date=? ANd p.when_=?"

    conn.query(query, [organization, purchase_date, when], (err, result) => {
        if (err) {
            res.status(403).json({ message: "Some error occured" })
            return
        } else {
            if (result.length == 0) {
                res.status(401).json({ message: "Please select valid organization, time and purchase date" })
            } else {
                res.status(200).json({ data: result })
            }
            return
        }
    })
    closeConnection(conn)
})

//update purchase order
app.put('/update_purchase', authenticate, async (req, res) => {

    const data = req.body
    const parseData = purchaseUpdate.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }

    const purchaseId = parseData.data.purchaseId
    const litre = parseData.data.litre
    const fat = parseData.data.fat
    const fat_price = parseData.data.fat_price
    const amount = parseData.data.amount
    const advanced_amount = parseData.data.advance_amount
    const due_date = parseData.data.due_date
    const milk_type = parseData.data.which
    const when = parseData.data.when

    const updatePurchase = "UPDATE purchase SET milk_type=?,litre=?, fat=?, fat_price=?, amount=?, advance_amount=?, due_date=?, when_=? WHERE purchase_id=?"
    console.log(advanced_amount)
    conn.query(updatePurchase, [milk_type, litre, fat, fat_price, amount, advanced_amount, due_date, when, purchaseId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occurred" })
            return
        } else {
            res.status(200).json({ message: "Record Updated successfully" })
            return
        }
    })
    closeConnection(conn)
})

// get biilles
app.get('/get_bills', authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const query = "SELECT p.purchase_id,c.customer_id,c.name,p.amount,p.due_date,p.payment_status FROM customers c INNER JOIN purchase p ON p.customer_id = c.customer_id AND c.user_id = ?"

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
    closeConnection(conn)
})

//get bills based on organizations to list on bill section
app.get("/get_bills_on_organizations", authenticate, async (req, res) => {

    const data = req.body
    const parseData = checkOrganization.safeParse(data)

    if (!parseData.success) {
        res.status(411).json({ message: parseData.error.issues[0].message })
        return
    }
    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const organization = parseData.data.organization
    const query = "SELECT p.purchase_id,c.customer_id,c.name,p.amount,p.due_date,p.payment_status FROM customers c INNER JOIN purchase p ON p.customer_id = c.customer_id AND c.user_id = ? AND organization=?"

    conn.query(query, [userId, organization], (err, result) => {

        if (err) {
            res.status(403).json({ message: "Some error occurred" })
            return
        } else {
            result.map(result => checkPurchaseStatus(result))
            res.status(200).json({ data: result })
            return
        }
    })
    closeConnection(conn)
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
    closeConnection(conn)
})

// make payment status done
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
    closeConnection(conn)
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
    closeConnection(conn)
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
    closeConnection(conn)
})

// get profile daat
app.get("/get_profile_data", async (req, res) => {

    const userId = await getUserIdFromToken(req).then(id => { return id.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const sql = "SELECT name, email, standard_price_cow, standard_price_buffalo, location FROM user WHERE user_id = ?"

    conn.query(sql, [userId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occured" })
            return
        } else {
            res.status(200).json({ data: result })
        }
    })
    closeConnection(conn)
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
        const standardPriceCow = parseData.data.standardPriceCow
        const standardPriceBuffalo = parseData.data.standardPriceBuffalo
        const userId = await getUserIdFromToken(req).then(id => { return id.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
        const sql = "UPDATE user SET name=?, standard_price_cow=?, standard_price_buffalo=?, location=? WHERE user_id=?"

        conn.query(sql, [username, standardPriceCow, standardPriceBuffalo, location, userId], (err, result) => {
            if (err) {
                res.status(411).json({ message: "Some error occured" })
                return
            } else {
                res.status(200).json({ message: "Profile updated successfully" })
                return
            }
        })
    }
    closeConnection(conn)
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
        const getUserData = "SELECt name, mobile_no, email,organization FROM customers WHERE organization = ? AND user_id = ?"

        conn.query(getUserData, [organization, userId], (err, customerData) => {
            if (err) {
                res.status(411).json({ message: "Some error occurred..." })
                return
            } else {
                const query = "SELECT p.fat,p.purchase_date,p.amount,p.advance_amount,p.litre,p.milk_type,p.when_, DATE_FORMAT(p.purchase_time, '%H:%i:%s') AS purchase_time FROM customers c INNER JOIN purchase p ON c.customer_id = p.customer_id AND p.payment_status != 'paid' AND c.organization = ? AND c.user_id = ?;"
                conn.query(query, [organization, userId], (err, result) => {
                    if (err) {
                        res.status(411).json({ message: "Some error occurred..." })
                        return
                    } else {
                        if (result.length == 0) {
                            res.status(200).json({ message: `No pending bills for ${organization} or No such organization found` })
                            return
                        } else {
                            let totalAmount = 0
                            let totalAdvanceAmount = 0
                            result.map(result => {
                                totalAmount += result.amount
                                totalAdvanceAmount += result.advance_amount
                            })
                            if (totalAmount < totalAdvanceAmount) {
                                res.status(200).json({ message: `Please set advanced payment to below ${totalAmount}` })
                                return
                            } else {
                                result.map(result => { result.purchase_date = formatDate(result.purchase_date) })
                                const grandTotalAmount = totalAmount - totalAdvanceAmount
                                customerData = { "userdata": customerData[0], "purchases": result, "total amount": totalAmount, "total advance": totalAdvanceAmount, "grand total": grandTotalAmount }
                                res.status(200).json(customerData)
                                return
                            }
                        }
                    }
                })
            }
        })
    }
    closeConnection(conn)
})

// mark as paid all bills
app.put("/mark_as_all_paid", authenticate, async (req, res) => {

    const data = req.body
    const parseData = checkOrganization.safeParse(data)

    if (!parseData.success) {
        res.status(200).json({ message: parseData.error.issues[0].message })
        return
    } else {
        const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
        const organization = parseData.data.organization
        const query = "UPDATE purchase SET payment_status='paid' WHERE purchase_id IN(SELECT p.purchase_id FROM customers c INNER JOIN purchase p ON p.customer_id = c.customer_id AND c.user_id = ? AND organization=?);"

        conn.query(query, [userId, organization], (err, result) => {
            if (err) {
                res.status(411).json({ message: "Some error occurred..." })
                return
            } else {
                res.status(200).json({ message: `All record are updated for ${organization}...` })
                return
            }
        })
        closeConnection(conn)
    }

})

//fetch todays purchases/bills
app.get("/fetch_todays_bills", authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const today = new Date().toISOString().split('T')[0]
    const query = "SELECT c.organization,p.when_,p.milk_type,p.litre,p.fat,p.amount,p.when_,DATE_FORMAT(purchase_time, '%H:%i:%s') AS purchase_time FROM customers c INNER JOIN purchase p WHERE c.customer_id = p.customer_id AND c.user_id = ? AND p.purchase_date = ?"

    conn.query(query, [userId, today], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occurred..." })
            return
        } else {
            if (result.length == 0) {
                res.status(200).json({ message: `No purchase make on ${today}` })
                return
            } else {
                res.status(200).json({ data: result })
                return
            }
        }
    })
    closeConnection(conn)
})

// get all bills till now
app.get('/get_all_bills', authenticate, async (req, res) => {

    const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
    const query = "SELECT c.organization,p.fat,p.purchase_date,p.advance_amount,p.due_date,p.amount,p.litre,p.milk_type,p.when_, DATE_FORMAT(p.purchase_time, '%H:%i:%s') AS purchase_time,p.payment_status FROM customers c INNER JOIN purchase p ON c.customer_id = p.customer_id AND c.user_id=?"
    conn.query(query, [userId], (err, result) => {
        if (err) {
            res.status(411).json({ message: "Some error occurred..." })
            return
        } else {
            if (result.length == 0) {
                res.status(200).json({ message: `No pending bills for ${organization} or No such organization found` })
                return
            } else {
                let totalAmount = 0
                let totalAdvanceAmount = 0
                let totalPaid = 0
                let totalUnpaid = 0

                result.map(result => {
                    totalAmount += result.amount
                    if (result.payment_status == 'paid')
                        totalPaid += result.amount
                    else
                        totalUnpaid += result.amount
                    totalAdvanceAmount += result.advance_amount
                    result.purchase_date = formatDate(result.purchase_date)
                    checkPurchaseStatus(result)
                    result.due_date = formatDate(result.due_date)
                })

                const data = { "purchases": result, "total amount": totalAmount, "total advnace": totalAdvanceAmount, "total paid": totalPaid, "total unpaid": totalUnpaid }
                res.status(200).json(data)
                return
            }
        }
    })
    closeConnection(conn)
})

//get bills based on organizations to list for report generation {paid, unpaid and overdue}
app.get("/get_all_bills_on_organizations", authenticate, async (req, res) => {

    const data = req.body
    const parseData = checkOrganization.safeParse(data)

    if (!parseData.success) {
        res.status(200).json({ message: parseData.error.issues[0].message })
        return
    } else {

        const organization = parseData.data.organization
        const userId = await getUserIdFromToken(req).then(response => { return response.data }).catch(err => { res.status(err.code).json({ message: err.message }) })
        const getUserData = "SELECt name, mobile_no, email,organization FROM customers WHERE organization = ? AND user_id = ?"

        conn.query(getUserData, [organization, userId], (err, customerData) => {
            if (err) {
                res.status(411).json({ message: "Some error occurred..." })
                return
            } else {
                const query = "SELECT p.fat,p.purchase_date,p.due_date,p.amount,p.advance_amount,p.litre,p.milk_type,p.when_, DATE_FORMAT(p.purchase_time, '%H:%i:%s') AS purchase_time,p.payment_status FROM customers c INNER JOIN purchase p ON c.customer_id = p.customer_id AND c.organization = ? AND c.user_id = ?;"
                conn.query(query, [organization, userId], (err, result) => {
                    if (err) {
                        res.status(411).json({ message: "Some error occurred..." })
                        return
                    } else {
                        if (result.length == 0) {
                            res.status(200).json({ message: `No pending bills for ${organization} or No such organization found` })
                            return
                        } else {
                            let totalAmountUnpaid = 0
                            let totalAmountPaid = 0
                            let totalAdvanceAmount = 0
                            result.map(result => {
                                if (result.payment_status == 'paid')
                                    totalAmountPaid += result.amount
                                else
                                    totalAmountUnpaid += result.amount

                                totalAdvanceAmount += result.advance_amount
                                result.purchase_date = formatDate(result.purchase_date)
                                checkPurchaseStatus(result)
                                result.due_date = formatDate(result.due_date)
                            })
                            customerData = { "userdata": customerData[0], "purchases": result, "total amount paid": totalAmountPaid, "total amount unpaid": totalAmountUnpaid, "total advance": totalAdvanceAmount }

                            res.status(200).json(customerData)
                            return
                        }
                    }
                })
            }
        })
    }
    closeConnection(conn)
})

app.get('/tmp', (req, res) => {
    const name = "વંશ"; // Data to be included in the PDF
    generatePDF(name, (err, filePath) => {
        if (err) {
            console.error('Error generating PDF:', err);
            res.status(500).json({ message: "Error generating PDF" });
            return;
        }

        // Serve the file after it's fully generated
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                console.log('PDF sent successfully');
                // Optionally clean up the file after sending
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                });
            }
        });
    });
})


app.listen(port)

