// --- App "Salut Salut Internet" ---
// Fenêtre unique façon écran CRT avec chapitres (Prog / Flashback / Qui on est)
// et cartes d'événements normalisées :
// - Titre de chapitre (h2) = category.heading (ton éditorial années 2000)
// - Carte événement :
//   1) Bandeau de titre (.news-item-title) :
//      "[date_sans_jour] — [titre_court]" (voir getEventTitleLabel)
//   2) Meta (.news-item-meta) : "date • heure • adresse"
//   3) Texte (.news-item-content)
//   4) Media (.news-item-media) : spécifique ou fallback aléatoire

let newsData = { categories: [], items: [] };
let contentHistory = [];
let isTyping = false;
const TYPE_SPEED = 20;
// Délai approximatif de l’animation des médias (CSS media-scan)
const MEDIA_ANIM_DELAY_MS = 1400;

// Médias par défaut à utiliser quand un événement (ou l'écran d'accueil)
// n'a pas encore d'image / gif associé.
// Pour ajouter ou retirer des GIF par défaut, il suffit de modifier
// cette liste de chemins, sans toucher au reste du code.
// NOTE: si un jour on veut optimiser un peu plus, on pourrait aussi
//       factoriser certains querySelector('.screen-info') récurrents,
//       mais ce n'est pas critique vu la taille de l'app.
const DEFAULT_MEDIA_URLS = [
  'assets/img/default-01.gif',
  'assets/img/default-02.gif',
  'assets/img/default-03.gif',
  'assets/img/default-04.gif',
  'assets/img/default-05.gif',
];
let lastDefaultMediaIndex = -1;

function getDefaultMedia() {
  if (!DEFAULT_MEDIA_URLS.length) return null;
  let index = Math.floor(Math.random() * DEFAULT_MEDIA_URLS.length);
  if (DEFAULT_MEDIA_URLS.length > 1 && index === lastDefaultMediaIndex) {
    index = (index + 1) % DEFAULT_MEDIA_URLS.length;
  }
  lastDefaultMediaIndex = index;
  return { type: 'image', url: DEFAULT_MEDIA_URLS[index] };
}

function normalizeMedia(raw) {
  if (!raw) return null;
  // Nouveau format (Decap) : champ "media" = simple string (chemin d'image)
  if (typeof raw === 'string') {
    return { type: 'image', url: raw };
  }
  // Ancien format : objet { type, url }
  return raw;
}

function getCategory(categoryId) {
  return newsData.categories.find(c => c.id === categoryId);
}

function getItemsForCategory(categoryId) {
  return newsData.items.filter(i => i.categoryId === categoryId);
}

function formatCategoryBlock(category, items) {
  // Titre de chapitre affiché dans la fenêtre.
  // Priorité :
  // 1) category.heading (texte éditorial court, style années 2000) si présent
  // 2) fallback sur label + symbol (+ éventuel sous-titre)
  let heading;
  if (category.heading) {
    heading = category.heading;
  } else if (category.subtitle) {
    heading = `${category.label} ${category.symbol} — ${category.subtitle}`;
  } else {
    heading = `${category.label} ${category.symbol}`;
  }
  return { label: heading, items, category };
}

function buildMetaParts(item) {
  const meta = [];
  // Nouvelle règle éditoriale :
  // la date est déjà dans le bandeau de titre de l'événement,
  // donc la meta ne contient plus QUE l'horaire et le lieu.
  if (item.time && item.time !== '—') meta.push(item.time);
  if (item.address) meta.push(item.address);
  return meta;
}

function getDateWithoutWeekday(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split(',');
  // Ex: "Ven, 6 févr. 2026" -> "6 févr. 2026"
  return (parts.length > 1 ? parts[1] : parts[0]).trim();
}

function getEventTitleLabel(item) {
  const baseTitle = item.title || '';
  const dateLabel = getDateWithoutWeekday(item.date || '');
  return dateLabel ? `${dateLabel} — ${baseTitle}` : baseTitle;
}

