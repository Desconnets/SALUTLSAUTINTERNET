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
  const label = `${category.label} ${category.symbol}`;
  return { label, items };
}

function blockToHtml(block) {
  return block.items.map(item => `
    <div class="news-item">
      <span class="news-item-title">${item.title}</span> <span class="news-item-content">${item.content}</span>
    </div>
  `).join('');
}

function loadData() {
  newsData = typeof NEWS_DATA !== 'undefined' ? NEWS_DATA : newsData;
  renderButtons();
  showWelcome();
}

function showWelcome() {
  const info = document.querySelector('.screen-info');
  info.innerHTML = '<div class="screen-info-block"><p>Feel like a 2000s kid again. Clique à droite.</p></div>';
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
    const itemDiv = document.createElement('div');
    itemDiv.className = 'news-item';
    itemDiv.innerHTML = `<span class="news-item-title">${item.title}</span> <span class="news-item-content typewriter-target"></span>`;
    container.appendChild(itemDiv);

    const target = itemDiv.querySelector('.typewriter-target');
    const fullText = item.content;
    let i = 0;

    function typeNext() {
      if (i < fullText.length) {
        target.textContent += fullText[i];
        i++;
        info.scrollTop = info.scrollHeight;
        setTimeout(typeNext, TYPE_SPEED);
      } else {
        itemIndex++;
        setTimeout(typeNextItem, 50);
      }
    }

    typeNext();
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
