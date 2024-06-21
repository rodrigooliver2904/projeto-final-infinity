document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout');
    const resourceForm = document.getElementById('resource-form');
    const resourceList = document.getElementById('resource-list');
  
    // Handle user login
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        authContainer.style.display = 'none';
        dashboard.style.display = 'block';
      } catch (error) {
        alert('Login failed: ' + error.message);
      }
    });
  
    // Handle user registration
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const role = document.getElementById('register-role').value;
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(userCredential.user.uid).set({ email, role });
        authContainer.style.display = 'none';
        dashboard.style.display = 'block';
      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    });
  
    // Handle user logout
    logoutButton.addEventListener('click', async () => {
      await auth.signOut();
      authContainer.style.display = 'block';
      dashboard.style.display = 'none';
    });
  
    // Add new resource
    resourceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('resource-name').value;
      const type = document.getElementById('resource-type').value;
      const description = document.getElementById('resource-description').value;
      try {
        await db.collection('resources').add({ name, type, description });
        alert('Resource added');
        loadResources();
      } catch (error) {
        alert('Failed to add resource: ' + error.message);
      }
    });
  
    // Load resources
    const loadResources = async () => {
      resourceList.innerHTML = '';
      const snapshot = await db.collection('resources').get();
      snapshot.forEach(doc => {
        const resource = doc.data();
        const li = document.createElement('li');
        li.textContent = `${resource.name} - ${resource.type}: ${resource.description}`;
        resourceList.appendChild(li);
      });
    };
  
    // Monitor auth state
    auth.onAuthStateChanged(user => {
      if (user) {
        authContainer.style.display = 'none';
        dashboard.style.display = 'block';
        loadResources();
      } else {
        authContainer.style.display = 'block';
        dashboard.style.display = 'none';
      }
    });
  });