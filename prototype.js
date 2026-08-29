(() => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 120);
  }, { once: true });
  const mobilePages = [
    ["login", "登录"], ["user-agreement", "用户协议"], ["privacy-policy", "隐私政策"], ["public-home", "公共首页"], ["case-results", "落地案例"], ["institution-home", "机构首页"],
    ["brain-center", "脑健康中心"], ["brain-report", "脑健康报告"], ["brain-whitepaper", "报告白皮书"], ["ai-explain", "AI 心智助理"],
    ["training-plan", "训练方案"], ["warning-center", "预警干预"], ["personal-warning-list", "个人预警记录"],
    ["personal-warning-detail", "个人预警详情"], ["growth-archive", "成长档案"],
    ["assessment-list", "测评列表"], ["assessment-detail", "测评详情"], ["assessment-process", "测评答题"], ["assessment-result", "人格报告"], ["assessment-report-list", "人格报告列表"],
    ["knowledge-center", "心智课堂"], ["classroom-records", "课堂收藏记录"], ["profile-center", "个人中心"], ["quota-detail", "配额明细"], ["talent-center", "天赋潜能"],
    ["warning-detail", "预警详情"], ["knowledge-detail", "课堂内容详情"], ["message-center", "消息通知"], ["message-detail", "消息详情"], ["institution-binding", "绑定机构"],
    ["binding-review-list", "绑定审核"], ["binding-review-detail", "审核详情"],
    ["privacy-center", "隐私授权"], ["talent-report-list", "天赋报告列表"], ["talent-report", "天赋报告"], ["partner-apply", "合作入驻"],
    ["brain-report-list", "脑测评报告"], ["training-record-list", "训练复测记录"],
    ["training-record-detail", "训练记录详情"], ["profile-edit", "编辑资料"],
    ["password-change", "修改密码"], ["warning-record-form", "处置记录"],
    ["store-center", "套餐充值"], ["order-confirm", "确认订单"], ["payment-result", "支付结果"],
    ["order-list", "我的订单"], ["order-detail", "订单详情"], ["refund-form", "退款申请"]
  ];
  const adminPages = [
    ["platform-dashboard", "数据驾驶舱"], ["institution-management", "机构管理"],
    ["hierarchy-permission", "层级与权限"], ["binding-permission", "绑定审核权限"], ["private-config", "私有化配置"],
    ["quota-center", "配额资源"], ["device-api", "设备与接口"], ["warning-rules", "预警规则"],
    ["intervention-ledger", "干预台账"], ["ai-content", "AI 与内容"], ["reports-compliance", "报表与存证"],
    ["institution-form", "添加机构"], ["intervention-record-form", "处置表单"], ["member-binding", "成员与绑定"],
    ["member-form", "新增成员"], ["member-import", "批量导入成员"], ["hierarchy-form", "新增组织层级"],
    ["classroom-management", "心智课堂管理"], ["classroom-publish", "发布课堂内容"], ["classroom-category", "分类与上传权限"],
    ["commerce-center", "支付与商品"], ["product-form", "套餐配置"], ["order-management", "订单管理"],
    ["admin-order-detail", "订单详情"], ["voucher-config", "消费凭证"]
  ];

  const query = new URLSearchParams(location.search);
  const embed = query.get("embed") === "1";
  let mode = query.get("mode") === "admin" ? "admin" : "mobile";
  let page = query.get("page") || (mode === "mobile" ? "login" : "platform-dashboard");
  const frame = document.querySelector("#design-iframe");
  const layer = document.querySelector("#prototype-layer");
  let toastTimer;

  if (embed) document.body.classList.add("embed-mode");

  function pages() { return mode === "mobile" ? mobilePages : adminPages; }
  function pageTitle() { return pages().find(([id]) => id === page)?.[1] || page; }
  function frameUrl() { return `index.html?prototype=1&mode=${encodeURIComponent(mode)}&page=${encodeURIComponent(page)}`; }

  function renderShell() {
    document.querySelector(".prototype-shell")?.classList.toggle("admin-mode", mode === "admin");
    document.querySelector("#mobile-mode").classList.toggle("active", mode === "mobile");
    document.querySelector("#admin-mode").classList.toggle("active", mode === "admin");
    document.querySelector("#rail-title").textContent = mode === "mobile" ? "小程序页面" : "管理后台页面";
    document.querySelector("#rail-copy").textContent = mode === "mobile" ? "48 个页面均直接复用设计稿原始结构。" : "25 个后台页面均直接复用设计稿原始结构。";
    document.querySelector("#preview-title").textContent = pageTitle();
    document.querySelector("#preview-size").textContent = mode === "mobile" ? "390 × 844" : "1180 × 720";
    frame.className = `design-iframe ${mode}`;
    document.querySelector("#prototype-nav").innerHTML = pages().map(([id, title], index) => `<button class="${id === page ? "active" : ""}" data-page="${id}"><span class="page-number">${String(index + 1).padStart(2, "0")}</span>${title}</button>`).join("");
    if (embed) {
      document.body.style.width = mode === "mobile" ? "390px" : "1180px";
      document.body.style.height = mode === "mobile" ? "844px" : "720px";
    }
  }

  function show(nextPage, nextMode = mode, pushHistory = true) {
    mode = nextMode;
    const validPages = pages();
    page = validPages.some(([id]) => id === nextPage) ? nextPage : validPages[0][0];
    renderShell();
    const previewScroll = document.querySelector(".preview-scroll");
    if (previewScroll) previewScroll.scrollTop = 0;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => window.scrollTo(0, 0), 120);
    frame.contentWindow?.postMessage({ type: "naoluopan:show", mode, page }, "*");
    if (pushHistory && !embed) history.replaceState(null, "", `?mode=${mode}&page=${page}`);
  }

  function showToast(message) {
    layer.innerHTML = `<div class="prototype-toast">${message}</div>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { if (layer.querySelector(".prototype-toast")) layer.innerHTML = ""; }, 2100);
  }

  function closeLayer() { layer.innerHTML = ""; }
  function modalBody(type, data = {}) {
    if (type === "logout") return `<h2>退出登录</h2><p>确定退出当前脑罗盘账号吗？</p>`;
    return `<h2>${data.title || "确认操作"}</h2><p>${data.copy || "请确认是否继续当前操作。"}</p>`;
  }

  function openModal(type, data = {}) {
    const confirm = type === "logout" ? "确认退出" : "确认";
    layer.innerHTML = `<div class="prototype-modal" data-close="backdrop"><section class="modal-card" role="dialog" aria-modal="true">${modalBody(type, data)}<div class="modal-actions"><button class="modal-cancel" data-close="modal">取消</button><button class="modal-confirm" data-confirm="${type}">${confirm}</button></div></section></div>`;
  }

  frame.src = frameUrl();
  renderShell();

  document.addEventListener("click", event => {
    const modeButton = event.target.closest("[data-mode]");
    if (modeButton) return show(modeButton.dataset.mode === "mobile" ? "login" : "platform-dashboard", modeButton.dataset.mode);
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) return show(pageButton.dataset.page);
    if (event.target.closest("#reset-prototype")) {
      show(mode === "mobile" ? "login" : "platform-dashboard", mode, false);
      frame.contentWindow?.postMessage({ type: "naoluopan:reset" }, "*");
      return showToast("交互状态已重置");
    }
    if (event.target.closest("#open-design")) return window.open("index.html", "_blank");
    if (event.target.matches("[data-close='backdrop']") || event.target.closest("[data-close='modal']")) return closeLayer();
    const confirmButton = event.target.closest("[data-confirm]");
    if (confirmButton) {
      const type = confirmButton.dataset.confirm;
      closeLayer();
      if (type === "logout") return show("login", "mobile");
      frame.contentWindow?.postMessage({ type: "naoluopan:modal-result", modal: type, ok: true }, "*");
      return showToast("操作已确认");
    }
  });

  window.addEventListener("message", event => {
    const message = event.data || {};
    if (!String(message.type || "").startsWith("naoluopan:")) return;
    if (message.type === "naoluopan:ready") return show(page, mode, false);
    if (message.type === "naoluopan:navigate") {
      const nextMode = message.mode === "admin" ? "admin" : "mobile";
      return show(message.page, nextMode);
    }
    if (message.type === "naoluopan:toast") return showToast(message.message || "操作成功");
    if (message.type === "naoluopan:modal") return openModal(message.modal || "info", message.data || {});
  });
})();
