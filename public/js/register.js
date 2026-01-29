const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    successMessage.textContent = 'Registration successful! Redirecting to login...';
    errorMessage.textContent = '';

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 2000);
  } catch (error) {
    errorMessage.textContent = error.message;
    successMessage.textContent = '';
  }
});
