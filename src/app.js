const express = require("express");
const app = express();
const {adminAuth,UserAuth} = require("./Middleware/auth")


app.use("/test", (req, res) => {
    res.send("wellcomt to test page")
});

app.get("/user/login",(req,res)=>{
res.send("login info")

})

app.use("/user/data",UserAuth,(req,res)=>{
res.send("user data")

})

app.use("/admin",adminAuth)

app.get("/admin/admindata",(req,res)=>{

    try {
        // db call or something
        res.send("Here is admin data")
    } catch (error) {
        res.status(500).send("uncaught error")
    }


})
app.delete("/admin/deletedata",(req,res)=>{
    throw new Error("errorer");
    
res.send("data deleted")

})

app.use("/",(err,req,res,next)=>{

    if (err){
        res.status(500).send("uncaught error")
    }

})


app.listen(7777, () => {
    console.log("listning to 7777")
})