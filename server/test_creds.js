import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

cloudinary.config({
  cloud_name: 'dhzyuyynv',
  api_key: '591598115299519',
  api_secret: 'vZNfM20swuFs3TTf_SpA8l8Y16w',
});

async function test() {
  try {
    // Create a tiny test PDF
    const testPdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF');

    // Upload as a data URI
    const dataUri = `data:application/pdf;base64,${testPdf.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'test_creds',
      resource_type: 'auto',
    });
    console.log('Upload OK! URL:', result.secure_url);

    // Try to fetch it
    const response = await axios.get(result.secure_url, { responseType: 'arraybuffer' });
    console.log('Download OK! Status:', response.status, 'Size:', response.data.length);

    // Clean up
    await cloudinary.uploader.destroy(result.public_id, { resource_type: 'image' });
    console.log('Cleanup done.');
  } catch (e) {
    console.error('FAILED:', e.message);
    if (e.response) console.error('Status:', e.response.status);
  }
}
test();
