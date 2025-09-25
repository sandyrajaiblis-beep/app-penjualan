document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const productSearch = document.getElementById('product_search');
    const productSearchResults = document.getElementById('product_search_results');
    const productId = document.getElementById('product_id');
    const quantity = document.getElementById('quantity');
    const addToCartBtn = document.getElementById('add_to_cart');
    const cartItems = document.getElementById('cart_items');
    const cartTotal = document.getElementById('cart_total');
    const clearCartBtn = document.getElementById('clear_cart');
    const processSaleBtn = document.getElementById('process_sale');
    
    // Cart data
    let cart = [];
    
    // Product data (for search functionality)
    const products = [];
    const productOptions = productId.querySelectorAll('option');
    
    productOptions.forEach(option => {
        if (option.value) {
            products.push({
                id: option.value,
                name: option.text.split(' (')[0],
                price: parseFloat(option.getAttribute('data-harga')),
                stock: parseInt(option.getAttribute('data-stok'))
            });
        }
    });
    
    // Search products
    productSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            productSearchResults.style.display = 'none';
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        
        if (filteredProducts.length > 0) {
            productSearchResults.innerHTML = '';
            
            filteredProducts.forEach(product => {
                const div = document.createElement('div');
                div.className = 'product-search-result';
                div.textContent = `${product.name} (Rp ${product.price.toLocaleString('id-ID')}, Stok: ${product.stock})`;
                div.addEventListener('click', function() {
                    productId.value = product.id;
                    quantity.value = 1;
                    productSearch.value = '';
                    productSearchResults.style.display = 'none';
                });
                
                productSearchResults.appendChild(div);
            });
            
            productSearchResults.style.display = 'block';
        } else {
            productSearchResults.style.display = 'none';
        }
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!productSearch.contains(e.target) && !productSearchResults.contains(e.target)) {
            productSearchResults.style.display = 'none';
        }
    });
    
    // Add to cart
    addToCartBtn.addEventListener('click', function() {
        const selectedProductId = productId.value;
        const selectedQuantity = parseInt(quantity.value);
        
        if (!selectedProductId) {
            alert('Silakan pilih produk terlebih dahulu!');
            return;
        }
        
        if (selectedQuantity <= 0) {
            alert('Jumlah harus lebih dari 0!');
            return;
        }
        
        // Get product details
        const selectedOption = productId.options[productId.selectedIndex];
        const productName = selectedOption.text.split(' (')[0];
        const productPrice = parseFloat(selectedOption.getAttribute('data-harga'));
        const productStock = parseInt(selectedOption.getAttribute('data-stok'));
        
        // Check stock
        if (selectedQuantity > productStock) {
            alert(`Stok tidak mencukupi! Stok tersedia: ${productStock}`);
            return;
        }
        
        // Check if product already in cart
        const existingItemIndex = cart.findIndex(item => item.id === selectedProductId);
        
        if (existingItemIndex !== -1) {
            // Update quantity if already in cart
            const newQuantity = cart[existingItemIndex].qty + selectedQuantity;
            
            if (newQuantity > productStock) {
                alert(`Stok tidak mencukupi! Stok tersedia: ${productStock}`);
                return;
            }
            
            cart[existingItemIndex].qty = newQuantity;
            cart[existingItemIndex].subtotal = newQuantity * productPrice;
        } else {
            // Add new item to cart
            cart.push({
                id: selectedProductId,
                name: productName,
                harga: productPrice,
                qty: selectedQuantity,
                subtotal: selectedQuantity * productPrice
            });
        }
        
        // Reset form
        productId.value = '';
        quantity.value = 1;
        
        // Update cart display
        updateCartDisplay();
    });
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja masih kosong</p>';
            cartTotal.textContent = 'Rp 0';
            return;
        }
        
        let html = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rp ${item.harga.toLocaleString('id-ID')} x ${item.qty}</div>
                    </div>
                    <div class="cart-item-subtotal">Rp ${item.subtotal.toLocaleString('id-ID')}</div>
                    <div class="cart-item-remove" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `;
            
            total += item.subtotal;
        });
        
        cartItems.innerHTML = html;
        cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartDisplay();
            });
        });
    }
    
    // Clear cart
    clearCartBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?')) {
            cart = [];
            updateCartDisplay();
        }
    });
    
    // Process sale
    processSaleBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Keranjang belanja masih kosong!');
            return;
        }
        
        // Create form to submit sale data
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'process_sale.php';
        
        // Add invoice number
        const invoiceNo = document.createElement('input');
        invoiceNo.type = 'hidden';
        invoiceNo.name = 'invoice_no';
        invoiceNo.value = document.getElementById('invoice_no').value;
        form.appendChild(invoiceNo);
        
        // Add customer ID
        const customerId = document.createElement('input');
        customerId.type = 'hidden';
        customerId.name = 'customer_id';
        customerId.value = document.getElementById('customer_id').value;
        form.appendChild(customerId);
        
        // Add payment method
        const paymentMethod = document.createElement('input');
        paymentMethod.type = 'hidden';
        paymentMethod.name = 'pembayaran_method';
        paymentMethod.value = document.getElementById('pembayaran_method').value;
        form.appendChild(paymentMethod);
        
        // Add cart items as JSON
        const cartItemsInput = document.createElement('input');
        cartItemsInput.type = 'hidden';
        cartItemsInput.name = 'cart_items';
        cartItemsInput.value = JSON.stringify(cart);
        form.appendChild(cartItemsInput);
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
    });
});