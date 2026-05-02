/**
 * 归档页通用逻辑
 */

const ArchiveApp = {
  page: '',

  init(page) {
    this.page = page;
    this.initNav();

    if (page === 'b-side' && typeof SkadrateData !== 'undefined' && !SkadrateData.bSide.isUnlocked()) {
      this.renderBSideLock();
    } else {
      this.render();
    }

    if (page === 'gravity-rainbow') {
      this.ensureMarked();
    }
  },

  initNav() {
    const nav = document.querySelector('.archive-nav');
    if (!nav) return;
    nav.innerHTML = `
      <a href="../index.html" class="archive-nav-back">← 碎屑</a>
      <span class="archive-nav-title">${this.getPageTitle()}</span>
    `;
  },

  getPageTitle() {
    const map = {
      'scintilla': 'SCINTILLA // ARCHIVE',
      'inland-empire': '内陆帝国 // ARCHIVE',
      'gravity-rainbow': '万有引力之虹 // ARCHIVE',
      'b-side': 'B-SIDE // ARCHIVE'
    };
    return map[this.page] || '';
  },

  render() {
    const container = document.getElementById('archive-content');
    if (!container || typeof SkadrateData === 'undefined') return;

    const catMap = {
      'scintilla': 'scintilla',
      'inland-empire': 'inlandEmpire',
      'gravity-rainbow': 'gravityRainbow',
      'b-side': 'bSide'
    };
    const category = catMap[this.page];
    const items = SkadrateData.getAll(category);

    if (items.length === 0) {
      container.innerHTML = '<p class="archive-empty">暂无记录</p>';
      return;
    }

    if (this.page === 'scintilla') {
      container.innerHTML = items.map(it => `
        <article class="archive-sci-item">
          <time class="archive-sci-date">${escapeHtml(it.date)}</time>
          <p class="archive-sci-text">${escapeHtml(it.content)}</p>
        </article>
      `).join('');
    } else if (this.page === 'inland-empire') {
      container.innerHTML = items.map(it => `
        <div class="archive-ie-item">
          <img src="../${escapeHtml(it.src)}" alt="${escapeHtml(it.alt || '')}" loading="lazy">
          ${it.category ? `<span class="archive-ie-category">${escapeHtml(it.category)}</span>` : ''}
          ${it.caption ? `<span class="archive-ie-caption">${escapeHtml(it.caption)}</span>` : ''}
        </div>
      `).join('');
    } else if (this.page === 'gravity-rainbow') {
      container.innerHTML = items.map((it, idx) => `
        <article class="archive-gr-item">
          <time class="archive-gr-date">${escapeHtml(it.date)}</time>
          <h3 class="archive-gr-title">${escapeHtml(it.title)}</h3>
          ${it.tags && it.tags.length ? `<div class="archive-gr-tags">${it.tags.map(t => `<span class="archive-gr-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
          <div class="archive-gr-md">${this.renderMarkdown(it.mdContent)}</div>
        </article>
      `).join('');
      if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
        MathJax.typesetPromise([container]).catch(() => {});
      }
    } else if (this.page === 'b-side') {
      container.innerHTML = items.map(it => `
        <div class="archive-bs-item">
          <time class="archive-bs-date">${escapeHtml(it.date)}</time>
          <p>${escapeHtml(it.content)}</p>
        </div>
      `).join('');
    }
  },

  renderBSideLock() {
    const container = document.getElementById('archive-content');
    if (!container) return;
    container.innerHTML = `
      <div class="archive-bs-lock">
        <div class="archive-bs-lock-panel">
          <h3>B-SIDE ACCESS</h3>
          <input type="password" id="archive-bs-input" maxlength="4" placeholder="####" inputmode="numeric">
          <div class="archive-bs-hint">Hint: 生日</div>
          <button id="archive-bs-submit">UNLOCK</button>
        </div>
      </div>
    `;

    const input = document.getElementById('archive-bs-input');
    const submit = document.getElementById('archive-bs-submit');

    const tryUnlock = () => {
      if (input.value === '0910') {
        SkadrateData.bSide.unlock();
        this.render();
      } else {
        input.style.borderColor = 'var(--red)';
        setTimeout(() => { input.style.borderColor = ''; }, 600);
        input.value = '';
        input.focus();
      }
    };

    submit.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
    input.focus();
  },

  ensureMarked() {
    if (typeof marked !== 'undefined') return;
    // 如果通过 CDN 加载失败，提供一个极简降级
    window.marked = {
      parse: (text) => {
        return escapeHtml(text)
          .replace(/\n/g, '<br>')
          .replace(/^#{1,6}\s+(.+)$/gm, '<strong>$1</strong>');
      }
    };
  },

  renderMarkdown(md) {
    if (!md) return '';
    if (typeof marked !== 'undefined' && marked.parse) {
      return marked.parse(md);
    }
    return escapeHtml(md).replace(/\n/g, '<br>');
  }
};

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}
