/**
 * 碎屑 - 构成主义博客
 * 交互脚本和动画控制
 */

// ========================================
// 页面加载完成后初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // 初始化各项功能
  initNavScroll();
  initHeroAnimations();
  initScrollAnimations();
  initDiaryItems();
  initHoverEffects();
  initSmoothScroll();
  initScrollProgress();
});

// ========================================
// Hero 区域动画初始化
// ========================================
function initHeroAnimations() {
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const verticalText = document.querySelector('.hero-vertical-text');
  
  if (heroTitle) {
    setTimeout(() => { heroTitle.classList.add('visible'); }, 200);
  }
  
  if (heroSubtitle) {
    setTimeout(() => { heroSubtitle.classList.add('visible'); }, 1000);
  }

  if (verticalText) {
    setTimeout(() => { verticalText.classList.add('visible'); }, 1300);
  }
  
  const geoElements = [
    { selector: '.geo-rect-1', delay: 400 },
    { selector: '.geo-circle-1', delay: 600 },
    { selector: '.geo-rect-2', delay: 800 },
    { selector: '.geo-circle-2', delay: 1000 },
    { selector: '.geo-lines', delay: 1200 },
    { selector: '.geo-cross', delay: 1400 },
    { selector: '.geo-triangle', delay: 1600 },
  ];
  
  geoElements.forEach(({ selector, delay }) => {
    const element = document.querySelector(selector);
    if (element) {
      setTimeout(() => { element.classList.add('visible'); }, delay);
    }
  });
}

// ========================================
// 导航栏滚动效果
// ========================================
function initNavScroll() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // 添加/移除滚动状态
    if (currentScroll > 100) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
    
    // 隐藏/显示导航栏
    if (currentScroll > lastScroll && currentScroll > 200) {
      nav.style.transform = 'translateY(-100%) rotate(-1.5deg)';
    } else {
      nav.style.transform = 'translateY(0) rotate(-1.5deg)';
    }
    
    lastScroll = currentScroll;
  });
  
  // 添加滚动状态样式
  const style = document.createElement('style');
  style.textContent = `
    .nav {
      transition: transform 0.3s ease, background 0.3s ease;
    }
    .nav.nav-scrolled {
      background: rgba(26, 26, 26, 0.95);
      backdrop-filter: blur(10px);
    }
  `;
  document.head.appendChild(style);
}

// ========================================
// 滚动动画（Intersection Observer）
// ========================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // 添加延迟动画
        const delay = entry.target.dataset.delay || 0;
        entry.target.style.animationDelay = `${delay}ms`;
        
        // 动画完成后移除观察
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // 观察日记卡片
  document.querySelectorAll('.diary-item').forEach((item, index) => {
    item.dataset.delay = index * 100;
    observer.observe(item);
  });
  
  // 观察笔记卡片
  document.querySelectorAll('.note-item').forEach((item, index) => {
    item.dataset.delay = index * 150;
    observer.observe(item);
  });
  
  // 观察引用卡片
  document.querySelectorAll('.quotes-grid .quote-item').forEach((item, index) => {
    item.dataset.delay = index * 100;
    observer.observe(item);
  });
  
  // 观察摄影卡片
  document.querySelectorAll('.photo-item').forEach((item, index) => {
    item.dataset.delay = index * 80;
    observer.observe(item);
  });
}

// ========================================
// 日记项目特殊效果
// ========================================
function initDiaryItems() {
  const diaryItems = document.querySelectorAll('.diary-item');
  
  diaryItems.forEach(item => {
    // 添加鼠标移动视差效果
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * 3;
      const rotateY = (centerX - x) / centerX * 3;
      
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    item.addEventListener('mouseleave', () => {
      // 恢复原始状态
      const index = Array.from(diaryItems).indexOf(item);
      if (index % 2 === 0) {
        item.style.transform = 'rotate(-0.5deg)';
      } else {
        item.style.transform = 'rotate(0.5deg)';
      }
      item.style.transition = 'transform 0.5s ease';
      
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease';
      }, 500);
    });
  });
}

// ========================================
// 悬停效果增强
// ========================================
function initHoverEffects() {
  // 导航链接音效（可选）
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateX(5px)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateX(0)';
    });
  });
  
  // 摄影作品悬停效果增强
  const photoItems = document.querySelectorAll('.photo-item');
  photoItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // 获取当前旋转角度
      const transform = item.style.transform;
      const match = transform.match(/rotate\(([-\d.]+)deg\)/);
      const baseRotation = match ? parseFloat(match[1]) : 0;
      
      item.style.transform = `rotate(0deg) scale(1.05)`;
    });
  });
  
  // 页脚链接效果
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'scale(1.1)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'scale(1)';
    });
  });
}

// ========================================
// 平滑滚动
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// 滚动进度指示器
// ========================================
function initScrollProgress() {
  // 创建进度条
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  // 添加进度条样式
  const style = document.createElement('style');
  style.textContent = `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #C62828, #FBC02D);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // 更新进度
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

// ========================================
// 几何装饰动画增强
// ========================================
function initGeoDecorAnimations() {
  const geoElements = document.querySelectorAll('.geo-circle, .geo-rect, .geo-triangle');
  
  geoElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animationPlayState = 'paused';
      el.style.transform = el.style.transform + ' scale(1.1)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = el.style.transform.replace(' scale(1.1)', '');
      el.style.animationPlayState = 'running';
    });
  });
}

// ========================================
// 键盘导航支持
// ========================================
document.addEventListener('keydown', (e) => {
  // 按住 Shift + 点击链接返回顶部
  if (e.shiftKey && e.key === 'Home') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // 按住 Shift + 点击链接到底部
  if (e.shiftKey && e.key === 'End') {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// ========================================
// 窗口大小变化处理
// ========================================
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // 重新计算布局
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, 250);
});

// ========================================
// 页面可见性变化处理
// ========================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 页面隐藏时暂停动画
    document.body.style.animationPlayState = 'paused';
  } else {
    // 页面显示时恢复动画
    document.body.style.animationPlayState = 'running';
  }
});

// ========================================
// 导出公共 API（可选）
// ========================================
window.SuixieBlog = {
  scrollToSection: (id) => {
    const section = document.getElementById(id);
    if (section) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = section.offsetTop - navHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  },
  
  getReadingProgress: () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round((scrollTop / docHeight) * 100);
  }
};
