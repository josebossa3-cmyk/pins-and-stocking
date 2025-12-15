// Array para almacenar los items del carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Número de WhatsApp (CAMBIAR POR TU NÚMERO)
const WHATSAPP_NUMBER = '5492657239836'; // Formato: 549 + código de área + número

// Cargar productos dinámicamente desde localStorage
function loadProducts() {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const productGrid = document.querySelector('.product-grid');
    
    // Obtener productos del HTML
    const defaultProductsFromHTML = Array.from(document.querySelectorAll('.product-card')).map((card) => {
        const productName = card.querySelector('.product-name').textContent.trim().toLowerCase();
        
        return {
            name: productName,
            description: card.querySelector('.product-description').textContent,
            price: parseInt(card.querySelector('.product-price').getAttribute('data-price')),
            category: card.getAttribute('data-category'),
            style: card.getAttribute('data-style') || '',
            color: card.getAttribute('data-color') || '',
            image: card.querySelector('.card-imagen img').src,
        };
    });
    
    // Si no hay productos en localStorage, crear estructura inicial con productos del HTML
    if (storedProducts.length === 0) {
        const initialProducts = defaultProductsFromHTML.map((dp, index) => ({
            id: `default-${index}`,
            name: dp.name,
            description: dp.description,
            price: dp.price,
            category: dp.category,
            subcategory: '',
            style: dp.style,
            color: dp.color,
            image: dp.image,
            createdAt: 0,
            outOfStock: false,
            isDefault: true
        }));
        
        // Guardar en localStorage para futuras sincronizaciones
        localStorage.setItem('products', JSON.stringify(initialProducts));
        
        // Renderizar productos iniciales
        productGrid.innerHTML = initialProducts.map(product => `
            <div class="product-card ${ product.outOfStock ? 'product-out-of-stock' : ''}" data-category="${product.category}" data-style="${product.style || ''}" data-color="${product.color || ''}">
                <div class="card-imagen">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.outOfStock ? '<div class="out-of-stock-overlay"><span>AGOTADO</span></div>' : ''}
                </div>
                <div class="card-details">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                </div>
                <div class="card-footer">
                    <span class="product-price" data-price="${product.price}">$${product.price.toLocaleString('es-AR')}</span>
                    <button class="add-cart-btn" ${product.outOfStock ? 'disabled' : ''}>${product.outOfStock ? 'No Disponible' : 'Añadir al Carrito'}</button>
                </div>
            </div>
        `).join('');
        
        attachCartListeners();
        return;
    }
    
    // Buscar productos del localStorage que coincidan con los del HTML y actualizar su estado
    const updatedDefaultProducts = defaultProductsFromHTML.map((dp, index) => {
        // Buscar si existe en localStorage por nombre
        const storedProduct = storedProducts.find(sp => 
            sp.name.trim().toLowerCase() === dp.name
        );
        
        // Si existe en localStorage, mantener su info pero actualizar imagen del HTML si es producto default
        if (storedProduct && storedProduct.isDefault) {
            return {
                ...storedProduct,
                // Actualizar la imagen desde el HTML para productos por defecto
                image: dp.image,
                // Asegurar que mantiene categoría, estilo y color del HTML
                category: dp.category,
                style: dp.style || storedProduct.style,
                color: dp.color || storedProduct.color
            };
        } else if (storedProduct) {
            // Producto editado desde admin, mantener todo de localStorage
            return storedProduct;
        }
        
        // Si no existe, crear uno nuevo
        return {
            id: `default-${index}`,
            name: dp.name,
            description: dp.description,
            price: dp.price,
            category: dp.category,
            subcategory: '',
            style: dp.style,
            color: dp.color,
            image: dp.image,
            createdAt: 0,
            outOfStock: false,
            isDefault: true
        };
    });
    
    // Filtrar productos del localStorage que NO están en el HTML (productos agregados por admin)
    const uniqueStoredProducts = storedProducts.filter(sp => 
        !defaultProductsFromHTML.some(dp => dp.name === sp.name.trim().toLowerCase())
    );
    
    // Combinar: productos nuevos del localStorage + productos del HTML actualizados
    const allProducts = [...uniqueStoredProducts, ...updatedDefaultProducts];
    
    // Ordenar por fecha de creación (más nuevos primero)
    const sortedProducts = allProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    // Guardar la lista actualizada en localStorage
    localStorage.setItem('products', JSON.stringify(sortedProducts));
    
    const allProductsToRender = sortedProducts;
    
    // Renderizar todos los productos
    productGrid.innerHTML = allProductsToRender.map(product => `
        <div class="product-card ${product.outOfStock ? 'product-out-of-stock' : ''}" data-category="${product.category}" data-style="${product.style || ''}" data-color="${product.color || ''}">
            <div class="card-imagen">
                <img src="${product.image}" alt="${product.name}">
                ${product.outOfStock ? '<div class="out-of-stock-overlay"><span>AGOTADO</span></div>' : ''}
            </div>
            <div class="card-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
            </div>
            <div class="card-footer">
                <span class="product-price" data-price="${product.price}">$${product.price.toLocaleString('es-AR')}</span>
                <button class="add-cart-btn" ${product.outOfStock ? 'disabled' : ''}>${product.outOfStock ? 'No Disponible' : 'Añadir al Carrito'}</button>
            </div>
        </div>
    `).join('');
    
    // Re-asignar event listeners a los nuevos botones
    attachCartListeners();
    attachImagePreviewListeners();
}

