const mongoose = require("mongoose")

const connectDB = async()=>{
await mongoose.connect("mongodb+srv://sonidhairya160:Twb4jokP3f2UAmVf@namastenode.cvl8pfq.mongodb.net/codeCrush")
}

module.exports = connectDB;