import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const email = 'sriharshaswamy@gmail.com';
const newPassword = 'PlacementPilot@2025';

const uri = 'mongodb://127.0.0.1:27017/placementpilot';
console.log('Connecting to:', uri);

await mongoose.connect(uri);
const hash = await bcrypt.hash(newPassword, 12);
const result = await mongoose.connection.db.collection('users').updateOne(
  { email },
  { $set: { password: hash } }
);
if (result.matchedCount === 0) {
  console.log('ERROR: User not found with email:', email);
} else {
  console.log('Password updated successfully');
  console.log('Email   :', email);
  console.log('Password: PlacementPilot@2025');
}
await mongoose.disconnect();
