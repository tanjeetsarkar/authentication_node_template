require('dotenv').config()
const express = require('express');
const bodyParse = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const saltRounds = 10

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParse.urlencoded({
    extended: true
}));
const PORT = 3000;
//////////////////////////////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

/////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        console.log(req.body.password)

        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        })
    });

});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = (req.body.password);
    User.findOne({
        email: username
    }, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                console.log(password, foundUser.password)
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result) {
                        res.render("secrets");
                    } else {
                        console.log("error in bycrypt")
                    }
                });
            }
        }
    })

})




////////////////////////////////////////////////////////////////
app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});