
function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.button').forEach(btn => {
        const href = (btn.getAttribute('href') || '').split('/').pop();
        if (href === path) btn.classList.add('active');
    });
}

function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}


function initLightbox() {
    const images = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    if (!images.length || !lightbox) return;

    const lbImg     = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    const lbClose   = document.getElementById('lightbox-close');
    const lbPrev    = document.getElementById('lightbox-prev');
    const lbNext    = document.getElementById('lightbox-next');

    const imgArray = Array.from(images);
    let current = 0;

    function open(index) {
        current = index;
        lbImg.src = imgArray[current].src;
        lbImg.alt = imgArray[current].alt;
        lbCaption.textContent = imgArray[current].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    function prev() { open((current - 1 + imgArray.length) % imgArray.length); }
    function next() { open((current + 1) % imgArray.length); }

    imgArray.forEach((img, i) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => open(i));
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', prev);
    lbNext.addEventListener('click', next);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      close();
        if (e.key === 'ArrowLeft')   prev();
        if (e.key === 'ArrowRight')  next();
    });
}


function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initTiltEffect() {
    document.querySelectorAll('.glass-card:not(.trailer-card)').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / rect.height) * -5;
            const rotateY = ((x - rect.width / 2) / rect.width) * 5;
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initScrollAnimations();
    initLightbox();
    initScrollTop();
    initTiltEffect();
    loadLeaderboard();
});

async function loadLeaderboard(){
    const SUPABASE_URL = "https://kvxyseitaupuifdqorae.supabase.co/rest/v1/leaderboard";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2eHlzZWl0YXVwdWlmZHFvcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjA0MjYsImV4cCI6MjA5MTkzNjQyNn0.Jpc7Aqd0QR2yMb1gCUS48uKnMl_7oUL_P64t7EBXock";

    const tbody = document.getElementById("leaderboard-body");
    if (!tbody) return;
try {
        const res = await fetch(`${SUPABASE_URL}?order=rounds.desc,kills.desc&limit=10`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });

        const entries = await res.json();

        tbody.innerHTML = "";
        const wrap = tbody.closest('.leaderboard-wrap');
        entries.forEach((entry, i) => {
            const date = new Date(entry.created_at).toLocaleDateString();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${entry.name}</td>
                    <td>${entry.rounds}</td>
                    <td>${entry.kills}</td>
                    <td>${date}</td>`;
            tbody.appendChild(tr);
            setTimeout(() => tr.classList.add('row-visible'), 200 + i * 80);
        });
        if (wrap) setTimeout(() => wrap.classList.add('loaded'), 60);
    } catch (err) {
        console.error("Failed to load leaderboard:", err);
    }
}
