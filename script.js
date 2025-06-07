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
    initProfileDropdown();
});

// Profile Dropdown functionality
function initProfileDropdown() {
    const profileTrigger = document.querySelector('.profile-trigger');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

    // Toggle main dropdown
    profileTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        profileDropdown.classList.toggle('active');
    });

    // Toggle nested dropdowns
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = trigger.closest('.dropdown');
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-dropdown')) {
            profileDropdown.classList.remove('active');
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

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
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItems = document.querySelector('.cart-items');
    const floatingCart = document.querySelector('.floating-cart');

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const stockCount = parseInt(productCard.querySelector('.stock-count').textContent);
            
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                price: price,
                quantity: 1,
                maxStock: stockCount,
                image: productCard.querySelector('img').src
            };
            
            addToCart(product);
            updateCartCount();
            showCartConfirmation();
        });
    });

    // Buy Now functionality
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const stockCount = parseInt(productCard.querySelector('.stock-count').textContent);
            
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                price: price,
                quantity: 1,
                maxStock: stockCount,
                image: productCard.querySelector('img').src
            };
            
            // Clear cart and add only this product
            cart = [product];
            updateCartCount();
            updateCartDisplay();
            
            // Open cart overlay
            cartOverlay.classList.add('active');
            
            // Show confirmation
            showCartConfirmation();
        });
    });

    // Add item to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            if (existingItem.quantity < existingItem.maxStock) {
                existingItem.quantity += product.quantity;
                if (existingItem.quantity > existingItem.maxStock) {
                    existingItem.quantity = existingItem.maxStock;
                }
            } else {
                showStockLimitMessage();
            }
        } else {
            cart.push(product);
        }
        
        updateCartDisplay();
    }

    // Show stock limit message
    function showStockLimitMessage() {
        const confirmation = document.createElement('div');
        confirmation.className = 'cart-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <i class="fas fa-exclamation-circle"></i>
                <p>Stock limit reached!</p>
            </div>
        `;
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            confirmation.remove();
        }, 2000);
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Show cart confirmation
    function showCartConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'cart-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <i class="fas fa-check-circle"></i>
                <p>Item added to cart!</p>
            </div>
        `;
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            confirmation.remove();
        }, 2000);
    }

    // Update cart display
    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">KES ${item.price.toLocaleString()}</p>
                    <p class="stock-info">Available: ${item.maxStock} units</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="${item.maxStock}" readonly>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Update total amount
        const totalElement = document.querySelector('.cart-total');
        if (totalElement) {
            totalElement.innerHTML = `
                <span>Total:</span>
                <span>KES ${total.toLocaleString()}</span>
            `;
        }
    }

    // Toggle cart overlay
    floatingCart.addEventListener('click', (e) => {
        e.preventDefault();
        cartOverlay.classList.toggle('active');
        updateCartDisplay();
    });

    // Close cart overlay
    document.querySelector('.close-cart').addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    // Handle quantity changes in cart
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const button = e.target;
            const itemId = parseInt(button.dataset.id);
            const item = cart.find(item => item.id === itemId);
            
            if (button.classList.contains('plus')) {
                if (item.quantity < item.maxStock) {
                    item.quantity += 1;
                } else {
                    showStockLimitMessage();
                }
            } else if (button.classList.contains('minus')) {
                item.quantity = Math.max(1, item.quantity - 1);
            }
            
            updateCartCount();
            updateCartDisplay();
        }
    });

    // Remove item from cart
    cartItems.addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const itemId = parseInt(e.target.closest('.remove-item').dataset.id);
            cart = cart.filter(item => item.id !== itemId);
            updateCartCount();
            updateCartDisplay();
        }
    });

    // Close cart when clicking outside
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
        }
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
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Handle dropdowns in mobile view
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
});

// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('.floating-whatsapp');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-message');
    const chatMessages = document.querySelector('.chat-messages');
    const notificationBadge = document.querySelector('.notification-badge');
    
    let unreadMessages = 0;
    const whatsappNumber = '254707041000'; // Your WhatsApp number

    // Toggle chat window
    whatsappButton.addEventListener('click', () => {
        chatContainer.classList.add('active');
        whatsappButton.classList.add('hidden'); // Use class instead of style
        if (chatContainer.classList.contains('active')) {
            unreadMessages = 0;
            updateNotificationBadge();
        }
    });

    // Close chat window
    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        whatsappButton.classList.remove('hidden'); // Remove class instead of style
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

// Celebration Animation
function createCelebration(x, y) {
    const emojis = ['🎉', '✨', '🎊', '🌟', '💫', '🎈', '🎁', '🎯', '🎨', '🎭', '🎪', '🎡', '🎠', '🎢', '🎪', '🎨', '🎭', '🎪', '🎡', '🎠'];
    const container = document.createElement('div');
    container.className = 'celebration-container';
    document.body.appendChild(container);

    // Create 30 emojis
    for (let i = 0; i < 30; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'celebration-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random starting position around the click point
        const angle = (Math.random() * Math.PI * 2);
        const distance = Math.random() * 100;
        const startX = x + Math.cos(angle) * distance;
        const startY = y + Math.sin(angle) * distance;
        
        // Random end position (spread all over the screen)
        const endX = (Math.random() - 0.5) * window.innerWidth * 2;
        const endY = (Math.random() - 0.5) * window.innerHeight * 2;
        
        // Random rotation
        const rotation = (Math.random() - 0.5) * 720; // Random rotation between -360 and 360 degrees
        
        emoji.style.left = `${startX}px`;
        emoji.style.top = `${startY}px`;
        emoji.style.setProperty('--tx', `${endX}px`);
        emoji.style.setProperty('--ty', `${endY}px`);
        emoji.style.setProperty('--tr', `${rotation}deg`);
        
        // Random animation duration between 3 and 4 seconds
        emoji.style.animationDuration = `${3 + Math.random()}s`;
        
        container.appendChild(emoji);
    }

    // Remove the container after animation
    setTimeout(() => {
        container.remove();
    }, 4000);
}

// Add click event listener to Shop Now buttons
document.addEventListener('DOMContentLoaded', function() {
    const shopNowButton = document.querySelector('.cta-button');
    if (shopNowButton) {
        shopNowButton.addEventListener('click', (e) => {
            createCelebration(e.clientX, e.clientY);
        });
    }
}); 