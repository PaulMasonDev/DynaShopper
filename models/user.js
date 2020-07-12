const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new mongoose.Schema({
    // User Information
    username: {type: String, unique: true, required: true, default:'' },
    email: {type: String, unique: true, required: false, default: ''},
    password: String,
    firstName: {type: String, default:""},
    lastName: {type: String, default:""},
    avatar: String,
    created: {type: String, default: Date.now()},
    //Role Booleans
    isAdmin: {type: Boolean, default: false},
    isSuperAdmin: {type: Boolean, default: false},
    //FB, Twitter, Google info
    provider: String,
    providerID: String,
    //Reset Password info
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);