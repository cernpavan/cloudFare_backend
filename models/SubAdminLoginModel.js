// backend/models/SubAdminLoginModel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const subAdminLoginSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
  },
  year: {
    type: Number,
    required: true,
  },
});

const SubAdminLoginModel = mongoose.model('SubAdminLogin', subAdminLoginSchema);
export default SubAdminLoginModel;
