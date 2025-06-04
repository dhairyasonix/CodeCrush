const express = require("express");
const app = express();



app.use("/test", (req, res) => {
    res.send("wellcomt to test page")
});


app.get("/user",(req,res)=>{
    res.send({name:"dhairya", no:"9993979695"})
})
app.post("/user",(req,res)=>{
    //db save
    res.send("succesfully saved the data")
})
app.delete("/user",(req,res)=>{
    //db delete
    res.send("succesfully deleted the data")
})

app.listen(7777, () => {
    console.log("listning to 7777")
})