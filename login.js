// Credenciales de administrador (en producción, esto debería estar en un servidor)
const ADMIN_CREDENTIALS = {
    username: 'Admin',
    password: 'murci123'
};

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Verificar si ya está logueado (usando sessionStorage para cerrar sesión al cerrar navegador)
if (sessionStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'admin.html';
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validar credenciales
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Guardar sesión (sessionStorage se borra al cerrar el navegador)
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('adminUser', username);
        
        // Mostrar mensaje de éxito
        showSuccess();
        
        // Redirigir al panel de administración
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        // Mostrar error
        showError('Usuario o contraseña incorrectos');
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

function showSuccess() {
    errorMessage.textContent = '✓ Inicio de sesión exitoso';
    errorMessage.style.color = '#48bb78';
    errorMessage.style.background = 'rgba(72, 187, 120, 0.1)';
    errorMessage.style.borderColor = 'rgba(72, 187, 120, 0.3)';
    errorMessage.classList.add('show');
}
