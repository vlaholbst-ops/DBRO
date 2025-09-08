// Landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Track scroll position and update active navigation
    let ticking = false;
    
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.pageYOffset + headerHeight + 100;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavigation);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add click tracking for form buttons (but don't prevent default behavior)
    const formButtons = document.querySelectorAll('a[href*="forms.yandex.ru"]');
    
    formButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't prevent default - let the link work normally
            
            // Track button clicks (you can integrate with analytics here)
            const buttonText = this.textContent.trim();
            const buttonLocation = this.closest('section')?.className || 'header';
            
            console.log('Form button clicked:', {
                text: buttonText,
                location: buttonLocation,
                timestamp: new Date().toISOString()
            });
            
            // Optional: Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'Form CTA',
                    event_label: buttonText,
                    custom_parameter_location: buttonLocation
                });
            }
            
            // Show brief visual feedback
            const originalText = this.textContent;
            this.textContent = 'Перенаправляем...';
            this.style.opacity = '0.8';
            
            // Reset text quickly since page will navigate away
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 500);
        });
    });
    
    // Add animation on scroll for cards and elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.problem-card, .benefit-card, .solution-step, .step'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add animation CSS
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .problem-card,
        .benefit-card,
        .solution-step,
        .step {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .problem-card.animate-in,
        .benefit-card.animate-in,
        .solution-step.animate-in,
        .step.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-link.active {
            color: var(--color-primary);
            font-weight: 600;
        }
        
        /* Stagger animation for cards */
        .problems-grid .problem-card:nth-child(1).animate-in { transition-delay: 0.1s; }
        .problems-grid .problem-card:nth-child(2).animate-in { transition-delay: 0.2s; }
        .problems-grid .problem-card:nth-child(3).animate-in { transition-delay: 0.3s; }
        .problems-grid .problem-card:nth-child(4).animate-in { transition-delay: 0.4s; }
        
        .benefits-grid .benefit-card:nth-child(1).animate-in { transition-delay: 0.1s; }
        .benefits-grid .benefit-card:nth-child(2).animate-in { transition-delay: 0.2s; }
        .benefits-grid .benefit-card:nth-child(3).animate-in { transition-delay: 0.3s; }
        
        .solution-visual .solution-step:nth-child(1).animate-in { transition-delay: 0.1s; }
        .solution-visual .solution-step:nth-child(3).animate-in { transition-delay: 0.2s; }
        .solution-visual .solution-step:nth-child(5).animate-in { transition-delay: 0.3s; }
        
        .steps-container .step:nth-child(1).animate-in { transition-delay: 0.1s; }
        .steps-container .step:nth-child(2).animate-in { transition-delay: 0.2s; }
        .steps-container .step:nth-child(3).animate-in { transition-delay: 0.3s; }
    `;
    document.head.appendChild(animationStyle);
    
    // Mobile menu functionality (if needed for smaller screens)
    function handleMobileNavigation() {
        const header = document.querySelector('.header');
        
        if (window.innerWidth <= 768) {
            // Add mobile-specific behavior if needed
            let lastScrollY = window.pageYOffset;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.pageYOffset;
                
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            });
        }
    }
    
    // Initialize mobile navigation
    handleMobileNavigation();
    
    // Reinitialize on window resize
    window.addEventListener('resize', handleMobileNavigation);
    
    // Handle other buttons (non-form buttons) with different behavior
    const otherButtons = document.querySelectorAll('.btn:not([href*="forms.yandex.ru"])');
    
    otherButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only handle internal navigation buttons
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                // This is handled by the navigation code above
                return;
            }
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Add keyboard shortcuts if needed
        if (e.key === 'Escape') {
            // Close any modals or overlays if they exist
            const activeElement = document.activeElement;
            if (activeElement && activeElement.blur) {
                activeElement.blur();
            }
        }
    });
    
    // Improve accessibility: announce section changes for screen readers
    function announceSection(sectionName) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Переход к разделу: ${sectionName}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Update navigation announcements
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionId = this.getAttribute('href').substring(1);
            const sectionElement = document.getElementById(sectionId);
            
            if (sectionElement) {
                const sectionTitle = sectionElement.querySelector('h2')?.textContent || sectionId;
                announceSection(sectionTitle);
            }
        });
    });
    
    // Add screen reader only class for accessibility
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(srOnlyStyle);
    
    // Performance optimization: Lazy load images if any are added later
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    console.log('Landing page initialized successfully');
});