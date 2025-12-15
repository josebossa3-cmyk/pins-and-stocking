// Verificar autenticación (sessionStorage se borra automáticamente al cerrar el navegador)
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Mostrar nombre de usuario
const adminUsername = document.getElementById('adminUsername');
if (adminUsername) {
    adminUsername.textContent = sessionStorage.getItem('adminUser') || 'Administrador';
}

// Manejar cierre de sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('adminUser');
            // Limpiar datos temporales
            localStorage.removeItem('productsUpdated');
            window.location.href = 'login.html';
        }
    });
}

// Obtener productos del localStorage o inicializar array vacío
let products = JSON.parse(localStorage.getItem('products')) || [];

// Función helper para guardar productos y notificar cambios
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    // Disparar evento personalizado para notificar cambios
    localStorage.setItem('productsUpdated', Date.now().toString());
}

// Referencias a elementos del DOM
const productForm = document.getElementById('productForm');
const adminProductsList = document.getElementById('adminProductsList');
const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const colorInput = document.getElementById('productColor');
const colorSelectedText = document.getElementById('colorSelectedText');

// Variable para almacenar la imagen en base64
let currentImageBase64 = '';

// Función para comprimir imágenes
function compressImage(base64, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Mantener aspect ratio
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a JPEG con calidad especificada
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = base64;
    });
}

// Manejar la vista previa de la imagen con compresión
if (productImageInput && imagePreview && previewImg) {
    productImageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        // Verificar que sea una imagen
        if (!file.type.startsWith('image/')) {
            showNotification('Por favor selecciona un archivo de imagen válido', 'error');
            return;
        }
        
        // Mostrar loader
        previewImg.classList.remove('show');
        const loadingText = document.createElement('p');
        loadingText.className = 'preview-text loading';
        loadingText.textContent = 'Comprimiendo imagen...';
        imagePreview.appendChild(loadingText);
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                // Comprimir la imagen
                const compressed = await compressImage(event.target.result, 800, 0.8);
                currentImageBase64 = compressed;
                
                // Mostrar preview
                previewImg.src = currentImageBase64;
                previewImg.classList.add('show');
                imagePreview.classList.add('has-image');
                
                // Remover loading
                if (loadingText) loadingText.remove();
                
                // Calcular reducción de tamaño
                const originalSize = (event.target.result.length * 0.75) / 1024; // KB
                const compressedSize = (compressed.length * 0.75) / 1024; // KB
                const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
                
                showNotification(`Imagen optimizada (${reduction}% más liviana)`, 'success');
            } catch (error) {
                showNotification('Error al procesar la imagen', 'error');
                if (loadingText) loadingText.remove();
            }
        };
        reader.readAsDataURL(file);
    }
    });
}

// Cargar productos existentes al inicio
document.addEventListener('DOMContentLoaded', () => {
    // Recargar productos desde localStorage (pueden haber sido actualizados)
    products = JSON.parse(localStorage.getItem('products')) || [];
    renderAdminProducts();
});

// Manejar el envío del formulario
if (productForm) {
    productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentImageBase64) {
        showNotification('Por favor selecciona una imagen', 'error');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseInt(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value || '',
        style: document.getElementById('productStyle').value || '',
        image: currentImageBase64,
        createdAt: Date.now(),
        outOfStock: false
    };
    
    // Agregar producto al array
    products.push(newProduct);
    
    // Guardar en localStorage
    saveProducts();
    
    // Limpiar formulario
    productForm.reset();
    currentImageBase64 = '';
    previewImg.classList.remove('show');
    imagePreview.classList.remove('has-image');
    
    // Actualizar vista
    renderAdminProducts();
    
    // Feedback visual
    showNotification('Producto agregado exitosamente', 'success');
    });
}

