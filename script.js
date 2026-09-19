 (function () {
  'use strict';

  /* ---------- SETTINGS (edit these) ---------- */
  var WHATSAPP_NUMBER = '2349168716925';
  var BUSINESS_NAME = 'Pinpoint Kitchen, Lounge & Suites';
  var OPEN_MINUTES = 8 * 60;    // 8:00am
  var CLOSE_MINUTES = 22 * 60;  // 10:00pm

  /* ---------- MENU DATA (prices in Naira) ---------- */
  var MENU = [
    {
      label: 'Rice & Pasta',
      items: [
        { name: 'Jollof rice', price: 1900 },
        { name: 'Oil rice', price: 1900 },
        { name: 'Fried rice', price: 2000 },
        { name: 'Pineapple rice', price: 3500 },
        { name: 'Spaghetti', price: 1500 }
      ]
    },
    {
      label: 'Soups & Sides',
      items: [
        { name: 'Okro seafood', price: 700 },
        { name: 'Banga soup', price: 400 },
        { name: 'Peppered gizzard', price: 1500 },
        { name: 'Snail portion', price: 2000 },
        { name: 'Plantain portion', price: 1000 },
        { name: 'Moi-moi', price: 1000 }
      ]
    },
    {
      label: 'Chicken & Snacks',
      items: [
        { name: 'Chicken and chips', price: 7000 },
        { name: 'Chicken wings', price: 2000 },
        { name: 'Turkey', price: 6500 },
        { name: 'Chicken pie', price: 1000 }
      ]
    },
    {
      label: 'Drinks & Dessert',
      items: [
        { name: 'Can fanta, sprite, coke', price: 900 },
        { name: 'Fayrouz', price: 1400 },
        { name: 'Monster', price: 3000 },
        { name: 'Parfait', price: 3500 }
      ]
    }
  ];

  /* ---------- HELPERS ---------- */
  function whatsappLink(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function formatPrice(amount) {
    return '\u20A6' + amount.toLocaleString('en-US');
  }

  /* ---------- WHATSAPP LINKS WITH PRE-FILLED MESSAGES ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (el) {
    el.href = whatsappLink(el.getAttribute('data-wa'));
  });

  /* ---------- MENU TABS + LIST ---------- */
  var tabsEl = document.getElementById('menuTabs');
  var listEl = document.getElementById('menuList');

  function showCategory(index) {
    var category = MENU[index];
    listEl.innerHTML = '';

    category.items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'dish';

      var info = document.createElement('div');
      var name = document.createElement('span');
      name.className = 'dish__name';
      name.textContent = item.name;
      var price = document.createElement('span');
      price.className = 'dish__price';
      price.textContent = formatPrice(item.price);
      info.appendChild(name);
      info.appendChild(price);

      var order = document.createElement('a');
      order.className = 'dish__order';
      order.href = whatsappLink(
        'Hello ' + BUSINESS_NAME + ', I would like to order: ' + item.name + ' (' + formatPrice(item.price) + ').'
      );
      order.target = '_blank';
      order.rel = 'noopener';
      order.textContent = 'Order';
      order.setAttribute('aria-label', 'Order ' + item.name + ' on WhatsApp');

      li.appendChild(info);
      li.appendChild(order);
      listEl.appendChild(li);
    });

    Array.prototype.forEach.call(tabsEl.children, function (btn, i) {
      btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
  }

  if (tabsEl && listEl) {
    MENU.forEach(function (category, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab';
      btn.textContent = category.label;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', function () { showCategory(i); });
      tabsEl.appendChild(btn);
    });
    showCategory(0);
  }

  /* ---------- OPEN / CLOSED BADGE (Lagos time) ---------- */
  function getLagosMinutes() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    var hours = 0;
    var minutes = 0;
    parts.forEach(function (part) {
      if (part.type === 'hour') { hours = parseInt(part.value, 10) % 24; }
      if (part.type === 'minute') { minutes = parseInt(part.value, 10); }
    });
    return hours * 60 + minutes;
  }

  function updateStatus() {
    var el = document.getElementById('status');
    if (!el) { return; }
    try {
      var now = getLagosMinutes();
      var isOpen = now >= OPEN_MINUTES && now < CLOSE_MINUTES;
      el.className = 'status ' + (isOpen ? 'is-open' : 'is-closed');
      el.textContent = isOpen ? 'Open now until 10:00pm' : 'Closed now. Opens daily at 8:00am';
    } catch (err) {
      /* keep the default text from the HTML */
    }
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- HEADER + MOBILE NAV ---------- */
  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');

  function setNav(open) {
    header.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', open);
  }

  navToggle.addEventListener('click', function () {
    setNav(!header.classList.contains('is-open'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { setNav(false); }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900) { setNav(false); }
  });

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- GALLERY PHOTO VIEWER ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCount = document.getElementById('lbCount');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var current = 0;
  var lastFocus = null;
  var touchStartX = 0;

  function showPhoto(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    lbImg.src = item.getAttribute('data-full');
    lbImg.alt = item.getAttribute('data-alt') || '';
    lbCount.textContent = (current + 1) + ' / ' + items.length;
  }

  function openLightbox(index) {
    lastFocus = document.activeElement;
    showPhoto(index);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.removeAttribute('src');
    document.body.classList.remove('no-scroll');
    if (lastFocus) { lastFocus.focus(); }
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { showPhoto(current - 1); });
  lbNext.addEventListener('click', function () { showPhoto(current + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) { closeLightbox(); }
  });

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    var deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      showPhoto(deltaX < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!lightbox.hidden) { closeLightbox(); }
      setNav(false);
    }
    if (!lightbox.hidden) {
      if (e.key === 'ArrowLeft') { showPhoto(current - 1); }
      if (e.key === 'ArrowRight') { showPhoto(current + 1); }
    }
  });

  /* ---------- FOOTER YEAR ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
