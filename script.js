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
    const closeCart = document.querySelector('.close-cart');
    const cartTotal = document.querySelector('.cart-total span:last-child');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Toggle cart overlay
    floatingCart.addEventListener('click', (e) => {
        e.preventDefault();
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const quantity = parseInt(productCard.querySelector('.quantity-input').value);
            
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                quantity: quantity,
                image: productCard.querySelector('.gallery-img.active').src
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
            const quantity = parseInt(productCard.querySelector('.quantity-input').value);
            
            const product = {
                id: Date.now(),
                name: productCard.querySelector('h3').textContent,
                quantity: quantity,
                image: productCard.querySelector('.gallery-img.active').src
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
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        updateCartDisplay();
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
        confirmation.textContent = 'Item added to cart!';
        document.body.appendChild(confirmation);

        setTimeout(() => {
            confirmation.remove();
        }, 2000);
    }

    // Update cart display
    function updateCartDisplay() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        // Add event listeners for quantity buttons
        cartItems.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const item = cart.find(item => item.id === itemId);
                
                if (e.target.classList.contains('plus')) {
                    item.quantity++;
                } else if (e.target.classList.contains('minus')) {
                    if (item.quantity > 1) {
                        item.quantity--;
                    }
                }
                
                updateCartDisplay();
                updateCartCount();
            });
        });

        // Add event listeners for remove buttons
        cartItems.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.remove-item').dataset.id);
                cart = cart.filter(item => item.id !== itemId);
                updateCartDisplay();
                updateCartCount();
            });
        });
    }

    // Checkout functionality
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Format cart items for WhatsApp message
        let message = "Hello! I would like to order the following items:\n\n";
        
        cart.forEach(item => {
            message += `- ${item.name} (${item.quantity}x)\n`;
        });
        
        message += "\nPlease contact me to complete the order.";
        
        // Encode the message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '254707041000';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        // Clear the cart
        cart = [];
        updateCartDisplay();
        updateCartCount();
        cartOverlay.classList.remove('active');
    });

    // Initialize cart display
    updateCartDisplay();
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