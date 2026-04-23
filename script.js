// ── Footer year ───────────────────────────────────────
document.querySelector('footer p').innerHTML =
    `&copy; ${new Date().getFullYear()} Gustavo Carvalho. Todos os direitos reservados.`;
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// ── Header scroll effect ──────────────────────────────
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// ── Mobile menu ───────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navMenu    = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
        navMenu.classList.remove('active');
    }
});

// ── Smooth scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 90,
                behavior: 'smooth'
            });
        }
    });
});

// ── Scroll-triggered fade-in ──────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section-title, .project-card, .about-text, .about-image')
    .forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.style.opacity = '0';
            observer.observe(el);
        }
    });

// ── Liquid Glass mouse parallax on cards ─────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `
            perspective(600px)
            rotateY(${x * 8}deg)
            rotateX(${-y * 8}deg)
            translateY(-10px)
        `;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease';
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'box-shadow 0.35s ease';
    });
});

// ── Subtle cursor glow (desktop only) ────────────────
if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999;
        width: 280px; height: 280px; border-radius: 50%;
        background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    (function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top  = glowY + 'px';
        requestAnimationFrame(animateGlow);
    })();

    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
    document.addEventListener('mouseenter', () => glow.style.opacity = '1');
}