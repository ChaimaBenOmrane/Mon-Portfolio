// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// Language Toggle
const langToggle = document.getElementById('lang-toggle');
const langOptions = document.querySelectorAll('.lang-option');
let currentLang = localStorage.getItem('language') || 'fr';

// Set initial language
setLanguage(currentLang);

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    setLanguage(currentLang);
    localStorage.setItem('language', currentLang);
});

function setLanguage(lang) {
    // Update active state on language toggle
    langOptions.forEach(option => {
        if (option.dataset.lang === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Update all elements with language data attributes
    const elements = document.querySelectorAll('[data-fr][data-en]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Check if element is an input or button
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                element.value = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// Smooth Scroll & Active Navigation
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Contact Form Handler with Formspree
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const buttonSpan = submitButton.querySelector('span');
    const originalButtonText = buttonSpan ? buttonSpan.textContent : submitButton.textContent;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    if (buttonSpan) {
        buttonSpan.textContent = currentLang === 'fr' ? 'Envoi...' : 'Sending...';
    } else {
        submitButton.textContent = currentLang === 'fr' ? 'Envoi...' : 'Sending...';
    }
    
    const formData = new FormData(contactForm);
    const formAction = contactForm.getAttribute('action');
    
    // Debug: Afficher les données envoyées
    console.log('📤 Envoi vers Formspree...');
    console.log('URL:', formAction);
    console.log('Name:', formData.get('name'));
    console.log('Email:', formData.get('_replyto'));
    console.log('Subject:', formData.get('_subject'));
    console.log('Message:', formData.get('message'));
    
    try {
        const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('📥 Statut de la réponse:', response.status);
        
        if (response.ok) {
            // Show success message
            const successMessage = currentLang === 'fr' 
                ? '✅ Message envoyé avec succès! Je vous répondrai bientôt.' 
                : '✅ Message sent successfully! I will reply soon.';
            
            alert(successMessage);
            console.log('✅ Succès! Email envoyé à benomranechaima95@gmail.com');
            
            // Reset form
            contactForm.reset();
        } else {
            const data = await response.json();
            console.error('❌ Erreur Formspree:', data);
            
            if (data.errors) {
                throw new Error(data.errors.map(e => e.message).join(', '));
            } else {
                throw new Error('Form submission failed');
            }
        }
    } catch (error) {
        // Show error message
        const errorMessage = currentLang === 'fr' 
            ? '❌ Erreur: ' + error.message 
            : '❌ Error: ' + error.message;
        
        alert(errorMessage);
        console.error('❌ Erreur d\'envoi:', error);
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        if (buttonSpan) {
            buttonSpan.textContent = originalButtonText;
        } else {
            submitButton.textContent = originalButtonText;
        }
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.skill-category, .project-card, .experience-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Cursor Effect (Optional - for desktop)
if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent-primary);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-tag');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Copy Email to Clipboard (Alternative to mailto)
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // You can add a click-to-copy functionality here if needed
    });
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Observe stats section
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Print/Download CV functionality
const cvButtons = document.querySelectorAll('a[download]');
cvButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Track download event
        console.log('CV downloaded:', button.getAttribute('href'));
    });
});

// Easter Egg: Konami Code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Performance: Lazy load images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console Message
console.log('%c👋 Bonjour! / Hello!', 'font-size: 24px; font-weight: bold; color: #c4a962;');
console.log('%cMerci de visiter mon portfolio! / Thanks for visiting my portfolio!', 'font-size: 14px; color: #666;');
console.log('%c💼 Chaima Ben Omrane - Software Engineer & AI Specialist', 'font-size: 12px; font-style: italic;');