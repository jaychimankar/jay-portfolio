import '../css/style.css'

console.log('Portfolio loaded!')

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
rootElement.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
  });
}

function updateToggleIcon(theme) {
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Contact Form Handling (Formspree)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      const action = form.action; // Get the Formspree URL from the form action attribute

      // Simple validation to check if user replaced the placeholder
      if (action.includes('YOUR_FORM_ID')) {
        formStatus.style.display = 'block';
        formStatus.style.color = 'orange';
        formStatus.textContent = '⚠️ Please setup your Formspree ID in index.html first!';
        return;
      }

      formStatus.style.display = 'block';
      formStatus.style.color = 'var(--text-secondary)';
      formStatus.textContent = 'Sending...';

      try {
        const response = await fetch(action, {
          method: form.method,
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.style.color = 'green';
          formStatus.textContent = '✅ Message sent successfully!';
          form.reset();
        } else {
          const jsonData = await response.json();
          if (Object.hasOwn(jsonData, 'errors')) {
            formStatus.style.color = 'red';
            formStatus.textContent = jsonData.errors.map(error => error.message).join(", ");
          } else {
            formStatus.style.color = 'red';
            formStatus.textContent = '❌ Oops! There was a problem submitting your form';
          }
        }
      } catch (error) {
        formStatus.style.color = 'red';
        formStatus.textContent = '❌ Oops! There was a problem submitting your form';
      }
    });
  }

  // Close menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
      }
    });
  });

  // Scroll Reveal Animation using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    root: null,
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px"
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Typing Effect for Hero Tagline
  const taglineElement = document.querySelector('#hero h2:nth-of-type(2)'); // Selects the tagline h2
  if (taglineElement) {
    const text = taglineElement.textContent.trim();
    taglineElement.textContent = ''; // Clear initial text

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        taglineElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50); // Adjust typing speed here (lower is faster)
      }
    };

    // Start typing after a small delay
    setTimeout(typeWriter, 500);
  }

  // Project Image Expansion Effect (Pop-out on Hover)
  const projectImages = document.querySelectorAll('.project-gallery img');

  projectImages.forEach(img => {
    img.addEventListener('mouseenter', (e) => {
      const original = e.target;
      const rect = original.getBoundingClientRect();

      // Create clone
      const clone = document.createElement('img');
      clone.src = original.src;
      clone.className = 'img-expand-clone';

      // Set initial position exactly matching the original
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;

      document.body.appendChild(clone);

      // Force reflow
      void clone.offsetWidth;

      // Calculate target size (max 400px or 90vw)
      const targetSize = Math.min(400, window.innerWidth * 0.9);
      const scaleQuery = targetSize / rect.width;

      // Animate to center-ish or just expand in place
      clone.style.transform = `scale(${scaleQuery})`;

      // Handle Mouse Leave
      const removeClone = () => {
        clone.style.transform = 'scale(1)';
        clone.style.opacity = '0';
        setTimeout(() => {
          if (clone.parentNode) clone.parentNode.removeChild(clone);
        }, 300);
        original.style.opacity = '1'; // Restore original opacity
      };

      clone.addEventListener('mouseleave', removeClone);
      // Also remove on scroll to prevent floating weirdness
      window.addEventListener('scroll', removeClone, { once: true });
    });
  });

});
