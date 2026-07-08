import mongoose from 'mongoose'; 
import config from './src/config/index.js'; 
import Job from './src/models/Job.js'; 
import Resume from './src/models/Resume.js'; 
import ts from './src/services/tailoring.service.js'; 

mongoose.connect(config.mongoURI || 'mongodb://127.0.0.1:27017/placement-assistance-ai').then(async () => { 
  try { 
    const resume = await Resume.findOne(); 
    const job = await Job.findOne(); 
    console.log('Testing with job', job._id, 'resume', resume._id); 
    const TailoringSession = (await import('./src/models/TailoringSession.js')).default; 
    const session = new TailoringSession({ 
      userId: resume.userId, 
      jobId: job._id, 
      resumeId: resume._id, 
      promptVersion: '2.0.0', 
      modelVersion: 'gemini-2.5-flash', 
      generationStatus: 'analyzing_jd', 
      status: 'active' 
    }); 
    await session.save(); 
    await ts._runTailoringPipeline(session, resume, job); 
    console.log('Pipeline finished successfully!'); 
  } catch (err) { 
    console.error('Pipeline threw an error:', err); 
  } 
  process.exit(0); 
});
