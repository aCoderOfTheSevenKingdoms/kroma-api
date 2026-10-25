import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   email: {type: String, required: true, unique: true},
   contact: {type: String, required: true},
   password: {type: String, required: true},
   fullname: {type: String, required: true},
   is_verified: {type: Boolean, default: false},
   user_type: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer"
   }
});

const userModel = mongoose.model('user', userSchema);

export default userModel;