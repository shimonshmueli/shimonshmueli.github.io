// © Shimon Shmueli

(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const modal = document.getElementById('email-modal');
  const form = document.getElementById('email-form');
  const status = form ? form.querySelector('.form-status') : null;
  let lastFocus = null;

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = modal.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }, 60);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (status) { status.textContent = ''; status.className = 'form-status'; }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('[data-open-email]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  document.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const accessKey = form.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.textContent = 'Form not configured yet. Add your Web3Forms access key in index.html.';
        status.className = 'form-status is-error';
        return;
      }

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        status.textContent = 'Please fill in all fields.';
        status.className = 'form-status is-error';
        return;
      }

      status.textContent = 'Sending…';
      status.className = 'form-status is-pending';

      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          status.textContent = "Thanks! I'll get back to you soon.";
          status.className = 'form-status is-success';
          form.reset();
          setTimeout(closeModal, 1800);
        } else {
          throw new Error(json.message || 'Request failed');
        }
      } catch (err) {
        status.textContent = "Sorry, that didn't go through. Try again, or email shimon.shmueli@gmail.com directly.";
        status.className = 'form-status is-error';
      }
    });
  }
})();
