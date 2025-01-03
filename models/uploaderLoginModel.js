// models/uploaderLoginModel.js
import mongoose from 'mongoose';

const uploaderLoginSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  regNo: { type: String, unique: true, required: true },
  year: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true
  },
});

// Remove the pre-save hook for password hashing
// Remove the method for password comparison

const uploaderLoginModel = mongoose.models.uploaderLoginModel || mongoose.model("uploaderLoginModel", uploaderLoginSchema);

export default uploaderLoginModel;
