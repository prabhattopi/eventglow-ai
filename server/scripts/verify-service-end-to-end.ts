import dotenv from 'dotenv';
dotenv.config();

import { analyzeSkin, setMockMode } from '../src/services/youcam/youcamService.js';

setMockMode(false); // Explicitly toggle to Live YouCam Cloud Engine

async function verifyAll() {
  console.log('Testing Marcus via analyzeSkin...');
  const marcusResult = await analyzeSkin(undefined, '/test-samples/marcus.jpg');
  console.log('Marcus Live Result:', {
    source: marcusResult.source,
    task_id: marcusResult.task_id,
    skin_age: marcusResult.metrics.skin_age,
    overall_score: marcusResult.metrics.overall_score,
    undertone: marcusResult.metrics.undertone
  });

  console.log('\nTesting Maya via analyzeSkin...');
  const mayaResult = await analyzeSkin(undefined, '/test-samples/maya.jpg');
  console.log('Maya Live Result:', {
    source: mayaResult.source,
    task_id: mayaResult.task_id,
    skin_age: mayaResult.metrics.skin_age,
    overall_score: mayaResult.metrics.overall_score,
    undertone: mayaResult.metrics.undertone
  });
}

verifyAll().catch((err) => {
  console.error('Verification failed:', err.message);
  process.exit(1);
});
