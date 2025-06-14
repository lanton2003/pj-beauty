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
            }, 2000);
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

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initImageGalleries();
    initCart();
    initQuantitySelectors();
    initMenuDropdown();
    initBuyNow();
    initWhatsAppChat();
});

// Menu Dropdown functionality
function initMenuDropdown() {
    const menuTrigger = document.querySelector('.menu-trigger');
    const menuContent = document.querySelector('.menu-content');
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

    // Toggle main menu
    menuTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        menuContent.classList.toggle('active');
    });

    // Toggle nested dropdowns
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = trigger.closest('.dropdown');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            // Check if dropdown would go off screen
            const rect = dropdownContent.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            if (rect.right > viewportWidth) {
                dropdownContent.style.transform = 'translateX(-100%)';
                dropdownContent.style.left = 'auto';
                dropdownContent.style.right = '0';
            } else {
                dropdownContent.style.transform = 'translateX(100%)';
                dropdownContent.style.left = '0';
                dropdownContent.style.right = 'auto';
            }
            
            dropdown.classList.toggle('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-dropdown')) {
            menuContent.classList.remove('active');
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.transform = 'none';
                content.style.left = 'auto';
                content.style.right = 'auto';
            });
        }
    });
}

// Emoji animation function
function createEmojiAnimation(emoji, x, y) {
    const emojiElement = document.createElement('div');
    emojiElement.className = 'floating-emoji';
    emojiElement.textContent = emoji;
    emojiElement.style.left = `${x}px`;
    emojiElement.style.top = `${y}px`;
    document.body.appendChild(emojiElement);

    // Random movement
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 2;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    let opacity = 1;

    function animate() {
        const currentX = parseFloat(emojiElement.style.left);
        const currentY = parseFloat(emojiElement.style.top);
        
        emojiElement.style.left = `${currentX + vx}px`;
        emojiElement.style.top = `${currentY + vy}px`;
        opacity -= 0.02;
        emojiElement.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            emojiElement.remove();
        }
    }

    requestAnimationFrame(animate);
}

// Cart functionality
function initCart() {
    const cart = [];
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const floatingCart = document.querySelector('.floating-cart');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top;
            
            // Create multiple emojis
            const emojis = ['🛍️', '✨', '💫', '🌟'];
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    createEmojiAnimation(emojis[i], x, y);
                }, i * 200);
            }

            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const quantity = parseInt(productCard.querySelector('.quantity-input').value);
            const productImage = productCard.querySelector('.gallery-img.active').src;
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.name === productName);
            
            if (existingItemIndex > -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += quantity;
                showCartConfirmation('Item quantity updated in cart!');
            } else {
                // Add new item if it doesn't exist
                cart.push({
                    name: productName,
                    quantity: quantity,
                    image: productImage
                });
                showCartConfirmation('Item added to cart!');
            }
            
            // Update cart display
            updateCartDisplay();
        });
    });

    // Update cart display
    function updateCartDisplay() {
        // Update cart count
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <button class="remove-item" data-name="${item.name}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Add remove functionality
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.dataset.name;
                const index = cart.findIndex(item => item.name === itemName);
                if (index > -1) {
                    cart.splice(index, 1);
                    updateCartDisplay();
                }
            });
        });
    }

    // Toggle cart overlay
    floatingCart.addEventListener('click', function(e) {
        e.preventDefault();
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', function() {
        cartOverlay.classList.remove('active');
    });

    // Close cart when clicking outside
    cartOverlay.addEventListener('click', function(e) {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    });

    // Checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showCartConfirmation('Your cart is empty!');
            return;
        }

        // Create WhatsApp message with cart items
        let message = 'Hello! I would like to purchase the following items:\n\n';
        cart.forEach(item => {
            message += `- ${item.name} (Quantity: ${item.quantity})\n`;
        });
        message += '\nPlease confirm availability and total price.';

        // Encode message and create WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '254707041000';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
    });
}

// Show cart confirmation message
function showCartConfirmation(message) {
    const confirmation = document.createElement('div');
    confirmation.className = 'cart-confirmation';
    confirmation.textContent = message;
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

// Quantity selector functionality
function initQuantitySelectors() {
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('.quantity-input');

        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
        });

        input.addEventListener('change', () => {
            if (parseInt(input.value) < 1) {
                input.value = 1;
            }
        });
    });
}

// Buy Now functionality
function initBuyNow() {
    const buyNowButtons = document.querySelectorAll('.buy-now');
    
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top;
            
            // Create multiple emojis
            const emojis = ['💝', '💖', '💗', '💓'];
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    createEmojiAnimation(emojis[i], x, y);
                }, i * 200);
            }

            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const quantity = parseInt(productCard.querySelector('.quantity-input').value);
            
            // Create WhatsApp message
            const message = `Hello! I would like to buy:\n\nProduct: ${productName}\nQuantity: ${quantity}\n\nPlease confirm availability and price.`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = '254707041000';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
        });
    });
}

// Initialize WhatsApp chat
function initWhatsAppChat() {
    const whatsappButton = document.querySelector('.floating-whatsapp');
    const chatContainer = document.querySelector('.chat-container');
    const chatWindow = document.querySelector('.chat-window');
    const closeChat = document.querySelector('.close-chat');
    const sendButton = document.querySelector('.send-message');
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Toggle chat window
    whatsappButton.addEventListener('click', function() {
        chatContainer.classList.toggle('active');
    });

    closeChat.addEventListener('click', function() {
        chatContainer.classList.remove('active');
    });

    // Send message to WhatsApp
    function sendToWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '254707041000';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            sendToWhatsApp(message);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add welcome message
    addMessage('Welcome to Jelly Beauty! How can we help you today?', 'system');
}
