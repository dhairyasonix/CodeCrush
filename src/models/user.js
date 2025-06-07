const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: 4,
            maxLength:40,
            unique: false,

        },
        lastName: {
            type: String,
            trim: true,
            minLength: 4,
            maxLength:40,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 4,
            maxLength:70,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 6,
            maxLength:70,
        },
        age: {
            type: Number,
            min: 18,
            max:100,
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
            default: "https://cdn2.iconfinder.com/data/icons/business-hr-and-recruitment/100/account_blank_face_dummy_human_mannequin_profile_user_-512.png"
        },
        skills: {
            type: [String],
            validate(value){
                if(value.length > 5){
                    throw new Error("length exicted add upto 5 skills")
                }
            }
        }
    }, { timestamps: true });

module.exports = mongoose.model("User", userSchema)