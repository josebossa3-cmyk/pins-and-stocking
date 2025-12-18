# 📱 CÓMO LIMPIAR CACHÉ EN MÓVILES

Si los cambios no se reflejan en tu móvil, sigue estos pasos:

## 🔴 MÉTODO 1: Recarga Forzada (MÁS RÁPIDO)

### En Chrome (Android):
1. Abre la página
2. Toca los **3 puntos** (⋮) en la esquina superior derecha
3. Selecciona **"Configuración"**
4. Busca **"Privacidad y seguridad"**
5. Toca **"Borrar datos de navegación"**
6. Marca **"Archivos e imágenes en caché"**
7. Toca **"Borrar datos"**
8. Recarga la página

### En Safari (iPhone):
1. Ve a **Ajustes** > **Safari**
2. Desplázate hacia abajo
3. Toca **"Borrar historial y datos de sitios web"**
4. Confirma
5. Vuelve a abrir la página

---

## 🔴 MÉTODO 2: Modo Incógnito/Privado

### Chrome (Android):
1. Toca los **3 puntos** (⋮)
2. Selecciona **"Nueva pestaña de incógnito"**
3. Ingresa a la página

### Safari (iPhone):
1. Toca el ícono de **pestañas** (dos cuadrados)
2. Toca **"Privado"** en la parte inferior
3. Toca **"+"** para nueva pestaña
4. Ingresa a la página

---

## 🔴 MÉTODO 3: Hard Reload (Para Desarrolladores)

### Chrome (Android):
1. Abre **Chrome DevTools** (si está disponible)
2. Mantén presionado el botón de **recargar**
3. Selecciona **"Vaciar caché y recargar de forma forzada"**

### Safari (iPhone):
1. Cierra Safari completamente (desliza hacia arriba)
2. Espera 5 segundos
3. Vuelve a abrir Safari
4. Ingresa a la página

---

## 🔴 MÉTODO 4: Agregar Parámetro Manual

Abre la URL agregando `?v=` y un número al final:

```
https://tu-sitio.com/?v=12345
```

Cambia el número cada vez que quieras forzar una recarga.

---

## ✅ VERIFICAR QUE FUNCIONÓ

Abre la **Consola del Navegador** (Chrome DevTools en móvil):
- Deberías ver: `🚀 Iniciando Pins and Stocking - v20251218001`
- Si ves ese mensaje, la versión nueva está cargada

---

## 🆘 SI NADA FUNCIONA

1. **Desinstala y reinstala el navegador**
2. **Usa otro navegador** (Chrome, Firefox, Edge)
3. **Reinicia el teléfono**
4. **Conecta desde otra red** (WiFi diferente o datos móviles)

---

## 📝 PARA EL DESARROLLADOR

Cada vez que hagas cambios importantes:

1. Actualiza la versión en `index.html`:
   ```javascript
   const CURRENT_VERSION = '20251218002'; // Incrementa el número
   ```

2. Actualiza los parámetros de versión:
   ```html
   <link rel="stylesheet" href="styles.css?v=20251218002">
   <script src="cart.js?v=20251218002"></script>
   ```

3. Haz commit y push a Vercel

4. Vercel desplegará automáticamente y los usuarios verán la nueva versión
