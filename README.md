# 🧦 Pins and Stocking

**Tienda online de medias y pins con estilo único**

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://josebossa3-cmyk.github.io/pins-and-stocking2/)

## 🌟 Características

- ✅ **Catálogo de Productos** con filtros avanzados por categoría, estilo y color
- ✅ **Carrito de Compras** con persistencia en localStorage
- ✅ **Panel Administrativo** para gestión de productos
- ✅ **Búsqueda en Tiempo Real** de productos
- ✅ **Integración con WhatsApp** para envío de pedidos
- ✅ **Compresión Automática de Imágenes** (hasta 80% más livianas)
- ✅ **Gestión de Stock** (marcar productos como agotados)
- ✅ **Diseño Responsive** adaptado a móviles, tablets y desktop
- ✅ **Tema Oscuro** con degradados negro/rojo/violeta

## 🚀 Demo en Vivo

👉 [Ver Demo](https://josebossa3-cmyk.github.io/pins-and-stocking2/)

## 📋 Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias
- 100% Frontend (HTML, CSS, JavaScript vanilla)

## 🛠️ Instalación Local

1. Clonar el repositorio:
```bash
git clone https://github.com/josebossa3-cmyk/pins-and-stocking2.git
cd pins-and-stocking2
```

2. Abrir `index.html` en tu navegador o usar un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js (npx)
npx serve
```

3. Abrir en el navegador: `http://localhost:8000`

## ⚙️ Configuración Inicial

### Configurar WhatsApp

1. Abrir el archivo `cart.js`
2. Buscar la línea 9:
```javascript
const WHATSAPP_NUMBER = '5491112345678';
```
3. Reemplazar con tu número en formato: **549** + código de área (sin 0) + número (sin 15)

Ejemplos:
- Buenos Aires: `5491112345678`
- Córdoba: `5493512345678`
- Rosario: `5493412345678`

### Cambiar Contraseña de Admin

1. Abrir el archivo `login.js`
2. Modificar línea 15-16:
```javascript
if (username === 'admin' && password === 'TUCLAVE') {
```

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

## 📱 Uso

### Para Clientes

1. **Navegar productos**: Usa los filtros en el sidebar o la barra de búsqueda
2. **Agregar al carrito**: Click en "añadir al carrito"
3. **Ver carrito**: Click en el botón 🛒 en el header
4. **Hacer pedido**: Click en "📱 Enviar pedido por WhatsApp"

### Para Administradores

1. **Acceder al panel**: Click en ⚙️ en el header
2. **Iniciar sesión**: Usuario `admin`, contraseña `admin123`
3. **Agregar productos**: Completar formulario (las imágenes se comprimen automáticamente)
4. **Gestionar stock**: Usar botones "Marcar Agotado/Disponible"
5. **Editar/Eliminar**: Desde las tarjetas de productos

## 🗂️ Estructura del Proyecto

```
pins-and-stocking2/
├── index.html              # Página principal (tienda)
├── admin.html              # Panel administrativo
├── login.html              # Página de login
├── limpiar-storage.html    # Utilidad para limpiar datos
├── styles.css              # Estilos principales
├── admin.css               # Estilos del admin
├── login.css               # Estilos del login
├── cart.js                 # Lógica del carrito y filtros
├── admin.js                # Lógica del panel admin
├── login.js                # Lógica de autenticación
├── imagenes/               # Carpeta de imágenes
│   └── logo.jpg
├── CONFIGURACION.md        # Guía de configuración detallada
├── RECOMENDACIONES.md      # Mejoras futuras sugeridas
└── README.md               # Este archivo
```

## 🧹 Mantenimiento

### Limpiar Datos de Prueba

Si has estado probando y quieres limpiar todos los productos y datos guardados:

1. Abrir `limpiar-storage.html` en el navegador
2. Seleccionar la opción de limpieza deseada:
   - **Limpiar TODO**: Elimina productos, carrito y sesión
   - **Limpiar Solo Productos**: Solo elimina productos guardados
   - **Vaciar Carrito**: Limpia el carrito actual
   - **Cerrar Sesión**: Cierra la sesión del admin

## 🎨 Personalización

### Cambiar Colores del Tema

Editar en `styles.css` y `admin.css`:
```css
/* Gradiente principal */
background: linear-gradient(135deg, #0f0f0f 0%, #8B0000 50%, #4B0082 100%);

/* Colores primarios */
--color-rojo: #8B0000;
--color-violeta: #4B0082;
--color-rojo-claro: #DC143C;
```

### Agregar Categorías

1. Editar `admin.html` y `index.html` para agregar opciones en los `<select>`
2. Los filtros se actualizarán automáticamente

## 📊 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive con Grid y Flexbox
- **JavaScript ES6+** - Lógica del frontend
- **LocalStorage API** - Persistencia de datos
- **FileReader API** - Compresión de imágenes
- **Google Fonts** - Tipografía Playfair Display

## 🔒 Seguridad

⚠️ **Importante**: Este es un proyecto frontend sin backend real. 

- Los datos se guardan en localStorage (solo en el navegador del usuario)
- La autenticación es básica (solo para demostración)
- Para producción real, considera implementar:
  - Backend con base de datos real
  - Autenticación JWT
  - HTTPS
  - Validación server-side

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/mejora`)
3. Commit los cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

- 📧 Abre un [Issue](https://github.com/josebossa3-cmyk/pins-and-stocking2/issues)
- 📖 Consulta `CONFIGURACION.md` para guías detalladas
- 💡 Revisa `RECOMENDACIONES.md` para mejoras futuras

## 🎯 Roadmap

- [ ] Backend con Firebase/Supabase
- [ ] Sistema de cupones/descuentos
- [ ] Múltiples imágenes por producto
- [ ] Categorías dinámicas
- [ ] Dashboard con analytics
- [ ] Notificaciones push
- [ ] Modo oscuro/claro toggle

---

Hecho con ❤️ por [Jose Bossa](https://github.com/josebossa3-cmyk)
