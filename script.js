// Function to handle image gallery switching
function initImageGalleries() {
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-img');
        const dots = gallery.querySelectorAll('.dot');
        let currentIndex = 0;
        let intervalId;
        
        // Function to switch to a specific image
        function switchImage(index) {
            // Remove active class from all images and dots
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current image and dot
            images[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentIndex = index;
        }
        
        // Function to start auto-switching
        function startAutoSwitch() {
            intervalId = setInterval(() => {
                const nextIndex = (currentIndex + 1) % images.length;
                switchImage(nextIndex);
            }, 2000); // Changed to 2 seconds
        }
        
        // Function to stop auto-switching
        function stopAutoSwitch() {
            clearInterval(intervalId);
        }
        
        // Set up click handlers for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                switchImage(index);
            });
        });

        // Set up click handler for images to show larger view
        gallery.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            
            const container = document.createElement('div');
            container.className = 'overlay-container';
            
            // Create a wrapper for the images
            const imagesWrapper = document.createElement('div');
            imagesWrapper.className = 'overlay-images-wrapper';
            
            // Add all images to the overlay
            images.forEach((img) => {
                const overlayImg = document.createElement('img');
                overlayImg.src = img.src;
                overlayImg.alt = img.alt;
                overlayImg.className = 'overlay-img';
                imagesWrapper.appendChild(overlayImg);
            });
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-overlay';
            closeBtn.innerHTML = '&times;';
            
            container.appendChild(imagesWrapper);
            container.appendChild(closeBtn);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
            
            // Prevent scrolling when overlay is open
            document.body.style.overflow = 'hidden';
            
            // Close overlay when clicking close button or outside the image
            closeBtn.addEventListener('click', () => {
                overlay.remove();
                document.body.style.overflow = '';
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Start auto-switching
        startAutoSwitch();
        
        // Pause auto-switching when hovering over gallery
        gallery.addEventListener('mouseenter', stopAutoSwitch);
        gallery.addEventListener('mouseleave', startAutoSwitch);
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initImageGalleries();
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-container input');
    const productCards = document.querySelectorAll('.product-card');

    // Toggle search overlay
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.style.display = 'flex';
        searchInput.focus();
    });

    // Close search overlay
    closeSearch.addEventListener('click', function() {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDescription = card.querySelector('.description').textContent.toLowerCase();
            const productTags = card.querySelector('.tag').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || 
                productDescription.includes(searchTerm) || 
                productTags.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Cart functionality
    let cart = [];
    const cartCount = document.querySelector('.cart-count');

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.price').textContent,
                quantity: parseInt(productCard.querySelector('.quantity-input').value),
                image: productCard.querySelector('.gallery-img.active').src
            };

            // Check if product is already in cart
            const existingProduct = cart.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                cart.push(product);
            }

            // Update cart count
            updateCartCount();

            // Show confirmation
            showAddToCartConfirmation(product.name);
        });
    });

    // Buy Now functionality
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.price').textContent,
                quantity: parseInt(productCard.querySelector('.quantity-input').value),
                image: productCard.querySelector('.gallery-img.active').src
            };

            // Clear cart and add only this product
            cart = [product];
            updateCartCount();
            
            // Show cart and proceed to checkout
            cartOverlay.classList.add('active');
            updateCartView();
            
            // Automatically click checkout button after a short delay
            setTimeout(() => {
                document.querySelector('.checkout-btn').click();
            }, 500);
        });
    });

    // Quantity selector functionality
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('.quantity-input');
        const stockCount = parseInt(selector.closest('.product-card').querySelector('.stock-count').textContent);

        minusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value < stockCount) {
                input.value = value + 1;
            }
        });

        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (value < 1) input.value = 1;
            if (value > stockCount) input.value = stockCount;
        });
    });

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Show add to cart confirmation
    function showAddToCartConfirmation(productName) {
        const confirmation = document.createElement('div');
        confirmation.className = 'cart-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <i class="fas fa-check-circle"></i>
                <p>${productName} added to cart</p>
            </div>
        `;
        document.body.appendChild(confirmation);

        // Remove confirmation after 2 seconds
        setTimeout(() => {
            confirmation.remove();
        }, 2000);
    }

    // Cart view functionality
    const cartIcon = document.querySelector('.nav-icons a[href="#cart"]');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');

    // Toggle cart view
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartOverlay.classList.add('active');
        updateCartView();
    });

    // Close cart view
    closeCart.addEventListener('click', function() {
        cartOverlay.classList.remove('active');
    });

    // Update cart view
    function updateCartView() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            totalAmount.textContent = 'KES 0';
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-name="${item.name}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="99">
                        <button class="increase-quantity">+</button>
                    </div>
                </div>
                <button class="remove-item"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');

        // Add event listeners for quantity buttons and remove buttons
        cartItems.querySelectorAll('.cart-item').forEach(item => {
            const name = item.dataset.name;
            const decreaseBtn = item.querySelector('.decrease-quantity');
            const increaseBtn = item.querySelector('.increase-quantity');
            const quantityInput = item.querySelector('input');
            const removeBtn = item.querySelector('.remove-item');

            decreaseBtn.addEventListener('click', () => {
                const cartItem = cart.find(i => i.name === name);
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                    quantityInput.value = cartItem.quantity;
                    updateCartCount();
                    updateCartView();
                }
            });

            increaseBtn.addEventListener('click', () => {
                const cartItem = cart.find(i => i.name === name);
                cartItem.quantity++;
                quantityInput.value = cartItem.quantity;
                updateCartCount();
                updateCartView();
            });

            quantityInput.addEventListener('change', () => {
                const cartItem = cart.find(i => i.name === name);
                const value = parseInt(quantityInput.value);
                if (value > 0) {
                    cartItem.quantity = value;
                    updateCartCount();
                    updateCartView();
                }
            });

            removeBtn.addEventListener('click', () => {
                cart = cart.filter(i => i.name !== name);
                updateCartCount();
                updateCartView();
            });
        });

        // Update total amount
        const total = cart.reduce((sum, item) => {
            const price = parseInt(item.price.replace(/[^0-9]/g, ''));
            return sum + (price * item.quantity);
        }, 0);
        totalAmount.textContent = `KES ${total}`;
    }

    // Checkout button functionality
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Thank you for your purchase! We will contact you shortly.');
            cart = [];
            updateCartCount();
            updateCartView();
            cartOverlay.classList.remove('active');
        }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-message');
    const chatMessages = document.querySelector('.chat-messages');
    const notificationBadge = document.querySelector('.notification-badge');
    
    let unreadMessages = 0;
    const whatsappNumber = '254707041000'; // Your WhatsApp number

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            unreadMessages = 0;
            updateNotificationBadge();
        }
    });

    // Close chat window
    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';

            // Send to WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Update notification badge if chat is closed
        if (!chatContainer.classList.contains('active') && type === 'seller') {
            unreadMessages++;
            updateNotificationBadge();
        }
    }

    // Update notification badge
    function updateNotificationBadge() {
        if (unreadMessages > 0) {
            notificationBadge.textContent = unreadMessages;
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
    }

    // Simulate seller response (for demo purposes)
    function simulateSellerResponse() {
        setTimeout(() => {
            addMessage('Thank you for your message! We will get back to you shortly.', 'seller');
        }, 1000);
    }

    // Listen for messages from WhatsApp (this would need to be implemented with a backend service)
    // For demo purposes, we'll simulate a response
    sendButton.addEventListener('click', simulateSellerResponse);
});

// Mobile Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let startX, moveX;
    let isDragging = false;

    // Touch events for mobile swipe
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveX = e.touches[0].clientX;
        const diff = moveX - startX;
        track.style.transform = `translateX(${diff}px)`;
    });

    track.addEventListener('touchend', () => {
        isDragging = false;
        const diff = moveX - startX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < slides.length - 1) {
                currentIndex++;
            }
        }
        
        updateCarousel();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    function updateCarousel() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Initialize carousel
    updateCarousel();
}); 