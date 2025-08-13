document.addEventListener("DOMContentLoaded", () => {
  // Sticky navbar background on scroll
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav.navbar');
    if (window.scrollY > 10) {
      nav.classList.add('bg-white', 'shadow');
    } else {
      nav.classList.remove('bg-white', 'shadow');
    }
  });

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i> ${isDark ? 'Light' : 'Dark'} Mode`;
  });

  // Smooth scroll for nav links + auto-collapse mobile navbar
  document.querySelectorAll('.nav-link-scroll').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });

      // Auto-collapse navbar on mobile after clicking a nav link
      const navbarCollapse = document.getElementById('navMenu');
      if (navbarCollapse.classList.contains('show')) {
        let bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (!bsCollapse) {
          bsCollapse = new bootstrap.Collapse(navbarCollapse);
        }
        bsCollapse.hide();
      }
    });
  });

  // Fade-in animations using Intersection Observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
  });

  // EmailJS Contact Form
  emailjs.init('ok9es0TUUl_pWO_9a'); // your public key here

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const attachments = document.getElementById('attachments').files;
    let attachmentList = [];
    for (let file of attachments) {
      attachmentList.push(file.name);
    }

    emailjs.send('service_nr5f3kk', 'template_4ggurq5', {
      from_name: name,
      reply_to: email,
      message: message + (attachmentList.length ? '\n\nAttachments: ' + attachmentList.join(', ') : '')
    })
      .then(() => {
        formMessage.classList.remove('hidden', 'text-danger');
        formMessage.classList.add('text-success');
        formMessage.textContent = 'Message sent successfully!';
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        setTimeout(() => formMessage.classList.add('hidden'), 4000);
      })
      .catch(() => {
        formMessage.classList.remove('hidden', 'text-success');
        formMessage.classList.add('text-danger');
        formMessage.textContent = 'Error sending message. Please try again.';
      });
  });
});
