 (function () {
      'use strict';

      /* ---------- Lucide icons ---------- */
      if (window.lucide) {
        lucide.createIcons();
      }

      /* ---------- Navbar scrolled state ---------- */
      const navbar = document.getElementById('navbar');
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      /* ---------- Mobile hamburger ---------- */
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobileMenu');

      hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        hamburger.innerHTML = isOpen
          ? '<i data-lucide="x" aria-hidden="true"></i>'
          : '<i data-lucide="menu" aria-hidden="true"></i>';
        if (window.lucide) lucide.createIcons();
      });

      mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.setAttribute('aria-label', 'Open menu');
          hamburger.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
          if (window.lucide) lucide.createIcons();
        });
      });

      /* ---------- Menu tabs ---------- */
      const tabs = Array.from(document.querySelectorAll('.tab-btn'));
      const panels = Array.from(document.querySelectorAll('.menu-panel'));

      function activateTab(tab) {
        const target = tab.dataset.tab;
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');

        panels.forEach((panel) => {
          const isActive = panel.id === target;
          panel.classList.toggle('active', isActive);
          panel.hidden = !isActive;
        });
      }

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(tab));
        tab.addEventListener('keydown', (e) => {
          let newIndex = index;
          if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') newIndex = 0;
          else if (e.key === 'End') newIndex = tabs.length - 1;
          else return;
          e.preventDefault();
          tabs[newIndex].focus();
          activateTab(tabs[newIndex]);
        });
      });

      /* ---------- Customer review slideshow ---------- */
      const reviewsCarousel = document.getElementById('reviewsCarousel');
      const reviewsTrack = document.getElementById('reviewsTrack');
      const reviewSlides = reviewsTrack ? Array.from(reviewsTrack.querySelectorAll('.review-card')) : [];
      const reviewDots = Array.from(document.querySelectorAll('.reviews-dot'));
      const reviewsPrev = document.getElementById('reviewsPrev');
      const reviewsNext = document.getElementById('reviewsNext');
      const reduceReviewMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let activeReview = 0;
      let reviewTimer;
      let reviewsPaused = false;

      function showReview(index) {
        activeReview = (index + reviewSlides.length) % reviewSlides.length;
        reviewsTrack.style.transform = `translateX(-${activeReview * 100}%)`;
        reviewSlides.forEach((slide, slideIndex) => {
          slide.setAttribute('aria-hidden', String(slideIndex !== activeReview));
        });
        reviewDots.forEach((dot, dotIndex) => {
          dot.setAttribute('aria-current', String(dotIndex === activeReview));
        });
      }

      function stopReviewTimer() {
        window.clearInterval(reviewTimer);
      }

      function startReviewTimer() {
        stopReviewTimer();
        if (!reduceReviewMotion && !reviewsPaused && !document.hidden && reviewSlides.length > 1) {
          reviewTimer = window.setInterval(() => showReview(activeReview + 1), 6000);
        }
      }

      if (reviewsCarousel && reviewsTrack && reviewSlides.length) {
        reviewsPrev.addEventListener('click', () => {
          showReview(activeReview - 1);
          startReviewTimer();
        });
        reviewsNext.addEventListener('click', () => {
          showReview(activeReview + 1);
          startReviewTimer();
        });
        reviewDots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            showReview(index);
            startReviewTimer();
          });
        });
        reviewsCarousel.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowLeft') {
            showReview(activeReview - 1);
            startReviewTimer();
          } else if (event.key === 'ArrowRight') {
            showReview(activeReview + 1);
            startReviewTimer();
          }
        });
        reviewsCarousel.addEventListener('pointerenter', () => {
          reviewsPaused = true;
          stopReviewTimer();
        });
        reviewsCarousel.addEventListener('pointerleave', () => {
          reviewsPaused = false;
          startReviewTimer();
        });
        reviewsCarousel.addEventListener('focusin', () => {
          reviewsPaused = true;
          stopReviewTimer();
        });
        reviewsCarousel.addEventListener('focusout', (event) => {
          if (!reviewsCarousel.contains(event.relatedTarget)) {
            reviewsPaused = false;
            startReviewTimer();
          }
        });
        document.addEventListener('visibilitychange', startReviewTimer);
        showReview(0);
        startReviewTimer();
      }

      panels.forEach((panel, i) => {
        if (i > 0) panel.hidden = true;
      });

      /* ---------- FAQ accordion ---------- */
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        button.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          faqItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove('open');
              const otherBtn = other.querySelector('.faq-question');
              const otherAns = other.querySelector('.faq-answer');
              otherBtn.setAttribute('aria-expanded', 'false');
              otherAns.style.maxHeight = null;
              otherAns.setAttribute('hidden', '');
            }
          });

          if (isOpen) {
            item.classList.remove('open');
            button.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = null;
            answer.setAttribute('hidden', '');
          } else {
            item.classList.add('open');
            button.setAttribute('aria-expanded', 'true');
            answer.removeAttribute('hidden');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
      });

      /* ---------- Contact form (mock submit) ---------- */
      const form = document.getElementById('contactForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }
          const btn = form.querySelector('button[type="submit"]');
          const original = btn.innerHTML;
          btn.innerHTML = 'Message Sent <i data-lucide="check" aria-hidden="true" style="width:18px;height:18px"></i>';
          btn.disabled = true;
          if (window.lucide) lucide.createIcons();
          setTimeout(() => {
            form.reset();
            btn.innerHTML = original;
            btn.disabled = false;
            if (window.lucide) lucide.createIcons();
          }, 2400);
        });
      }

      /* ---------- Cinematic reveal on scroll ---------- */
      const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
      } else {
        revealEls.forEach((el) => el.classList.add('visible'));
      }

      /* ---------- Gallery Lightbox ---------- */
      const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
      const lightbox = document.getElementById('lightbox');
      const lightboxImage = document.getElementById('lightboxImage');
      const lightboxCaption = document.getElementById('lightboxCaption');
      const lightboxClose = document.getElementById('lightboxClose');
      const lightboxPrev = document.getElementById('lightboxPrev');
      const lightboxNext = document.getElementById('lightboxNext');

      let currentIndex = 0;
      let lastFocused = null;

      function openLightbox(index) {
        if (!lightbox || !galleryItems.length) return;
        currentIndex = (index + galleryItems.length) % galleryItems.length;
        const trigger = galleryItems[currentIndex];
        const img = trigger.querySelector('img');
        const fullSrc = trigger.dataset.full || img.src;
        const alt = img.alt || '';

        lightboxImage.src = fullSrc;
        lightboxImage.alt = alt;
        lightboxCaption.textContent = alt;

        lastFocused = document.activeElement;
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
        lightboxClose.focus();
      }

      function closeLightbox() {
        if (!lightbox) return;
        lightbox.hidden = true;
        document.body.classList.remove('lightbox-open');
        lightboxImage.src = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        }
      }

      function showNext() { openLightbox(currentIndex + 1); }
      function showPrev() { openLightbox(currentIndex - 1); }

      galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(index);
        });
      });

      if (lightbox) {
        lightboxClose.addEventListener('click', (e) => {
          e.preventDefault();
          closeLightbox();
        });
        lightboxNext.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          showNext();
        });
        lightboxPrev.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          showPrev();
        });

        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
          if (lightbox.hidden) return;
          if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
          else if (e.key === 'ArrowRight') { e.preventDefault(); showNext(); }
          else if (e.key === 'ArrowLeft') { e.preventDefault(); showPrev(); }
        });

        if (window.lucide) lucide.createIcons();
      }
    })();