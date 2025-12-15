// ==========================================
// LOGIN CON FIREBASE AUTHENTICATION
// ==========================================
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');

// Verificar si ya está autenticado
auth.onAuthStateChanged((user) => {
    if (user) {
        // Ya está autenticado, redirigir a admin
        window.location.href = 'https://pinsandstocking.rf.gd/admin.html';
    }
});

// Manejar envío del formulario
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Limpiar error previo
        if (loginError) {
            loginError.style.display = 'none';
            loginError.textContent = '';
        }
        
        // Deshabilitar botón mientras se procesa
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando sesión...';
        
        try {
            // Intentar iniciar sesión con email y contraseña
            // Nota: Firebase Authentication requiere formato de email
            // Si el usuario ingresa solo un nombre, agregarle @admin.com
            const emailToUse = email.includes('@') ? email : `${email}@admin.com`;
            
            await auth.signInWithEmailAndPassword(emailToUse, password);
            
            // Login exitoso, redirigir al panel admin
            console.log('Login exitoso, redirigiendo...');
            window.location.href = 'https://pinsandstocking.rf.gd/admin.html';
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            
            let errorMessage = 'Usuario o contraseña incorrectos';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Usuario no encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Usuario deshabilitado';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos. Intenta más tarde';
                    break;
                default:
                    errorMessage = 'Error al iniciar sesión: ' + error.message;
            }
            
            if (loginError) {
                loginError.textContent = errorMessage;
                loginError.style.display = 'block';
            }
            
            // Hacer vibrar el formulario
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
            
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Agregar animación de shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
