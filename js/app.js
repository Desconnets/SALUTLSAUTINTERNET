// --- App actualités régionales ---
// Titres surlignés (couleurs inversées), saut de ligne entre chaque actualité

let newsData = { categories: [], items: [] };
let contentHistory = [];
let isTyping = false;
const TYPE_SPEED = 25;

function getCategory(categoryId) {
  return newsData.categories.find(c => c.id === categoryId);
}

function getItemsForCategory(categoryId) {
  return newsData.items.filter(i => i.categoryId === categoryId);
}

function formatCategoryBlock(category, items) {
  const subtitle = category.subtitle ? ` — ${category.subtitle}` : '';
  const label = `${category.label} ${category.symbol}${subtitle}`;
  return { label, items, category };
}

function formatEventItem(item) {
  const mediaHtml = (item.media && item.media.url) ? `<div class="news-item-media">${item.media.type === 'link' ? `<a href="${item.media.url}" target="_blank" rel="noopener">${item.media.label || item.media.url}</a>` : `<img src="${item.media.url}" alt="" loading="lazy">`}</div>` : '';
  if (item.date || item.time || item.address) {
    const meta = [];
    if (item.date && item.time) meta.push(`${item.date} • ${item.time}`);
    else if (item.date) meta.push(item.date);
    else if (item.time && item.time !== '—') meta.push(item.time);
    if (item.address) meta.push(item.address);
    return `
    <div class="news-item news-item-event">
      <span class="news-item-title">${item.title}</span>
      <div class="news-item-meta">${meta.join('<br>')}</div>
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
  function step() {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
      const info = document.querySelector('.screen-info');
      if (info) info.scrollTop = info.scrollHeight;
      setTimeout(step, TYPE_SPEED);
    } else if (onComplete) {
      setTimeout(onComplete, 50);
    }
  }
  step();
}

function loadData() {
  newsData = typeof NEWS_DATA !== 'undefined' ? NEWS_DATA : newsData;
  renderButtons();
  showWelcome();
}

function appendMedia(container, media) {
  if (!media || !media.url) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'news-item-media';
  if (media.type === 'link') {
    const a = document.createElement('a');
    a.href = media.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = media.label || media.url;
    wrapper.appendChild(a);
  } else {
    const img = document.createElement('img');
    img.src = media.url;
    img.alt = '';
    img.loading = 'lazy';
    wrapper.classList.add('media-reveal');
    wrapper.appendChild(img);
  }
  container.appendChild(wrapper);
}

function showWelcome() {
  const info = document.querySelector('.screen-info');
  const welcomeText = 'Feel like a 2000s kid again. Clique pour explorer.';
  const welcomeMedia = typeof WELCOME_MEDIA !== 'undefined' ? WELCOME_MEDIA : '';
  info.innerHTML = '<div class="screen-info-block"><p><span class="typewriter-target"></span></p><div class="welcome-media"></div></div>';
  const target = info.querySelector('.typewriter-target');
  const mediaContainer = info.querySelector('.welcome-media');
  isTyping = true;
  setButtonsEnabled(false);
  typeText(target, welcomeText, () => {
    if (welcomeMedia) {
      appendMedia(mediaContainer, { type: 'gif', url: welcomeMedia });
    }
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
    <div class="screen-info-block">
      <h2>${block.label}</h2>
      <div class="news-items">${blockToHtml(block)}</div>
    </div>
  `).join('');

  html += `
    <div class="screen-info-block screen-info-block-typing">
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
      isTyping = false;
      setButtonsEnabled(true);
      return;
    }

    const item = lastBlock.items[itemIndex];
    const hasEventMeta = item.date || item.time || item.address;
    const itemDiv = document.createElement('div');
    itemDiv.className = hasEventMeta ? 'news-item news-item-event' : 'news-item';

    if (hasEventMeta) {
      const meta = [];
      if (item.date && item.time) meta.push(`${item.date} • ${item.time}`);
      else if (item.date) meta.push(item.date);
      else if (item.time && item.time !== '—') meta.push(item.time);
      if (item.address) meta.push(item.address);
      const metaText = meta.join(' • ');
      itemDiv.innerHTML = '<span class="news-item-title typewriter-target"></span><div class="news-item-meta typewriter-target"></div><span class="news-item-content typewriter-target"></span>';
      container.appendChild(itemDiv);
      const titleEl = itemDiv.querySelector('.news-item-title');
      const metaEl = itemDiv.querySelector('.news-item-meta');
      const contentEl = itemDiv.querySelectorAll('.news-item-content')[0];
      typeText(titleEl, item.title, () => {
        typeText(metaEl, metaText, () => {
          typeText(contentEl, item.content || '', () => {
            metaEl.innerHTML = metaText.replace(/ • /g, '<br>');
            if (item.media && item.media.url) appendMedia(itemDiv, item.media);
            itemIndex++;
            setTimeout(typeNextItem, 50);
          });
        });
      });
    } else {
      itemDiv.innerHTML = '<span class="news-item-title typewriter-target"></span> <span class="news-item-content typewriter-target"></span>';
      container.appendChild(itemDiv);
      const titleEl = itemDiv.querySelector('.news-item-title');
      const contentEl = itemDiv.querySelector('.news-item-content');
      typeText(titleEl, item.title, () => {
        typeText(contentEl, ' ' + (item.content || ''), () => {
          if (item.media && item.media.url) appendMedia(itemDiv, item.media);
          itemIndex++;
          setTimeout(typeNextItem, 50);
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

document.addEventListener('DOMContentLoaded', loadData);