function formatEventItem(item) {
  const mediaObj = normalizeMedia(item.media);
  const effectiveMedia = (mediaObj && mediaObj.url) ? mediaObj : getDefaultMedia();
  const mediaHtml = (effectiveMedia && effectiveMedia.url)
    ? (
        effectiveMedia.type === 'link'
          ? `<div class="news-item-media"><a href="${effectiveMedia.url}" target="_blank" rel="noopener">${effectiveMedia.label || effectiveMedia.url}</a></div>`
          // Pour l'historique déjà affiché, on ne remet PAS la classe
          // "media-reveal" pour éviter de relancer l'animation quand
          // un nouveau bloc est déclenché.
          : `<div class="news-item-media"><img src="${effectiveMedia.url}" alt="" loading="lazy"></div>`
      )
    : '';
  if (item.date || item.time || item.address) {
    const meta = buildMetaParts(item);
    return `
    <div class="news-item news-item-event">
      <span class="news-item-title">${getEventTitleLabel(item)}</span>
      <div class="news-item-meta">${meta.join(' • ')}</div>
      <span class="news-item-content">${item.content}</span>${mediaHtml}
    </div>`;
  }
  return `
    <div class="news-item">
      <span class="news-item-title">${item.title}</span> <span class="news-item-content">${item.content}</span>${mediaHtml}
    </div>`;
}

function blockToHtml(block) {
  return block.items.map(item => formatEventItem(item)).join('');
}

function typeText(element, text, onComplete) {
  let i = 0;

  // On encapsule le texte dans un span dédié pour pouvoir garder le curseur
  // toujours à la fin, SANS qu'il saute à la ligne.
  const textSpan = document.createElement('span');
  textSpan.className = 'typing-text';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';

  // On vide l'élément cible et on remet notre duo (texte + curseur) dedans.
  element.textContent = '';
  element.appendChild(textSpan);
  element.appendChild(cursor);

  function cleanupCursor() {
    if (cursor && cursor.parentNode) {
      cursor.parentNode.removeChild(cursor);
    }
  }

  function step() {
    if (i < text.length) {
      textSpan.textContent += text[i];
      i++;
      const info = document.querySelector('.screen-info');
      if (info) info.scrollTop = info.scrollHeight;
      setTimeout(step, TYPE_SPEED);
    } else {
      cleanupCursor();
      if (onComplete) {
        setTimeout(onComplete, 50);
      }
    }
  }

  step();
}

let editorialData = null; // Contenu chargé depuis content/editorial.json (Decap CMS)

function loadData() {
  // TEMP : on désactive editorial.json et on se base
  // uniquement sur NEWS_DATA (js/data.js), le temps
  // que le CMS soit stabilisé.
  if (typeof NEWS_DATA !== 'undefined') {
    newsData = { categories: NEWS_DATA.categories, items: NEWS_DATA.items };
  }
  initApp();
}

function initApp() {
  renderButtons();
  showWelcome();
}

function appendMedia(container, media) {
  const mediaObj = normalizeMedia(media);
  const effectiveMedia = (mediaObj && mediaObj.url) ? mediaObj : getDefaultMedia();
  if (!effectiveMedia || !effectiveMedia.url) return false;
  const wrapper = document.createElement('div');
  wrapper.className = 'news-item-media';
  if (effectiveMedia.type === 'link') {
    const a = document.createElement('a');
    a.href = effectiveMedia.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = effectiveMedia.label || effectiveMedia.url;
    wrapper.appendChild(a);
  } else {
    const img = document.createElement('img');
    img.src = effectiveMedia.url;
    img.alt = '';
    img.loading = 'lazy';
    wrapper.classList.add('media-reveal');
    wrapper.appendChild(img);
  }
  container.appendChild(wrapper);
  // S'assurer que la zone d'infos suit l'apparition du média
  const infoEl = document.querySelector('.screen-info');
  if (infoEl) infoEl.scrollTop = infoEl.scrollHeight;
  return true;
}

function showWelcome() {
  const info = document.querySelector('.screen-info');
  const welcomeText = 'Feel like a 2000s kid again. Clique pour explorer.';
  info.innerHTML = '<div class="screen-info-block"><p><span class="typewriter-target"></span></p><div class="welcome-media"></div></div>';
  const target = info.querySelector('.typewriter-target');
  const mediaContainer = info.querySelector('.welcome-media');
  isTyping = true;
  setButtonsEnabled(false);
  typeText(target, welcomeText, () => {
    // Pour l'écran d'accueil, on utilise la même mécanique
    // que pour les événements : si aucun média n'est fourni,
    // on pioche un GIF / une image par défaut dans DEFAULT_MEDIA_URLS.
    //
    // Ici on force volontairement l'utilisation du fallback par défaut
    // (pas de média spécifique passé), ce qui évite aussi les 404
    // si un ancien chemin de type "assets/img/welcome.gif" traîne encore.
    appendMedia(mediaContainer, null);
    const infoEl = document.querySelector('.screen-info');
    if (infoEl) infoEl.scrollTop = infoEl.scrollHeight;
    isTyping = false;
    setButtonsEnabled(true);
  });
}

