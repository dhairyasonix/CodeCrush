const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: 4,
            maxLength: 40,
            unique: false,

        },
        lastName: {
            type: String,
            trim: true,
            minLength: 4,
            maxLength: 40,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 4,
            maxLength: 70,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Not a valid email")
                }
            }

        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 6,
            maxLength: 70,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Not a strong password " + value)
                }
            }
        },
        age: {
            type: Number,
            min: 18,
            max: 100,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid")
                }

            }
        },
        photoUrl: {
            type: String,
            default: "https://cdn2.iconfinder.com/data/icons/business-hr-and-recruitment/100/account_blank_face_dummy_human_mannequin_profile_user_-512.png",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Not a valid image" + value)
                }
            }
        },
        skills: {
            type: [String],
            validate(value) {
                if (value.length > 5) {
                    throw new Error("length exicted add upto 5 skills")
                }
            }
        }
    }, { timestamps: true });

    // methods to create jwt token
userSchema.methods.getJWT = async function () {

    const token = await jwt.sign({ _id: this._id }, "CodeCrush@Dhairy123", { expiresIn: '1d' })
    return token;
};
 // methods to validate user enterd password
userSchema.methods.validateUserPassword = async function (userHashPassword) {

    validationResult = await bcrypt.compare(userHashPassword, this.password)
return validationResult
}

module.exports = mongoose.model("User", userSchema)