// Referencias a elementos del DOM
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// Funcionalidad del modal del carrito
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
}

// Cerrar modal al hacer click fuera
if (cartModal) {
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
}

// Función para agregar event listeners a los botones del carrito
function attachCartListeners() {
    const addCartBtns = document.querySelectorAll('.add-cart-btn');
    
    addCartBtns.forEach(btn => {
        // Remover listeners anteriores clonando el botón
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Agregar nuevo listener
        newBtn.addEventListener('click', (e) => {
            // Prevenir múltiples clicks
            if (newBtn.disabled) return;
            
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPriceElement = productCard.querySelector('.product-price');
            const productPrice = parseInt(productPriceElement.getAttribute('data-price'));

            // Crear objeto de producto
            const product = {
                id: Date.now(), // ID único basado en timestamp
                name: productName,
                price: productPrice
            };

            // Agregar al carrito
            cart.push(product);
            
            // Actualizar interfaz
            updateCart();
            
            // Feedback visual
            newBtn.textContent = '✓ Agregado';
            newBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            newBtn.disabled = true;
            
            setTimeout(() => {
                newBtn.textContent = 'Añadir al Carrito';
                newBtn.style.background = 'linear-gradient(135deg, #8B0000 0%, #4B0082 100%)';
                newBtn.disabled = false;
            }, 1500);
        });
    });
}

// Función de búsqueda de productos
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const normalizedQuery = query.toLowerCase().trim();
    
    let visibleCount = 0;
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        const match = name.includes(normalizedQuery) || description.includes(normalizedQuery);
        
        if (match || normalizedQuery === '') {
            product.classList.remove('hidden');
            // Remover cualquier estilo en línea que pueda interferir
            product.style.display = '';
            visibleCount++;
        } else {
            product.classList.add('hidden');
        }
    });
    
    return visibleCount;
}

// Función para actualizar el carrito
function updateCart() {
    // Proteger si los elementos no existen
    if (!cartCount || !cartTotal || !cartItems) {
        return;
    }
    
    // Actualizar contador
    cartCount.textContent = cart.length;
    
    // Calcular total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
    
    // Guardar en localStorage
    saveCart();
    
    // Renderizar items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString('es-AR')}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    Eliminar
                </button>
            </div>
        `).join('');
    }
}

// Función para eliminar del carrito
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Sistema de filtros
function attachFilterListeners() {
    const filterLinks = document.querySelectorAll('.filter-link');

    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase active de todos los filtros
            filterLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al filtro clickeado
            link.classList.add('active');
            
            // Obtener la categoría del filtro
            const filter = link.getAttribute('data-filter');
            
            // Filtrar productos
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'todo') {
                    card.classList.remove('hidden');
                } else if (category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Sistema de filtros avanzados
function setupAdvancedFilters() {
    // Filtros de acordeón
    const filterHeaders = document.querySelectorAll('.filter-header');
    filterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            const content = header.nextElementSibling;
            content.classList.toggle('active');
        });
    });

    // Filtro por tipo de producto (radio buttons)
    const productTypeRadios = document.querySelectorAll('input[name="productType"]');
    productTypeRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });

    // Filtros de estilo (radio buttons)
    const styleFilters = document.querySelectorAll('.style-filter');
    styleFilters.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });

    // Botón limpiar filtros
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
}

// Aplicar todos los filtros
function applyFilters() {
    const productCards = document.querySelectorAll('.product-card');
    
    // Obtener filtros seleccionados
    const selectedType = document.querySelector('input[name="productType"]:checked')?.value || 'todo';
    
    const selectedStyle = document.querySelector('input[name="styleType"]:checked')?.value || '';
    
    // Aplicar filtros a cada card
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardStyle = card.getAttribute('data-style');
        
        let show = true;
        
        // Filtro por tipo
        if (selectedType !== 'todo' && cardCategory !== selectedType) {
            show = false;
        }
        
        // Filtro por estilo
        if (selectedStyle && cardStyle !== selectedStyle) {
            show = false;
        }
        
        // Mostrar u ocultar card
        if (show) {
            card.classList.remove('hidden');
            // Limpiar estilos en línea para evitar conflictos
            card.style.display = '';
        } else {
            card.classList.add('hidden');
        }
    });
}

// Limpiar todos los filtros
function clearAllFilters() {
    // Resetear tipo de producto
    const todoRadio = document.querySelector('input[name="productType"][value="todo"]');
    if (todoRadio) todoRadio.checked = true;
    
    // Resetear estilos al valor vacío (Todos)
    const allStylesRadio = document.querySelector('input[name="styleType"][value=""]');
    if (allStylesRadio) allStylesRadio.checked = true;
    
    // Limpiar búsqueda si existe
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchProducts('');
    }
    
    // Mostrar todos los productos
    applyFilters();
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    attachCartListeners();
    attachFilterListeners();
    setupAdvancedFilters();
    updateCart(); // Cargar carrito guardado
    attachImagePreviewListeners(); // Agregar listeners de vista previa
    
    // Configurar búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            searchProducts(query);
            
            // Mostrar/ocultar botón de limpiar
            if (searchClear) {
                searchClear.style.display = query ? 'block' : 'none';
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchProducts('');
            searchClear.style.display = 'none';
            searchInput.focus();
        });
    }
    
    // Configurar WhatsApp checkout
    const checkoutBtn = document.getElementById('checkoutWhatsApp');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            
            // Crear mensaje para WhatsApp
            let message = '🛒 *Nuevo Pedido - Pins and Stocking*\n\n';
            message += '*Productos:*\n';
            
            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - $${item.price.toLocaleString('es-AR')}\n`;
            });
            
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            message += `\n*Total: $${total.toLocaleString('es-AR')}*\n\n`;
            message += '¡Gracias por tu compra! 🎉';
            
            // Abrir WhatsApp
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            
            // Vaciar carrito y reiniciar filtros automáticamente
            setTimeout(() => {
                // Vaciar carrito
                cart = [];
                updateCart();
                cartModal.classList.remove('active');
                
                // Reiniciar todos los filtros
                clearAllFilters();
                
                // Mostrar confirmación
                alert('¡Pedido enviado! El carrito ha sido vaciado y los filtros reiniciados.');
            }, 500);
        });
    }
});

