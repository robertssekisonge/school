// Test script to debug login
console.log('Testing login...');

fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    email: 'robs@educ.com', 
    password: 'hub h@11' 
  }),
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
});


