document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  mobileMenu?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Scroll animations
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => observer.observe(el));

  // Scroll to top button
  const scrollTop = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTop?.classList.add('visible');
    } else {
      scrollTop?.classList.remove('visible');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Menu tabs
  const menuTabs = document.querySelectorAll('.menu-tab');
  const pizzaCards = document.querySelectorAll('.pizza-card');
  
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const category = tab.dataset.category;
      
      pizzaCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Live horaires status
  updateHorairesStatus();
  setInterval(updateHorairesStatus, 60000); // Update every minute
});

function updateHorairesStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;
  
  // Horaires: 11h-14h et 18h-22h sauf dimanche soir et lundi
  const cards = document.querySelectorAll('.horaire-card');
  
  cards.forEach(card => {
    const dayText = card.querySelector('.day').textContent.toLowerCase();
    card.classList.remove('status-open', 'status-closed');
    
    let isOpen = false;
    
    if (dayText.includes('lundi')) {
      isOpen = false;
    } else if (dayText.includes('dimanche')) {
      // Dimanche uniquement le midi (11h-14h)
      isOpen = day === 0 && currentTime >= 660 && currentTime <= 840;
    } else {
      // Mardi à Samedi: 11h-14h (660-840) et 18h-22h (1080-1320)
      const dayMap = {2: 'mardi', 3: 'mercredi', 4: 'jeudi', 5: 'vendredi', 6: 'samedi'};
      if (dayMap[day] && dayText.includes(dayMap[day])) {
        isOpen = (currentTime >= 660 && currentTime <= 840) || 
                 (currentTime >= 1080 && currentTime <= 1320);
      }
    }
    
    // Appliquer le statut au jour actuel uniquement
    const dayMap = {0: 'dimanche', 1: 'lundi', 2: 'mardi', 3: 'mercredi', 4: 'jeudi', 5: 'vendredi', 6: 'samedi'};
    if (dayText.includes(dayMap[day])) {
      card.classList.add(isOpen ? 'status-open' : 'status-closed');
      const badge = card.querySelector('.status-badge');
      if (badge) {
        badge.textContent = isOpen ? 'Ouvert maintenant' : 'Fermé';
      }
    }
  });
}

// CSS Animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