function addToHistory(block) {
  contentHistory.push({ ...block });
}

function setButtonsEnabled(enabled) {
  document.querySelectorAll('.screen-controls button').forEach(btn => {
    btn.disabled = !enabled;
  });
}

function renderHistoryAndType() {
  const info = document.querySelector('.screen-info');
  if (contentHistory.length === 0) {
    showWelcome();
    return;
  }

  const fullBlocks = contentHistory.slice(0, -1);
  const lastBlock = contentHistory[contentHistory.length - 1];

  let html = fullBlocks.map(block => `
    <div class="screen-info-block screen-info-block--${block.category.id}">
      <h2>${block.label}</h2>
      <div class="news-items">${blockToHtml(block)}</div>
    </div>
  `).join('');

  html += `
    <div class="screen-info-block screen-info-block--${lastBlock.category.id} screen-info-block-typing">
      <h2>${lastBlock.label}</h2>
      <div class="news-items" id="typing-container"></div>
    </div>
  `;

  info.innerHTML = html;
  info.scrollTop = info.scrollHeight;

  isTyping = true;
  setButtonsEnabled(false);

  const container = document.getElementById('typing-container');
  let itemIndex = 0;

  function typeNextItem() {
    if (itemIndex >= lastBlock.items.length) {
      document.querySelector('.screen-info-block-typing').classList.remove('screen-info-block-typing');
       // S'assurer qu'à la fin du dernier événement, on est bien scrolled en bas
       const infoEnd = document.querySelector('.screen-info');
       if (infoEnd) infoEnd.scrollTop = infoEnd.scrollHeight;
      isTyping = false;
      setButtonsEnabled(true);
      return;
    }

    const item = lastBlock.items[itemIndex];
    const hasEventMeta = item.date || item.time || item.address;
    const itemDiv = document.createElement('div');
    itemDiv.className = hasEventMeta ? 'news-item news-item-event' : 'news-item';

    if (hasEventMeta) {
      const metaText = buildMetaParts(item).join(' • ');
      itemDiv.innerHTML = '<span class="news-item-title typewriter-target"></span><div class="news-item-meta typewriter-target"></div><span class="news-item-content typewriter-target"></span>';
      container.appendChild(itemDiv);
      // On "pré-shoot" le scroll dès qu'un nouvel événement est inséré,
      // pour réserver la place du texte + média et garder le bloc visible.
      const infoOnInsert = document.querySelector('.screen-info');
      if (infoOnInsert) infoOnInsert.scrollTop = infoOnInsert.scrollHeight;
      const titleEl = itemDiv.querySelector('.news-item-title');
      const metaEl = itemDiv.querySelector('.news-item-meta');
      const contentEl = itemDiv.querySelectorAll('.news-item-content')[0];
      const rawContent = item.content || '';
      const normalizedContent = rawContent.replace(/\\n/g, '\n');
      typeText(titleEl, getEventTitleLabel(item), () => {
        typeText(metaEl, metaText, () => {
          typeText(contentEl, normalizedContent, () => {
            // Toujours appeler appendMedia : s'il n'y a pas de media spécifique,
            // un fallback par défaut sera utilisé.
            const hadMedia = appendMedia(itemDiv, item.media);
            itemIndex++;
            // Si un media est présent, on laisse le temps à l’animation
            // de se jouer avant de passer à l’événement suivant.
            setTimeout(typeNextItem, hadMedia ? MEDIA_ANIM_DELAY_MS : 50);
          });
        });
      });
    } else {
      itemDiv.innerHTML = '<span class="news-item-title typewriter-target"></span> <span class="news-item-content typewriter-target"></span>';
      container.appendChild(itemDiv);
      const infoOnInsert = document.querySelector('.screen-info');
      if (infoOnInsert) infoOnInsert.scrollTop = infoOnInsert.scrollHeight;
      const titleEl = itemDiv.querySelector('.news-item-title');
      const contentEl = itemDiv.querySelector('.news-item-content');
      const rawContent2 = item.content || '';
      const normalizedContent2 = (' ' + rawContent2).replace(/\\n/g, '\n');
      typeText(titleEl, getEventTitleLabel(item), () => {
        typeText(contentEl, normalizedContent2, () => {
          // Idem ici : fallback si aucun media n'est défini.
          const hadMedia = appendMedia(itemDiv, item.media);
          itemIndex++;
          setTimeout(typeNextItem, hadMedia ? MEDIA_ANIM_DELAY_MS : 50);
        });
      });
    }
  }

  typeNextItem();
}

