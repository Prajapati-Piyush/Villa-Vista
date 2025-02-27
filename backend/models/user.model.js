import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'villa owner'],
    default: 'user',
  },
  otp: { type: Number, default: null },  // OTP field
  otpExpiration: { type: Date, default: null },
  verified: {
    type: Boolean,
    default: false
  }
});


const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
