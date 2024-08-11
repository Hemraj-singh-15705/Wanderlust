const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(session({secret:"mysupersecretcode" , resave:false, saveUninitialized:true}));
app.use(flash());


app.get("/test",(req,res)=>{
    res.send("test successful");
});

app.get("/register",(req,res)=>{
    let {name ="anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user register successfully !");
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    req.locals.errorMsj = req.flash("success");
    res.render("page.ejs",{name: req.session.name });
});


// app.get("/request",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you send a request ${req.session.count}`);
// });


app.listen(3000, ()=>{
    console.log("server is listing in port 3000");
});