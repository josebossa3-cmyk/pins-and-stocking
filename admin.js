// ==========================================
// INICIALIZAR FIRESTORE COLLECTION
// ==========================================
const productsCollection = db.collection('products');

// ==========================================
// VERIFICAR AUTENTICACIÓN CON FIREBASE
// ==========================================
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        const adminUsername = document.getElementById('adminUsername');
        if (adminUsername) {
            adminUsername.textContent = user.email.split('@')[0] || 'Administrador';
        }
    }
});

// Manejar cierre de sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            try {
                await auth.signOut();
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                showNotification('Error al cerrar sesión', 'error');
            }
        }
    });
}

// ==========================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ==========================================
const productForm = document.getElementById('productForm');
const adminProductsList = document.getElementById('adminProductsList');
const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');

let currentImageFile = null;
let currentImageBase64 = '';

// ==========================================
// FUNCIONES DE COMPRESIÓN DE IMAGEN
// ==========================================
function compressImage(base64, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = base64;
    });
}

// ==========================================
// MANEJAR VISTA PREVIA DE IMAGEN
// ==========================================
if (productImageInput && imagePreview && previewImg) {
    productImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showNotification('Por favor selecciona un archivo de imagen válido', 'error');
                return;
            }
            
            currentImageFile = file;
            
            previewImg.classList.remove('show');
            const loadingText = document.createElement('p');
            loadingText.className = 'preview-text loading';
            loadingText.textContent = 'Procesando imagen...';
            imagePreview.appendChild(loadingText);
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const compressed = await compressImage(event.target.result, 800, 0.8);
                    currentImageBase64 = compressed;
                    
                    previewImg.src = currentImageBase64;
                    previewImg.classList.add('show');
                    imagePreview.classList.add('has-image');
                    
                    if (loadingText) loadingText.remove();
                    
                    const originalSize = (event.target.result.length * 0.75) / 1024;
                    const compressedSize = (compressed.length * 0.75) / 1024;
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

