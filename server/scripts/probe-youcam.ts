import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function runProbe() {
  const apiKey = process.env.YOUCAM_API_KEY;
  const baseUrl = process.env.YOUCAM_BASE_URL || 'https://yce-api-01.makeupar.com';

  console.log('----------------------------------------------------');
  console.log('⚡ EventGlow AI — YouCam API Connection Probe');
  console.log('----------------------------------------------------');
  console.log(`Endpoint Base: ${baseUrl}`);
  console.log(`API Key Loaded: ${apiKey ? `Key exists (...${apiKey.slice(-4)})` : '❌ NONE FOUND in .env'}`);

  if (!apiKey) {
    console.error('\n⚠️ Please set YOUCAM_API_KEY in server/.env before testing live connectivity.');
    console.log('Example: YOUCAM_API_KEY=your_actual_key_here\n');
    process.exit(1);
  }

  try {
    console.log('\n📡 Sending verification request to YouCam API server...');
    const startTime = Date.now();

    // Probe file registration endpoint with exact required fields
    const response = await axios.post(
      `${baseUrl}/s2s/v2.0/file`,
      {
        files: [
          { content_type: 'image/jpeg', file_size: 51200, file_name: 'face.jpg' }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const elapsedMs = Date.now() - startTime;
    console.log(`✅ Success! Response received in ${elapsedMs}ms`);
    console.log('Status Code:', response.status);
    console.log('Response Payload:', JSON.stringify(response.data, null, 2));

    const outputPath = path.resolve(process.cwd(), 'scripts', 'last-probe-result.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          status: response.status,
          data: response.data,
          verified: true
        },
        null,
        2
      )
    );
    console.log(`\n💾 Live probe result saved to: ${outputPath}`);
  } catch (error: any) {
    console.error('\n❌ Probe encountered an error:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

runProbe();
