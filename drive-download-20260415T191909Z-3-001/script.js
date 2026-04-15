// script.js
// Mobile Menu Toggle Logic
function toggleMenu() {
    if (window.innerWidth <= 768) {
        const navLinks = document.getElementById('navLinks');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        navLinks.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            menuBtn.innerText = '✕';
        } else {
            menuBtn.innerText = '☰';
        }
    }
}

// Header Style Update on Scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.padding = '0.8rem 5%';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1.2rem 5%';
            header.style.boxShadow = 'none';
        }
    }
});

// Simple form handling simulation
function submitForm(event) {
    event.preventDefault();
    alert("Thank you! Your quote request has been received. Colton will reach out shortly to discuss your project.");
}

// Intersection Observer logic to trigger cool "fade-in-up" animations when scrolling down
document.addEventListener("DOMContentLoaded", function() {
    // Set active nav link based on current path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Match base name or exact link for the active state
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused'; 
        observer.observe(el);
    });

    // --- Lightbox Functionality ---
    const itemsToEnlarge = Array.from(document.querySelectorAll('.gallery-item, .color-item img'));
    if (itemsToEnlarge.length > 0) {
        let currentIndex = 0;
        
        // Extract all image sources
        const imageSources = itemsToEnlarge.map(item => {
            const img = item.tagName === 'IMG' ? item : item.querySelector('img');
            return img ? img.src : null;
        }).filter(src => src !== null);

        // Create lightbox DOM elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const lightboxClose = document.createElement('button');
        lightboxClose.className = 'lightbox-close';
        lightboxClose.innerHTML = '&times;';
        lightboxClose.setAttribute('aria-label', 'Close Image');
        
        const lightboxImg = document.createElement('img');
        lightboxImg.className = 'lightbox-img';
        
        const btnPrev = document.createElement('button');
        btnPrev.className = 'lightbox-prev';
        btnPrev.innerHTML = '&#10094;'; // Left Arrow
        
        const btnNext = document.createElement('button');
        btnNext.className = 'lightbox-next';
        btnNext.innerHTML = '&#10095;'; // Right Arrow
        
        lightbox.appendChild(btnPrev);
        lightbox.appendChild(btnNext);
        lightbox.appendChild(lightboxClose);
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);
        
        // Handlers
        const updateLightboxImage = (index) => {
            currentIndex = index;
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = imageSources[currentIndex];
                lightboxImg.style.opacity = '1';
            }, 150); // Small fade effect for transition
        };

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = imageSources[currentIndex];
            lightbox.classList.add('active');
            lightboxImg.style.opacity = '1';
            document.body.style.overflow = 'hidden'; // prevent scrolling
        };
        
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300); // clear src after fade out
            document.body.style.overflow = '';
        };
        
        const showNext = () => {
            const nextIndex = (currentIndex + 1) % imageSources.length;
            updateLightboxImage(nextIndex);
        };
        
        const showPrev = () => {
            const prevIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
            updateLightboxImage(prevIndex);
        };

        // Attach click listeners to all items
        let validImageIndex = 0;
        itemsToEnlarge.forEach(item => {
            const img = item.tagName === 'IMG' ? item : item.querySelector('img');
            if (img && img.src) {
                const capturedIndex = validImageIndex++;
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    openLightbox(capturedIndex);
                });
            }
        });
        
        // Navigation listeners
        btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        btnNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }
});
