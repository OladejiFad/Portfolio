document.addEventListener("DOMContentLoaded", () => {
  // Sticky navbar
  const nav = document.querySelector('nav.navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('bg-white', window.scrollY > 10);
    nav.classList.toggle('shadow', window.scrollY > 10);
  });

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i> ${isDark ? 'Light' : 'Dark'} Mode`;
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  });
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  }

  // Smooth scroll
  document.querySelectorAll('.nav-link-scroll').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
      const navbarCollapse = document.getElementById('navMenu');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // Fade-in sections
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

  // Project filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => item.classList.add('fade-in'), 10);
        } else {
          item.classList.remove('fade-in');
          item.style.display = 'none';
        }
      });
    });
  });

  // EmailJS initialization
  emailjs.init('ok9es0TUUl_pWO_9a');

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const attachmentsInput = document.getElementById('attachments');
    const attachments = attachmentsInput ? Array.from(attachmentsInput.files).map(f => f.name) : [];

    try {
      await emailjs.send('service_nr5f3kk', 'template_4ggurq5', {
        from_name: name,
        reply_to: email,
        message: message + (attachments.length ? '\n\nAttachments: ' + attachments.join(', ') : '')
      });

      formMessage.classList.remove('hidden', 'text-danger');
      formMessage.classList.add('text-success');
      formMessage.textContent = 'Message sent successfully!';
      contactForm.reset();
      contactForm.classList.remove('was-validated');
      setTimeout(() => formMessage.classList.add('hidden'), 4000);
    } catch (error) {
      formMessage.classList.remove('hidden', 'text-success');
      formMessage.classList.add('text-danger');
      formMessage.textContent = 'Error sending message. Please try again.';
      console.error('EmailJS error:', error);
    }
  });
});
