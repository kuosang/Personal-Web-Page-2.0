(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Init: default active tag content
  const tagNote = document.getElementById('tagNote');
  if (tagNote) {
    tagNote.textContent = '通识和见识的边界会转化为人生与AI的边界';
    tagNote.hidden = false;
  }

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });

    mobileNav.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  }

  // Drawer detail content
  const DETAILS = {
    software: {
      search: {
        desc: '端到端 RAG 方案落地、答案质量评测体系、搜索体验革新\n\n探索从"关键词匹配"到"语义理解"的转化，优化意图识别与答案合成的流式响应体验。',
      },
      cs: {
        desc: '企业知识库构建、多轮对话流程编排、人工兜底与大模型切换\n\n设计复杂的任务型对话流，实现业务闭环。',
      },
      chat: {
        desc: '人格化与一致性塑造、长短期记忆管理、情感价值输出\n\n系统性定义 AI 角色，做个性化陪伴与有温度的交互。',
      },
    },
    hardware: {
      device: {
        desc: '情绪感知与响应、低干扰交互设计、场景自适应提醒',
      },
      multi: {
        desc: '声光电协同体验、跨模态语义映射',
      },
      edge: {
        desc: '端侧隐私保护、OTA 持续进化',
      },
    },
    pm: {
      strategy: {
        desc: '核心价值锚点定位、商业闭环路径探索、技术边界权衡\n\n在大模型能力极限与用户真实需求之间寻找平衡点，定义 AI 产品在特定场景下的"必选理由"与差异化优势。',
      },
      prd: {
        desc: '逻辑严密的文档编写、多方协同机制、敏捷迭代与落地\n\n包含详细的边缘情况处理、AI 异常回复策略以及核心业务逻辑的流程拆解。',
      },
      eval: {
        desc: '指标体系建立、质量回溯与监控、方法论沉淀\n\n针对AI产品展开多维度评测体系，制定评测标准，完成优化升级迭代。',
      },
    },
  };

  function renderDrawer(wrap, expKey, itemKey) {
    const detail = DETAILS?.[expKey]?.[itemKey];
    if (!detail) return;

    const third = wrap.querySelector('.exp-third');
    if (!third) return;

    third.innerHTML = `<p class="third-desc" style="white-space:pre-line;line-height:1.9;font-size:14px;color:rgba(17,17,17,.60)">${detail.desc}</p>`;
  }

  function setSelectedItem(wrap, item) {
    const group = Array.from(wrap.querySelectorAll('.panel-item'));
    group.forEach((x) => {
      const selected = x === item;
      x.classList.toggle('is-selected', selected);
      x.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  const backdrop = null;
  let activeWrap = null;

  function closeDrawer() {}

  // Experience cards + panels
  const expCards = Array.from(document.querySelectorAll('.exp-card'));
  const panels = {
    software: document.getElementById('softwarePanel'),
    hardware: document.getElementById('hardwarePanel'),
    pm: document.getElementById('pmPanel'),
  };

  function setActiveExp(key) {
    // 切换大类时先收起抽屉，避免不必要的遮罩/滚动锁和重绘
    closeDrawer();

    expCards.forEach((c) => c.classList.toggle('is-active', c.dataset.exp === key));
    Object.entries(panels).forEach(([k, el]) => {
      if (!el) return;
      el.style.display = k === key ? 'block' : 'none';
    });

    // 默认不自动打开抽屉：等用户点二级菜单项再打开
  }


  expCards.forEach((btn) => {
    btn.addEventListener('click', () => setActiveExp(btn.dataset.exp));
  });

  // Click interactions (event delegation)
  document.addEventListener('click', (e) => {
    // Prevent placeholder anchors jumping to top
    const placeholderLink = e.target.closest('a[href="#"]');
    if (placeholderLink) {
      e.preventDefault();
    }

    // Tags (hero)
    const tag = e.target.closest('.tag-pill');
    if (tag) {
      const map = {
        planner: '早点计划早点下班！',
        entj: '紫人大姐头，效率效率',
        chill: '发呆是创意的来源！',
        explore: '通识和见识的边界会转化为人生与AI的边界',
      };

      const note = document.getElementById('tagNote');
      const key = tag.dataset.tag;
      const text = map[key];

      // Toggle pressed state
      const pressed = tag.getAttribute('aria-pressed') === 'true';
      document.querySelectorAll('.tag-pill[aria-pressed="true"]').forEach((el) => {
        el.setAttribute('aria-pressed', 'false');
      });
      tag.setAttribute('aria-pressed', pressed ? 'false' : 'true');

      if (note) {
        if (pressed || !text) {
          note.hidden = true;
          note.textContent = '';
        } else {
          note.textContent = text;
          note.hidden = false;
        }
      }
      return;
    }



    // Sharing tabs
    const shareTab = e.target.closest('.sharing-item[data-tab]');
    if (shareTab) {
      const tab = shareTab.dataset.tab;
      document.querySelectorAll('.sharing-item').forEach((el) => el.classList.remove('is-active'));
      document.querySelectorAll('.sharing-pane').forEach((el) => el.classList.remove('is-active'));
      shareTab.classList.add('is-active');
      const pane = document.querySelector(`.sharing-pane[data-pane="${tab}"]`);
      if (pane) pane.classList.add('is-active');
      return;
    }


    // Sharing posts: flip card
    const post = e.target.closest('.post-card');
    if (post) {
      const flipped = post.classList.toggle('is-flipped');
      post.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      const back = post.querySelector('.post-back');
      if (back) back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
      return;
    }


    const item = e.target.closest('.panel-item');
    if (item) {
      const wrap = item.closest('.exp-panel-wrap');
      if (!wrap) return;

      const expKey = wrap.querySelector('.exp-detail')?.dataset?.exp;
      if (!expKey) return;

      setSelectedItem(wrap, item);
      renderDrawer(wrap, expKey, item.dataset.item);
      return;
    }

    // Close button
    const closeBtn = e.target.closest('.drawer-close');
    if (closeBtn) {
      closeDrawer();
      return;
    }

    // Backdrop click
    if (backdrop && e.target === backdrop) {
      closeDrawer();
      return;
    }
  });



  // ESC close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Business direction tab navigation
  function initBizTabs() {
    const tabList = document.getElementById('bizTabs');
    const indicator = document.getElementById('bizTabIndicator');
    if (!tabList || !indicator) return;

    const tabs = Array.from(tabList.querySelectorAll('.biz-tab'));
    const panels = document.querySelectorAll('.biz-panel');
    if (!tabs.length) return;

    let activeTab = tabList.querySelector('.biz-tab.is-active') || tabs[0];

    function updateIndicator(tab) {
      if (!indicator || !tab) return;
      const rect = tab.getBoundingClientRect();
      const listRect = tabList.getBoundingClientRect();
      const left = rect.left - listRect.left;
      indicator.style.transform = `translateX(${left}px)`;
      indicator.style.width = `${rect.width}px`;
    }

    function activateTab(tab) {
      if (!tab) return;
      const key = tab.dataset.tab;

      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle('is-active', selected);
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
      });

      panels.forEach((p) => {
        const show = p.dataset.panel === key;
        if (show) {
          p.removeAttribute('hidden');
          // re-trigger animation
          p.style.animation = 'none';
          p.offsetHeight; // force reflow
          p.style.animation = '';
        } else {
          p.setAttribute('hidden', '');
        }
      });

      activeTab = tab;
      updateIndicator(tab);
    }

    // Click
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab));
    });

    // Keyboard: arrow left/right
    tabList.addEventListener('keydown', (e) => {
      const current = Array.from(tabs).indexOf(activeTab);
      if (current < 0) return;
      let next = current;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (current + 1) % tabs.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (current - 1 + tabs.length) % tabs.length;
        e.preventDefault();
      } else {
        return;
      }
      tabs[next].focus();
      activateTab(tabs[next]);
    });

    // Init: position indicator under active tab
    requestAnimationFrame(() => updateIndicator(activeTab));

    // Reposition on resize
    window.addEventListener('resize', () => updateIndicator(activeTab));
  }


  // Contact details toggle
  const contactToggle = document.getElementById('contactToggle');
  const contactDetails = document.getElementById('contactDetails');
  if (contactToggle && contactDetails) {
    contactToggle.addEventListener('click', () => {
      const expanded = contactToggle.getAttribute('aria-expanded') === 'true';
      contactToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      contactDetails.hidden = expanded;
    });
  }

  // Music Player
  (function initMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    const playBtn = document.getElementById('mpPlayBtn');
    const iconPlay = document.getElementById('mpIconPlay');
    const iconPause = document.getElementById('mpIconPause');
    const uploadBtn = document.getElementById('mpUploadBtn');
    const fileInput = document.getElementById('mpFileInput');
    const progressBar = document.getElementById('mpProgressBar');
    const progressFill = document.getElementById('mpProgressFill');
    const progressThumb = document.getElementById('mpProgressThumb');
    const currentEl = document.getElementById('mpCurrent');
    const durationEl = document.getElementById('mpDuration');
    const titleEl = document.getElementById('mpTitle');

    if (!player || !playBtn) return;

    const audio = new Audio('assets/music.mp3');
    audio.load();
    let isPlaying = false;
    let isDragging = false;

    // Show player by default
    player.hidden = false;
    titleEl.textContent = '拍拍灰-Everything will be ok';
    durationEl.textContent = '—';

    // Web Audio API setup (lazy init on first play)
    let audioCtx = null;
    let analyser = null;
    let sourceNode = null;
    let animFrameId = null;
    const mvBars = document.querySelectorAll('.mv-bar');
    const NUM_BARS = mvBars.length;

    function initWebAudio() {
      if (audioCtx) return;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        sourceNode = audioCtx.createMediaElementSource(audio);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
      } catch (e) {
        audioCtx = null;
      }
    }

    function startVisualizer() {
      if (!analyser || !audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const dataArr = new Uint8Array(analyser.frequencyBinCount);

      function draw() {
        animFrameId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArr);

        // Sample frequency bins across 5 bars
        const step = Math.floor(dataArr.length / NUM_BARS);
        mvBars.forEach((bar, i) => {
          // Average a small range around each sampled bin for smoother visuals
          let sum = 0;
          const start = i * step;
          for (let j = 0; j < step; j++) {
            sum += dataArr[Math.min(start + j, dataArr.length - 1)];
          }
          const avg = step > 0 ? sum / step : dataArr[start] || 0;
          const minH = 4;
          const maxH = 18;
          const h = minH + (avg / 255) * (maxH - minH);
          bar.style.height = h + 'px';
        });
      }
      draw();
    }

    function stopVisualizer() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      // Reset bars to idle
      mvBars.forEach((bar) => {
        bar.style.height = '';
        bar.style.animation = '';
      });
    }

    function formatTime(s) {
      if (isNaN(s) || s === Infinity) return '0:00';
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return m + ':' + String(sec).padStart(2, '0');
    }

    function updatePlayState(playing) {
      isPlaying = playing;
      player.classList.toggle('is-playing', playing);
      iconPlay.style.display = playing ? 'none' : '';
      iconPause.style.display = playing ? '' : 'none';
      playBtn.setAttribute('aria-label', playing ? '暂停' : '播放');
      if (playing) {
        initWebAudio();
        startVisualizer();
      } else {
        stopVisualizer();
      }
    }

    function updateProgress() {
      if (audio.duration && isFinite(audio.duration)) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + '%';
        progressThumb.style.left = pct + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(pct));
        currentEl.textContent = formatTime(audio.currentTime);
      }
    }

    // Load audio from file input
    function loadAudio(file) {
      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.load();
      const name = file.name.replace(/\.[^.]+$/, '');
      titleEl.textContent = name || '未命名音频';
      durationEl.textContent = formatTime(0);
      progressFill.style.width = '0%';
      progressThumb.style.left = '0%';
      updatePlayState(false);
    }

    // Events
    playBtn.addEventListener('click', () => {
      if (!audio.src || audio.readyState < 2) return;
      if (isPlaying) {
        audio.pause();
        updatePlayState(false);
      } else {
        audio.play().catch(() => {});
        updatePlayState(true);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!isDragging) updateProgress();
    });

    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
      progressBar.setAttribute('aria-valuemax', '100');
    });

    audio.addEventListener('ended', () => {
      updatePlayState(false);
      audio.currentTime = 0;
      updateProgress();
    });

    audio.addEventListener('play', () => updatePlayState(true));
    audio.addEventListener('pause', () => {
      if (!audio.ended) updatePlayState(false);
    });

    // Progress bar click / drag
    function seekTo(e) {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
      updateProgress();
    }

    progressBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      seekTo(e);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) seekTo(e);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    progressBar.addEventListener('keydown', (e) => {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
      else if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); }
      else return;
      updateProgress();
      e.preventDefault();
    });

    // Upload
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        loadAudio(fileInput.files[0]);
      }
    });

    // Keyboard: Space = play/pause (when player focused or global)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement === player) {
        e.preventDefault();
        playBtn.click();
      }
    });
  })();

  // Default
  setActiveExp('software');
  initBizTabs();
})();






