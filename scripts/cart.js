// Helper: Converts product name to ID-safe string
function slugifyProductName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')         // spaces to dashes
        .replace(/[^a-z0-9\-]/g, ''); // remove special characters
}

// Show popup for a specific product
function showPopup(productName) {
    const popupId = `popup-${slugifyProductName(productName)}`;
    const popup = document.getElementById(popupId);

    if (popup) {
        popup.style.display = 'flex';
    } else {
        console.warn(`Popup not found: ${popupId}`);
    }
}

// Close all popups
function closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(p => p.style.display = 'none');
}

// Add item to cart (physical product only)
function addToCart(name, price, quantity = 1) {
    quantity = parseInt(quantity);
    if (quantity <= 0 || isNaN(quantity)) {
        alert("Please select a valid quantity.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find existing item
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name,
            price: parseFloat(price),
            quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showPopup(name); // Show popup after adding to cart
    displayCart();
}

// Display cart contents
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    if (!cartContainer || !totalDisplay) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalDisplay.textContent = "Total: $0.00";
        return;
    }

    cartContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <p><strong>${item.name}</strong></p>
                <p>$${item.price.toFixed(2)} × ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                <div class="cart-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
                </div>
            </div>
        `;
    });

    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Change item quantity
function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newQuantity = cart[index].quantity + change;

    if (newQuantity <= 0) {
        removeItem(index); // Remove the item if the quantity becomes 0 or less
    } else {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Remove item
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Clear cart
function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}

function checkout() {
    // You can optionally validate or send data to a backend here
    document.getElementById('checkout-modal').style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('checkout-modal').style.display = 'none';
  }
  

// Handle cart additions for any product
function handleProductCart(productName, price, quantity) {
    addToCart(productName, price, quantity);
}

// Example usage for products
document.getElementById("add-to-cart-honeywell").addEventListener("click", function() {
    const price = 34.99;
    const quantity = document.getElementById('quantity-honeywell').value || 1;
    handleProductCart("Honeywell TurboForce Wall Fan", price, quantity);
});

document.getElementById("add-to-cart-lamp").addEventListener("click", function() {
    const price = 19.99;
    const quantity = document.getElementById('quantity-lamp').value || 1;
    handleProductCart("Desk Lamp", price, quantity);
});

// Close popups when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('popup')) {
        closePopup();
    }
});