// Sincronización automática cuando se modifica localStorage desde otra ventana (admin)
window.addEventListener('storage', (e) => {
    if (e.key === 'products' || e.key === 'productsUpdated') {
        // Recargar productos cuando el admin hace cambios
        console.log('Productos actualizados desde admin, recargando...');
        loadProducts();
        applyFilters();
    }
});

// También verificar cambios periódicamente (por si el evento storage no se dispara)
let lastProductsUpdate = localStorage.getItem('productsUpdated') || '0';
setInterval(() => {
    const currentUpdate = localStorage.getItem('productsUpdated') || '0';
    if (currentUpdate !== lastProductsUpdate) {
        lastProductsUpdate = currentUpdate;
        console.log('Cambios detectados en productos, recargando...');
        loadProducts();
        applyFilters();
    }
}, 2000); // Verificar cada 2 segundos

// Limpiar datos temporales al cerrar el navegador
window.addEventListener('beforeunload', () => {
    // Limpiar timestamp de actualización (dato temporal)
    localStorage.removeItem('productsUpdated');
});

// Limpiar sesión de admin si existe (por seguridad)
window.addEventListener('load', () => {
    // Si hay sesión de admin en localStorage antigua, limpiarla
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
});

// Funcionalidad de vista previa de imágenes
const imagePreviewModal = document.getElementById('imagePreviewModal');
const previewModalImage = document.getElementById('previewModalImage');
const closePreview = document.getElementById('closePreview');

// Función para abrir vista previa
function openImagePreview(imageSrc, productName) {
    if (imagePreviewModal && previewModalImage) {
        previewModalImage.src = imageSrc;
        previewModalImage.alt = productName;
        imagePreviewModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
}

// Función para cerrar vista previa
function closeImagePreview() {
    if (imagePreviewModal) {
        imagePreviewModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// Event listener para cerrar con el botón X
if (closePreview) {
    closePreview.addEventListener('click', closeImagePreview);
}

// Event listener para cerrar al hacer click fuera de la imagen
if (imagePreviewModal) {
    imagePreviewModal.addEventListener('click', (e) => {
        if (e.target === imagePreviewModal) {
            closeImagePreview();
        }
    });
}

// Event listener para cerrar con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imagePreviewModal.classList.contains('active')) {
        closeImagePreview();
    }
});

// Agregar event listeners a las imágenes de productos (se ejecuta después de cargar productos)
function attachImagePreviewListeners() {
    const productImages = document.querySelectorAll('.card-imagen');
    
    productImages.forEach(imageContainer => {
        imageContainer.addEventListener('click', (e) => {
            const img = imageContainer.querySelector('img');
            if (img) {
                const productCard = imageContainer.closest('.product-card');
                const productName = productCard?.querySelector('.product-name')?.textContent || 'Producto';
                openImagePreview(img.src, productName);
            }
        });
    });
}