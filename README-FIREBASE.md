# 🧦 Pins and Stocking - Guía de Configuración con Firebase

## 📋 Tabla de Contenidos
1. [Configuración de Firebase](#1-configuración-de-firebase)
2. [Configurar el Proyecto](#2-configurar-el-proyecto)
3. [Subir a InfinityFree (Hosting Gratis)](#3-subir-a-infinityfree)
4. [Actualizar Archivos Manualmente](#4-actualizar-archivos)
5. [Crear Usuario Administrador](#5-crear-usuario-administrador)
6. [Solución de Problemas](#6-solución-de-problemas)

---

## 1. Configuración de Firebase

### Paso 1.1: Crear Proyecto en Firebase

1. **Ir a Firebase Console**
   - Abre tu navegador y ve a: https://console.firebase.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Crear nuevo proyecto**
   - Clic en "Agregar proyecto" o "Add project"
   - Nombre del proyecto: `pins-and-stocking` (o el que prefieras)
   - Deshabilita Google Analytics (no es necesario)
   - Clic en "Crear proyecto"
   - Espera a que se cree (1-2 minutos)

### Paso 1.2: Configurar Firestore Database

1. **Ir a Firestore Database**
   - En el menú lateral, clic en "Firestore Database"
   - Clic en "Crear base de datos"

2. **Configurar reglas de seguridad**
   - Selecciona "Comenzar en modo de **producción**"
   - Ubicación: Elige la más cercana (ej: `southamerica-east1` para Argentina)
   - Clic en "Habilitar"

3. **Configurar reglas de lectura/escritura**
   - Ve a la pestaña "Reglas"
   - Reemplaza el contenido con esto:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Permitir lectura de productos a todos
       match /products/{productId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
   - Clic en "Publicar"

### Paso 1.3: Configurar Firebase Storage

1. **Ir a Storage**
   - En el menú lateral, clic en "Storage"
   - Clic en "Comenzar"

2. **Configurar reglas de Storage**
   - Selecciona "Comenzar en modo de **producción**"
   - Clic en "Siguiente" y luego "Listo"

3. **Configurar reglas de seguridad de Storage**
   - Ve a la pestaña "Rules"
   - Reemplaza el contenido con esto:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /products/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
   - Clic en "Publicar"

### Paso 1.4: Configurar Authentication

1. **Ir a Authentication**
   - En el menú lateral, clic en "Authentication"
   - Clic en "Comenzar"

2. **Habilitar Email/Password**
   - Clic en "Email/Password"
   - Activa el interruptor "Habilitar"
   - **NO** actives "Vínculo de correo electrónico"
   - Clic en "Guardar"

### Paso 1.5: Obtener Configuración de Firebase

1. **Ir a Configuración del Proyecto**
   - Clic en el ícono de engranaje ⚙️ (arriba a la izquierda)
   - Selecciona "Configuración del proyecto"

2. **Agregar App Web**
   - Baja hasta "Tus apps"
   - Clic en el ícono `</>` (Web)
   - Nombre de la app: `Pins and Stocking Web`
   - **NO** marques "Firebase Hosting"
   - Clic en "Registrar app"

3. **Copiar Configuración**
   - Verás un código que dice `const firebaseConfig = {...}`
   - **COPIA** todos los valores que aparecen ahí
   - Se verá algo así:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "pins-and-stocking.firebaseapp.com",
     projectId: "pins-and-stocking",
     storageBucket: "pins-and-stocking.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

---

## 2. Configurar el Proyecto

### Paso 2.1: Actualizar firebase-config.js

1. **Abrir el archivo `firebase-config.js`** en VS Code

2. **Reemplazar los valores** con los que copiaste de Firebase:
   ```javascript
   const firebaseConfig = {
       apiKey: "TU_API_KEY_AQUI",              // <- PEGAR TU apiKey
       authDomain: "tu-proyecto.firebaseapp.com",      // <- PEGAR TU authDomain
       projectId: "tu-proyecto-id",            // <- PEGAR TU projectId
       storageBucket: "tu-proyecto.appspot.com",       // <- PEGAR TU storageBucket
       messagingSenderId: "123456789",         // <- PEGAR TU messagingSenderId
       appId: "1:123456789:web:abcdef123456"   // <- PEGAR TU appId
   };
   ```

3. **Guardar el archivo** (Ctrl + S)

### Paso 2.2: Activar Archivos Firebase

Ahora tienes DOS versiones de cada archivo JavaScript:

- **Versión ACTUAL** (localStorage):
  - `admin.js`
  - `cart.js`
  - `login.js`

- **Versión FIREBASE** (Firestore + Storage):
  - `admin-firebase.js`
  - `cart-firebase.js`
  - `login-firebase.js`

**Para activar Firebase:**

1. **Opción A: Renombrar archivos**
   ```powershell
   # Respaldar archivos actuales
   Rename-Item admin.js admin-old.js
   Rename-Item cart.js cart-old.js
   Rename-Item login.js login-old.js
   
   # Activar versiones Firebase
   Rename-Item admin-firebase.js admin.js
   Rename-Item cart-firebase.js cart.js
   Rename-Item login-firebase.js login.js
   ```

2. **Opción B: Actualizar manualmente**
   - Abre `admin.html` y cambia `<script src="admin.js">` por `<script src="admin-firebase.js">`
   - Abre `index.html` y cambia `<script src="cart.js">` por `<script src="cart-firebase.js">`
   - Abre `login.html` y cambia `<script src="login.js">` por `<script src="login-firebase.js">`

---

## 3. Subir a InfinityFree

### Paso 3.1: Crear Cuenta en InfinityFree

1. **Ir a InfinityFree**
   - Abre: https://www.infinityfree.net/

2. **Crear cuenta gratis**
   - Clic en "Sign Up" (Registrarse)
   - Completa el formulario:
     - Email
     - Contraseña
   - Verifica tu email

3. **Crear un sitio web**
   - Clic en "Create Account"
   - Subdomain: `pinsandstocking` (o el que prefieras)
   - Selecciona dominio gratuito: `.free.nf` o `.rf.gd`
   - Clic en "Create Account"

### Paso 3.2: Obtener Datos FTP

1. **Ir al Panel de Control**
   - Clic en "Control Panel" de tu sitio web
   - En la sección "Account Settings" verás:
     - **FTP Hostname**: `ftpupload.net`
     - **FTP Username**: algo como `if0_12345678`
     - **FTP Password**: (la que creaste)

2. **Anotar estos datos** para el siguiente paso

### Paso 3.3: Instalar FileZilla

1. **Descargar FileZilla**
   - Ve a: https://filezilla-project.org/
   - Descarga "FileZilla Client" (NO Server)
   - Instala el programa

2. **Conectar a InfinityFree**
   - Abre FileZilla
   - Arriba verás 4 campos:
     - **Host**: `ftpupload.net`
     - **Username**: `if0_XXXXXXXX` (el que anotaste)
     - **Password**: Tu contraseña de InfinityFree
     - **Port**: `21`
   - Clic en "Quickconnect"

3. **Esperar conexión**
   - Verás que se conecta (puede tardar 10-30 segundos)
   - A la izquierda: Archivos de tu PC
   - A la derecha: Archivos del servidor

### Paso 3.4: Subir Archivos

1. **Navegar a la carpeta correcta en el servidor**
   - En el panel derecho (servidor), busca la carpeta `htdocs`
   - Doble clic en `htdocs`

2. **Seleccionar archivos de tu proyecto**
   - En el panel izquierdo, navega hasta:
     `C:\Users\Jose Bossa\Desktop\proyectos\pins and stocking`

3. **Subir TODOS los archivos y carpetas**:
   - index.html
   - admin.html
   - login.html
   - styles.css
   - admin.css
   - login.css
   - admin.js (o admin-firebase.js según Paso 2.2)
   - cart.js (o cart-firebase.js)
   - login.js (o login-firebase.js)
   - firebase-config.js ⭐
   - vercel.json
   - carpeta `imagenes/`

4. **Arrastrar archivos**
   - Selecciona TODOS los archivos del panel izquierdo
   - Arrástralos al panel derecho (carpeta `htdocs`)
   - Espera a que terminen de subir (barra de progreso abajo)

5. **Verificar**
   - Abre tu navegador
   - Ve a: `http://tusubdominio.free.nf`
   - Deberías ver tu página funcionando

---

## 4. Actualizar Archivos y Agregar Contenido Nuevo

### 🔄 Tipos de Cambios

Ahora que tu proyecto usa Firebase, hay DOS tipos de cambios que puedes hacer:

#### A) Cambios en DATOS (productos, usuarios)
- **No requieren subir archivos a FTP**
- Se hacen desde el panel admin de tu sitio
- Se guardan automáticamente en Firebase
- **Ejemplos**: Agregar productos, editar precios, cambiar descripciones, subir imágenes de productos

#### B) Cambios en CÓDIGO (diseño, funcionalidad)
- **SÍ requieren subir archivos a FTP**
- Se hacen editando archivos en VS Code
- Debes subir los archivos modificados a InfinityFree
- **Ejemplos**: Cambiar colores, agregar páginas nuevas, modificar layout, agregar funciones

---

### 📦 Agregar Nuevos Productos (Sin FTP)

**Proceso completo:**

1. **Accede al panel admin**
   - Ve a: `http://tudominio.free.nf/login.html`
   - Usuario: `admin@admin.com` (el que creaste en Firebase)
   - Contraseña: tu contraseña

2. **Agregar producto nuevo**
   - Clic en el botón "Agregar Producto"
   - Completa el formulario:
     - **Nombre**: Ej. "Medias Rayas Rojas"
     - **Precio**: Ej. "1500" (solo números)
     - **Tipo**: Selecciona "medias" o "pins"
     - **Estilo**: Selecciona el estilo
     - **Imagen**: Clic en "Seleccionar imagen" → elige archivo JPG/PNG
   - Clic en "Agregar Producto"

3. **Verificar**
   - Ve a: `http://tudominio.free.nf`
   - El producto aparecerá automáticamente en la tienda
   - **No necesitas subir nada a FTP** ✅

**Límites de imágenes:**
- Tamaño máximo: 5MB por imagen
- Formatos: JPG, PNG, WebP
- Recomendado: 800x800px para mejor rendimiento

---

### 🎨 Modificar Código Existente (Con FTP)

**Ejemplo: Cambiar color del título**

1. **Editar localmente en VS Code**
   - Abre `styles.css`
   - Busca `.hero h1` (aproximadamente línea 50)
   - Cambia el color:
   ```css
   .hero h1 {
       font-size: 3rem;
       color: #ff6b6b; /* <- CAMBIA ESTE COLOR */
   }
   ```
   - Guarda el archivo (Ctrl + S)

2. **Subir a InfinityFree con File Manager Web**
   - Ve a: https://infinityfree.net/
   - Inicia sesión
   - Clic en tu sitio web → "Control Panel"
   - Busca "File Manager" y haz clic
   - Navega a la carpeta `htdocs`
   - Clic en "Upload" (arriba)
   - Selecciona el archivo `styles.css` desde tu PC
   - Espera a que suba (verás confirmación)

3. **Verificar cambios**
   - Ve a tu sitio: `http://tudominio.free.nf`
   - Presiona Ctrl + F5 para refrescar (limpiar caché)
   - Deberías ver el nuevo color

**Archivos que se modifican frecuentemente:**
- `styles.css` - Estilos, colores, diseño
- `admin.css` - Estilos del panel admin
- `login.css` - Estilos de la página de login
- `cart.js` - Funcionalidad del carrito y catálogo
- `admin.js` - Funcionalidad del panel admin

---

### ➕ Agregar Nuevos Archivos (HTML, CSS, JS)

**Ejemplo: Crear página "Sobre Nosotros"**

1. **Crear archivo en VS Code**
   - Clic derecho en tu proyecto → "New File"
   - Nombre: `about.html`
   - Agrega el contenido:
   ```html
   <!DOCTYPE html>
   <html lang="es">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Sobre Nosotros - Pins and Stocking</title>
       <link rel="stylesheet" href="styles.css">
   </head>
   <body>
       <header>
           <h1>Sobre Nosotros</h1>
       </header>
       <main>
           <p>Aquí va tu contenido...</p>
       </main>
   </body>
   </html>
   ```
   - Guarda el archivo (Ctrl + S)

2. **Subir a InfinityFree**
   - Ve a File Manager Web (igual que antes)
   - Navega a `htdocs`
   - Clic en "Upload"
   - Selecciona `about.html`
   - Espera confirmación

3. **Agregar enlace en index.html**
   - Abre `index.html` en VS Code
   - Busca el `<header>` (aproximadamente línea 15)
   - Agrega un enlace:
   ```html
   <nav>
       <a href="index.html">Inicio</a>
       <a href="about.html">Sobre Nosotros</a>
       <a href="login.html">Admin</a>
   </nav>
   ```
   - Guarda y sube `index.html` a InfinityFree

4. **Verificar**
   - Ve a: `http://tudominio.free.nf`
   - Deberías ver el enlace "Sobre Nosotros"
   - Clic en el enlace → se abre `about.html`

---

### 🖼️ Agregar Nuevas Imágenes (Logos, Banners)

**Diferencia importante:**
- **Imágenes de PRODUCTOS** → Se suben desde el panel admin → van a Firebase
- **Imágenes del SITIO** (logo, banner, íconos) → Se suben por FTP → van a InfinityFree

**Para agregar logo o banner:**

1. **Crear carpeta local (si no existe)**
   - En VS Code, crea carpeta `assets/` en la raíz del proyecto
   - Dentro de `assets/`, guarda tu `logo.png`

2. **Subir carpeta a InfinityFree**
   - File Manager Web → `htdocs`
   - Clic en "New Folder" → nombre: `assets`
   - Entra a la carpeta `assets`
   - Clic en "Upload" → selecciona `logo.png`

3. **Usar en HTML**
   - Abre `index.html`
   - Agrega en el `<header>`:
   ```html
   <header>
       <img src="assets/logo.png" alt="Logo" class="logo">
       <h1>Pins and Stocking</h1>
   </header>
   ```
   - Guarda y sube `index.html`

---

### 🔧 Actualizar Varios Archivos a la Vez

**Cuando haces cambios grandes:**

1. **Edita todos los archivos necesarios en VS Code**
   - Por ejemplo: `index.html`, `styles.css`, `cart.js`
   - Guarda todos los cambios (Ctrl + K, S para guardar todo)

2. **Subir múltiples archivos**
   - File Manager Web → `htdocs`
   - Clic en "Upload"
   - **Selecciona TODOS los archivos modificados** (Ctrl + clic)
   - Se subirán todos a la vez
   - File Manager pregunta si quieres sobrescribir → "Yes to All"

3. **Verificar**
   - Ve a tu sitio
   - Presiona Ctrl + Shift + R (hard refresh)
   - Verifica que todos los cambios estén aplicados

---

### 📋 Checklist: ¿Qué método usar?

| Quiero... | Método | Herramienta |
|-----------|--------|-------------|
| Agregar producto nuevo | Panel Admin | Firebase ✅ |
| Editar precio/descripción | Panel Admin | Firebase ✅ |
| Cambiar colores del sitio | Editar CSS → Subir FTP | File Manager 📤 |
| Agregar página nueva | Crear HTML → Subir FTP | File Manager 📤 |
| Cambiar logo/banner | Subir imagen → Editar HTML | File Manager 📤 |
| Modificar funcionalidad | Editar JS → Subir FTP | File Manager 📤 |
| Agregar nueva función | Crear/Editar JS → Subir FTP | File Manager 📤 |

---

### ⚡ Consejos para Actualizar

1. **Siempre guarda backup local**
   - Antes de cambios grandes, copia tu carpeta completa
   - Renombra: `pins and stocking - backup DD-MM-AAAA`

2. **Prueba localmente primero**
   - Abre `index.html` en tu navegador directamente
   - Verifica que los cambios funcionen
   - Luego sube a InfinityFree

3. **Limpia caché del navegador**
   - Después de subir cambios, presiona Ctrl + Shift + R
   - O abre en modo incógnito para ver cambios frescos

4. **Revisa la consola del navegador**
   - Presiona F12 → pestaña "Console"
   - Si algo no funciona, mira los errores en rojo
   - Busca el error en Google para solucionarlo

5. **Sube solo lo necesario**
   - No subas archivos `.md` (documentación)
   - No subas carpetas `.git` o `node_modules`
   - Solo archivos `.html`, `.css`, `.js`, e `imagenes/`

---

## 5. Crear Usuario Administrador

### Opción A: Desde Firebase Console (Recomendado)

1. **Ir a Firebase Console**
   - https://console.firebase.google.com/
   - Selecciona tu proyecto

2. **Ir a Authentication**
   - Clic en "Authentication" en el menú lateral
   - Clic en pestaña "Users"

3. **Agregar usuario**
   - Clic en "Add user"
   - Email: `admin@admin.com` (o el que prefieras)
   - Password: `tu_contraseña_segura`
   - Clic en "Add user"

4. **Listo**
   - Ahora puedes iniciar sesión en: `http://tudominio.free.nf/login.html`
   - Usuario: `admin@admin.com`
   - Contraseña: la que pusiste

### Opción B: Crear script de registro temporal

Si prefieres crear usuarios desde tu sitio web, puedes agregar temporalmente una página de registro:

1. Crea `register.html` (solo para ti, luego lo eliminas)
2. Agrega Firebase SDK y un formulario de registro
3. Creas tu usuario
4. Eliminas la página `register.html`

*(Si necesitas ayuda con esto, avísame)*

---

## 6. Solución de Problemas

### ❌ Error: "Firebase is not defined"

**Causa**: No se cargó el SDK de Firebase

**Solución**:
1. Verifica que `firebase-config.js` esté en la raíz del proyecto
2. Verifica que los `<script>` de Firebase estén ANTES de tus scripts en HTML
3. Revisa la consola del navegador (F12) para ver el error exacto

### ❌ Error: "Permission denied" en Firestore

**Causa**: Las reglas de seguridad están muy estrictas

**Solución**:
1. Ve a Firebase Console → Firestore Database → Reglas
2. Verifica que tengas las reglas del Paso 1.2
3. Publica las reglas nuevamente

### ❌ Error: "Storage: Object 'products/...' does not exist"

**Causa**: La imagen no se subió correctamente

**Solución**:
1. Ve a Firebase Console → Storage
2. Verifica que exista la carpeta `products/`
3. Revisa las reglas de Storage (Paso 1.3)

### ❌ Error: "auth/user-not-found"

**Causa**: El usuario no existe en Authentication

**Solución**:
1. Ve a Firebase Console → Authentication → Users
2. Verifica que el usuario exista
3. Crea el usuario si no está (Paso 5)

### ❌ Los productos no aparecen

**Posibles causas**:

1. **Firebase no configurado**
   - Revisa `firebase-config.js` con tus valores correctos

2. **No hay productos en Firestore**
   - Ve a Firebase Console → Firestore Database
   - Deberías ver una colección llamada `products`
   - Si está vacía, agrega productos desde el panel admin

3. **Error de JavaScript**
   - Abre la consola del navegador (F12)
   - Ve a la pestaña "Console"
   - Mira si hay errores en rojo

### 📞 Necesitas más ayuda

Si tienes problemas:

1. **Revisa la consola del navegador** (F12 → Console)
2. **Mira los errores** y búscalos en Google
3. **Firebase tiene documentación**: https://firebase.google.com/docs/web/setup

---

## 📊 Diferencias: LocalStorage vs Firebase

| Característica | LocalStorage (Actual) | Firebase (Nuevo) |
|----------------|----------------------|------------------|
| **Almacenamiento** | Navegador local | Nube (Google) |
| **Persistencia** | Solo en tu PC | Disponible en todos lados |
| **Imágenes** | Base64 en navegador | Firebase Storage |
| **Velocidad** | Muy rápida | Rápida (depende de internet) |
| **Límite** | ~5-10MB | Gratis: 1GB Storage, 10GB Firestore |
| **Actualización** | Manual (FTP) | Automática (tiempo real) |
| **Costo** | Gratis | Gratis hasta cierto límite |

---

## 🎯 Próximos Pasos

1. ✅ Configura Firebase (Paso 1)
2. ✅ Actualiza `firebase-config.js` (Paso 2)
3. ✅ Sube archivos a InfinityFree (Paso 3)
4. ✅ Crea usuario administrador (Paso 5)
5. ✅ Prueba agregar un producto desde el panel admin
6. 🎉 ¡Tu tienda está funcionando con Firebase!

---

## 📝 Notas Importantes

- **No compartas** tu `firebase-config.js` con nadie (tiene tus claves)
- **Haz respaldo** de tu proyecto regularmente
- **Firebase Plan Gratis** es suficiente para comenzar
- **Si superas los límites**, Firebase te avisará y puedes actualizar al plan Blaze (paga solo lo que usas)

---

## 🔄 Límites del Plan Gratuito de Firebase

| Servicio | Límite Gratuito | Uso Estimado |
|----------|-----------------|--------------|
| Firestore | 1GB almacenamiento | ~10,000 productos |
| Storage | 1GB almacenamiento | ~1,000 imágenes |
| Firestore Lecturas | 50,000/día | ~500 visitas/día |
| Authentication | Ilimitado | ∞ usuarios |

**Para una tienda pequeña-mediana, el plan gratuito es más que suficiente.**

---

¿Alguna duda? ¡Escríbeme y te ayudo! 🚀
