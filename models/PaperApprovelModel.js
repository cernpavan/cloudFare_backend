import mongoose from "mongoose";

// Define the schema for paper approvals
const PaperApprovelschema = new mongoose.Schema({
    username: { type: String, required: true },  // Username of the uploader
    subjectName: { type: String, required: true },  // Subject name for the paper
    paperType: { type: String, required: true },  // Type of paper (e.g., CAT-1, CAT-2, FAT)
    paperDate: { type: Date, required: true },  // Date of the paper
    paperSlot: { type: String, required: true },  // Slot of the paper
    paperLink: { type: String, required: true }  // Link to the uploaded paper
});

// Create and export the PaperApprovelModel
const PaperApprovelModel = mongoose.models.PaperApprovelModel || mongoose.model("PaperApprovelModel", PaperApprovelschema);

export default PaperApprovelModel;
