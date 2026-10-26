import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const apiKey = process.env.YOUCAM_API_KEY;
const baseUrl = process.env.YOUCAM_BASE_URL || 'https://yce-api-01.makeupar.com';

async function testModel(name: string, filename: string) {
  console.log(`\n========================================`);
  console.log(`Testing ${name}: ${filename}`);
  console.log(`========================================`);
  const filePath = path.resolve(process.cwd(), '../assets/test-samples', filename);
  const buffer = fs.readFileSync(filePath);

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  // Register
  const regRes = await axios.post(
    `${baseUrl}/s2s/v2.0/file`,
    {
      files: [{ content_type: 'image/jpeg', file_size: buffer.length, file_name: filename }]
    },
    { headers }
  );

  const fileEntry = regRes.data?.data?.files?.[0];
  const fileId = fileEntry?.file_id;
  const uploadUrl = fileEntry?.requests?.[0]?.url;

  // Upload
  await axios.put(uploadUrl, buffer, {
    headers: { 'Content-Type': 'image/jpeg', 'Content-Length': buffer.length.toString() }
  });

  // Task
  const taskRes = await axios.post(
    `${baseUrl}/s2s/v2.0/task/skin-analysis`,
    {
      src_file_id: fileId,
      dst_actions: ['wrinkle', 'pore', 'texture', 'acne', 'moisture', 'oiliness', 'redness', 'radiance']
    },
    { headers }
  );

  const taskId = taskRes.data?.data?.task_id;
  console.log(`${name} Task ID: ${taskId}`);

  let poll = 0;
  while (poll < 15) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await axios.get(`${baseUrl}/s2s/v2.0/task/skin-analysis/${taskId}`, { headers });
    const status = statusRes.data?.data?.task_status;
    console.log(`Poll ${poll + 1}: status = ${status}`);

    if (status === 'success') {
      console.log(`🎉 ${name} SUCCESS! Real YouCam Analysis Succeeded!`);
      const scoreUrl = statusRes.data?.data?.results?.url;
      console.log(`Result ZIP URL:`, scoreUrl);
      return { success: true, taskId, scoreUrl };
    } else if (status === 'error') {
      console.error(`❌ ${name} ERROR:`, statusRes.data?.data?.error_message || statusRes.data?.data);
      return { success: false, error: statusRes.data?.data?.error_message };
    }
    poll++;
  }
}

async function run() {
  await testModel('Alex', 'alex.jpg');
  await testModel('Marcus', 'marcus.jpg');
  await testModel('Maya', 'maya.jpg');
}

run().catch(console.error);
