const validator = require("validator")

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    }
    else if (!validator.isEmail(emailId.trim())) {
        throw new Error("email is not valid")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("password is not strong")
    }

};

const validateProfileEdit =(req)=>{
    const allowedEditFields = ["age","gender","photoUrl","skills","firstName","lastName","about"]
    
    const isAllowed = Object.keys(req.body).every(feild=> allowedEditFields.includes(feild));

if(!isAllowed){
    throw new Error("Profile data is not validated")
}

}


module.exports = { validateSignUpData,validateProfileEdit }