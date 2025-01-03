import mongoose from "mongoose";

// Define the schema for the latest question papers
const latestPaperSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    paperType: { type: String, required: true },
    paperDate: { type: Date, required: true },
    paperSlot: { type: String, required: true },
    paperLink: { type: String, required: true }
});

// Create the model for the latest question papers
const latestPaperModel = mongoose.models.latestPaperModel || mongoose.model("latestPaperModel", latestPaperSchema);

export default latestPaperModel;
