/**
 * K. Yamuna — Portfolio Main UI & Interaction Controller
 * 3D Card Tilt • Custom Cursor • Interactive Terminal • Toast Notifications • Copy/Print
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Custom Interactive Cursor Follower ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorDot && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function renderCursor() {
      // Lerp smooth trailing for glow ring
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Scale cursor when hovering over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .tilt-card, .btn-copy-chip');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '54px';
        cursorGlow.style.height = '54px';
        cursorGlow.style.borderColor = 'rgba(139, 92, 246, 0.7)';
        cursorGlow.style.background = 'rgba(139, 92, 246, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '36px';
        cursorGlow.style.height = '36px';
        cursorGlow.style.borderColor = 'rgba(6, 182, 212, 0.45)';
        cursorGlow.style.background = 'rgba(6, 182, 212, 0.05)';
      });
    });
  }

  // --- 2. 3D Card Tilt Effect ---
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- 3. Navbar Sticky Style & Mobile Menu Toggle ---
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // --- 4. Scroll-Spy Navigation Active Link Detection ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollPosition = window.pageYOffset + 160;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- 5. Toast Notification System ---
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = 'fa-check-circle') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3600);
  }

  // --- 6. One-Click Copy-to-Clipboard ---
  // Copy Email Buttons
  const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
  copyEmailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'yamunakanagaraj9@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`, 'fa-envelope');
      }).catch(() => {
        showToast(`Email: ${email}`, 'fa-envelope');
      });
    });
  });

  // Copy Phone Buttons
  const copyPhoneButtons = document.querySelectorAll('.copy-phone-btn');
  copyPhoneButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = btn.getAttribute('data-phone') || '7010645757';
      navigator.clipboard.writeText(phone).then(() => {
        showToast(`Phone number copied: ${phone}`, 'fa-phone');
      }).catch(() => {
        showToast(`Phone: ${phone}`, 'fa-phone');
      });
    });
  });

  // --- 7. Print Resume Trigger ---
  const printResumeBtn = document.getElementById('printResumeBtn');
  const triggerPrintBtn = document.getElementById('triggerPrintBtn');

  function triggerPrint() {
    showToast('Opening clean print / PDF view...', 'fa-file-pdf');
    setTimeout(() => {
      window.print();
    }, 400);
  }

  if (printResumeBtn) printResumeBtn.addEventListener('click', triggerPrint);
  if (triggerPrintBtn) triggerPrintBtn.addEventListener('click', triggerPrint);

  // --- 8. Interactive Live Skill Playground ---
  const runCodeBtn = document.getElementById('runCodeBtn');
  const resetPlaygroundBtn = document.getElementById('resetPlaygroundBtn');
  const terminalOutput = document.getElementById('terminalOutput');

  if (runCodeBtn && terminalOutput) {
    runCodeBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = '';
      const lines = [
        { text: '> [1/4] Compiling candidate profile script...', class: 'text-muted', delay: 100 },
        { text: '> [2/4] Validating academic credentials: Muthayammal College of Arts and Science', class: 'text-violet', delay: 400 },
        { text: '> [3/4] B.Sc Computer Science (Third Year) score verified: 75%', class: 'text-cyan', delay: 700 },
        { text: '✓ Candidate Record: K. Yamuna', class: 'text-emerald', delay: 1000 },
        { text: '✓ Status: Motivated B.Sc Computer Science Student ready for professional roles!', class: 'text-primary', delay: 1300 },
        { text: '>> Execution finished successfully with code 0.', class: 'text-muted', delay: 1600 }
      ];

      lines.forEach((item) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = `terminal-line ${item.class}`;
          div.textContent = item.text;
          terminalOutput.appendChild(div);
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }, item.delay);
      });

      showToast('Simulation executed successfully!', 'fa-terminal');
    });
  }

  if (resetPlaygroundBtn && terminalOutput) {
    resetPlaygroundBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = `
        <div class="terminal-line text-muted">> Ready to execute... click "Run Code Simulation"</div>
        <div class="terminal-line text-cyan">> Environment: B.Sc Computer Science Runtime v2026</div>
      `;
      showToast('Console reset.', 'fa-rotate-right');
    });
  }

  // --- 9. Contact Form Handling ---
  const contactForm = document.getElementById('portfolioContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('messageSubject').value.trim() || 'Opportunity for B.Sc CS Candidate';
      const body = document.getElementById('messageBody').value.trim();

      if (!name || !email || !body) {
        showToast('Please fill in all required fields.', 'fa-triangle-exclamation');
        return;
      }

      // Format email body for mailto
      const formattedBody = `From: ${name} (${email})\n\nMessage:\n${body}\n\n---\nSent via K. Yamuna Portfolio Website`;
      const mailtoUrl = `mailto:yamunakanagaraj9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedBody)}`;

      showToast('Opening your email client to send message...', 'fa-paper-plane');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }
});
