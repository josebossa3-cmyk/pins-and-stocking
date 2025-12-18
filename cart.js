// ==========================================
// VERSIÓN Y CONTROL DE CACHÉ
// ==========================================
const APP_VERSION = '20251218004';
console.log('🔄 Cargando cart.js - Versión:', APP_VERSION);
console.log('📱 Navegador:', navigator.userAgent);
console.log('⏰ Timestamp:', new Date().toISOString());

// ==========================================
// INICIALIZAR FIRESTORE COLLECTION
// ==========================================
const productsCollection = db.collection('products');

// ==========================================
// CARGAR PRODUCTOS DESDE FIRESTORE
// ==========================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const WHATSAPP_NUMBER = '5492657239836';

let allProducts = [];

// Cargar productos desde Firestore
async function loadProducts() {
    try {
        console.log('Iniciando carga de productos...');
        
        // Forzar recarga desde servidor (sin caché)
        const snapshot = await productsCollection.orderBy('createdAt', 'desc').get({ source: 'server' });
        
        allProducts = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        
        console.log('Productos cargados desde servidor:', allProducts.length);
        
        if (allProducts.length === 0) {
            console.warn('No se encontraron productos en la base de datos');
            const productGrid = document.querySelector('.product-grid');
            if (productGrid) {
                productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No hay productos disponibles en este momento.</p>';
            }
            return;
        }
        
        renderProducts(allProducts);
        attachCartListeners();
        attachImagePreviewListeners();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        console.error('Detalles del error:', error.code, error.message);
        
        // Mostrar mensaje de error en la página
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e53e3e;">
                    <p style="font-size: 18px; margin-bottom: 10px;">⚠️ Error al cargar productos</p>
                    <p style="font-size: 14px; color: #666;">${error.message}</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #8B0000; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
}

// Renderizar productos
function renderProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    
    if (!productGrid) {
        console.error('No se encontró el contenedor product-grid');
        return;
    }
    
    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No hay productos que coincidan con los filtros seleccionados.</p>';
        return;
    }
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card ${product.outOfStock ? 'product-out-of-stock' : ''}" 
             data-category="${product.category}" 
             data-style="${product.style || ''}">
            <div class="card-imagen">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='imagenes/placeholder.jpg';this.onerror=null;">
                ${product.outOfStock ? '<div class="out-of-stock-overlay"><span>AGOTADO</span></div>' : ''}
            </div>
            <div class="card-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
            </div>
            <div class="card-footer">
                <span class="product-price" data-price="${product.price}">$${product.price.toLocaleString('es-AR')}</span>
                <button class="add-cart-btn" ${product.outOfStock ? 'disabled' : ''}>
                    ${product.outOfStock ? 'No Disponible' : 'Añadir al Carrito'}
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('Renderizados', products.length, 'productos');
}

// Escuchar cambios en tiempo real de Firestore
productsCollection.onSnapshot((snapshot) => {
    allProducts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
    
    applyFilters();
    attachCartListeners();
    attachImagePreviewListeners();
}, (error) => {
    console.error('Error en sincronización:', error);
});

// ==========================================
// SISTEMA DE FILTROS
// ==========================================
function setupAdvancedFilters() {
    console.log('Configurando filtros avanzados...');
    
    const typeFilters = document.querySelectorAll('input[name="productType"]');
    const styleFilters = document.querySelectorAll('input[name="styleType"]');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const searchInput = document.getElementById('searchInput');
    const navFilterLinks = document.querySelectorAll('.filter-link');
    
    console.log('Elementos encontrados:', {
        typeFilters: typeFilters.length,
        styleFilters: styleFilters.length,
        navFilterLinks: navFilterLinks.length,
        clearFiltersBtn: !!clearFiltersBtn,
        searchInput: !!searchInput
    });
    
    // Filtros de navegación (Todo, Medias, Pins)
    navFilterLinks.forEach(link => {
        // Usar touchstart para mejor respuesta en móviles
        const handleClick = (e) => {
            e.preventDefault();
            
            console.log('Click en filtro de navegación:', link.getAttribute('data-filter'));
            
            // Remover clase active de todos los links
            navFilterLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al link clickeado
            link.classList.add('active');
            
            const filterValue = link.getAttribute('data-filter');
            
            // Actualizar radio buttons en sidebar
            document.querySelectorAll('input[name="productType"]').forEach(input => {
                input.checked = input.value === filterValue;
            });
            
            applyFilters();
        };
        
        link.addEventListener('click', handleClick);
        link.addEventListener('touchend', handleClick);
    });
    
    typeFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            console.log('Cambio en filtro de tipo:', filter.value);
            // Sincronizar con navegación
            navFilterLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-filter') === filter.value);
            });
            applyFilters();
        });
    });
    
    styleFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            console.log('Cambio en filtro de estilo:', filter.value);
            applyFilters();
        });
    });
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        
        // Agregar botón de limpiar búsqueda
        const searchClear = document.getElementById('searchClear');
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                applyFilters();
            });
        }
    }
    
    console.log('Filtros configurados correctamente');
}

