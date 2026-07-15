document.addEventListener('DOMContentLoaded', () => {
  
  // Navbar Scroll Logic
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // 0. Hero Fullscreen Slider Logic
  const slideItems = document.querySelectorAll('.slide-item');
  const navDots = document.querySelectorAll('.nav-dot');
  let currentFSIndex = 0;
  let fsInterval;

  function updateFSSlider() {
    if (slideItems.length === 0) return;
    
    slideItems.forEach((item, i) => {
      item.classList.remove('active');
      navDots[i].classList.remove('active');
      
      if (i === currentFSIndex) {
        item.classList.add('active');
        navDots[i].classList.add('active');
      }
    });
  }

  function nextFSSlide() {
    currentFSIndex = (currentFSIndex + 1) % slideItems.length;
    updateFSSlider();
  }

  function startFSSlider() {
    if (slideItems.length > 0) {
      fsInterval = setInterval(nextFSSlide, 8000);
    }
  }

  function stopFSSlider() {
    clearInterval(fsInterval);
  }

  navDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentFSIndex = i;
      updateFSSlider();
      stopFSSlider(); startFSSlider();
    });
  });

  const heroFullscreen = document.querySelector('.hero-fullscreen');
  if (heroFullscreen) {
    heroFullscreen.addEventListener('mouseenter', stopFSSlider);
    heroFullscreen.addEventListener('mouseleave', startFSSlider);
    updateFSSlider();
    startFSSlider();
  }

  // 1. Intersection Observer for Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // 2. Custom Cursor Logic (Only on Desktop)
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.innerWidth > 992) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover states for links and interactive elements
    document.querySelectorAll('a, button, .magnetic, .tab-btn, .faq-question, .pillar-card, .masonry-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });

    // Magnetic Button Physics
    const magneticEls = document.querySelectorAll('.magnetic');
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', function(e) {
        const position = el.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', function() {
        el.style.transform = `translate(0px, 0px)`;
      });
    });
  }

  // 3. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 4. Floating 'Scroll to Top' Button Visibility
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if(scrollToTopBtn){
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Counter logic for Impact Stats
  const counters = document.querySelectorAll('.counter');
  const speed = 100; // The lower the slower

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        
        const updateCount = () => {
          const count = +counter.innerText;
          const inc = target / speed;

          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 20);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
        observer.unobserve(counter); // Only run once
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // 6. Dynamic Typewriter Effect
  const words = ["Brand Identity.", "Digital Real Estate.", "Future Growth.", "Premium Prints."];
  const typeText = document.getElementById('typewriter');
  if (typeText) {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typeText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typeText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before new word
      }
      setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000); // Initial delay
  }

  // 7. About Section Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active to clicked
      btn.classList.add('active');
      const targetId = 'tab-' + btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // 8. Portfolio Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
          // Small timeout to allow display:block to apply before animating opacity
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // 9. Testimonial Carousel
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  
  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = document.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    });
    
    // Optional: Auto slide
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    }, 5000);
  }

  // 10. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // 11. Geometric Particle Canvas
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#00aee9', '#8cc63f', '#92278f', '#f7931e', '#ed1c24', '#fcee21'];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const logoEl = document.querySelector('.about-logo-anim');

    class Particle {
      constructor() {
        this.reset();
        // Fast forward the particle's life so the screen is already filled
        const randomLife = Math.floor(Math.random() * 800);
        this.x += this.speedX * randomLife;
        this.y += this.speedY * randomLife;
        this.life = randomLife;
        this.size = Math.max(0.1, this.maxSize * (1 - this.life / 800));
      }
      
      reset() {
        if (logoEl) {
          const rect = logoEl.getBoundingClientRect();
          // Top right corner approximation area (not a single pixel point)
          const baseOriginX = rect.left + rect.width * 0.85;
          const baseOriginY = rect.top + rect.height * 0.15;
          
          // Add a random spread radius of ~50px so they spawn from a chunky region
          this.x = baseOriginX + (Math.random() * 80 - 40);
          this.y = baseOriginY + (Math.random() * 80 - 40);
        } else {
          this.x = canvas.width / 2;
          this.y = canvas.height / 2;
        }
        
        // Start larger (4px to 10px) as previously
        this.maxSize = Math.random() * 6 + 4; 
        this.size = this.maxSize;
        
        // Radiate outwards slowly
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.5 + 0.2; // Keep the much slower speed
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
        this.life = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        this.life++;

        // Shrink as they go far away
        this.size = Math.max(0, this.maxSize * (1 - this.life / 800));

        // Mouse repulsion
        if (window.innerWidth > 992) {
          let dx = mouseX - this.x;
          let dy = mouseY - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            this.x -= dx * 0.03;
            this.y -= dy * 0.03;
          }
        }

        // Reset if it goes far off screen or lives too long
        if (this.x > canvas.width + 200 || this.x < -200 || this.y > canvas.height + 200 || this.y < -200 || this.life > 800 || this.size <= 0) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3; // Very subtle
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      particles = [];
      const numParticles = Math.min(window.innerWidth / 15, 100); // Increased amount
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }
});
