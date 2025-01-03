import AdminLoginModel from '../../backend/models/AdminLoginModel.js';
import PaperApprovelModel from '../../backend/models/PaperApprovelModel.js';
import SubAdminLoginModel from "../../backend/models/SubAdminLoginModel.js";
import latestPaperModel from '../../backend/models/latestPaperModel.js';
import paperModel from '../../backend/models/paperModel.js';
import uploaderLoginModel from '../../backend/models/uploaderLoginModel.js';

// Function to add a new paper to paperModel
const addPaper = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { subjectName, paperType, paperDate, paperSlot, paperLink } = req.body;

        if (!subjectName || !paperType || !paperDate || !paperSlot) {
            console.log("Validation failed: Missing required fields");
            return res.status(400).json({ message: "All fields are required." });
        }

        const parsedDate = new Date(paperDate);
        if (isNaN(parsedDate.getTime())) {
            console.log("Validation failed: Invalid date format");
            return res.status(400).json({ message: "Invalid date format." });
        }

        if (paperLink && !/^(https?:\/\/)[^\s/$.?#].[^\s]*$/i.test(paperLink)) {
            console.log("Validation failed: Invalid paperLink URL format");
            return res.status(400).json({ message: "Invalid paperLink URL format." });
        }

        const paper = new paperModel({
            subjectName,
            paperType,
            paperDate: parsedDate,
            paperSlot,
            paperLink: paperLink || ''
        });

        await paper.save();
        console.log('Paper added successfully:', paper);
        res.status(201).json({ message: "Paper added successfully", paper });
    } catch (error) {
        console.error('Error in addPaper:', error);
        res.status(500).json({ message: "Failed to add paper", error: error.message });
    }
};

// Function to list all papers from paperModel
const listPaper = async (req, res) => {
    try {
        const papers = await paperModel.find({});
        res.json({ success: true, data: papers });
    } catch (error) {
        console.log('Error listing papers:', error);
        res.status(500).json({ success: false, message: "Error retrieving papers" });
    }
};

