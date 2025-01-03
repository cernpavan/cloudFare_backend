import express from 'express';
import multer from 'multer';
import { 
    addPaper, 
    listPaper, 
    removePaper, 
    addLatestPaper, 
    listLatestPapers, 
    removeLatestPaper, 
    uploaderLogin,
    listUploaders,
    removeUploader,
    addPaperApproval,       // Handler for adding paper approval
    listPaperApprovals,     // Handler for listing paper approvals
    removePaperApproval,    // Handler for removing paper approval
    addAdmin,               // Handler for adding an admin
    listAdmins,             // Handler for listing admins
    removeAdmin,            // Handler for removing an admin
    addSubAdmin,            // Handler for adding a subadmin
    listSubAdmins,          // Handler for listing subadmins
    removeSubAdmin,
    updatePaperDetails          // Handler for removing a subadmin
} from '../controllers/paperController.js';

const paperRouter = express.Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// Define routes
paperRouter.post('/add', addPaper);
paperRouter.get('/list', listPaper);
paperRouter.post('/remove', removePaper);
paperRouter.post('/latest', addLatestPaper);
paperRouter.get('/latest', listLatestPapers);
paperRouter.post('/removeLatest', removeLatestPaper);
paperRouter.post('/uploaderLogin', uploaderLogin);
paperRouter.get('/uploaderList', listUploaders);
paperRouter.post('/removeUploader', removeUploader);

// Routes for Paper Approvals
paperRouter.post('/addPaperApproval', addPaperApproval); // Add a paper approval
paperRouter.get('/listPaperApprovals', listPaperApprovals); // List all paper approvals
paperRouter.post('/removePaperApproval', removePaperApproval); // Remove a paper approval

// Routes for Admins
paperRouter.post('/addAdmin', addAdmin); // Add a new admin
paperRouter.get('/listAdmins', listAdmins); // List all admins
paperRouter.post('/removeAdmin', removeAdmin); // Remove an admin

// Routes for SubAdmins
paperRouter.post('/addSubAdmin', addSubAdmin);
paperRouter.get('/listSubAdmins', listSubAdmins);
paperRouter.post('/removeSubAdmin', removeSubAdmin);

// Route to update paper details
paperRouter.post('/updatePaper', updatePaperDetails);


export default paperRouter;
