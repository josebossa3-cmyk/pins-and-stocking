# 🚀 Guía de Despliegue en GitHub Pages

## Pasos para Publicar tu Tienda

### 1️⃣ Preparar el Proyecto

#### Limpiar Datos de Prueba
1. Abrir `limpiar-storage.html` en tu navegador
2. Click en "🗑️ Limpiar TODO"
3. Esto eliminará todos los productos de prueba y datos guardados

#### Configurar WhatsApp (IMPORTANTE)
1. Abrir `cart.js`
2. Línea 9: Cambiar el número de WhatsApp
```javascript
const WHATSAPP_NUMBER = '5491112345678'; // ⬅️ TU NÚMERO AQUÍ
```

#### Verificar Credenciales Admin
1. Abrir `login.js`
2. Cambiar contraseña si es necesario (línea 15-16)

---

### 2️⃣ Subir a GitHub

#### Opción A: Desde GitHub Desktop
1. Abrir GitHub Desktop
2. Seleccionar "Add Existing Repository"
3. Elegir la carpeta del proyecto
4. Escribir mensaje de commit: "Initial commit - Tienda completa"
5. Click en "Publish repository"
6. Marcar como **público**

#### Opción B: Desde Terminal/PowerShell
```bash
cd "c:\Users\Jose Bossa\Desktop\proyectos\pins and stocking"

# Si ya existe el repositorio
git add .
git commit -m "Limpieza final y optimización para GitHub Pages"
git push origin main

# Si es nuevo repositorio
git init
git add .
git commit -m "Initial commit - Tienda completa"
git branch -M main
git remote add origin https://github.com/josebossa3-cmyk/pins-and-stocking2.git
git push -u origin main
```

---

### 3️⃣ Activar GitHub Pages

1. Ir a tu repositorio en GitHub
2. Click en **Settings** (⚙️)
3. En el menú lateral, click en **Pages**
4. En "Source", seleccionar:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click en **Save**
6. Esperar 1-2 minutos
7. ¡Tu sitio estará en: `https://josebossa3-cmyk.github.io/pins-and-stocking2/`!

---

### 4️⃣ Verificación Post-Despliegue

Una vez publicado, verifica:

✅ **Página Principal**
- [ ] Los productos se muestran correctamente
- [ ] Los filtros funcionan
- [ ] La búsqueda funciona
- [ ] El carrito se abre

✅ **Panel Admin**
- [ ] Login funciona con las credenciales
- [ ] Se pueden agregar productos
- [ ] Se pueden editar/eliminar productos
- [ ] Las imágenes se comprimen

✅ **WhatsApp**
- [ ] El botón de WhatsApp abre correctamente
- [ ] El mensaje se formatea bien
- [ ] El número es correcto

✅ **Responsive**
- [ ] Se ve bien en móvil
- [ ] Se ve bien en tablet
- [ ] Se ve bien en desktop

---

### 5️⃣ Agregar Productos Iniciales

1. Ir a `https://TU-USUARIO.github.io/pins-and-stocking2/login.html`
2. Iniciar sesión con admin/admin123
3. Agregar tus productos reales:
   - Subir imágenes de buena calidad (se comprimirán automáticamente)
   - Completar todos los campos
   - Seleccionar categoría, estilo y color
4. Los productos quedarán guardados en localStorage de cada visitante

---

### 6️⃣ Compartir tu Tienda

Comparte estos enlaces:

- 🏠 **Tienda**: `https://josebossa3-cmyk.github.io/pins-and-stocking2/`
- ⚙️ **Admin**: `https://josebossa3-cmyk.github.io/pins-and-stocking2/login.html`

#### En Redes Sociales
```
🧦 ¡Nueva tienda online!
Pins and Stocking - Tendencias que marcan tu estilo

🛍️ Visita: https://josebossa3-cmyk.github.io/pins-and-stocking2/
💬 Pedidos por WhatsApp
✨ Diseños únicos
```

---

### 7️⃣ Actualizaciones Futuras

Cuando quieras actualizar la tienda:

```bash
cd "c:\Users\Jose Bossa\Desktop\proyectos\pins and stocking"
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Los cambios se verán reflejados en 1-2 minutos.

---

### 🆘 Solución de Problemas

#### La página no carga
- Verifica que el repositorio sea público
- Espera 5 minutos después de activar GitHub Pages
- Revisa la consola del navegador (F12) para errores

#### Las imágenes no se ven
- Verifica que la carpeta `imagenes/` esté subida a GitHub
- Las rutas de las imágenes deben ser relativas: `imagenes/logo.jpg`

#### WhatsApp no funciona
- Verifica el número en `cart.js`
- Debe incluir código de país: `549...`
- No debe tener espacios ni guiones

#### Los productos se pierden
- Es normal: localStorage es local a cada navegador
- Considera migrar a Firebase en el futuro para persistencia real

---

### 📊 Métricas y Analytics (Opcional)

Para ver cuántas personas visitan tu tienda:

1. Crear cuenta en [Google Analytics](https://analytics.google.com/)
2. Obtener el código de tracking
3. Agregar antes de `</head>` en todos los HTML:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

---

### ✅ Checklist Final

Antes de compartir públicamente:

- [ ] localStorage limpio (sin productos de prueba)
- [ ] Número de WhatsApp actualizado
- [ ] Contraseña de admin cambiada
- [ ] Logo correcto en `imagenes/`
- [ ] Productos reales agregados
- [ ] Probado en móvil y desktop
- [ ] Todos los enlaces funcionan
- [ ] Repositorio público en GitHub
- [ ] GitHub Pages activado
- [ ] Sitio accesible desde la URL

---

## 🎉 ¡Listo!

Tu tienda está en línea y lista para recibir pedidos.

**Próximos pasos sugeridos:**
1. Agregar productos reales desde el admin
2. Compartir el link en redes sociales
3. Probar hacer un pedido de prueba por WhatsApp
4. Revisar `RECOMENDACIONES.md` para mejoras futuras

---

**Soporte:** Si tienes problemas, revisa la consola del navegador (F12) o abre un issue en GitHub.
