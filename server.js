import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import { google } from 'googleapis';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js'; // Ensure you have this file
import paperRouter from './routes/paperRoutes.js'; // Ensure you have this file
import nodemailer from 'nodemailer'; // Import Nodemailer
import https from 'https';

// Load environment variables
dotenv.config();

// Get the current module's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Google API credentials from JSON file
const keyFile = path.join(__dirname, 'driveApi.json');

// Create an instance of Google Drive API
const auth = new google.auth.GoogleAuth({
    keyFile: keyFile,
    scopes: ['https://www.googleapis.com/auth/drive.file']
});
const drive = google.drive({ version: 'v3', auth });

// Google Drive folder ID
const FOLDER_ID = '1W1VzyTWxprJ4fY8ZCKfJh5xAincbfzaC'; // Replace with your folder ID

// Create an instance of Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

const httpsServer = https.createServer(app); 
const httpsPort = 443;
// Start the HTTPS server
httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server running on port ${httpsPort}`);
});


// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// API endpoints
app.use('/api/paper', paperRouter);

// Endpoint to handle file upload to Google Drive
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, req.file.path);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'File does not exist' });
    }

    try {
        // Upload the file to Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: req.file.originalname,
                mimeType: req.file.mimetype,
                parents: [FOLDER_ID] // Ensure this folder ID is correct
            },
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(filePath)
            },
            fields: 'id'
        });

        const fileId = response.data.id;
        console.log('File uploaded successfully:', fileId);

        // Get the viewable link
        const fileResponse = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink'
        });

        // Send back the viewable link to the client
        res.json({ link: fileResponse.data.webViewLink });

    } catch (error) {
        console.error('Error uploading file:', error); // Log the complete error
        res.status(500).json({ error: 'Error uploading file: ' + error.message });
    } finally {
        // Clean up the uploaded file
        try {
            fs.unlinkSync(filePath);
        } catch (cleanupError) {
            console.error('Error cleaning up file:', cleanupError.message);
        }
    }
});

// Serve static files from 'uploads' directory
app.use('/images', express.static('uploads'));

// Root route
app.get('/', (req, res) => {
    res.send('API Working');
});

// Endpoint to send email
app.post('/send-message', async (req, res) => {
    const { name, email, subject, message, phone } = req.body;

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app password
        },
    });

    // Set up email data
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'vitpapervault@gmail.com', // Recipient's email address
        subject: subject || 'Contact Us Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
