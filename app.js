(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

  // Drawer detail content (placeholder copy)
  const DETAILS = {
    software: {
      search: {
        title: 'AI 搜索',
        desc: '适用于知识检索、长文问答与企业内搜索。强调可解释、可溯源与可评测。',
        tags: ['RAG', '溯源', '评测'],
        points: ['召回/排序与答案合成的整体链路设计', '引用与证据展示，降低幻觉风险', '评测集、线上指标与迭代闭环'],
      },
      cs: {
        title: 'AI 客服',
        desc: '面向高频问题与标准流程场景，通过知识库+流程编排+人工兜底提升效率与满意度。',
        tags: ['知识库', '流程', '兜底'],
        points: ['多轮对话与工单/系统联动', '风险控制与触发人工介入', '命中率、转人工率、满意度等指标体系'],
      },
      chat: {
        title: 'AI 对话',
        desc: '关注对话体验、记忆一致性与人设稳定性，让用户感到“可培养、可成长”。',
        tags: ['体验', '记忆', '人设'],
        points: ['语气与风格一致的对话策略', '短期/长期记忆与隐私边界', '对话质量评测与持续迭代'],
      },
    },
    hardware: {
      device: {
        title: '陪伴设备',
        desc: '以低打扰为前提，提供温和陪伴与可持续互动（语音为主，辅以触觉/灯效）。',
        tags: ['陪伴', '低打扰', '情绪价值'],
        points: ['核心场景：睡前/通勤/独处时刻', '交互：少即是多，减少打断', '目标：长期留存与关系建立'],
      },
      multi: {
        title: '多模态交互',
        desc: '把语音、屏幕、触觉与灯效作为一个整体，设计清晰、克制的一致体验。',
        tags: ['语音', '触觉', '灯效'],
        points: ['输入输出的优先级与冲突处理', '弱网/噪声环境的降级策略', '动效与反馈的情绪张力控制'],
      },
      edge: {
        title: '端侧智能',
        desc: '在端侧能力与隐私约束下，规划模型、缓存与 OTA 的可持续迭代。',
        tags: ['隐私', '端侧推理', 'OTA'],
        points: ['端云协同与成本/时延权衡', '隐私与数据合规的边界', '版本灰度与体验一致性'],
      },
    },
    pm: {
      strategy: {
        title: '产品策略',
        desc: '用清晰的定位与边界，让团队知道“做什么/不做什么”，并能持续复盘。',
        tags: ['定位', '路线图', '增长'],
        points: ['用户洞察与价值主张', '路线图与里程碑拆解', '竞争分析与差异化叙事'],
      },
      prd: {
        title: 'PRD / 交付',
        desc: '把不确定的需求变成可交付的计划：定义验收、协作机制与风险兜底。',
        tags: ['PRD', '验收', '协作'],
        points: ['PRD 结构化与对齐', '跨团队协作与节奏管理', '灰度上线与问题闭环'],
      },
      eval: {
        title: '数据与评测',
        desc: '用指标体系与评测门槛保证质量，把迭代变成确定性提升。',
        tags: ['指标', '评测', '质量门槛'],
        points: ['离线评测集与线上指标对齐', '一票否决项与安全护栏', '实验设计与数据飞轮'],
      },
    },
  };

  const backdrop = document.getElementById('drawerBackdrop');
  let activeWrap = null;

  function setBackdrop(open) {
    if (!backdrop) return;
    backdrop.hidden = !open;
    document.body.classList.toggle('drawer-lock', open);
  }

  function closeDrawer() {
    if (!activeWrap) {
      setBackdrop(false);
      return;
    }
    activeWrap.classList.remove('is-drawer-open');
    const drawer = activeWrap.querySelector('.drawer');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
    activeWrap = null;
    setBackdrop(false);
  }

  function renderDrawer(wrap, expKey, itemKey) {
    const detail = DETAILS?.[expKey]?.[itemKey];
    if (!detail) return;

    const drawer = wrap.querySelector('.drawer');
    if (!drawer) return;

    const titleEl = drawer.querySelector('.drawer-title');
    const descEl = drawer.querySelector('.drawer-desc');
    const tagsEl = drawer.querySelector('.drawer-tags');
    const pointsEl = drawer.querySelector('.drawer-points');

    if (titleEl) titleEl.textContent = detail.title;
    if (descEl) descEl.textContent = detail.desc;

    if (tagsEl) {
      tagsEl.innerHTML = '';
      detail.tags.forEach((t) => {
        const s = document.createElement('span');
        s.className = 'drawer-tag';
        s.textContent = t;
        tagsEl.appendChild(s);
      });
    }

    if (pointsEl) {
      pointsEl.innerHTML = '';
      detail.points.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = p;
        pointsEl.appendChild(li);
      });
    }

    wrap.classList.add('is-drawer-open');
    drawer.setAttribute('aria-hidden', 'false');
    activeWrap = wrap;
    setBackdrop(true);
  }

  function setSelectedItem(wrap, item) {
    const group = Array.from(wrap.querySelectorAll('.panel-item'));
    group.forEach((x) => {
      const selected = x === item;
      x.classList.toggle('is-selected', selected);
      x.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

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

    // Projects: flip card
    const project = e.target.closest('.project-card');
    if (project) {
      const flipped = project.classList.toggle('is-flipped');
      project.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      const back = project.querySelector('.project-back');
      if (back) back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
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

  // Default
  setActiveExp('software');
})();




