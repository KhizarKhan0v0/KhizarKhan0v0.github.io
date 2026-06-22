document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "5d75DPiROwG3-gD6Z",
        });
    }

    /* ==========================================
       PARTICLE CANVAS BACKGROUND
       ========================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = 'rgba(99, 102, 241, 0.15)'; // Soft Indigo
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxForce = mouse.radius;
                    let force = (maxForce - distance) / maxForce;
                    let directionX = forceDirectionX * force * 0.6;
                    let directionY = forceDirectionY * force * 0.6;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize Particles
    function initParticles() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Draw lines connecting particles
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacityValue * 0.08})`; // Soft Cyan Line
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* ==========================================
       HERO TYPING ANIMATION
       ========================================== */
    const typingElement = document.getElementById('typing-text');
    const roles = [
        "Full-Stack Web Developer",
        "AI & LLM Integrator",
        "RESTful API Designer",
        "Computer Science Student"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deleting
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing
        }

        // Handle typing completions and deletions
        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Hold at the end of the text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    // Start typing effect
    if (typingElement) {
        setTimeout(typeEffect, 1000);
    }


    /* ==========================================
       MOBILE NAVIGATION HAMBURGER MENU
       ========================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Scroll Navbar Effect
    const navbar = document.querySelector('.navbar-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    /* ==========================================
       SCROLL REVEAL ANIMATIONS & ACTIVE NAV LINK
       ========================================== */
    const sections = document.querySelectorAll('section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillBars = document.querySelectorAll('.skill-progress');

    // Create an intersection observer for fade-in animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    timelineItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Observer for skill progress bars animating on view
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('data-level');
                entry.target.style.width = targetWidth;
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });

    // Active Navigation Highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================
       SKILLS FILTERING
       ========================================== */
    const skillTabBtns = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all tabs
            skillTabBtns.forEach(t => t.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');

                // Reset styling first
                card.classList.remove('hide');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';

                if (category !== 'all' && cardCat !== category) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    // Delay hiding for smooth transition
                    setTimeout(() => {
                        if (btn.classList.contains('active') && btn.getAttribute('data-category') === category) {
                            card.classList.add('hide');
                        }
                    }, 300);
                }
            });
        });
    });


    /* ==========================================
       PROJECTS FILTERING
       ========================================== */
    const projectFilterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active
            projectFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                card.classList.remove('hide');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';

                if (filter !== 'all' && category !== filter) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        if (btn.classList.contains('active') && btn.getAttribute('data-filter') === filter) {
                            card.classList.add('hide');
                        }
                    }, 300);
                }
            });
        });
    });


    /* ==========================================
       TOAST ALERTS & CLIPBOARD COPYING
       ========================================== */
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle toast-icon' : 'fas fa-info-circle toast-icon';

        const msgSpan = document.createElement('span');
        msgSpan.className = 'toast-msg';
        msgSpan.textContent = message;

        toast.appendChild(icon);
        toast.appendChild(msgSpan);
        toastContainer.appendChild(toast);

        // Slide out and remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'toast-out 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => {
                toast.remove();
            }, 350);
        }, 3000);
    }

    // Copy to Clipboard implementation
    const copyCards = document.querySelectorAll('[data-clipboard]');
    copyCards.forEach(card => {
        const valueToCopy = card.getAttribute('data-clipboard');
        const copyBtn = card.querySelector('.copy-btn');

        // Click handler for card/button
        const handleCopy = (e) => {
            e.stopPropagation(); // Avoid double triggers

            navigator.clipboard.writeText(valueToCopy).then(() => {
                showToast(`Copied to clipboard: ${valueToCopy}`, 'success');
            }).catch(err => {
                showToast('Failed to copy text', 'info');
            });
        };

        if (copyBtn) {
            copyBtn.addEventListener('click', handleCopy);
        }
        card.addEventListener('click', handleCopy);
    });


    /* ==========================================
       FORM VALIDATION & INTERACTIVE SUBMIT
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formSuccessOverlay = document.getElementById('form-success-overlay');
    const successResetBtn = document.getElementById('btn-success-reset');
    const submitBtn = document.getElementById('form-submit-btn');
    const submitBtnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    // Fields
    const fields = {
        name: {
            input: document.getElementById('form-name'),
            error: document.getElementById('name-error'),
            validate: (val) => val.trim().length > 0
        },
        email: {
            input: document.getElementById('form-email'),
            error: document.getElementById('email-error'),
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
        },
        subject: {
            input: document.getElementById('form-subject'),
            error: document.getElementById('subject-error'),
            validate: (val) => val.trim().length > 0
        },
        message: {
            input: document.getElementById('form-message'),
            error: document.getElementById('message-error'),
            validate: (val) => val.trim().length > 0
        }
    };

    // Real-time input cleaning
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        field.input.addEventListener('input', () => {
            if (field.validate(field.input.value)) {
                field.input.closest('.form-group').classList.remove('invalid');
            }
        });
    });

    // Submit handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        // Validate all fields
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            const isValid = field.validate(field.input.value);

            if (!isValid) {
                field.input.closest('.form-group').classList.add('invalid');
                isFormValid = false;
            } else {
                field.input.closest('.form-group').classList.remove('invalid');
            }
        });

        if (isFormValid) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtnText.textContent = "Sending...";
            spinner.classList.remove('hide');

            // EmailJS configuration variables
            // REPLACE 'service_portfolio' and 'template_portfolio' with your actual EmailJS IDs
            const SERVICE_ID = 'service_0eb955j';
            const TEMPLATE_ID = 'template_buh941a';

            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm)
                    .then(() => {
                        // Success state
                        submitBtn.disabled = false;
                        submitBtnText.textContent = "Send Message";
                        spinner.classList.add('hide');

                        // Trigger overlay animation
                        formSuccessOverlay.classList.remove('hide');
                        showToast("Message sent successfully!", 'success');
                    }, (error) => {
                        console.error("EmailJS Error:", error);
                        submitBtn.disabled = false;
                        submitBtnText.textContent = "Send Message";
                        spinner.classList.add('hide');

                        if (SERVICE_ID === 'service_portfolio' || TEMPLATE_ID === 'template_portfolio') {
                            showToast("EmailJS: Set SERVICE_ID & TEMPLATE_ID in script.js", 'info');
                            // local fallback for preview purposes
                            formSuccessOverlay.classList.remove('hide');
                        } else {
                            showToast("Failed to send: " + (error.text || error), 'info');
                        }
                    });
            } else {
                // Local fallback if EmailJS library did not load
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtnText.textContent = "Send Message";
                    spinner.classList.add('hide');
                    formSuccessOverlay.classList.remove('hide');
                    showToast("Sent successfully (Local Demo Mode)", 'success');
                }, 1500);
            }
        } else {
            showToast("Please fill in all required fields correctly", 'info');
        }
    });

    // Success reset handler
    if (successResetBtn) {
        successResetBtn.addEventListener('click', () => {
            contactForm.reset();
            formSuccessOverlay.classList.add('hide');
        });
    }


    /* ==========================================
       BACK TO TOP & FOOTER SCROLL INDICATOR
       ========================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.transform = 'translateY(0)';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(15px)';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });

    if (backToTopBtn) {
        // Double check opacity trigger initial state
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
