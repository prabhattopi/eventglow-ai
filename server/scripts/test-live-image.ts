import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function testLiveImage() {
  const apiKey = process.env.YOUCAM_API_KEY;
  const baseUrl = process.env.YOUCAM_BASE_URL || 'https://yce-api-01.makeupar.com';
  const imagePath = path.resolve(process.cwd(), '../assets/test-samples/youcam-verified-man.jpg');

  console.log('Testing image:', imagePath);
  const imageBuffer = fs.readFileSync(imagePath);
  console.log('Image buffer size:', imageBuffer.length, 'bytes');

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  // Step 1: Register file
  console.log('Step 1: Registering file...');
  const regRes = await axios.post(
    `${baseUrl}/s2s/v2.0/file`,
    {
      files: [
        {
          content_type: 'image/jpeg',
          file_size: imageBuffer.length,
          file_name: 'real-man-portrait-1.jpg'
        }
      ]
    },
    { headers }
  );

  const fileEntry = regRes.data?.data?.files?.[0];
  const fileId = fileEntry?.file_id;
  const uploadUrl = fileEntry?.requests?.[0]?.url;

  console.log('File registered! ID:', fileId);

  // Step 2: Upload binary
  console.log('Step 2: Uploading binary buffer to AWS S3...');
  await axios.put(uploadUrl, imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length.toString()
    }
  });
  console.log('Binary upload successful!');

  // Step 3: Trigger skin-analysis task
  console.log('Step 3: Creating skin-analysis task...');
  const taskRes = await axios.post(
    `${baseUrl}/s2s/v2.0/task/skin-analysis`,
    {
      src_file_id: fileId,
      dst_actions: ['wrinkle', 'pore', 'texture', 'acne', 'moisture', 'oiliness', 'redness', 'radiance']
    },
    { headers }
  );

  const taskId = taskRes.data?.data?.task_id;
  console.log('Task submitted! Task ID:', taskId);

  // Step 4: Poll status
  console.log('Step 4: Polling task status...');
  let poll = 0;
  while (poll < 15) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await axios.get(`${baseUrl}/s2s/v2.0/task/skin-analysis/${taskId}`, { headers });
    const status = statusRes.data?.data?.task_status;
    console.log(`Poll ${poll + 1}: status = ${status}`);

    if (status === 'success') {
      console.log('\n🎉 SUCCESS! Real YouCam Skin Analysis Result:');
      console.log(JSON.stringify(statusRes.data?.data?.results, null, 2));
      break;
    } else if (status === 'error') {
      console.error('\n❌ Task Error:', statusRes.data?.data?.error_message || statusRes.data?.data);
      break;
    }
    poll++;
  }
}

testLiveImage().catch(console.error);
