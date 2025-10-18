// =================================
// Mobile Navigation Toggle
// =================================
const navHamburger = document.querySelector('.nav-hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navHamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navHamburger.classList.toggle('active');

    const isExpanded = navHamburger.getAttribute('aria-expanded') === 'true';
    navHamburger.setAttribute('aria-expanded', !isExpanded);
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navHamburger.classList.remove('active');
        navHamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navHamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        navHamburger.classList.remove('active');
        navHamburger.setAttribute('aria-expanded', 'false');
    }
});

// =================================
// Active Navigation Link on Scroll
// =================================
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// =================================
// Smooth Scrolling for Navigation Links
// =================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Smooth scroll for CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = ctaButton.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Smooth scroll for back to top button
const backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =================================
// Intersection Observer for Fade-in Animation
// =================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(element => {
    observer.observe(element);
});

// Observe cards and elements within sections
const cardsToAnimate = document.querySelectorAll('.project-card, .education-card, .lab-card');
cardsToAnimate.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// =================================
// Contact Form Validation & Submission
// =================================
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const modalClose = document.querySelector('.modal-close');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field) {
    const value = field.value.trim();
    const errorSpan = field.parentElement.querySelector('.error-message');

    field.classList.remove('error');
    errorSpan.textContent = '';

    if (field.hasAttribute('required') && value === '') {
        field.classList.add('error');
        errorSpan.textContent = 'This field is required.';
        return false;
    }

    if (field.type === 'email' && value !== '' && !emailRegex.test(value)) {
        field.classList.add('error');
        errorSpan.textContent = 'Please enter a valid email address.';
        return false;
    }

    return true;
}

// Real-time validation on blur
const formFields = contactForm.querySelectorAll('input, textarea');
formFields.forEach(field => {
    field.addEventListener('blur', () => {
        validateField(field);
    });

    // Clear error on input
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            field.classList.remove('error');
            const errorSpan = field.parentElement.querySelector('.error-message');
            errorSpan.textContent = '';
        }
    });
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate all fields
    formFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // If form is valid, show success modal
    if (isValid) {
        // Simulate form submission
        successModal.classList.add('show');

        // Reset form
        contactForm.reset();

        // Focus on modal for accessibility
        modalClose.focus();
    } else {
        // Focus on first error field
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
    }
});

// Close modal functionality
modalClose.addEventListener('click', () => {
    successModal.classList.remove('show');
});

// Close modal when clicking outside content
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('show');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        successModal.classList.remove('show');
    }
});

// =================================
// Keyboard Accessibility Enhancements
// =================================

// Trap focus within modal when open
successModal.addEventListener('keydown', (e) => {
    if (!successModal.classList.contains('show')) return;

    if (e.key === 'Tab') {
        const focusableElements = successModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Ensure skip to content functionality
document.addEventListener('keydown', (e) => {
    // Allow users to press Enter on links with href starting with #
    if (e.key === 'Enter' && document.activeElement.tagName === 'A' && document.activeElement.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        document.activeElement.click();
    }
});

// =================================
// Dynamic Year for Copyright
// =================================
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('.footer-copyright');
if (copyrightElement) {
    copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
}

// =================================
// Performance Optimization - Debounce Scroll
// =================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll event
const debouncedScrollHandler = debounce(updateActiveLink, 50);
window.removeEventListener('scroll', updateActiveLink);
window.addEventListener('scroll', debouncedScrollHandler);

// =================================
// Loading Animation Complete
// =================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// =================================
// Console Message (Optional - can be removed)
// =================================
console.log('%c👋 Welcome to Mae Ann\'s Portfolio!', 'color: #A7C7E7; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #373A40; font-size: 14px;');
