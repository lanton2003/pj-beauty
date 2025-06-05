document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const productCards = document.querySelectorAll('.product-card');
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const hoverOverlay = document.querySelector('.image-hover-overlay');
    const hoverContainer = document.querySelector('.hover-images-container');
    const closeHover = document.querySelector('.close-hover');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Search functionality
    searchToggle?.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch?.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });

    searchOverlay?.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });

    // Optimized search form submission
    searchForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        const firstMatch = Array.from(productCards).find(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('.description').textContent.toLowerCase();
            return productName.includes(searchTerm) || productDesc.includes(searchTerm);
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert('No products found matching your search.');
        }
        searchOverlay.classList.remove('active');
    });

    // Optimized quantity selector
    productCards.forEach(card => {
        const quantityBtns = card.querySelectorAll('.quantity-btn');
        const input = card.querySelector('.quantity-input');
        const stockCount = parseInt(card.querySelector('.stock-count').textContent);
        const addToCartBtn = card.querySelector('.add-to-cart');

        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                let value = parseInt(input.value);
                value = this.classList.contains('plus') 
                    ? Math.min(value + 1, Math.min(10, stockCount))
                    : Math.max(value - 1, 1);
                input.value = value;
            });
        });

        // Optimized add to cart
        addToCartBtn?.addEventListener('click', function() {
            const quantity = parseInt(input.value);
            if (quantity > stockCount) {
                alert('Sorry, not enough stock available!');
                return;
            }
            
            const newStock = stockCount - quantity;
            card.querySelector('.stock-count').textContent = newStock;
            
            const stockMessage = card.querySelector('.stock');
            if (newStock === 0) {
                stockMessage.innerHTML = '<span class="out-of-stock">Out of Stock</span>';
                this.disabled = true;
                this.textContent = 'Out of Stock';
            } else {
                stockMessage.innerHTML = `In Stock: <span class="stock-count">${newStock}</span> units`;
            }
            
            alert(`${quantity} ${card.querySelector('h3').textContent}(s) added to cart!`);
        });

        // Optimized image gallery
        const gallery = card.querySelector('.image-gallery');
        if (gallery) {
            const images = gallery.querySelectorAll('.gallery-img');
            const dots = gallery.querySelectorAll('.dot');
            let currentImageIndex = 0;
            let galleryInterval;

            function showImage(index) {
                images.forEach(img => img.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                images[index].classList.add('active');
                dots[index].classList.add('active');
                currentImageIndex = index;
            }

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => showImage(index));
            });

            // Start auto-rotation only when gallery is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        galleryInterval = setInterval(() => {
                            showImage((currentImageIndex + 1) % images.length);
                        }, 3000);
                    } else {
                        clearInterval(galleryInterval);
                    }
                });
            });
            observer.observe(gallery);
        }
    });

    // Optimized image hover functionality
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG' || e.target.closest('.image-gallery')) {
                const images = Array.from(card.querySelectorAll('img'));
                hoverContainer.innerHTML = images.map(img => 
                    `<img src="${img.src}" alt="${img.alt}" class="hover-image">`
                ).join('');
                hoverOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeHover?.addEventListener('click', () => {
        hoverOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    hoverOverlay?.addEventListener('click', (e) => {
        if (e.target === hoverOverlay) {
            hoverOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Optimized filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            productCards.forEach(card => {
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
                card.style.display = filterValue === 'all' || tags.includes(filterValue) ? 'block' : 'none';
            });
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        if (email) {
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        }
    });

    // Smooth scrolling for product links
    const productLinks = document.querySelectorAll('a[href="#products"]');
    productLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const featuredProducts = document.querySelector('#featured-products');
            if (featuredProducts) {
                featuredProducts.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Image Gallery Functionality
    const specialProduct = document.querySelector('.special-product');
    if (specialProduct) {
        const images = specialProduct.querySelectorAll('.gallery-img');
        const dots = specialProduct.querySelectorAll('.dot');
        let currentImageIndex = 0;

        // Function to show image
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            images[index].classList.add('active');
            dots[index].classList.add('active');
            currentImageIndex = index;
        }

        // Click event for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showImage(index);
            });
        });

        // Auto-rotate images every 3 seconds
        setInterval(() => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            showImage(nextIndex);
        }, 3000);

        // Touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        specialProduct.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        specialProduct.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left
                const nextIndex = (currentImageIndex + 1) % images.length;
                showImage(nextIndex);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right
                const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
                showImage(prevIndex);
            }
        }
    }

    // Close overlay on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hoverOverlay.classList.contains('active')) {
            hoverOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}); 