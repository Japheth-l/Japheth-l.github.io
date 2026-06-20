/* =============================================
   NAV — scroll behaviour & mobile menu
============================================= */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* =============================================
   SCROLL REVEAL
============================================= */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards within the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* =============================================
   CONTACT FORM — validation & mailto fallback
============================================= */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

function validateField(id, errorId, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  const value = field.value.trim();

  if (!value) {
    field.classList.add('error');
    error.textContent = message;
    return false;
  }

  if (id === 'email') {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value)) {
      field.classList.add('error');
      error.textContent = 'Enter a valid email address.';
      return false;
    }
  }

  field.classList.remove('error');
  error.textContent = '';
  return true;
}

// Clear error on input
['name', 'email', 'subject', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
    formStatus.textContent = '';
    formStatus.className = 'form-note';
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const validName    = validateField('name',    'nameError',    'Name is required.');
  const validEmail   = validateField('email',   'emailError',   'Email is required.');
  const validSubject = validateField('subject', 'subjectError', 'Subject is required.');
  const validMsg     = validateField('message', 'messageError', 'Message is required.');

  if (!validName || !validEmail || !validSubject || !validMsg) return;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  // Build a mailto link as the delivery mechanism
  // (replace with a real backend/Formspree endpoint when ready)
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  );
  const mailto = `mailto:lamuojapheth@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

  // Open the mailto link
  window.location.href = mailto;

  // Show success feedback
  formStatus.textContent = '✓ Opening your email client…';
  formStatus.className = 'form-note success';
  submitBtn.textContent = 'Sent!';
  submitBtn.style.opacity = '0.7';

  setTimeout(() => {
    form.reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.style.opacity = '';
    formStatus.textContent = '';
    formStatus.className = 'form-note';
  }, 3500);
});

/* =============================================
   ACTIVE NAV LINK — highlight on scroll
============================================= */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links li a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--white)';
    }
  });
}, { passive: true });