// Function to remove a paper from paperModel
const removePaper = async (req, res) => {
    try {
        const paper = await paperModel.findById(req.body.id);
        if (!paper) {
            return res.status(404).json({ success: false, message: "Paper not found" });
        }

        await paperModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Paper removed successfully" });
    } catch (error) {
        console.error('Error removing paper:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Function to add a paper to latestPaperModel
const addLatestPaper = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { subjectName, paperType, paperDate, paperSlot, paperLink } = req.body;

        if (!subjectName || !paperType || !paperDate || !paperSlot) {
            console.log("Validation failed: Missing required fields");
            return res.status(400).json({ message: "All fields are required." });
        }

        const parsedDate = new Date(paperDate);
        if (isNaN(parsedDate.getTime())) {
            console.log("Validation failed: Invalid date format");
            return res.status(400).json({ message: "Invalid date format." });
        }

        const latestPaper = new latestPaperModel({
            subjectName,
            paperType,
            paperDate: parsedDate,
            paperSlot,
            paperLink: paperLink || ''
        });

        await latestPaper.save();
        console.log('Latest paper added successfully:', latestPaper);
        res.status(201).json({ message: "Latest paper added successfully", latestPaper });
    } catch (error) {
        console.error('Error in addLatestPaper:', error);
        res.status(500).json({ message: "Failed to add latest paper", error: error.message });
    }
};

// Function to list all papers from latestPaperModel
const listLatestPapers = async (req, res) => {
    try {
        const latestPapers = await latestPaperModel.find({});
        res.json({ success: true, data: latestPapers });
    } catch (error) {
        console.log('Error listing latest papers:', error);
        res.status(500).json({ success: false, message: "Error retrieving latest papers" });
    }
};

// Function to remove a paper from latestPaperModel
const removeLatestPaper = async (req, res) => {
    try {
        const latestPaper = await latestPaperModel.findById(req.body.id);
        if (!latestPaper) {
            return res.status(404).json({ success: false, message: "Latest paper not found" });
        }

        await latestPaperModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Latest paper removed successfully" });
    } catch (error) {
        console.error('Error removing latest paper:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Function to handle uploader login
const uploaderLogin = async (req, res) => {
    try {
        const { username, password, name, phoneNumber, regNo, year } = req.body;
    
        // Validate input fields
        if (!username || !password || !name || !phoneNumber || !regNo || !year) {
          return res.status(400).json({ message: "All fields are required." });
        }
    
        // Find and update user or create a new one if not exists
        const user = await uploaderLoginModel.findOneAndUpdate(
          { username },
          { username, password, name, phoneNumber, regNo, year },
          { new: true, upsert: true } // Create new if not exists
        );
    
        // Send success response
        res.status(201).json({ message: "User added/updated successfully.", user });
    } catch (error) {
        // Log and send error response
        console.error('Error in uploaderLogin:', error);
        res.status(500).json({ message: "Failed to add/update user", error: error.message });
    }
};

// Function to list all uploaders
const listUploaders = async (req, res) => {
    try {
        const uploaders = await uploaderLoginModel.find({});
        res.json({ success: true, data: uploaders });
    } catch (error) {
        console.log('Error listing uploaders:', error);
        res.status(500).json({ success: false, message: "Error retrieving uploaders" });
    }
};

const removeUploader = async (req, res) => {
    try {
        const { id } = req.body;

        const uploader = await uploaderLoginModel.findById(id);
        if (!uploader) {
            return res.status(404).json({ success: false, message: "Uploader not found" });
        }

        await uploaderLoginModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Uploader removed successfully" });
    } catch (error) {
        console.error('Error removing uploader:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const addPaperApproval = async (req, res) => {
    try {
        const { subjectName, paperType, paperDate, paperSlot, paperUrl, username } = req.body;

        if (!subjectName || !paperType || !paperDate || !paperSlot || !username) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const parsedDate = new Date(paperDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        const paperApproval = new PaperApprovelModel({
            subjectName,
            paperType,
            paperDate: parsedDate,
            paperSlot,
            paperLink: paperUrl || '', // Changed from paperLink to paperUrl
            username
        });

        await paperApproval.save();
        res.status(201).json({ message: "Paper approval added successfully", paperApproval });
    } catch (error) {
        console.error('Error in addPaperApproval:', error);
        res.status(500).json({ message: "Failed to add paper approval", error: error.message });
    }
};

// Function to list all paper approvals
const listPaperApprovals = async (req, res) => {
    try {
        const paperApprovals = await PaperApprovelModel.find({});
        res.json({ success: true, data: paperApprovals });
    } catch (error) {
        console.error('Error listing paper approvals:', error);
        res.status(500).json({ success: false, message: "Error retrieving paper approvals" });
    }
};

// Function to remove a paper approval
const removePaperApproval = async (req, res) => {
    try {
        const { id } = req.body;

        const paperApproval = await PaperApprovelModel.findById(id);
        if (!paperApproval) {
            return res.status(404).json({ success: false, message: "Paper approval not found" });
        }

        await PaperApprovelModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Paper approval removed successfully" });
    } catch (error) {
        console.error('Error removing paper approval:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Admin functions
const addAdmin = async (req, res) => {
    try {
        const { username, password, name, regNo, phoneNumber, gmail, year } = req.body;

        if (!username || !password || !name || !regNo || !phoneNumber || !gmail || !year) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const admin = new AdminLoginModel({ username, password, name, regNo, phoneNumber, gmail, year });
        await admin.save();
        res.status(201).json({ message: "Admin added successfully", admin });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ message: "Failed to add admin", error: error.message });
    }
};

const listAdmins = async (req, res) => {
    try {
        const admins = await AdminLoginModel.find({});
        res.json({ success: true, data: admins });
    } catch (error) {
        console.error('Error listing admins:', error);
        res.status(500).json({ success: false, message: "Error retrieving admins" });
    }
};

const removeAdmin = async (req, res) => {
    try {
        const { id } = req.body;

        const admin = await AdminLoginModel.findById(id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        await AdminLoginModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Admin removed successfully" });
    } catch (error) {
        console.error('Error removing admin:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
// SubAdmin functions
const addSubAdmin = async (req, res) => {
    try {
        const { username, password, name, regNo, phoneNumber, gmail, year } = req.body;

        // Validate all required fields
        if (!username || !password || !name || !regNo || !phoneNumber || !gmail || !year) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate that year is a number
        if (isNaN(year)) {
            return res.status(400).json({ message: "Year must be a number." });
        }

        const subAdmin = new SubAdminLoginModel({ username, password, name, regNo, phoneNumber, gmail, year });
        await subAdmin.save();
        res.status(201).json({ message: "SubAdmin added successfully", subAdmin });
    } catch (error) {
        console.error('Error adding SubAdmin:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username, Gmail, or RegNo already exists." });
        }

        res.status(500).json({ message: "Failed to add SubAdmin", error: error.message });
    }
};

const listSubAdmins = async (req, res) => {
    try {
        const subAdmins = await SubAdminLoginModel.find({});
        res.json({ success: true, data: subAdmins });
    } catch (error) {
        console.error('Error listing SubAdmins:', error);
        res.status(500).json({ success: false, message: "Error retrieving SubAdmins" });
    }
};

const removeSubAdmin = async (req, res) => {
    try {
        const { id } = req.body;

        const subAdmin = await SubAdminLoginModel.findById(id);
        if (!subAdmin) {
            return res.status(404).json({ success: false, message: "SubAdmin not found" });
        }

        await SubAdminLoginModel.findByIdAndDelete(id);
        res.json({ success: true, message: "SubAdmin removed successfully" });
    } catch (error) {
        console.error('Error removing SubAdmin:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Function to update paper details
const updatePaperDetails = async (req, res) => {
    const { id, subjectName, paperSlot, paperType, paperDate } = req.body;

    // Validate all required fields
    if (!id || !subjectName || !paperSlot || !paperType || !paperDate) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Find the paper by ID
        const paper = await PaperApprovelModel.findById(id);
        if (!paper) {
            return res.status(404).json({ success: false, message: "Paper not found" });
        }

        // Update paper details
        paper.subjectName = subjectName;
        paper.paperSlot = paperSlot;
        paper.paperType = paperType;

        // Validate and set paperDate
        const date = new Date(paperDate);
        if (isNaN(date.getTime())) { // Check if date is valid
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }
        paper.paperDate = date;

        // Save the updated paper
        await paper.save();

        res.json({ success: true, message: "Paper details updated successfully" });
    } catch (error) {
        console.error("Error updating paper details:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Export all functions
export {
    addAdmin, addLatestPaper, addPaper, addPaperApproval, addSubAdmin, listAdmins, listLatestPapers, listPaper, listPaperApprovals, listSubAdmins, listUploaders, removeAdmin, removeLatestPaper, removePaper, removePaperApproval, removeSubAdmin, removeUploader, uploaderLogin,updatePaperDetails
};

