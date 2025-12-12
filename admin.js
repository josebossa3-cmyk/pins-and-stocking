// Verificar autenticación
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Mostrar nombre de usuario
const adminUsername = document.getElementById('adminUsername');
if (adminUsername) {
    adminUsername.textContent = localStorage.getItem('adminUser') || 'Administrador';
}

// Manejar cierre de sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('adminUser');
            window.location.href = 'login.html';
        }
    });
}

// Obtener productos del localStorage o inicializar array vacío
let products = JSON.parse(localStorage.getItem('products')) || [];

// Referencias a elementos del DOM
const productForm = document.getElementById('productForm');
const adminProductsList = document.getElementById('adminProductsList');
const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');

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

// Manejar la selección de color
const colorButtons = document.querySelectorAll('.color-select-btn');
const colorInput = document.getElementById('productColor');
const colorSelectedText = document.getElementById('colorSelectedText');

colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover selección de todos los botones
        colorButtons.forEach(b => b.classList.remove('selected'));
        
        // Seleccionar el botón clickeado
        btn.classList.add('selected');
        
        // Guardar el valor del color
        const selectedColor = btn.getAttribute('data-color');
        colorInput.value = selectedColor;
        
        // Actualizar texto
        colorSelectedText.textContent = `Color seleccionado: ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`;
        colorSelectedText.classList.add('has-selection');
    });
});

// Manejar la vista previa de la imagen con compresión
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

// Cargar productos existentes al inicio
document.addEventListener('DOMContentLoaded', () => {
    renderAdminProducts();
});

// Manejar el envío del formulario
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
        color: document.getElementById('productColor').value || '',
        image: currentImageBase64,
        createdAt: Date.now(),
        outOfStock: false
    };
    
    // Agregar producto al array
    products.push(newProduct);
    
    // Guardar en localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Limpiar formulario
    productForm.reset();
    currentImageBase64 = '';
    previewImg.classList.remove('show');
    imagePreview.classList.remove('has-image');
    
    // Limpiar selección de color
    colorButtons.forEach(b => b.classList.remove('selected'));
    colorInput.value = '';
    colorSelectedText.textContent = 'Ningún color seleccionado';
    colorSelectedText.classList.remove('has-selection');
    
    // Actualizar vista
    renderAdminProducts();
    
    // Feedback visual
    showNotification('Producto agregado exitosamente', 'success');
});

// Renderizar productos en el panel de administración
function renderAdminProducts() {
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
                <button class="btn-stock ${product.outOfStock ? 'btn-in-stock' : 'btn-out-stock'}" onclick="toggleStock(${product.id})">
                    ${product.outOfStock ? 'Marcar Disponible' : 'Marcar Agotado'}
                </button>
                <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Eliminar producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminProducts();
        showNotification('Producto eliminado', 'error');
    }
}

// Editar producto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
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
                    <label for="editProductColor">Color</label>
                    <div class="color-selector">
                        <div class="color-palette-admin">
                            <button type="button" class="edit-color-select-btn" data-color="negro" style="background: #000000;" title="Negro"></button>
                            <button type="button" class="edit-color-select-btn" data-color="blanco" style="background: #FFFFFF; border: 1px solid rgba(139, 0, 0, 0.3);" title="Blanco"></button>
                            <button type="button" class="edit-color-select-btn" data-color="gris" style="background: #808080;" title="Gris"></button>
                            <button type="button" class="edit-color-select-btn" data-color="rojo" style="background: #DC143C;" title="Rojo"></button>
                            <button type="button" class="edit-color-select-btn" data-color="azul" style="background: #1E90FF;" title="Azul"></button>
                            <button type="button" class="edit-color-select-btn" data-color="verde" style="background: #32CD32;" title="Verde"></button>
                            <button type="button" class="edit-color-select-btn" data-color="amarillo" style="background: #FFD700;" title="Amarillo"></button>
                            <button type="button" class="edit-color-select-btn" data-color="naranja" style="background: #FF8C00;" title="Naranja"></button>
                            <button type="button" class="edit-color-select-btn" data-color="rosa" style="background: #FF69B4;" title="Rosa"></button>
                            <button type="button" class="edit-color-select-btn" data-color="morado" style="background: #9370DB;" title="Morado"></button>
                            <button type="button" class="edit-color-select-btn" data-color="marron" style="background: #8B4513;" title="Marrón"></button>
                            <button type="button" class="edit-color-select-btn" data-color="multicolor" style="background: linear-gradient(135deg, #FF0000 0%, #FF7F00 14%, #FFFF00 28%, #00FF00 42%, #0000FF 56%, #4B0082 70%, #9400D3 84%, #FF0000 100%);" title="Multicolor"></button>
                        </div>
                        <input type="hidden" id="editProductColor" value="${product.color || ''}">
                        <p class="color-selected-text" id="editColorSelectedText">Ningún color seleccionado</p>
                    </div>
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
    
    // Manejar selección de color en el modal de edición
    const editColorButtons = document.querySelectorAll('.edit-color-select-btn');
    const editColorInput = document.getElementById('editProductColor');
    const editColorSelectedText = document.getElementById('editColorSelectedText');
    
    // Preseleccionar color si existe
    if (product.color) {
        const selectedBtn = document.querySelector(`.edit-color-select-btn[data-color="${product.color}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
            editColorSelectedText.textContent = `Color seleccionado: ${product.color.charAt(0).toUpperCase() + product.color.slice(1)}`;
            editColorSelectedText.classList.add('has-selection');
        }
    }
    
    editColorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            editColorButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const selectedColor = btn.getAttribute('data-color');
            editColorInput.value = selectedColor;
            editColorSelectedText.textContent = `Color seleccionado: ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`;
            editColorSelectedText.classList.add('has-selection');
        });
    });
    
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
        
        const index = products.findIndex(p => p.id === productId);
        products[index] = {
            id: productId,
            name: document.getElementById('editProductName').value,
            description: document.getElementById('editProductDescription').value,
            price: parseInt(document.getElementById('editProductPrice').value),
            category: document.getElementById('editProductCategory').value,
            subcategory: document.getElementById('editProductSubcategory').value || '',
            style: document.getElementById('editProductStyle').value || '',
            color: document.getElementById('editProductColor').value || '',
            image: editImageBase64
        };
        
        localStorage.setItem('products', JSON.stringify(products));
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
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    product.outOfStock = !product.outOfStock;
    localStorage.setItem('products', JSON.stringify(products));
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
