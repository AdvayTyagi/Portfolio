// Typing Animation
const typingText = document.querySelector('.typing-text');
const words = ['Aspiring Software Engineer', 'Full Stack Developer', 'Tech Enthusiast'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
}

// Start typing animation
document.addEventListener('DOMContentLoaded', () => {
    if (typingText) setTimeout(type, 1000);
});


// Mobile Navbar Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const comingSoon = document.querySelector('.coming-soon');

// Hide coming soon text initially if there are projects
if (comingSoon && projectCards.length > 0) {
    comingSoon.style.display = 'none';
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        let visibleCount = 0;

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'flex';
                visibleCount++;
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        if (comingSoon) {
            if (visibleCount === 0) {
                setTimeout(() => {
                    comingSoon.style.display = 'block';
                }, 300);
            } else {
                comingSoon.style.display = 'none';
            }
        }
    });
});

// Copy Email Button
const copyBtn = document.getElementById('copy-email');
const emailText = document.getElementById('email-address').textContent;

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(emailText).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            copyBtn.style.color = '#00d2ff';

            setTimeout(() => {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
                copyBtn.style.color = '';
            }, 2000);
        });
    });
}

// Contact Form — Formspree
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
        };

        try {
            const response = await fetch('https://formspree.io/f/mojrbzpd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                btn.textContent = 'Message Sent! ✓';
                btn.style.background = '#4caf50';
                contactForm.reset();
            } else {
                throw new Error('Server error');
            }
        } catch {
            btn.textContent = 'Failed — Try Again';
            btn.style.background = '#f44336';
        } finally {
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
        }
    });
}

// Resume Download Placeholder logic
const resumeBtn = document.getElementById('resume-download');
if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Resume download functionality will be implemented once the PDF is uploaded.');
    });
}

// Background Canvas Animation (Dynamic Dots)
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let particlesArray;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    // Particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fill();
        }
        // Update particle position
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    // Initialize particles array
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 4500;

        if (window.innerWidth < 768) {
            numberOfParticles = (canvas.height * canvas.width) / 6000;
        }

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 5) + 2;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = '#ffffff';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        // Dynamically set dot color based on theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        ctx.fillStyle = currentTheme === 'light' ? '#000000' : '#ffffff';

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    // Start animation
    // init();
    // animate();
}