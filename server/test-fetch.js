import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

async function testFetch() {
  // Let's get the URL from the DB
  const mongoose = require('mongoose');
  require('dotenv').config();
  
  await mongoose.connect(process.env.MONGODB_URI);
  const Resume = require('./src/models/Resume.js').default;
  
  const resume = await Resume.findOne();
  if (!resume) {
    console.log("No resume found");
    process.exit(0);
  }
  
  console.log("Testing URL:", resume.cloudinaryUrl);
  try {
    const response = await axios.get(resume.cloudinaryUrl, {
      responseType: 'arraybuffer'
    });
    console.log("Success! Status:", response.status);
  } catch (err) {
    console.error("Failed:", err.message, err.response?.status);
  }
  
  process.exit(0);
}

testFetch();
