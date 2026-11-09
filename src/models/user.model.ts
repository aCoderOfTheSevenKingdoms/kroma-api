import mongoose from "mongoose";

export interface IUser {
   email: string;
   contact: string;
   password: string;
   fullname: string;
   is_verified: boolean;
   google_id: string;
   user_type: string;
}

function isLocalAccount(this: { google_id?: string }) {
   return !this.google_id;
}

const userSchema = new mongoose.Schema<IUser>({
   email: {type: String, required: true, unique: true},
   contact: {type: String, required: isLocalAccount},
   password: {type: String, required: isLocalAccount, select: false},
   fullname: {type: String, required: true},
   is_verified: {type: Boolean, default: false},
   google_id: { type: String, unique: true, sparse: true },
   user_type: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer"
   }
});

const userModel = mongoose.model('user', userSchema);

export default userModel;