const msql = require("mssql");
let db = require("../sql/connection");
let argon2 = require('argon2');
let jwt = require("jsonwebtoken");

let register = async (req, res) => {
    // ("username": "nsank", "password": "bob12345", "fullName": "Nik Sankovich")
    let username = req.body.username;
    let password = req.body.password;
    let fullName = req.body.fullName;

    let passwordHash;

    try {
        // hash the password
        passwordHash = await argon2.hash(password);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }

    let params = [username, passwordHash, fullName];
    let sql = "insert into regUser (username, password_hash, full_name) values (?, ?, ?)"

    try {
        let results = await db.queryPromise(sql, params);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        if (err.code == "ER_DUP_ENTRY") {
            res.sendStatus(400).send("That username is taken. Please try again")
        } else {
            res.sendStatus(500);
        }
        return;
    }
}

let login = (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    let sql = "select full_name, password_hash from regUser where username = ?"
    let params = [username];

    db.query(sql, params, async (err, rows) => {
        if (err) {
            console.log("Could not get user ", err);
            res.sendStatus(500)
        } else {
            // we found someone
            if (rows.length > 1) {
                console.log("Returned too many rows for username ", err);
                res.sendStatus(500);
            } else if (rows.length == 0) {
                console.log("Username does not exist");
                res.sendStatus(400).send("That username doesn't exist. Please sign up for an account")
            } else {
                //we have one row 
                // it comes back as an array of objects, so u get the object by its index
                // [{"id": 234, "username": "nsank", "password_hash": "...", "full_name": "Nik Sankovich"} ]
                // [{"id": 456, "username": "nsank", "password_hash": "...", "full_name": "Nik Sankovich"} ]

                let pwHash = rows[0].password_hash;
                let fnName = rows[0].full_name;
                let userId = rows[0].id;

                let goodPass = false;

                try {
                    goodPass = await argon2.verify(pwHash, password)
                } catch (err) {
                    console.log("Failed to verify password ", err);
                    res.status(400).send("Invalid password");
                }

                if (goodPass) {
                    let token = {
                        "fullName": fnName,
                        "userId": userId
                    }
                    // res.json(token);

                    let signedToken = jwt.sign(token, process.env.JWT_SECRET);

                    res.json(signedToken)

                    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5payBTYW5rb3ZpY2giLCJpYXQiOjE2ODAxOTE5MzR9.r6LwmZktaIvX9edP14ocLoNBzOnp5JU0KVxahPu0jUU


                } else {
                    res.sendStatus(400)
                }
            } // end else
        }
    })



} // end login function

module.exports = { register, login }