// ==========================================
// SUBIR IMAGEN A FIREBASE STORAGE
// ==========================================
// AGREGAR PRODUCTO A FIRESTORE
// ==========================================
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentImageBase64) {
            showNotification('Por favor selecciona una imagen', 'error');
            return;
        }
        
        const submitBtn = productForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando producto...';
        
        try {
            const productId = Date.now().toString();
            
            const newProduct = {
                id: productId,
                name: document.getElementById('productName').value,
                description: document.getElementById('productDescription').value,
                price: parseInt(document.getElementById('productPrice').value),
                category: document.getElementById('productCategory').value,
                subcategory: document.getElementById('productSubcategory').value || '',
                style: document.getElementById('productStyle').value || '',
                image: currentImageBase64,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                outOfStock: false
            };
            
            await productsCollection.doc(productId).set(newProduct);
            
            productForm.reset();
            currentImageBase64 = '';
            currentImageFile = null;
            previewImg.classList.remove('show');
            imagePreview.classList.remove('has-image');
            
            await loadProducts();
            
            showNotification('✅ Producto agregado exitosamente', 'success');
        } catch (error) {
            console.error('Error al agregar producto:', error);
            showNotification('❌ Error al agregar producto: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ==========================================
// CARGAR PRODUCTOS DESDE FIRESTORE
// ==========================================
let products = [];

async function loadProducts() {
    try {
        const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
        products = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        renderAdminProducts();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showNotification('Error al cargar productos', 'error');
    }
}

// ==========================================
// RENDERIZAR PRODUCTOS EN ADMIN
// ==========================================
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
    
    adminProductsList.innerHTML = products.map(product => `
        <div class="admin-product-card ${product.outOfStock ? 'out-of-stock' : ''}">
            <div class="admin-card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
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

// ==========================================
// CAMBIAR ESTADO DE STOCK
// ==========================================
async function toggleStock(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const newStockStatus = !product.outOfStock;
        
        await productsCollection.doc(productId).update({
            outOfStock: newStockStatus
        });
        
        product.outOfStock = newStockStatus;
        renderAdminProducts();
        
        showNotification(
            newStockStatus ? 'Producto marcado como agotado' : 'Producto marcado como disponible',
            'success'
        );
    } catch (error) {
        console.error('Error al cambiar stock:', error);
        showNotification('Error al cambiar estado de stock', 'error');
    }
}

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================
async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
        await productsCollection.doc(productId).delete();
        
        await loadProducts();
        
        showNotification('Producto eliminado', 'success');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showNotification('Error al eliminar producto', 'error');
    }
}

// ==========================================
// EDITAR PRODUCTO
// ==========================================
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'edit-modal active';
    modal.id = 'editModal';
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
                        <label for="editProductPrice">Precio ($)</label>
                        <input type="number" id="editProductPrice" value="${product.price}" required min="0">
                    </div>

                    <div class="form-group">
                        <label for="editProductCategory">Categoría</label>
                        <select id="editProductCategory" required>
                            <option value="medias" ${product.category === 'medias' ? 'selected' : ''}>Medias</option>
                            <option value="pins" ${product.category === 'pins' ? 'selected' : ''}>Pins</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="editProductSubcategory">Subcategoría</label>
                        <input type="text" id="editProductSubcategory" value="${product.subcategory || ''}" 
                               placeholder="ej: Premium, Básica">
                    </div>

                    <div class="form-group">
                        <label for="editProductStyle">Estilo</label>
                        <select id="editProductStyle">
                            <option value="">Seleccionar estilo</option>
                            <option value="lisas" ${product.style === 'lisas' ? 'selected' : ''}>Lisas</option>
                            <option value="animadas" ${product.style === 'animadas' ? 'selected' : ''}>Animadas</option>
                            <option value="soquetes" ${product.style === 'soquetes' ? 'selected' : ''}>Soquetes</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Imagen Actual</label>
                    <div class="current-image">
                        <img src="${product.image}" alt="${product.name}" style="max-width: 200px; border-radius: 8px;">
                    </div>
                    <label for="editProductImage" style="margin-top: 10px;">Cambiar Imagen (opcional)</label>
                    <input type="file" id="editProductImage" accept="image/*">
                    <div id="editImagePreview" class="image-preview">
                        <img id="editPreviewImg" src="" alt="Vista previa">
                        <p class="preview-text">Vista previa de nueva imagen</p>
                    </div>
                </div>

                <div class="form-buttons">
                    <button type="button" class="btn-cancel" onclick="closeEditModal()">Cancelar</button>
                    <button type="submit" class="btn-save">Guardar Cambios</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    let editImageBase64 = '';
    const editImageInput = document.getElementById('editProductImage');
    const editImagePreview = document.getElementById('editImagePreview');
    const editPreviewImg = document.getElementById('editPreviewImg');
    
    editImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showNotification('Por favor selecciona un archivo de imagen válido', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const compressed = await compressImage(event.target.result, 800, 0.8);
                    editImageBase64 = compressed;
                    editPreviewImg.src = compressed;
                    editPreviewImg.classList.add('show');
                    editImagePreview.classList.add('has-image');
                } catch (error) {
                    showNotification('Error al procesar la imagen', 'error');
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    const editForm = document.getElementById('editForm');
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = editForm.querySelector('.btn-save');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
        
        try {
            const updatedData = {
                name: document.getElementById('editProductName').value,
                description: document.getElementById('editProductDescription').value,
                price: parseInt(document.getElementById('editProductPrice').value),
                category: document.getElementById('editProductCategory').value,
                subcategory: document.getElementById('editProductSubcategory').value || '',
                style: document.getElementById('editProductStyle').value || ''
            };
            
            if (editImageBase64) {
                updatedData.image = editImageBase64;
            }
            
            await productsCollection.doc(productId).update(updatedData);
            
            await loadProducts();
            
            closeEditModal();
            showNotification('✅ Producto actualizado exitosamente', 'success');
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            showNotification('❌ Error al actualizar producto', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Cambios';
        }
    });
}

// ==========================================
// CERRAR MODAL DE EDICIÓN
// ==========================================
function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

// ==========================================
// SISTEMA DE NOTIFICACIONES
// ==========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// CARGAR PRODUCTOS AL INICIAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// ==========================================
// ESCUCHAR CAMBIOS EN TIEMPO REAL
// ==========================================
productsCollection.onSnapshot((snapshot) => {
    products = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
    renderAdminProducts();
}, (error) => {
    console.error('Error en sincronización en tiempo real:', error);
});
