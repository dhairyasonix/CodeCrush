const adminAuth = (req,res,next)=>{
const token ="xyz";
const isAuthorished = token === "xyz";
if(!isAuthorished){
res.status(401).send("unauthorished access")
}
else{
    next()
}   
}

const UserAuth = (req,res,next)=>{
const token ="xyz";
const isAuthorished = token === "xyz";
if(!isAuthorished){
res.status(401).send("unauthorished access")
}
else{
    next()
}   
}

module.exports = {adminAuth,UserAuth}