// Test script to check frontend-backend connection
const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    
    const response = await fetch('http://localhost:5000/api/branding', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connection successful!');
      console.log('Branding data:', data);
      return data;
    } else {
      console.error('❌ Backend connection failed:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return null;
  }
};

// Run the test
testConnection();