function renderButtons() {
  const container = document.querySelector('.screen-controls');
  container.innerHTML = newsData.categories
    .map(cat => `<button data-id="${cat.id}">${cat.label} ${cat.symbol}</button>`)
    .join('');

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTyping) return;
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const categoryId = btn.dataset.id;
      const category = getCategory(categoryId);
      const items = getItemsForCategory(categoryId);
      if (category && items.length) {
        const block = formatCategoryBlock(category, items);
        addToHistory(block);
        renderHistoryAndType();
      }
    });
  });
}

function initThemeToggle() {
  const root = document.documentElement; // <html>
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  // Si aucun thème n'est posé explicitement, on part sur le thème CLAIR par défaut
  if (!root.classList.contains('theme-dark') && !root.classList.contains('theme-light')) {
    root.classList.add('theme-light');
  }

  function syncLabel() {
    const isDark = root.classList.contains('theme-dark');
    // Icône seule : lune pour sombre, soleil pour clair
    toggle.textContent = isDark ? '☾' : '☼';
    toggle.setAttribute('aria-pressed', String(!isDark));
    toggle.setAttribute('aria-label', isDark ? 'Basculer en thème clair' : 'Basculer en thème sombre');
  }

  toggle.addEventListener('click', () => {
    const isDark = root.classList.contains('theme-dark');
    root.classList.toggle('theme-dark', !isDark);
    root.classList.toggle('theme-light', isDark);
    syncLabel();
  });

  syncLabel();
}

// --- Stickers tombants (fun) : gravité, rebond en bas, clic = repart en haut et disparaît ---
// Si l’internaute ne clique pas, un nouveau du même type tombe à intervalles → la page se remplit.
const STICKER_SIZE_PX = 200;
const STICKER_GRAVITY = 0.35;
const STICKER_BOUNCE = 0.6;
const STICKER_REST_THRESHOLD = 0.5;
const STICKER_FLY_UP_SPEED = -14;
const STICKER_FIRST_DELAY_MS = 2500;
const STICKER_SPAWN_INTERVAL_MS = 60000;
const STICKER_MAX_ON_SCREEN = 7;

let fallingStickerCount = 0;

function spawnFallingSticker(url) {
  if (fallingStickerCount >= STICKER_MAX_ON_SCREEN) return;
  fallingStickerCount += 1;
  const img = document.createElement('img');
  img.className = 'falling-sticker';
  img.src = url;
  img.alt = '';
  img.draggable = false;

  const w = window.innerWidth;
  const h = window.innerHeight;
  const floor = h - STICKER_SIZE_PX;
  let x = Math.max(0, Math.random() * (w - STICKER_SIZE_PX));
  let y = -STICKER_SIZE_PX;
  let vy = 0;
  let rotation = 0;
  let resting = false;
  let flyAway = false;
  let rafId = null;

  img.style.left = `${x}px`;
  img.style.top = `${y}px`;

  function tick() {
    if (flyAway) {
      // Phase "fly away" : accélération vers le HAUT + rotation.
      vy -= STICKER_GRAVITY * 0.6;
      y += vy;
      rotation += 9;
      img.style.top = `${y}px`;
      img.style.transform = `rotate(${rotation}deg)`;
      if (y < -STICKER_SIZE_PX * 2) {
        fallingStickerCount -= 1;
        img.remove();
        return;
      }
    } else if (!resting) {
      vy += STICKER_GRAVITY;
      y += vy;
      if (y >= floor) {
        y = floor;
        vy = -vy * STICKER_BOUNCE;
        if (Math.abs(vy) < STICKER_REST_THRESHOLD) {
          resting = true;
          vy = 0;
        }
      }
      img.style.top = `${y}px`;
    }
    rafId = requestAnimationFrame(tick);
  }

  img.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!resting || flyAway) return;
    flyAway = true;
    vy = STICKER_FLY_UP_SPEED;
    img.style.pointerEvents = 'none';
  });

  document.body.appendChild(img);
  rafId = requestAnimationFrame(tick);
}

function startStickerRain() {
  const urls = typeof FALLING_STICKER_URLS !== 'undefined' ? FALLING_STICKER_URLS : [];
  if (!urls.length) return;

  function randomStickerUrl() {
    return urls[Math.floor(Math.random() * urls.length)];
  }

  setTimeout(() => spawnFallingSticker(randomStickerUrl()), STICKER_FIRST_DELAY_MS);
  setInterval(() => spawnFallingSticker(randomStickerUrl()), STICKER_SPAWN_INTERVAL_MS);
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initThemeToggle();
  startStickerRain();
});
