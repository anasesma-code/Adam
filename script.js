// Address that receives appointment requests
const BOOKING_EMAIL = 'adam@realtalkcounselling.com';

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

document.getElementById('year').textContent = new Date().getFullYear();

// Header border on scroll
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// Fade sections in as they scroll into view
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section .container').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Booking form: no past dates, validate, then open the visitor's email client
const form = document.getElementById('booking-form');
const status = document.getElementById('form-status');
document.getElementById('date').min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.className = 'form-status';

  const required = [...form.querySelectorAll('[required]')];
  const invalid = required.filter((field) => !field.value.trim() || !field.checkValidity());
  required.forEach((field) => field.classList.toggle('invalid', invalid.includes(field)));

  if (invalid.length) {
    status.textContent = 'Please complete your name, a valid email and the type of session.';
    status.classList.add('error');
    invalid[0].focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Session: ${data.service}`,
    `Format: ${data.format}`,
    `Preferred date: ${data.date || 'Flexible'}`,
    `Preferred time: ${data.time}`,
    '',
    data.message,
  ].join('\n');

  const subject = `Appointment request — ${data.service}`;
  window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = 'Thank you. Your email app should open with your request ready to send.';
  form.reset();
});
