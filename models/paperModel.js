import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    paperType: { type: String, required: true },
    paperDate: { type: Date, required: true },
    paperSlot: { type: String, required: true },
    paperLink: { type: String, required: true }
});

const paperModel = mongoose.models.paper || mongoose.model("paper", paperSchema);

export default paperModel;
