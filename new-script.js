// Improved preloader functionality for faster loading
// Show content as soon as critical elements are loaded
document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById("preloader");
    
    // Hide preloader faster - reduced from 1500ms to 800ms
    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 300);
        }
    }, 800);
});

// Handle video loading separately to prevent it from blocking page display
window.addEventListener("load", function () {
    // Check for video loading issues
    const heroVideo = document.querySelector('.video-container video');
    if (heroVideo) {
        // Add error handling for video
        heroVideo.addEventListener('error', function(e) {
            console.log('Video loading error, using fallback background');
            // Apply a fallback background image if video fails to load
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.style.backgroundImage = 'url("https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")';
                videoContainer.style.backgroundSize = 'cover';
                videoContainer.style.backgroundPosition = 'center';
                // Hide the video element
                heroVideo.style.display = 'none';
            }
        });
    }
    
    // Initialize AOS animation library with error handling
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        } else {
            console.log('AOS library not loaded, animations will be disabled');
        }
    } catch (error) {
        console.log('Error initializing AOS:', error);
    }
});

// Initialize all components when DOM is loaded with error handling
document.addEventListener('DOMContentLoaded', function() {
    // Check for external resource availability
    checkExternalResources();
    
    // Initialize components with error handling
    try { initDarkMode(); } catch (e) { console.error('Error initializing dark mode:', e); }
    try { initNavigation(); } catch (e) { console.error('Error initializing navigation:', e); }
    try { initScrollAnimations(); } catch (e) { console.error('Error initializing scroll animations:', e); }
    try { initSearchBar(); } catch (e) { console.error('Error initializing search bar:', e); }
    try { initMenuFilter(); } catch (e) { console.error('Error initializing menu filter:', e); }
    try { initTestimonialCarousel(); } catch (e) { console.error('Error initializing testimonial carousel:', e); }
    try { initBackToTop(); } catch (e) { console.error('Error initializing back to top button:', e); }
    try { initReservationForm(); } catch (e) { console.error('Error initializing reservation form:', e); }
    try { initContactForm(); } catch (e) { console.error('Error initializing contact form:', e); }
});

// Function to check external resources
function checkExternalResources() {
    // Check for image loading issues
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            console.log('Error loading image:', img.src);
            // Set a fallback image
            img.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
        };
    });
    
    // Check for font awesome availability
    if (typeof FontAwesome === 'undefined' && document.querySelector('.fas, .fab, .far')) {
        console.log('Font Awesome not loaded, adding fallback');
        const fontAwesomeFallback = document.createElement('link');
        fontAwesomeFallback.rel = 'stylesheet';
        fontAwesomeFallback.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(fontAwesomeFallback);
    }
}

// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Check for saved user preference
    const darkMode = localStorage.getItem('darkMode');
    
    // If dark mode was previously enabled, turn it on
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', () => {
        // Toggle dark mode
        body.classList.toggle('dark-mode');
        
        // Save user preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', null);
        }
    });
}

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                }
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Search bar functionality
function initSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    
    if (searchInput && searchSuggestions) {
        // Show suggestions when input is focused
        searchInput.addEventListener('focus', function() {
            searchSuggestions.style.display = 'block';
        });
        
        // Hide suggestions when clicked outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });
        
        // Handle input changes
        searchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                searchSuggestions.style.display = 'block';
                // In a real app, you would fetch suggestions from the server here
            } else {
                searchSuggestions.style.display = 'none';
            }
        });
        
        // Handle suggestion clicks
        const suggestionItems = document.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(item => {
            item.addEventListener('click', function() {
                searchInput.value = this.querySelector('span').textContent;
                searchSuggestions.style.display = 'none';
                // In a real app, you would redirect to search results page
            });
        });
    }
}

// Menu filter functionality
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (filterButtons.length > 0 && menuItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter menu items
                menuItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'flex';
                        
                        // Add animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const menuItem = this.closest('.menu-item');
                const itemName = menuItem.querySelector('h3').textContent;
                const itemPrice = menuItem.querySelector('.price').textContent;
                
                // Show a confirmation message
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Added';
                this.style.backgroundColor = '#4CAF50';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
                
                // In a real app, you would add the item to the cart here
                console.log(`Added to cart: ${itemName} - ${itemPrice}`);
            });
        });
    }
}

// Testimonial carousel functionality
function initTestimonialCarousel() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    if (testimonialItems.length > 0) {
        let currentIndex = 0;
        
        // Function to show testimonial at index
        function showTestimonial(index) {
            // Hide all testimonials
            testimonialItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show testimonial at index
            testimonialItems[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        // Next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % testimonialItems.length;
                showTestimonial(currentIndex);
            });
        }
        
        // Previous button click
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + testimonialItems.length) % testimonialItems.length;
                showTestimonial(currentIndex);
            });
        }
        
        // Dot click
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentIndex = index;
                showTestimonial(currentIndex);
            });
        });
        
        // Auto slide every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            showTestimonial(currentIndex);
        }, 5000);
    }
}

// Scroll animations for sections
function initScrollAnimations() {
    // This is now handled by AOS library
    
    // Add animation to gallery items on hover
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.gallery-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.gallery-overlay').style.opacity = '0';
        });
    });
}

// Back to top button functionality
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Reservation form functionality
function initReservationForm() {
    const reservationForm = document.querySelector('.reservation-form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const occasion = document.getElementById('occasion').value;
            const specialRequest = document.getElementById('special-request').value;
            
            // Validate form
            if (!name || !email || !phone || !date || !time || !guests) {
                alert('Please fill in all required fields');
                return;
            }
            
            // In a real app, you would send the form data to the server here
            console.log('Reservation submitted:', {
                name,
                email,
                phone,
                date,
                time,
                guests,
                occasion,
                specialRequest
            });
            
            // Show success message
            alert('Thank you for your reservation! We will confirm shortly.');
            
            // Reset form
            reservationForm.reset();
        });
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            // Validate form
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real app, you would send the form data to the server here
            console.log('Contact form submitted:', {
                name,
                email,
                subject,
                message
            });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Newsletter form functionality
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            // In a real app, you would send the email to the server here
            console.log('Newsletter subscription:', email);
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            
            // Reset form
            newsletterForm.reset();
        });
    }
}