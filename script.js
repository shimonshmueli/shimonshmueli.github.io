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

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCounter = lightbox ? lightbox.querySelector('.lightbox-counter') : null;
  const shots = Array.from(document.querySelectorAll('.shot'));
  let lightboxIndex = -1;
  let lightboxLastFocus = null;

  function getActiveShots() {
    return shots.filter((s) => !s.classList.contains('placeholder'));
  }

  function openLightbox(shotEl) {
    if (!lightbox || !lightboxImg) return;
    const active = getActiveShots();
    const idx = active.indexOf(shotEl);
    if (idx === -1) return;
    lightboxIndex = idx;
    const img = active[idx].querySelector('img');
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    if (lightboxCounter) lightboxCounter.textContent = `${idx + 1} / ${active.length}`;
    lightboxLastFocus = document.activeElement;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxLastFocus && lightboxLastFocus.focus) lightboxLastFocus.focus();
  }

  function stepLightbox(delta) {
    const active = getActiveShots();
    if (!active.length) return;
    const next = (lightboxIndex + delta + active.length) % active.length;
    openLightbox(active[next]);
  }

  shots.forEach((shot) => {
    shot.addEventListener('click', () => {
      if (!shot.classList.contains('placeholder')) openLightbox(shot);
    });
  });

  if (lightbox) {
    const closeBtn = lightbox.querySelector('[data-lightbox-close]');
    const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
    const nextBtn = lightbox.querySelector('[data-lightbox-next]');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => stepLightbox(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => stepLightbox(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') stepLightbox(-1);
    else if (e.key === 'ArrowRight') stepLightbox(1);
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