// Renderizar productos en el panel de administración
function renderAdminProducts() {
    if (!adminProductsList) return;
    
    if (products.length === 0) {
        adminProductsList.innerHTML = `
            <div class="empty-products">
                <p>No hay productos agregados aún</p>
            </div>
        `;
        return;
    }
    
    // Ordenar productos por fecha de creación (más nuevos primero)
    const sortedProducts = [...products].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    adminProductsList.innerHTML = sortedProducts.map(product => `
        <div class="admin-product-card ${product.outOfStock ? 'out-of-stock' : ''}">
            <div class="admin-card-image">
                <img src="${product.image}" alt="${product.name}">
                <span class="product-category-badge">${product.category}</span>
                ${product.subcategory ? `<span class="product-subcategory-badge">${product.subcategory}</span>` : ''}
                ${product.outOfStock ? '<span class="out-of-stock-badge">AGOTADO</span>' : ''}
            </div>
            <div class="admin-card-details">
                <h3 class="admin-product-name">${product.name}</h3>
                <p class="admin-product-description">${product.description}</p>
                <span class="admin-product-price">$${product.price.toLocaleString('es-AR')}</span>
            </div>
            <div class="admin-card-actions">
                <button class="btn-stock ${product.outOfStock ? 'btn-in-stock' : 'btn-out-stock'}" onclick="toggleStock('${product.id}')">
                    ${product.outOfStock ? 'Marcar Disponible' : 'Marcar Agotado'}
                </button>
                <button class="btn-edit" onclick="editProduct('${product.id}')">Editar</button>
                <button class="btn-delete" onclick="deleteProduct('${product.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Eliminar producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => String(p.id) !== String(productId));
        saveProducts();
        renderAdminProducts();
        showNotification('Producto eliminado', 'error');
    }
}

// Editar producto
function editProduct(productId) {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;
    
    // Crear modal de edición
    const modal = document.createElement('div');
    modal.className = 'edit-modal active';
    modal.innerHTML = `
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h2>Editar Producto</h2>
                <button class="close-edit-modal" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editForm" class="product-form">
                <div class="form-group">
                    <label for="editProductName">Nombre del Producto</label>
                    <input type="text" id="editProductName" value="${product.name}" required>
                </div>

                <div class="form-group">
                    <label for="editProductDescription">Descripción</label>
                    <textarea id="editProductDescription" required>${product.description}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="editProductPrice">Precio</label>
                        <input type="number" id="editProductPrice" value="${product.price}" required step="100">
                    </div>

                    <div class="form-group">
                        <label for="editProductCategory">Categoría</label>
                        <select id="editProductCategory" required>
                            <option value="medias" ${product.category === 'medias' ? 'selected' : ''}>Medias</option>
                            <option value="pins" ${product.category === 'pins' ? 'selected' : ''}>Pins</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="editProductSubcategory">Subcategoría</label>
                    <input type="text" id="editProductSubcategory" value="${product.subcategory || ''}" placeholder="Ej: Deportivas, Casuales, Vintage, etc.">
                </div>

                <div class="form-group">
                    <label for="editProductStyle">Estilo</label>
                    <select id="editProductStyle">
                        <option value="">Seleccionar estilo (opcional)</option>
                        <option value="lisas" ${product.style === 'lisas' ? 'selected' : ''}>Lisas</option>
                        <option value="animadas" ${product.style === 'animadas' ? 'selected' : ''}>Animadas</option>
                        <option value="soquetes" ${product.style === 'soquetes' ? 'selected' : ''}>Soquetes</option>
                        <option value="niños" ${product.style === 'niños' ? 'selected' : ''}>De Niños</option>
                        <option value="largas" ${product.style === 'largas' ? 'selected' : ''}>Largas</option>
                        <option value="old school" ${product.style === 'old school' ? 'selected' : ''}>Old School</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="editProductImage">Imagen del Producto</label>
                    <input type="file" id="editProductImage" accept="image/*">
                    <div class="image-preview has-image" id="editImagePreview">
                        <img id="editPreviewImg" src="${product.image}" alt="Vista previa" class="show">
                        <span class="preview-text">Vista previa de la imagen</span>
                    </div>
                </div>

                <button type="submit" class="btn-submit">Guardar Cambios</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Variable para la nueva imagen en edición
    let editImageBase64 = product.image;
    
    // Manejar cambio de imagen en el modal de edición
    const editImageInput = document.getElementById('editProductImage');
    const editPreview = document.getElementById('editPreviewImg');
    const editImagePreviewContainer = document.getElementById('editImagePreview');
    
    editImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                editImageBase64 = event.target.result;
                editPreview.src = editImageBase64;
                editPreview.classList.add('show');
                editImagePreviewContainer.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Manejar el formulario de edición
    document.getElementById('editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const index = products.findIndex(p => String(p.id) === String(productId));
        if (index === -1) {
            showNotification('Error: Producto no encontrado', 'error');
            closeEditModal();
            return;
        }
        
        const originalProduct = products[index];
        products[index] = {
            id: productId,
            name: document.getElementById('editProductName').value,
            description: document.getElementById('editProductDescription').value,
            price: parseInt(document.getElementById('editProductPrice').value),
            category: document.getElementById('editProductCategory').value,
            subcategory: document.getElementById('editProductSubcategory').value || '',
            style: document.getElementById('editProductStyle').value || '',
            image: editImageBase64,
            createdAt: originalProduct.createdAt || Date.now(),
            outOfStock: originalProduct.outOfStock || false,
            isDefault: originalProduct.isDefault || false
        };
        
        saveProducts();
        renderAdminProducts();
        closeEditModal();
        showNotification('Producto actualizado', 'success');
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

// Alternar estado de stock
function toggleStock(productId) {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;
    
    product.outOfStock = !product.outOfStock;
    saveProducts();
    renderAdminProducts();
    
    showNotification(
        product.outOfStock ? 'Producto marcado como agotado' : 'Producto marcado como disponible',
        product.outOfStock ? 'error' : 'success'
    );
}

// Cerrar modal de edición
function closeEditModal() {
    const modal = document.querySelector('.edit-modal');
    if (modal) {
        modal.remove();
    }
}

// Mostrar notificación
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Limpiar sesión y datos temporales al cerrar el navegador
window.addEventListener('beforeunload', () => {
    // La sesión se cierra automáticamente (sessionStorage)
    // Limpiar datos temporales de sincronización
    localStorage.removeItem('productsUpdated');
});