function applyFilters() {
    const selectedType = document.querySelector('input[name="productType"]:checked')?.value || 'todo';
    const selectedStyle = document.querySelector('input[name="styleType"]:checked')?.value || '';
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    console.log('Aplicando filtros:', { selectedType, selectedStyle, searchTerm, totalProducts: allProducts.length });
    
    if (!allProducts || allProducts.length === 0) {
        console.warn('No hay productos para filtrar');
        return;
    }
    
    let filteredProducts = [...allProducts];
    
    if (selectedType !== 'todo') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedType);
        console.log('Filtrado por tipo:', filteredProducts.length);
    }
    
    if (selectedStyle !== '' && selectedStyle !== 'todo') {
        filteredProducts = filteredProducts.filter(p => p.style === selectedStyle);
        console.log('Filtrado por estilo:', filteredProducts.length);
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
        console.log('Filtrado por búsqueda:', filteredProducts.length);
    }
    
    console.log('Productos finales a mostrar:', filteredProducts.length);
    renderProducts(filteredProducts);
    attachCartListeners();
    attachImagePreviewListeners();
}

function clearAllFilters() {
    // Resetear filtros de tipo de producto
    document.querySelectorAll('input[name="productType"]').forEach(input => {
        input.checked = input.value === 'todo';
    });
    
    // Resetear filtros de estilo
    document.querySelectorAll('input[name="styleType"]').forEach(input => {
        input.checked = input.value === '';
    });
    
    // Resetear búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Sincronizar links de navegación
    document.querySelectorAll('.filter-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-filter') === 'todo');
    });
    
    applyFilters();
}

// ==========================================
// SISTEMA DE CARRITO
// ==========================================
function attachCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.removeEventListener('click', handleAddToCart);
        button.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(e) {
    const button = e.target;
    const productCard = button.closest('.product-card');
    
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseInt(productCard.querySelector('.product-price').getAttribute('data-price'));
    const productImage = productCard.querySelector('.card-imagen img').src;
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showAddedToCartAnimation(button);
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function showAddedToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Agregado';
    button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

function attachImagePreviewListeners() {
    const productImages = document.querySelectorAll('.card-imagen img');
    
    productImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.removeEventListener('click', handleImagePreview);
        img.addEventListener('click', handleImagePreview);
    });
}

function handleImagePreview(e) {
    const imgSrc = e.target.src;
    const modal = document.getElementById('imagePreviewModal');
    const modalImg = document.getElementById('previewModalImage');
    
    if (modal && modalImg) {
        modalImg.src = imgSrc;
        modal.classList.add('active');
    }
}

function closeImagePreview() {
    const modal = document.getElementById('imagePreviewModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==========================================
// MODAL DEL CARRITO
// ==========================================
function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
    renderCartItems();
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toLocaleString('es-AR')}</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="decreaseQuantity(${index})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">🗑️ Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    renderCartItems();
    updateCartCount();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    renderCartItems();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
    updateCartCount();
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    let message = '¡Hola! Quiero hacer un pedido:%0A%0A';
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0ATotal: $${total.toLocaleString('es-AR')}`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
}

// ==========================================
// LIMPIEZA AL CERRAR PESTAÑA
// ==========================================
window.addEventListener('beforeunload', () => {
    // Limpiar carrito
    localStorage.removeItem('cart');
    
    // Limpiar cualquier otro dato que se quiera resetear
    // Si tienes filtros guardados en localStorage, también los puedes limpiar aquí
});

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Limpiar caché al cargar la página
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Página cargada desde caché (botón atrás)
        console.log('Página cargada desde caché, recargando...');
        window.location.reload();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, iniciando aplicación...');
    console.log('User Agent:', navigator.userAgent);
    
    // Primero configurar los filtros
    setupAdvancedFilters();
    
    // Actualizar contador del carrito
    updateCartCount();
    
    // Cargar productos (esto es asíncrono)
    await loadProducts();
    
    // Configurar eventos del carrito
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    const checkoutBtn = document.getElementById('checkoutWhatsApp');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Configurar preview de imágenes
    const closePreviewBtn = document.getElementById('closePreview');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closeImagePreview);
    }
    
    const modal = document.getElementById('imagePreviewModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeImagePreview();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImagePreview();
        }
    });
    
    console.log('Aplicación iniciada correctamente');
});
