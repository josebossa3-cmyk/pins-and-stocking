# 🔧 Configuración del Sitio

## 📱 Configurar Número de WhatsApp

Para que el botón de WhatsApp funcione correctamente, debes cambiar el número de teléfono en el archivo `cart.js`:

### Paso 1: Abrir cart.js
Busca la línea 9 en el archivo `cart.js`:

```javascript
const WHATSAPP_NUMBER = '5491112345678'; // Formato: 549 + código de área + número
```

### Paso 2: Reemplazar con tu número
El formato es: **549** + código de área (sin 0) + número (sin 15)

**Ejemplos:**
- Buenos Aires: `5491112345678` (549 + 11 + 12345678)
- Córdoba: `5493512345678` (549 + 351 + 2345678)
- Rosario: `5493412345678` (549 + 341 + 2345678)
- Mendoza: `5492612345678` (549 + 261 + 2345678)

### Paso 3: Guardar el archivo
Una vez cambiado el número, guarda el archivo. ¡Listo!

---

## ✅ Funcionalidades Implementadas

### 1. **Compresión de Imágenes** 🖼️
- Las imágenes se comprimen automáticamente al 80% de calidad
- Redimensionadas a máximo 800px de ancho
- Reduce el peso de las imágenes en un 60-80%
- Ahorra espacio en localStorage

### 2. **Persistencia del Carrito** 💾
- El carrito se guarda automáticamente en localStorage
- Los productos permanecen aunque cierres la página
- Se recupera automáticamente al volver a entrar

### 3. **Integración con WhatsApp** 💬
- Botón verde "Enviar pedido por WhatsApp"
- Genera un mensaje con:
  - Lista de todos los productos
  - Precios individuales
  - Total del pedido
- Abre WhatsApp Web o la app automáticamente
- Opción para vaciar el carrito después de enviar

### 4. **Búsqueda de Productos** 🔍
- Barra de búsqueda en el header
- Busca por nombre o descripción
- Resultados en tiempo real
- Botón X para limpiar búsqueda rápidamente
- Se integra con los filtros existentes

---

## 🎨 Mejoras de UX Implementadas

### Feedback Visual
- ✅ Notificación al comprimir imagen con % de reducción
- ✅ Texto de "Comprimiendo imagen..." mientras procesa
- ✅ Botón de WhatsApp con color verde característico
- ✅ Búsqueda con animaciones suaves

### Responsive Design
- ✅ Búsqueda ocupa todo el ancho en móviles
- ✅ Header se reorganiza automáticamente
- ✅ Todos los elementos se adaptan a pantalla pequeña

---

## 📊 Uso del Sitio

### Para Clientes:
1. **Buscar productos**: Usar la barra de búsqueda
2. **Filtrar**: Por categoría, estilo o color
3. **Agregar al carrito**: Click en "añadir al carrito"
4. **Ver carrito**: Click en 🛒 Carrito
5. **Hacer pedido**: Click en "Enviar pedido por WhatsApp"

### Para Administradores:
1. **Acceso**: Click en ⚙️ en el header
2. **Login**: usuario `admin`, contraseña `admin123`
3. **Agregar productos**: Completar formulario
   - Las imágenes se comprimen automáticamente
   - Seleccionar color visualmente
4. **Gestionar stock**: Marcar como agotado/disponible
5. **Editar/Eliminar**: Desde las cards de productos

---

## 💡 Consejos de Uso

### Imágenes
- Usa imágenes de buena calidad (mínimo 800x800px)
- Formatos recomendados: JPG, PNG
- No te preocupes por el tamaño, se comprimen automáticamente

### WhatsApp
- Prueba el botón antes de usar en producción
- Verifica que tu número esté correcto
- Asegúrate de tener WhatsApp instalado

### Carrito
- El carrito se guarda automáticamente
- Los clientes pueden cerrar y volver sin perder productos
- Se limpia al confirmar el pedido (opcional)

---

## 🔐 Seguridad

### Cambiar Contraseña de Admin
Para cambiar la contraseña del administrador, edita el archivo `login.js`:

```javascript
// Línea 15-16
if (username === 'admin' && password === 'admin123') {
```

Cambia `'admin123'` por tu contraseña deseada.

### Recomendaciones:
- Usa una contraseña fuerte
- No compartas las credenciales
- Cambia la contraseña regularmente

---

## 📈 Próximas Mejoras Sugeridas

1. **Cantidad en Carrito**: Poder seleccionar cantidad de cada producto
2. **Categorías Dinámicas**: Crear categorías desde el admin
3. **Descuentos**: Sistema de cupones o promociones
4. **Galería de Imágenes**: Múltiples fotos por producto
5. **Backend Real**: Migrar a Firebase o Supabase para escalabilidad

---

## 🆘 Solución de Problemas

### El carrito no se guarda
- Verifica que el navegador permita localStorage
- Prueba en modo incógnito
- Limpia la caché del navegador

### WhatsApp no abre
- Verifica el formato del número
- Asegúrate de incluir el código de país (549)
- Prueba en diferentes navegadores

### Las imágenes no se comprimen
- Usa formatos JPG o PNG
- El archivo debe ser una imagen válida
- Espera unos segundos al proceso de compresión

### La búsqueda no funciona
- Recarga la página
- Verifica que haya productos cargados
- Limpia los filtros activos

---

## 📞 Soporte

Si tienes problemas o necesitas ayuda adicional, revisa:
1. Este archivo de configuración
2. El archivo `RECOMENDACIONES.md` para más mejoras
3. Consola del navegador (F12) para errores

---

**¡Tu tienda está lista para usar!** 🎉
