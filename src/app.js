const express = require("express");
const app = express();

app.use("/", (req, res) => {
    res.send("wellcomt to Home page")
});

app.use("/about", (req, res) => {
    res.send("wellcomt to about page")
});

app.listen(7777, () => {
    console.log("listning to 7777")
})