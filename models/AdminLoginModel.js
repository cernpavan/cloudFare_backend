import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminLoginSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures username is unique
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
    unique: true, // Ensures registration number is unique
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
    unique: true, // Ensures Gmail is unique
    match: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, // Validates that the email is a Gmail address
  },
  year: {
    type: Number,
    required: true,
  },
});

// Export the model as default
const AdminLoginModel = mongoose.model('AdminLogin', adminLoginSchema);
export default AdminLoginModel;
