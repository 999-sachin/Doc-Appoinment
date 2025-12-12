// Quick test script to verify backend is working
const axios = require('axios');

async function testConnection() {
  try {
    console.log('Testing backend connection...');
    const response = await axios.get('http://localhost:5000/api/doctors');
    console.log('✅ Backend is working!');
    console.log(`Found ${response.data.length} doctors`);
    if (response.data.length === 0) {
      console.log('⚠️  No doctors found. Run: POST http://localhost:5000/api/seed');
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running!');
      console.log('Start it with: cd Backend && npm run dev');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testConnection();

