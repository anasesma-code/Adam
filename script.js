// Address that receives enquiries from the contact form
const CONTACT_EMAIL = 'adam@realtalkcounselling.com';

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
const navLinks = [...nav.querySelectorAll('a:not(.btn)')];

document.getElementById('year').textContent = new Date().getFullYear();

// Header border once the page scrolls
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const closeMenu = () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
};
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

// Highlight the menu item of the section in view
if ('IntersectionObserver' in window) {
  const sections = navLinks.map((link) => document.querySelector(link.hash));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((section) => section && observer.observe(section));
}

// A service's "Book now" pre-selects its enquiry type
const form = document.getElementById('contact-form');
document.querySelectorAll('[data-enquiry]').forEach((button) =>
  button.addEventListener('click', () => {
    const option = form.querySelector(`input[value="${button.dataset.enquiry}"]`);
    if (option) option.checked = true;
  })
);

// Validate, then open the visitor's email app with the enquiry ready to send
const status = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.className = 'form-status';

  const required = [...form.querySelectorAll('[required]')];
  const invalid = required.filter((field) => !field.value.trim() || !field.checkValidity());
  required.forEach((field) => field.classList.toggle('invalid', invalid.includes(field)));

  if (invalid.length) {
    status.textContent = 'Please fill in your name, a valid e-mail and your message.';
    status.classList.add('error');
    invalid[0].focus();
    return;
  }

  const data = new FormData(form);
  const enquiry = data.getAll('enquiry').join(', ') || 'General enquiry';
  const body = [
    `Name: ${data.get('name')}`,
    `E-mail: ${data.get('email')}`,
    `Enquiry type: ${enquiry}`,
    '',
    data.get('message'),
  ].join('\n');

  const subject = `Website enquiry — ${enquiry}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = 'Thank you. Your e-mail app should open with your message ready to send.';
  form.reset();
});
