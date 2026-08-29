(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("prototype") !== "1") return;

  const mobilePages = ["login","user-agreement","privacy-policy","public-home","case-results","institution-home","brain-center","brain-report","brain-whitepaper","ai-explain","training-plan","warning-center","personal-warning-list","personal-warning-detail","growth-archive","assessment-list","assessment-detail","assessment-process","assessment-result","assessment-report-list","knowledge-center","classroom-records","profile-center","quota-detail","talent-center","warning-detail","knowledge-detail","message-center","message-detail","institution-binding","binding-review-list","binding-review-detail","privacy-center","talent-report-list","talent-report","partner-apply","brain-report-list","training-record-list","training-record-detail","profile-edit","password-change","warning-record-form","store-center","order-confirm","payment-result","order-list","order-detail","refund-form"];
  const adminPages = ["platform-dashboard","institution-management","hierarchy-permission","binding-permission","private-config","quota-center","device-api","warning-rules","intervention-ledger","ai-content","reports-compliance","institution-form","intervention-record-form","member-binding","member-form","member-import","hierarchy-form","classroom-management","classroom-publish","classroom-category","commerce-center","product-form","order-management","admin-order-detail","voucher-config"];
  const adminRoute = {"数据驾驶舱":"platform-dashboard","机构管理":"institution-management","成员与绑定":"member-binding","层级与权限":"hierarchy-permission","私有化配置":"private-config","配额资源":"quota-center","支付与订单":"commerce-center","设备与接口":"device-api","预警规则":"warning-rules","干预台账":"intervention-ledger","AI 与内容":"ai-content","心智课堂":"classroom-management","报表与存证":"reports-compliance"};
  const backRoute = {"user-agreement":"login","privacy-policy":"login","public-home":"login","case-results":"public-home","institution-home":"login","brain-center":"institution-home","brain-report":"brain-center","brain-whitepaper":"brain-report","ai-explain":"brain-report","training-plan":"brain-report","warning-center":"institution-home","personal-warning-list":"warning-center","personal-warning-detail":"personal-warning-list","warning-detail":"warning-center","warning-record-form":"warning-detail","growth-archive":"institution-home","assessment-list":"institution-home","assessment-detail":"assessment-list","assessment-process":"assessment-detail","assessment-result":"assessment-process","assessment-report-list":"assessment-list","knowledge-center":"institution-home","classroom-records":"knowledge-center","knowledge-detail":"knowledge-center","profile-center":"institution-home","quota-detail":"profile-center","profile-edit":"profile-center","password-change":"profile-center","message-center":"profile-center","message-detail":"message-center","institution-binding":"profile-center","binding-review-list":"profile-center","binding-review-detail":"binding-review-list","privacy-center":"profile-center","talent-center":"institution-home","talent-report-list":"talent-center","talent-report":"talent-report-list","partner-apply":"profile-center","brain-report-list":"profile-center","training-record-list":"profile-center","training-record-detail":"training-record-list","store-center":"profile-center","order-confirm":"store-center","payment-result":"store-center","order-list":"profile-center","order-detail":"order-list","refund-form":"order-detail"};
  const moduleRoute = {"脑健康中心":"brain-center","预警干预":"warning-center","成长档案":"growth-archive","成长数据":"growth-archive","人格测评":"assessment-list","天赋潜能":"talent-center","脑科学知识":"knowledge-center","科普知识":"knowledge-center","心智课堂":"knowledge-center"};
  let mode = params.get("mode") === "admin" ? "admin" : "mobile";
  let page = params.get("page") || (mode === "mobile" ? "login" : "platform-dashboard");
  let codeTimer = null;
  let voiceUtterance = null;
  let pendingAction = null;
  let bannerTimer = null;
  let bannerIndex = 0;
  const assessmentQuestions = [
    { dimension: "情绪调节", text: "面对突发压力时，我通常能够让自己逐渐平静下来。" },
    { dimension: "情绪调节", text: "即使情绪低落，我也能继续完成需要处理的事情。" },
    { dimension: "情绪调节", text: "遇到挫折后，我很少长时间陷在负面情绪里。" },
    { dimension: "目标坚持", text: "当任务变得困难时，我仍愿意继续尝试。" },
    { dimension: "目标坚持", text: "我能把较大的目标拆分成可以完成的小步骤。" },
    { dimension: "目标坚持", text: "即使短期看不到结果，我也能保持行动。" },
    { dimension: "积极认知", text: "遇到问题时，我通常能看到可以调整或改善的部分。" },
    { dimension: "积极认知", text: "我相信自己能够从过去的困难中获得经验。" },
    { dimension: "积极认知", text: "面对不确定性时，我仍能保持基本的希望。" },
    { dimension: "社会支持", text: "当我需要帮助时，我知道可以向谁求助。" },
    { dimension: "社会支持", text: "我愿意向信任的人表达真实的压力和感受。" },
    { dimension: "社会支持", text: "我能感受到身边人给予的理解和支持。" },
    { dimension: "压力恢复", text: "高强度任务结束后，我能通过休息恢复状态。" },
    { dimension: "压力恢复", text: "压力较大时，我仍能维持基本的睡眠和生活规律。" },
    { dimension: "压力恢复", text: "经历冲突后，我通常可以较快回到正常节奏。" },
    { dimension: "适应能力", text: "计划突然变化时，我能够调整自己的安排。" },
    { dimension: "适应能力", text: "进入陌生环境后，我能逐渐找到合适的应对方式。" },
    { dimension: "适应能力", text: "当原有方法无效时，我愿意尝试新的解决方式。" }
  ];
  let assessmentIndex = 0;
  let assessmentAnswers = Array(assessmentQuestions.length).fill(null);
  let selectedProduct = { name: "人格测评成长包", type: "人格测评份额", quota: "10 份", price: "199.00", copy: "适用于校园、企业和机关的常用人格量表配额" };
  let selectedOrder = { id: "NL20260806102618", name: "人格测评成长包", status: "已支付", price: "199.00", quota: "10 份人格测评", time: "2026.08.06 10:26", trade: "WX2026080610382618" };
  let selectedBindingApplicationId = "BA20260808001";
  const quotaState = { personality: 5, talent: 1, ai: 120 };
  const moduleState = {};
  const runtimeStyle = document.createElement("style");
  runtimeStyle.id = "prototype-runtime-style";
  document.head.appendChild(runtimeStyle);

  const post = (type, payload = {}) => parent.postMessage({ type: `naoluopan:${type}`, ...payload }, "*");
  const navigate = next => post("navigate", { mode, page: next });
  const toast = message => post("toast", { message });
  const modal = (name, data = {}) => post("modal", { modal: name, data });

  function moduleKey(label) {
    if (label.includes("脑健康")) return "brain";
    if (label.includes("预警")) return "warning";
    if (label.includes("成长") || label.includes("档案")) return "growth";
    if (label.includes("人格")) return "assessment";
    if (label.includes("天赋")) return "talent";
    if (label.includes("知识") || label.includes("课堂")) return "knowledge";
    return label;
  }

  function syncInstitutionModules() {
    const home = document.querySelector('[data-mobile="institution-home"]');
    home?.querySelectorAll(".org-module").forEach(module => {
      const key = moduleKey(module.textContent.trim());
      if (Object.hasOwn(moduleState, key)) module.style.display = moduleState[key] ? "block" : "none";
    });
  }

  function bindingReviewCard(applicationId) {
    return document.querySelector(`[data-mobile="binding-review-list"] [data-binding-application-id="${applicationId}"]`);
  }

  function bindingApplication(applicationId) {
    const card = bindingReviewCard(applicationId);
    if (!card) return null;
    return {
      id: applicationId,
      name: card.dataset.applicantName || "申请人",
      phone: card.dataset.applicantPhone || "--",
      time: card.dataset.applyTime || "--",
      institution: card.dataset.targetInstitution || "--",
      org: card.dataset.targetOrg || "--",
      status: card.dataset.bindingStatus || "待审核",
    };
  }

  function filterBindingReviews(status = "待审核") {
    const article = document.querySelector('[data-mobile="binding-review-list"]');
    if (!article) return;
    let visible = 0;
    article.querySelectorAll(".binding-review-card").forEach(card => {
      const showCard = card.dataset.bindingStatus === status;
      card.hidden = !showCard;
      if (showCard) visible += 1;
    });
    const empty = article.querySelector(".binding-empty");
    if (empty) empty.hidden = visible > 0;
  }

  function syncBindingCounts() {
    const cards = [...document.querySelectorAll('[data-mobile="binding-review-list"] .binding-review-card')];
    const pendingCount = cards.filter(card => card.dataset.bindingStatus === "待审核").length;
    document.querySelectorAll("[data-binding-pending-count]").forEach(node => { node.textContent = String(pendingCount); });
    const badge = document.querySelector(".profile-review-badge");
    if (badge) badge.textContent = pendingCount ? `${pendingCount} 项待审核` : "暂无待审核";
    const adminPage = document.querySelector('[data-admin="member-binding"]');
    const pendingStat = adminPage?.querySelector(".a-stats .a-stat:nth-child(2) b");
    if (pendingStat) pendingStat.textContent = String(pendingCount);
    const applicationTab = adminPage?.querySelector('[data-binding-tab="applications"]');
    if (applicationTab) applicationTab.textContent = `绑定申请（${pendingCount}）`;
  }

  function syncBindingReviewDetail(applicationId = selectedBindingApplicationId) {
    const data = bindingApplication(applicationId);
    const article = document.querySelector('[data-mobile="binding-review-detail"]');
    if (!data || !article) return;
    selectedBindingApplicationId = applicationId;
    const set = (selector, value) => { const node = article.querySelector(selector); if (node) node.textContent = value; };
    set("[data-binding-detail-avatar]", data.name.slice(0, 1));
    set("[data-binding-detail-name]", data.name);
    set("[data-binding-detail-phone]", data.phone);
    set("[data-binding-detail-institution]", data.institution);
    set("[data-binding-detail-time]", data.time);
    set("[data-binding-detail-id]", data.id);
    const status = article.querySelector("[data-binding-detail-status]");
    if (status) {
      status.textContent = data.status;
      status.className = `binding-review-state binding-detail-status${data.status === "已通过" ? " approved" : data.status === "已拒绝" ? " rejected" : ""}`;
    }
    const org = article.querySelector("#binding-review-org");
    if (org && [...org.options].some(option => option.value === data.org)) org.value = data.org;
    if (org) org.disabled = data.status !== "待审核";
    const actions = article.querySelector(".binding-detail-actions");
    if (actions) actions.hidden = data.status !== "待审核";
    const result = article.querySelector(".binding-audit-result");
    if (result) result.hidden = data.status === "待审核";
    set("[data-binding-detail-result-title]", data.status === "已通过" ? "审核通过并完成绑定" : "申请已拒绝");
    set("[data-binding-detail-result-copy]", `${data.status === "已通过" ? "周老师" : "李老师"}处理 · 结果已同步至管理后台`);
  }

  function applyBindingDecision(applicationId, approved) {
    const card = bindingReviewCard(applicationId);
    if (!card || card.dataset.bindingStatus !== "待审核") return false;
    const nextStatus = approved ? "已通过" : "已拒绝";
    card.dataset.bindingStatus = nextStatus;
    const state = card.querySelector(".binding-review-state");
    if (state) {
      state.textContent = nextStatus;
      state.className = `binding-review-state ${approved ? "approved" : "rejected"}`;
    }
    const metaAction = card.querySelector(".binding-review-meta span:last-child");
    if (metaAction) metaAction.textContent = "详情 ›";
    const description = card.querySelector(".binding-review-card-head p");
    if (description) description.textContent = approved ? `已绑定${card.dataset.targetOrg}` : "申请信息与机构成员不一致";
    const adminRow = document.querySelector(`[data-admin="member-binding"] [data-binding-application-id="${applicationId}"]`);
    if (adminRow) {
      adminRow.dataset.bindingStatus = nextStatus;
      const adminStatus = adminRow.querySelector(".binding-row-status");
      if (adminStatus) {
        adminStatus.textContent = nextStatus;
        adminStatus.className = approved ? "a-tag binding-row-status" : "a-tag gray binding-row-status";
      }
      adminRow.querySelector(".binding-actions")?.replaceChildren(document.createTextNode(approved ? "已完成绑定" : "申请已关闭"));
    }
    syncBindingCounts();
    const activeTab = document.querySelector('[data-mobile="binding-review-list"] .binding-review-tabs .active')?.dataset.bindingReviewTab || "待审核";
    filterBindingReviews(activeTab);
    if (selectedBindingApplicationId === applicationId) syncBindingReviewDetail(applicationId);
    return true;
  }

  function syncMiniPreview(moduleOption, enabled) {
    const config = document.querySelector('[data-admin="private-config"]');
    const grid = config?.querySelector(".mini-modules");
    if (!grid) return;
    const label = moduleOption.querySelector("b")?.textContent.trim() || "模块";
    const key = moduleKey(label);
    let preview = [...grid.querySelectorAll(".mini-module")].find(item => moduleKey(item.textContent.trim()) === key);
    if (!preview && enabled) {
      preview = document.createElement("div");
      preview.className = "mini-module prototype-generated";
      preview.dataset.moduleKey = key;
      const icon = moduleOption.querySelector(".role-icon")?.cloneNode(true);
      if (icon) preview.appendChild(icon);
      preview.appendChild(document.createTextNode(label.replace("中心", "").replace("数据", "")));
      const knowledge = [...grid.querySelectorAll(".mini-module")].find(item => moduleKey(item.textContent.trim()) === "knowledge");
      grid.insertBefore(preview, knowledge || null);
    }
    if (preview) preview.style.display = enabled ? "block" : "none";
  }

  function syncWarningDetail(person) {
    const detail = document.querySelector('[data-mobile="warning-detail"]');
    if (!detail || !person) return;
    const name = person.querySelector("h4")?.textContent.trim() || "预警个案";
    const reason = person.querySelector(".person-top p")?.textContent.trim() || "脑功能异常";
    const deadline = person.querySelector(".deadline b")?.textContent.trim() || "待处置";
    const report = person.querySelector(".person-action span")?.textContent.trim() || "检测报告";
    detail.querySelector("[data-case-name]").textContent = name;
    detail.querySelector("[data-case-reason]").textContent = reason;
    detail.querySelector("[data-case-deadline]").textContent = deadline;
    detail.querySelector("[data-case-report]").textContent = report;
    const form = document.querySelector('[data-mobile="warning-record-form"]');
    if (form) {
      form.querySelector("[data-form-case-name]").textContent = name;
      form.querySelector("[data-form-case-report]").textContent = report;
      form.querySelector(".person-avatar").textContent = name.slice(0, 1);
    }
  }

  function syncPersonalWarningDetail(record) {
    const detail = document.querySelector('[data-mobile="personal-warning-detail"]');
    if (!detail || !record) return;
    const values = {
      "[data-personal-warning-title]": record.dataset.warningTitle,
      "[data-personal-warning-level]": record.dataset.warningLevel,
      "[data-personal-warning-date]": record.dataset.warningDate,
      "[data-personal-warning-status]": record.dataset.warningStatus,
      "[data-personal-warning-summary]": record.dataset.warningSummary,
      "[data-personal-warning-source]": record.dataset.warningSource
    };
    Object.entries(values).forEach(([selector, value]) => {
      const node = detail.querySelector(selector);
      if (node && value) node.textContent = value;
    });
    const dimensions = (record.dataset.warningDimensions || "异常维度").split("|").filter(Boolean);
    const dimensionGrid = detail.querySelector("[data-personal-warning-dimensions]");
    if (dimensionGrid) {
      dimensionGrid.textContent = "";
      dimensions.forEach((dimension, index) => {
        const item = document.createElement("div");
        item.className = "warning-dimension";
        const title = document.createElement("b");
        title.textContent = dimension;
        const copy = document.createElement("span");
        copy.textContent = index === 0 ? "低于个人基线" : "需要持续观察";
        item.append(title, copy);
        dimensionGrid.appendChild(item);
      });
    }
  }

  function syncKnowledgeDetail(articleCard) {
    const detail = document.querySelector('[data-mobile="knowledge-detail"]');
    if (!detail || !articleCard) return;
    const title = articleCard.querySelector("b,h4")?.textContent.trim() || "心智课堂内容";
    const meta = articleCard.querySelector(".article-meta span,.article-item p,.classroom-record-item p")?.textContent.trim() || "心智课堂";
    const type = articleCard.dataset.contentType || "图文";
    const category = articleCard.dataset.contentCategory || "脑健康";
    detail.querySelector("[data-article-title]").textContent = title;
    detail.querySelector("[data-article-meta]").textContent = meta;
    detail.dataset.contentType = type;
    const typeChip = detail.querySelector("[data-article-type]");
    if (typeChip) typeChip.textContent = `${type} · ${category}`;
    const media = detail.querySelector(".classroom-media");
    media?.classList.toggle("hidden", type === "图文");
    const playLabel = detail.querySelector("[data-classroom-play-label]");
    if (playLabel) playLabel.textContent = type === "音频" ? "播放音频" : "播放视频";
    media?.classList.remove("playing");
    detail.querySelector(".classroom-favorite")?.classList.remove("active");
  }

  function showClassroomRecordTab(label) {
    const records = document.querySelector('[data-mobile="classroom-records"]');
    if (!records) return;
    records.querySelectorAll(".classroom-record-tabs span").forEach(tab => tab.classList.toggle("active", tab.textContent.trim() === label));
    records.querySelectorAll(".classroom-record-item").forEach(item => {
      item.style.display = item.dataset.recordKind === label ? "flex" : "none";
    });
  }

  function setBack(pageName, destination) {
    const targetPage = document.querySelector(`[data-mobile="${pageName}"]`);
    if (targetPage) targetPage.dataset.back = destination;
  }

  function syncQuotaDisplays() {
    document.querySelectorAll("[data-quota-personality]").forEach(node => { node.textContent = quotaState.personality; });
    document.querySelectorAll("[data-quota-talent]").forEach(node => { node.textContent = quotaState.talent; });
    document.querySelectorAll("[data-quota-ai]").forEach(node => { node.textContent = quotaState.ai; });
  }

  function renderPublicBanner(index = bannerIndex) {
    const banner = document.querySelector('[data-mobile="public-home"] .public-banner');
    const slides = [...(banner?.querySelectorAll("[data-banner-slide]") || [])];
    if (!slides.length) return;
    bannerIndex = (Number(index) + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === bannerIndex));
    banner.querySelectorAll("[data-banner-index]").forEach((dot, dotIndex) => {
      const active = dotIndex === bannerIndex;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function startPublicBanner() {
    clearInterval(bannerTimer);
    renderPublicBanner();
    bannerTimer = setInterval(() => renderPublicBanner(bannerIndex + 1), 4000);
  }

  function syncUnreadCount() {
    const center = document.querySelector('[data-mobile="message-center"]');
    if (!center) return;
    const count = center.querySelectorAll(".message-card.unread").length;
    const countNode = center.querySelector("[data-unread-count]");
    if (countNode) countNode.textContent = count;
    const summary = center.querySelector(".message-summary h1");
    if (summary) summary.setAttribute("aria-label", count ? `${count} 条未读消息` : "消息已全部读完");
  }

  function markMessageRead(messageCard) {
    if (!messageCard) return;
    messageCard.classList.remove("unread");
    messageCard.querySelector(".message-unread-dot")?.remove();
    syncUnreadCount();
  }

  function syncMessageDetail(messageCard) {
    const detail = document.querySelector('[data-mobile="message-detail"]');
    if (!detail || !messageCard) return;
    detail.querySelector("[data-message-detail-title]").textContent = messageCard.dataset.messageTitle || "消息通知";
    detail.querySelector("[data-message-detail-type]").textContent = messageCard.dataset.messageType || "系统通知";
    detail.querySelector("[data-message-detail-body]").textContent = messageCard.dataset.messageBody || messageCard.querySelector("p")?.textContent.trim() || "";
    detail.querySelector("[data-message-detail-time]").textContent = messageCard.dataset.messageTime || "";
    const sourceIcon = messageCard.querySelector(".message-icon");
    const detailIcon = detail.querySelector(".message-icon");
    if (sourceIcon && detailIcon) {
      detailIcon.innerHTML = sourceIcon.innerHTML;
      detailIcon.style.cssText = sourceIcon.style.cssText;
    }
    markMessageRead(messageCard);
  }

  function syncProductSelection(productCard) {
    if (productCard) {
      selectedProduct = {
        name: productCard.dataset.productName,
        type: productCard.dataset.productType,
        quota: productCard.dataset.productQuota,
        price: productCard.dataset.productPrice,
        copy: productCard.dataset.productCopy
      };
    }
    const confirm = document.querySelector('[data-mobile="order-confirm"]');
    if (!confirm) return;
    confirm.querySelector("[data-order-product]").textContent = selectedProduct.name;
    confirm.querySelector("[data-order-type]").textContent = `${selectedProduct.type} · ${selectedProduct.quota}`;
    confirm.querySelector("[data-order-quota]").textContent = selectedProduct.quota;
    confirm.querySelector("[data-order-copy]").textContent = selectedProduct.copy;
    confirm.querySelectorAll("[data-order-price]").forEach(node => { node.textContent = selectedProduct.price; });
  }

  function createOrder(status) {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    selectedOrder = {
      id: `NL${stamp}18`,
      name: selectedProduct.name,
      status,
      price: selectedProduct.price,
      quota: `${selectedProduct.quota} ${selectedProduct.type.replace("份额", "")}`,
      time: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      trade: status === "已支付" ? `WX${stamp}2618` : "待支付"
    };
    syncOrderDetail();
  }

  function syncOrderFromList(orderItem) {
    if (orderItem) {
      selectedOrder = {
        id: orderItem.dataset.orderId,
        name: orderItem.dataset.orderName,
        status: orderItem.dataset.orderStatus,
        price: orderItem.dataset.orderPrice,
        quota: orderItem.dataset.orderQuota,
        time: orderItem.dataset.orderTime,
        trade: orderItem.dataset.orderTrade
      };
    }
    syncOrderDetail();
  }

  function syncOrderDetail() {
    const detail = document.querySelector('[data-mobile="order-detail"]');
    if (!detail) return;
    const status = selectedOrder.status;
    const statusHints = {
      "待支付": "订单将在超时后自动关闭，请及时完成支付",
      "已支付": "支付成功，配额已发放至机构主账号",
      "退款中": "退款申请已提交，等待平台后台审核",
      "已退款": "退款审核已通过，款项将原路退回",
      "已取消": "订单已取消，无需继续支付"
    };
    const allocationCopy = {
      "待支付": "机构主账号 · 未发放",
      "已支付": "机构主账号 · 已到账",
      "退款中": "机构主账号 · 配额冻结",
      "已退款": "机构主账号 · 已回收",
      "已取消": "机构主账号 · 未发放"
    };
    detail.querySelector("[data-order-detail-status]").textContent = status;
    detail.querySelector("[data-order-detail-hint]").textContent = statusHints[status] || "订单状态已更新";
    detail.querySelector("[data-order-detail-name]").textContent = selectedOrder.name;
    detail.querySelector("[data-order-detail-quota]").textContent = selectedOrder.quota;
    detail.querySelector("[data-order-detail-price]").textContent = selectedOrder.price;
    detail.querySelector("[data-order-detail-time]").textContent = selectedOrder.time;
    detail.querySelector("[data-order-detail-id]").textContent = selectedOrder.id;
    detail.querySelector("[data-order-detail-trade]").textContent = selectedOrder.trade;
    detail.querySelector("[data-order-allocation]").textContent = allocationCopy[status] || "机构主账号";
    const statusCard = detail.querySelector(".order-detail-status");
    statusCard.classList.remove("pending", "refunding", "refunded", "canceled");
    if (status === "待支付") statusCard.classList.add("pending");
    if (status === "退款中") statusCard.classList.add("refunding");
    if (status === "已退款") statusCard.classList.add("refunded");
    if (status === "已取消") statusCard.classList.add("canceled");
    detail.querySelector(".refund-entry").hidden = status !== "已支付";
    detail.querySelector(".order-repay-action").hidden = status !== "待支付";
    detail.querySelector(".order-cancel-action").hidden = status !== "待支付";
    detail.querySelector(".order-buy-again").hidden = !["已取消", "已退款"].includes(status);
    detail.querySelector(".receipt-link").hidden = ["待支付", "已取消"].includes(status);
    const refundProgress = detail.querySelector(".refund-progress-card");
    refundProgress.hidden = !["退款中", "已退款"].includes(status);
    refundProgress.querySelector("[data-refund-progress-copy]").textContent = status === "已退款" ? "平台审核已通过，退款将原路退回支付账户" : "平台将在 1—3 个工作日内完成审核";
    const refund = document.querySelector('[data-mobile="refund-form"]');
    refund.querySelector("[data-refund-product]").textContent = selectedOrder.name;
    refund.querySelector("[data-refund-quota]").textContent = `未使用 ${selectedOrder.quota.split(" ")[0]}，可申请退款`;
    refund.querySelector("[data-refund-price]").textContent = selectedOrder.price;
    const quantity = refund.querySelector("#refund-quantity");
    if (quantity) quantity.value = Number.parseInt(selectedOrder.quota, 10) || 1;
  }

  function completePayment() {
    createOrder("已支付");
    const amount = Number.parseInt(selectedProduct.quota, 10) || 0;
    if (selectedProduct.type.includes("人格")) quotaState.personality += amount;
    if (selectedProduct.type.includes("天赋")) quotaState.talent += amount;
    if (selectedProduct.type.includes("AI")) quotaState.ai += amount;
    syncQuotaDisplays();
    const result = document.querySelector('[data-mobile="payment-result"]');
    result.querySelector("[data-payment-product]").textContent = selectedProduct.name;
    result.querySelector("[data-payment-quota]").textContent = `+ ${selectedProduct.quota}`;
    result.querySelector("[data-payment-price]").textContent = selectedProduct.price;
    result.querySelector("[data-payment-trade]").textContent = selectedOrder.trade;
  }

  function syncBrainReportDetail(reportItem) {
    const detail = document.querySelector('[data-mobile="brain-report"]');
    if (!detail || !reportItem) return;
    const score = reportItem.dataset.reportScore || "72";
    const reportId = reportItem.dataset.reportId || "NL20260802018";
    const reportDate = reportItem.dataset.reportDate || "2026.08.02";
    detail.querySelector(".report-date span:first-child").textContent = `报告编号 ${reportId}`;
    detail.querySelector(".report-date span:last-child").textContent = reportDate;
    const scoreRing = detail.querySelector(".score-ring");
    scoreRing?.style.setProperty("--report-score", `"${score}"`);
    if (scoreRing) scoreRing.style.background = `conic-gradient(#a9d5ff 0 ${score}%, rgba(255,255,255,.16) ${score}%)`;
    detail.querySelector(".score-copy b").textContent = reportItem.dataset.reportStatus || "中度脑环路失衡";
    detail.querySelector(".score-copy p").textContent = reportItem.dataset.reportSummary || "前额叶调节效率下降，注意力控制与情绪稳定性需要重点关注。";
    const whitepaper = document.querySelector('[data-mobile="brain-whitepaper"]');
    if (whitepaper) {
      whitepaper.querySelector("[data-whitepaper-id]").textContent = reportId;
      whitepaper.querySelector("[data-whitepaper-date]").textContent = reportDate;
      whitepaper.querySelector(".whitepaper-conclusion").textContent = `当前综合脑功能指数 ${score}，${reportItem.dataset.reportStatus || "脑功能状态需要持续关注"}。${reportItem.dataset.reportSummary || "建议结合训练和后续复测观察变化。"}`;
    }
  }

  function resetVoicePlayer(article) {
    const player = article?.querySelector(".voice-player");
    if (!player) return;
    article.dataset.voicePlaying = "0";
    player.classList.remove("playing");
    player.querySelector("[data-voice-label]").textContent = "语音播报";
    voiceUtterance = null;
  }

  function toggleVoicePlayback(article) {
    const player = article.querySelector(".voice-player");
    if (!player) return;
    if (article.dataset.voicePlaying === "1") {
      window.speechSynthesis?.cancel();
      resetVoicePlayer(article);
      return toast("语音播报已停止");
    }
    const copy = (article.querySelector(".brain-center-voice") ? article.querySelector(".brain-trend-note") : article.querySelector(".ai-summary p"))?.textContent.trim();
    if (!copy) return;
    article.dataset.voicePlaying = "1";
    player.classList.add("playing");
    player.querySelector("[data-voice-label]").textContent = "停止播报";
    if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
      window.speechSynthesis.cancel();
      voiceUtterance = new SpeechSynthesisUtterance(copy);
      voiceUtterance.lang = "zh-CN";
      voiceUtterance.rate = 0.95;
      voiceUtterance.onend = () => resetVoicePlayer(article);
      voiceUtterance.onerror = () => resetVoicePlayer(article);
      window.speechSynthesis.speak(voiceUtterance);
    }
    return toast("正在播报上方解读内容");
  }

  function syncTrainingRecordDetail(recordItem) {
    const detail = document.querySelector('[data-mobile="training-record-detail"]');
    if (!detail || !recordItem) return;
    const values = {
      "[data-training-title]": recordItem.dataset.recordTitle,
      "[data-training-period]": recordItem.dataset.recordPeriod,
      "[data-training-rate]": recordItem.dataset.recordRate,
      "[data-training-sessions]": recordItem.dataset.recordSessions,
      "[data-training-minutes]": recordItem.dataset.recordMinutes,
      "[data-training-change]": recordItem.dataset.recordChange
    };
    Object.entries(values).forEach(([selector, value]) => {
      if (value) detail.querySelector(selector).textContent = value;
    });
    const change = Number.parseInt(recordItem.dataset.recordChange, 10) || 0;
    const comparisonLabels = detail.querySelectorAll(".compare-row-top span");
    if (comparisonLabels[0]) comparisonLabels[0].textContent = `改善 ${change}%`;
    if (comparisonLabels[1]) comparisonLabels[1].textContent = `提升 ${Math.max(4, Math.round(change / 2))}%`;
  }

  function syncTalentReportDetail(reportItem) {
    const detail = document.querySelector('[data-mobile="talent-report"]');
    if (!detail || !reportItem) return;
    const score = reportItem.dataset.talentScore || "82";
    const date = reportItem.dataset.reportDate || "2026.08.01";
    const scoreNode = detail.querySelector("[data-talent-report-score]");
    const dateNode = detail.querySelector("[data-talent-report-date]");
    if (scoreNode) scoreNode.textContent = score;
    if (dateNode) dateNode.textContent = `${date} · 历史测评报告`;
  }

  function submitChatMessage(article) {
    const input = article?.querySelector("#ai-chat-input");
    const value = input?.value.trim();
    if (!value) return input?.focus();
    const row = document.createElement("div");
    row.className = "msg-row";
    row.innerHTML = `<div class="bubble user"></div>`;
    row.querySelector(".bubble").textContent = value;
    article.querySelector(".chat-body")?.appendChild(row);
    input.value = "";
    row.scrollIntoView({ block: "nearest" });
    toast("问题已发送");
  }

  function syncAdminInterventionForm(sourceRow) {
    const formPage = document.querySelector('[data-admin="intervention-record-form"]');
    if (!formPage || !sourceRow) return;
    const person = sourceRow.querySelector(".case-person");
    const personName = person?.querySelector("b")?.textContent.trim() || "新增人工关怀";
    const organization = person?.querySelector("span")?.textContent.trim();
    const name = organization ? `${personName} · ${organization}` : personName;
    const evidence = sourceRow.children[2]?.textContent.trim() || "待关联检测报告";
    formPage.querySelector("[data-admin-case-name]").textContent = name;
    formPage.querySelector("[data-admin-case-report]").textContent = evidence;
    formPage.querySelector(".case-reference .inst-logo").textContent = name.slice(0, 1);
  }

  function resetAssessment() {
    assessmentIndex = 0;
    assessmentAnswers = Array(assessmentQuestions.length).fill(null);
    renderAssessmentQuestion();
  }

  function renderAssessmentQuestion() {
    const article = document.querySelector('[data-mobile="assessment-process"]');
    const question = assessmentQuestions[assessmentIndex];
    if (!article || !question) return;
    const current = assessmentIndex + 1;
    const answer = assessmentAnswers[assessmentIndex];
    article.querySelector("[data-question-index]").textContent = `${current} / ${assessmentQuestions.length}`;
    article.querySelector("[data-question-number]").textContent = `Q${String(current).padStart(2, "0")}`;
    article.querySelector("[data-question-dimension]").textContent = question.dimension;
    article.querySelector("[data-question-text]").textContent = question.text;
    article.querySelector(".assessment-process-progress i").style.width = `${current / assessmentQuestions.length * 100}%`;
    article.querySelectorAll(".answer-option").forEach(option => {
      const selected = Number(option.dataset.value) === answer;
      option.classList.toggle("active", selected);
      option.setAttribute("aria-checked", String(selected));
    });
    article.querySelector('[data-assessment-action="prev"]').disabled = assessmentIndex === 0;
    article.querySelector('[data-assessment-action="next"]').textContent = assessmentIndex === assessmentQuestions.length - 1 ? "提交测评" : "下一题";
  }

  function show(nextMode, nextPage) {
    mode = nextMode === "admin" ? "admin" : "mobile";
    const allowed = mode === "mobile" ? mobilePages : adminPages;
    page = allowed.includes(nextPage) ? nextPage : allowed[0];
    const width = mode === "mobile" ? 390 : 1180;
    const height = mode === "mobile" ? 844 : 720;
    const board = mode === "mobile" ? "#mobile-board" : "#admin-board";
    const attr = mode === "mobile" ? "data-mobile" : "data-admin";
    runtimeStyle.textContent = `
      html,body{margin:0!important;width:${width}px!important;min-width:${width}px!important;height:${height}px!important;min-height:${height}px!important;overflow:hidden!important;background:linear-gradient(rgba(47,128,237,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(47,128,237,.055) 1px,transparent 1px),#f7faff!important;background-size:32px 32px!important}
      body>*{display:none!important}.symbols{display:block!important}
      ${board}{display:block!important;width:${width}px!important;height:${height}px!important;margin:0!important;padding:0!important}
      ${board}>article{display:none!important}
      ${board}>article[${attr}="${page}"]{display:block!important;width:${width}px!important;height:${height}px!important;padding:0!important;margin:0!important}
      .screen-label,.admin-label{display:none!important}
      .round,.tab,.btn-primary,.btn-secondary,.wechat-btn,.code-action,.hero-actions span,.center-item,.public-case-entry,.public-action,.risk-banner,.org-module,.institution-quota-strip,.task-card,.ai-entry,.quick-row span,.send,.training-card,.app-guide,.filter-tabs span,.risk-person,.warning-record-action,.trend-card,.archive-item,.scale-card,.bottom-action,.answer-option,.assessment-process-actions button,.objective-link,.topic,.featured-article,.article-item,.profile-message,.quota-buy-link,.quota-detail-link,.quota-recharge-action,.menu-item,.logout-btn,.talent-card,.partner-form-action,.report-list-item,.brain-report-more,.training-record-item,.training-record-plan,.whitepaper-link,.voice-player,.brain-center-ai,.brain-center-tools button,.report-center-entry,.assessment-report-item,.ai-teacher-entry,.talent-report-list-entry,.message-read-all,.message-card,.commerce-order-link,.commerce-tabs span,.product-card,.product-buy,.order-confirm-action,.order-later-action,.payment-order-action,.payment-finish-action,.order-status-tabs span,.order-list-item,.receipt-link,.refund-entry,.order-repay-action,.order-cancel-action,.order-buy-again,.refund-choice,.a-btn,.side-item,.a-action,.select,.tick,.module-option,.rule-tabs span,.switch,.content-type,.report-template,.admin-form-back,.commerce-shortcut{cursor:pointer!important;user-select:none}
    `;
    syncInstitutionModules();
    syncQuotaDisplays();
    clearInterval(bannerTimer);
    bannerTimer = null;
    if (page === "public-home") startPublicBanner();
    if (page === "order-confirm") syncProductSelection();
    if (page === "order-detail" || page === "refund-form") syncOrderDetail();
    if (page === "assessment-process") renderAssessmentQuestion();
    if (page === "classroom-records") showClassroomRecordTab(document.querySelector('[data-mobile="classroom-records"] .classroom-record-tabs .active')?.textContent.trim() || "收藏");
    if (page === "binding-review-list") {
      syncBindingCounts();
      filterBindingReviews(document.querySelector('[data-mobile="binding-review-list"] .binding-review-tabs .active')?.dataset.bindingReviewTab || "待审核");
    }
    if (page === "binding-review-detail") syncBindingReviewDetail();
    document.title = `脑罗盘 · ${page}`;
  }

  function activeArticle() {
    return document.querySelector(mode === "mobile" ? `[data-mobile="${page}"]` : `[data-admin="${page}"]`);
  }

  function activateSibling(target, selector, activeClass = "active") {
    const parentNode = target.parentElement;
    parentNode?.querySelectorAll(selector).forEach(node => node.classList.remove(activeClass));
    target.classList.add(activeClass);
  }

  function routeTab(text) {
    if (text.includes("首页")) return navigate("institution-home");
    if (text.includes("脑健康")) {
      setBack("brain-center", "institution-home");
      return navigate("brain-center");
    }
    if (text.includes("预警") || text.includes("干预")) return navigate("warning-center");
    if (text.includes("档案") || text.includes("数据")) return navigate("growth-archive");
    if (text.includes("我的")) return navigate("profile-center");
  }

  function loginControls(article) {
    return {
      phone: article?.querySelector("#login-phone"),
      code: article?.querySelector("#login-code"),
      codeButton: article?.querySelector(".code-action")
    };
  }

  function setLoginMode(article, nextMode, focusInput = true) {
    const loginMode = nextMode === "sms" ? "sms" : "wechat";
    article?.querySelectorAll("[data-login-mode]").forEach(tab => {
      const active = tab.dataset.loginMode === loginMode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    article?.querySelectorAll("[data-login-panel]").forEach(panel => {
      panel.hidden = panel.dataset.loginPanel !== loginMode;
    });
    if (loginMode === "sms" && focusInput) loginControls(article).phone?.focus();
  }

  function setFieldError(input, message) {
    input?.closest(".login-field")?.classList.add("error");
    input?.focus();
    toast(message);
  }

  function startCodeCountdown(article) {
    const { phone, codeButton } = loginControls(article);
    if (!/^1\d{10}$/.test(phone?.value || "")) return setFieldError(phone, "请输入正确的 11 位手机号");
    clearInterval(codeTimer);
    let seconds = 60;
    codeButton.disabled = true;
    codeButton.textContent = `${seconds}s 后重发`;
    toast("验证码已发送");
    codeTimer = setInterval(() => {
      seconds -= 1;
      if (seconds <= 0) {
        clearInterval(codeTimer);
        codeTimer = null;
        codeButton.disabled = false;
        codeButton.textContent = "重新获取";
      } else {
        codeButton.textContent = `${seconds}s 后重发`;
      }
    }, 1000);
  }

  function submitPhoneLogin(article) {
    const { phone, code } = loginControls(article);
    if (!/^1\d{10}$/.test(phone?.value || "")) return setFieldError(phone, "请输入正确的 11 位手机号");
    if (!/^\d{6}$/.test(code?.value || "")) return setFieldError(code, "请输入 6 位短信验证码");
    toast("登录成功");
    navigate("institution-home");
  }

  function resetLogin() {
    clearInterval(codeTimer);
    codeTimer = null;
    const login = document.querySelector('[data-mobile="login"]');
    const { phone, code, codeButton } = loginControls(login);
    if (phone) phone.value = "";
    if (code) code.value = "";
    login?.querySelectorAll(".login-field").forEach(field => field.classList.remove("error"));
    if (codeButton) {
      codeButton.disabled = false;
      codeButton.textContent = "获取验证码";
    }
    setLoginMode(login, "wechat", false);
  }

  function handleMobileClick(target, article) {
    const text = target.textContent.replace(/\s+/g, " ").trim();
    const round = target.closest(".round");
    if (round) {
      const rounds = [...(round.closest(".appbar")?.querySelectorAll(".round") || [])];
      const explicitBack = round.closest("[data-back]")?.dataset.back;
      if (rounds.indexOf(round) === 0) return navigate(explicitBack || backRoute[page] || "institution-home");
      return toast("操作入口已响应");
    }
    const tab = target.closest(".tab");
    if (tab) return routeTab(tab.textContent.trim());

    if (page === "login") {
      const loginDocument = target.closest(".login-agree b");
      if (loginDocument) return navigate(loginDocument.textContent.includes("用户协议") ? "user-agreement" : "privacy-policy");
      const loginTab = target.closest("[data-login-mode]");
      if (loginTab) return setLoginMode(article, loginTab.dataset.loginMode);
      if (target.closest(".code-action")) return startCodeCountdown(article);
      if (target.closest(".btn-primary")) return submitPhoneLogin(article);
      if (target.closest(".wechat-btn")) return navigate("institution-home");
    }
    if (page === "public-home") {
      const bannerDot = target.closest("[data-banner-index]");
      if (bannerDot) {
        bannerIndex = Number(bannerDot.dataset.bannerIndex);
        startPublicBanner();
        return;
      }
      if (target.closest(".public-case-entry")) return navigate("case-results");
      const action = target.closest("[data-public-action]");
      if (action) return action.dataset.publicAction === "partner" ? navigate("partner-apply") : navigate("assessment-list");
      const publicBrain = target.closest(".public-brain-primary");
      if (publicBrain) {
        setBack("brain-center", "public-home");
        return navigate("brain-center");
      }
      const center = target.closest(".center-item");
      if (center) {
        const centerLabel = center.querySelector("b")?.textContent.trim() || center.textContent.trim();
        const destination = moduleRoute[centerLabel] || "public-home";
        return navigate(destination);
      }
    }
    if (page === "institution-home") {
      if (target.closest(".profile-circle")) return navigate("profile-center");
      if (target.closest(".risk-banner")) return navigate("warning-center");
      if (target.closest(".institution-quota-strip")) {
        setBack("store-center", "institution-home");
        return navigate("store-center");
      }
      const orgModule = target.closest(".org-module");
      if (orgModule) {
        let destination = orgModule.dataset.moduleRoute || moduleRoute[orgModule.textContent.trim()] || "institution-home";
        if (destination === "assessment-center") destination = "assessment-list";
        if (destination === "brain-center") setBack("brain-center", "institution-home");
        return navigate(destination);
      }
      if (target.closest(".ai-entry")) return navigate("ai-explain");
    }
    if (page === "brain-center") {
      if (target.closest(".brain-center-ai")) {
        setBack("ai-explain", "brain-center");
        return navigate("ai-explain");
      }
      if (target.closest(".brain-report-more")) {
        setBack("brain-report-list", "brain-center");
        return navigate("brain-report-list");
      }
      if (target.closest(".brain-center-voice")) return toggleVoicePlayback(article);
      if (target.closest(".brain-center-whitepaper")) {
        setBack("brain-whitepaper", "brain-center");
        return navigate("brain-whitepaper");
      }
      if (target.closest(".brain-center-latest")) {
        setBack("brain-report", "brain-center");
        return navigate("brain-report");
      }
      const reportItem = target.closest(".brain-center-report");
      if (reportItem) {
        syncBrainReportDetail(reportItem);
        setBack("brain-report", "brain-center");
        return navigate("brain-report");
      }
    }
    if (page === "brain-report") {
      if (target.closest(".whitepaper-link")) {
        setBack("brain-whitepaper", "brain-report");
        return navigate("brain-whitepaper");
      }
      if (target.closest(".voice-player")) return toggleVoicePlayback(article);
      const action = target.closest(".report-actions > *");
      if (action) {
        if (action.textContent.includes("训练")) {
          setBack("training-plan", "brain-report");
          return navigate("training-plan");
        }
      }
    }
    if (page === "ai-explain") {
      const quick = target.closest(".quick-row span");
      if (quick) return quick.textContent.includes("训练") ? navigate("training-plan") : toast("语音解读已开始");
      if (target.closest(".send")) return submitChatMessage(article);
    }
    if (page === "training-plan") {
      if (target.closest(".training-card:not(.locked)")) return toast("训练任务已打开");
      if (target.closest(".app-guide")) return toast("正在唤起脑罗盘 App");
    }
    if (page === "warning-center") {
      if (target.closest(".warning-history-more")) {
        setBack("personal-warning-list", "warning-center");
        return navigate("personal-warning-list");
      }
      const personalRecord = target.closest(".personal-warning-entry");
      if (personalRecord) {
        syncPersonalWarningDetail(personalRecord);
        setBack("personal-warning-detail", "warning-center");
        return navigate("personal-warning-detail");
      }
      const filter = target.closest(".filter-tabs span");
      if (filter) return activateSibling(filter, "span");
      const person = target.closest(".risk-person");
      if (person) {
        syncWarningDetail(person);
        return navigate("warning-detail");
      }
    }
    if (page === "personal-warning-list") {
      const personalRecord = target.closest(".personal-warning-entry");
      if (personalRecord) {
        syncPersonalWarningDetail(personalRecord);
        setBack("personal-warning-detail", "personal-warning-list");
        return navigate("personal-warning-detail");
      }
    }
    if (page === "warning-detail" && target.closest(".warning-record-action")) return navigate("warning-record-form");
    if (page === "growth-archive") {
      const metric = target.closest(".metric");
      if (metric) {
        const metricText = metric.textContent.replace(/\s+/g, " ").trim();
        if (metricText.includes("脑检测") || metricText.includes("脑健康")) {
          setBack("brain-report-list", "growth-archive");
          return navigate("brain-report-list");
        }
        if (metricText.includes("训练")) {
          setBack("training-record-list", "growth-archive");
          return navigate("training-record-list");
        }
        if (metricText.includes("量表")) return navigate("assessment-result");
      }
      if (target.closest(".trend-card")) {
        setBack("brain-report-list", "growth-archive");
        return navigate("brain-report-list");
      }
      const item = target.closest(".archive-item");
      if (item) {
        const itemText = item.textContent.replace(/\s+/g, " ").trim();
        if (itemText.includes("脑功能") || itemText.includes("脑健康")) {
          setBack("brain-report-list", "growth-archive");
          return navigate("brain-report-list");
        }
        if (itemText.includes("训练")) {
          setBack("training-record-list", "growth-archive");
          return navigate("training-record-list");
        }
        if (itemText.includes("人格")) return navigate("assessment-result");
      }
    }
    if (page === "brain-report-list") {
      const reportItem = target.closest(".report-list-item");
      if (reportItem) {
        syncBrainReportDetail(reportItem);
        setBack("brain-report", "brain-report-list");
        return navigate("brain-report");
      }
    }
    if (page === "training-record-list") {
      const recordItem = target.closest(".training-record-item");
      if (recordItem) {
        syncTrainingRecordDetail(recordItem);
        return navigate("training-record-detail");
      }
    }
    if (page === "training-record-detail" && target.closest(".training-record-plan")) {
      setBack("training-plan", "training-record-detail");
      return navigate("training-plan");
    }
    if (page === "assessment-list") {
      if (target.closest(".personality-report-entry")) {
        setBack("assessment-report-list", "assessment-list");
        return navigate("assessment-report-list");
      }
      if (target.closest(".scale-card")) return navigate("assessment-detail");
    }
    if (page === "assessment-report-list" && target.closest(".assessment-report-item")) {
      setBack("assessment-result", "assessment-report-list");
      return navigate("assessment-result");
    }
    if (page === "assessment-detail" && target.closest(".bottom-action")) {
      resetAssessment();
      return navigate("assessment-process");
    }
    if (page === "assessment-process") {
      const option = target.closest(".answer-option");
      if (option) {
        assessmentAnswers[assessmentIndex] = Number(option.dataset.value);
        return renderAssessmentQuestion();
      }
      const action = target.closest("[data-assessment-action]");
      if (action?.dataset.assessmentAction === "prev") {
        if (assessmentIndex > 0) assessmentIndex -= 1;
        return renderAssessmentQuestion();
      }
      if (action?.dataset.assessmentAction === "next") {
        if (assessmentAnswers[assessmentIndex] === null) return toast("请选择本题答案");
        if (assessmentIndex === assessmentQuestions.length - 1) {
          toast("测评已完成");
          setBack("assessment-result", "assessment-process");
          return navigate("assessment-result");
        }
        assessmentIndex += 1;
        return renderAssessmentQuestion();
      }
    }
    if (page === "assessment-result") {
      if (target.closest(".assessment-report-voice")) return toggleVoicePlayback(article);
      if (target.closest(".ai-teacher-entry")) {
        setBack("ai-explain", "assessment-result");
        return navigate("ai-explain");
      }
      if (target.closest(".objective-link")) return navigate("brain-center");
      const action = target.closest(".report-actions > *");
      if (action) return navigate("brain-center");
    }
    if (page === "knowledge-center") {
      const topic = target.closest(".topic");
      if (topic) {
        activateSibling(topic, ".topic");
        const label = topic.textContent.trim();
        article.querySelectorAll(".featured-article,.article-item").forEach(card => {
          const typeTab = article.querySelector(".classroom-type-tabs .active")?.textContent.trim() || "全部";
          card.style.display = (label === "全部" || card.dataset.contentCategory === label) && (typeTab === "全部" || card.dataset.contentType === typeTab) ? "" : "none";
        });
        return;
      }
      const typeTab = target.closest(".classroom-type-tabs span");
      if (typeTab) {
        activateSibling(typeTab, "span");
        const type = typeTab.textContent.trim();
        const category = article.querySelector(".topic.active")?.textContent.trim() || "全部";
        article.querySelectorAll(".featured-article,.article-item").forEach(card => {
          card.style.display = (type === "全部" || card.dataset.contentType === type) && (category === "全部" || card.dataset.contentCategory === category) ? "" : "none";
        });
        return;
      }
      const recordEntry = target.closest(".classroom-record-entry");
      if (recordEntry) {
        showClassroomRecordTab(recordEntry.dataset.recordTab || "收藏");
        return navigate("classroom-records");
      }
      const articleCard = target.closest(".featured-article,.article-item");
      if (articleCard) {
        syncKnowledgeDetail(articleCard);
        setBack("knowledge-detail", "knowledge-center");
        return navigate("knowledge-detail");
      }
    }
    if (page === "classroom-records") {
      const recordTab = target.closest(".classroom-record-tabs span");
      if (recordTab) return showClassroomRecordTab(recordTab.textContent.trim());
      const recordItem = target.closest(".classroom-record-item");
      if (recordItem) {
        syncKnowledgeDetail(recordItem);
        setBack("knowledge-detail", "classroom-records");
        return navigate("knowledge-detail");
      }
    }
    if (page === "knowledge-detail") {
      const play = target.closest(".classroom-media-play,.classroom-media");
      if (play) {
        const media = article.querySelector(".classroom-media");
        const playing = media?.classList.toggle("playing");
        const type = article.dataset.contentType === "音频" ? "音频" : "视频";
        const label = article.querySelector("[data-classroom-play-label]");
        if (label) label.textContent = playing ? `暂停${type}` : `播放${type}`;
        return toast(playing ? `${type}开始播放` : `${type}已暂停`);
      }
      const favorite = target.closest(".classroom-favorite");
      if (favorite) {
        const active = favorite.classList.toggle("active");
        favorite.textContent = active ? "已收藏" : "收藏内容";
        return toast(active ? "已加入我的收藏" : "已取消收藏");
      }
      if (target.closest(".classroom-share")) return toast("已打开微信分享");
    }
    if (page === "message-center") {
      if (target.closest(".message-read-all")) {
        article.querySelectorAll(".message-card.unread").forEach(markMessageRead);
        return toast("全部消息已标记为已读");
      }
      const messageCard = target.closest(".message-card");
      if (messageCard) {
        syncMessageDetail(messageCard);
        return navigate("message-detail");
      }
    }
    if (page === "binding-review-list") {
      const tab = target.closest("[data-binding-review-tab]");
      if (tab) {
        activateSibling(tab, "button");
        return filterBindingReviews(tab.dataset.bindingReviewTab);
      }
      const card = target.closest("[data-binding-application-id]");
      if (card) {
        selectedBindingApplicationId = card.dataset.bindingApplicationId;
        syncBindingReviewDetail(selectedBindingApplicationId);
        return navigate("binding-review-detail");
      }
    }
    if (page === "binding-review-detail") {
      if (target.closest(".binding-detail-approve")) {
        const data = bindingApplication(selectedBindingApplicationId);
        if (!data || data.status !== "待审核") return toast("该申请已处理，请刷新列表");
        const org = article.querySelector("#binding-review-org")?.value || data.org;
        const card = bindingReviewCard(selectedBindingApplicationId);
        if (card) card.dataset.targetOrg = org;
        pendingAction = { type: "binding-mobile-approve", applicationId: selectedBindingApplicationId };
        return modal("binding-mobile-approve", { title: "通过绑定申请", copy: `确认将${data.name}绑定到${org}吗？` });
      }
      if (target.closest(".binding-detail-reject")) {
        const data = bindingApplication(selectedBindingApplicationId);
        if (!data || data.status !== "待审核") return toast("该申请已处理，请刷新列表");
        pendingAction = { type: "binding-mobile-reject", applicationId: selectedBindingApplicationId };
        return modal("binding-mobile-reject", { title: "拒绝绑定申请", copy: `确认拒绝${data.name}的机构绑定申请吗？` });
      }
    }
    if (page === "profile-center") {
      if (target.closest(".profile-message")) return navigate("message-center");
      if (target.closest("[data-quota-entry]")) return navigate("quota-detail");
      if (target.closest(".quota-buy-link")) {
        setBack("store-center", "profile-center");
        return navigate("store-center");
      }
      if (target.closest(".quota-detail-link")) return navigate("quota-detail");
      const item = target.closest(".menu-item");
      if (item) {
        const itemText = item.textContent.replace(/\s+/g, " ").trim();
        if (itemText.includes("我的订单")) return navigate("order-list");
        if (itemText.includes("编辑个人")) return navigate("profile-edit");
        if (itemText.includes("修改登录密码")) return navigate("password-change");
        if (itemText.includes("脑测评报告")) {
          setBack("brain-report-list", "profile-center");
          return navigate("brain-report-list");
        }
        if (itemText.includes("训练与复测")) {
          setBack("training-record-list", "profile-center");
          return navigate("training-record-list");
        }
        if (itemText.includes("预警与干预")) return navigate("warning-center");
        if (itemText.includes("机构绑定审核")) return navigate("binding-review-list");
        if (itemText.includes("我的机构")) return navigate("institution-binding");
        if (itemText.includes("合作入驻")) {
          setBack("partner-apply", "profile-center");
          return navigate("partner-apply");
        }
        if (itemText.includes("消息通知")) return navigate("message-center");
        if (itemText.includes("知情同意") || itemText.includes("隐私授权")) return navigate("privacy-center");
        return toast("功能入口已响应");
      }
      if (target.closest(".logout-btn")) return modal("logout");
    }
    if (page === "quota-detail" && target.closest(".quota-recharge-action")) {
      setBack("store-center", "quota-detail");
      return navigate("store-center");
    }
    if (page === "store-center") {
      if (target.closest(".commerce-order-link")) return navigate("order-list");
      const category = target.closest(".commerce-tabs span");
      if (category) {
        activateSibling(category, "span");
        const label = category.textContent.trim();
        article.querySelectorAll(".product-card").forEach(card => {
          card.style.display = label === "全部" || card.dataset.productType.includes(label.replace("训练", "")) ? "" : "none";
        });
        return;
      }
      const product = target.closest(".product-card");
      if (product) {
        syncProductSelection(product);
        return navigate("order-confirm");
      }
    }
    if (page === "order-confirm") {
      if (target.closest(".order-confirm-action")) {
        completePayment();
        toast("微信支付成功，配额已到账");
        return navigate("payment-result");
      }
      if (target.closest(".order-later-action")) {
        createOrder("待支付");
        toast("订单已创建，可稍后继续支付");
        return navigate("order-detail");
      }
    }
    if (page === "payment-result") {
      if (target.closest(".payment-order-action")) return navigate("order-detail");
      if (target.closest(".payment-finish-action")) return navigate("profile-center");
    }
    if (page === "order-list") {
      const statusTab = target.closest(".order-status-tabs span");
      if (statusTab) {
        activateSibling(statusTab, "span");
        const status = statusTab.textContent.trim();
        article.querySelectorAll(".order-list-item").forEach(item => {
          const refundAfterSale = status === "退款/售后" && ["退款中", "已退款"].includes(item.dataset.orderStatus);
          item.style.display = status === "全部" || item.dataset.orderStatus === status || refundAfterSale ? "" : "none";
        });
        return;
      }
      const orderItem = target.closest(".order-list-item");
      if (orderItem) {
        syncOrderFromList(orderItem);
        return navigate("order-detail");
      }
    }
    if (page === "order-detail") {
      if (target.closest(".refund-entry")) return navigate("refund-form");
      if (target.closest(".order-cancel-action")) {
        pendingAction = { type: "order-cancel" };
        return modal("order-cancel", { title: "取消订单", copy: "确认取消当前待支付订单吗？取消后将无法继续支付。" });
      }
      if (target.closest(".order-repay-action")) {
        const isTalent = selectedOrder.name.includes("天赋");
        const isAI = selectedOrder.name.includes("AI");
        selectedProduct = {
          name: selectedOrder.name,
          type: isAI ? "AI 训练时长" : isTalent ? "天赋测评份额" : "人格测评份额",
          quota: selectedOrder.quota.match(/^\d+\s*(?:份|分钟)/)?.[0] || selectedProduct.quota,
          price: selectedOrder.price,
          copy: isAI ? "用于 AI 心智助理、训练解读与个性化陪伴" : isTalent ? "适用于个人发展、人才盘点与成长规划" : "适用于校园、企业和机关的常用人格量表配额"
        };
        syncProductSelection();
        return navigate("order-confirm");
      }
      if (target.closest(".order-buy-again")) return navigate("store-center");
      if (target.closest(".receipt-link")) return toast("电子消费凭证已打开");
    }
    if (page === "refund-form") {
      const choice = target.closest(".refund-choice");
      if (choice) return activateSibling(choice, ".refund-choice");
    }
    if (page === "talent-center") {
      if (target.closest(".talent-report-list-entry")) {
        setBack("talent-report-list", "talent-center");
        return navigate("talent-report-list");
      }
      if (target.closest(".talent-card")) {
        setBack("talent-report", "talent-center");
        return navigate("talent-report");
      }
    }
    if (page === "talent-report-list") {
      const talentReport = target.closest(".talent-report-item");
      if (talentReport) {
        syncTalentReportDetail(talentReport);
        setBack("talent-report", "talent-report-list");
        return navigate("talent-report");
      }
    }
  }

  function handleAdminClick(target, article) {
    const text = target.textContent.replace(/\s+/g, " ").trim();
    const sideItem = target.closest(".side-item");
    if (sideItem) return adminRoute[sideItem.textContent.replace(/\d+/g, "").trim()] ? navigate(adminRoute[sideItem.textContent.replace(/\d+/g, "").trim()]) : toast("系统设置入口已响应");
    const formBack = target.closest("[data-admin-back]");
    if (formBack) return navigate(formBack.dataset.adminBack);
    if (target.closest(".member-add")) return navigate("member-form");
    if (target.closest(".member-import-entry")) return navigate("member-import");
    if (target.closest(".hierarchy-add")) return navigate("hierarchy-form");
    if (target.closest(".binding-permission-entry")) return navigate("binding-permission");
    const approvalRole = target.closest(".approval-role-item");
    if (approvalRole) {
      activateSibling(approvalRole, ".approval-role-item");
      const roleName = approvalRole.dataset.approvalRole;
      const scope = approvalRole.dataset.approvalScope;
      const roleTitle = article.querySelector("[data-approval-role-name]");
      const roleSummary = article.querySelector("[data-approval-role-summary]");
      if (roleTitle) roleTitle.textContent = roleName;
      if (roleSummary) roleSummary.textContent = `审核范围：${scope}`;
      const permissionKeys = roleName === "普通成员" ? [] : roleName === "基层负责人" ? ["review","reject","mobile","admin"] : roleName === "部门负责人" ? ["review","adjust","reject","mobile","admin"] : ["review","adjust","reject","unbind","mobile","admin"];
      article.querySelectorAll(".approval-permission-option").forEach(option => {
        const enabled = permissionKeys.includes(option.dataset.permissionKey);
        option.classList.toggle("selected", enabled);
        const tick = option.querySelector(".tick");
        if (tick) { tick.classList.toggle("off", !enabled); tick.textContent = enabled ? "✓" : ""; }
      });
      article.querySelector(".approval-config-head .a-tag").textContent = roleName === "普通成员" ? "未启用" : "已启用";
      return;
    }
    const approvalOption = target.closest(".approval-permission-option");
    if (approvalOption) {
      const enabled = approvalOption.classList.toggle("selected");
      const tick = approvalOption.querySelector(".tick");
      if (tick) { tick.classList.toggle("off", !enabled); tick.textContent = enabled ? "✓" : ""; }
      return;
    }
    if (target.closest(".approval-descendants")) {
      target.closest(".approval-descendants").classList.toggle("off");
      return;
    }
    if (target.closest(".approval-reset")) {
      article.querySelectorAll(".approval-permission-option").forEach(option => {
        option.classList.add("selected");
        const tick = option.querySelector(".tick");
        if (tick) { tick.classList.remove("off"); tick.textContent = "✓"; }
      });
      article.querySelector(".approval-descendants")?.classList.remove("off");
      return toast("已恢复当前角色的默认权限");
    }
    if (target.closest(".approval-save")) return toast("审核权限已保存，并同步至小程序与后台");
    if (target.closest(".classroom-admin-entry")) return navigate("classroom-management");
    if (target.closest(".classroom-publish-entry,.classroom-content-edit")) return navigate("classroom-publish");
    if (target.closest(".classroom-category-entry")) return navigate("classroom-category");
    const bindingTab = target.closest(".binding-tabs span");
    if (bindingTab) {
      activateSibling(bindingTab, "span");
      const selected = bindingTab.dataset.bindingTab;
      article.querySelectorAll("[data-binding-panel]").forEach(panel => { panel.hidden = panel.dataset.bindingPanel !== selected; });
      return;
    }
    const bindingApprove = target.closest(".binding-approve");
    if (bindingApprove) {
      const row = bindingApprove.closest("[data-binding-row]");
      const applicationId = row?.dataset.bindingApplicationId;
      const assignedOrganization = row?.querySelector(".binding-admin-org")?.value;
      const card = bindingReviewCard(applicationId);
      if (card && assignedOrganization) card.dataset.targetOrg = assignedOrganization;
      pendingAction = { type: "binding-admin-approve", applicationId };
      const name = row?.querySelector(".member-person b")?.textContent.trim() || "该用户";
      return modal("binding-approve", { title: "通过绑定申请", copy: `确认将${name}绑定到当前机构吗？` });
    }
    const bindingReject = target.closest(".binding-reject");
    if (bindingReject) {
      const row = bindingReject.closest("[data-binding-row]");
      pendingAction = { type: "binding-admin-reject", applicationId: row?.dataset.bindingApplicationId };
      const name = row?.querySelector(".member-person b")?.textContent.trim() || "该用户";
      return modal("binding-reject", { title: "拒绝绑定申请", copy: `确认拒绝${name}的机构绑定申请吗？` });
    }
    if (target.closest(".binding-batch-approve,.binding-batch-reject")) {
      const approved = Boolean(target.closest(".binding-batch-approve"));
      const pendingRows = [...article.querySelectorAll('[data-binding-row][data-binding-status="待审核"]')].filter(row => row.style.display !== "none");
      if (approved) pendingRows.forEach(row => {
        const card = bindingReviewCard(row.dataset.bindingApplicationId);
        const assignedOrganization = row.querySelector(".binding-admin-org")?.value;
        if (card && assignedOrganization) card.dataset.targetOrg = assignedOrganization;
      });
      const ids = pendingRows.map(row => row.dataset.bindingApplicationId).filter(Boolean);
      if (!ids.length) return toast("当前没有待审核申请");
      pendingAction = { type: approved ? "binding-batch-approve" : "binding-batch-reject", applicationIds: ids };
      return modal("binding-batch", { title: approved ? "批量通过申请" : "批量拒绝申请", copy: `确认${approved ? "通过" : "拒绝"}当前 ${ids.length} 条待审核申请吗？` });
    }
    if (target.closest(".import-template")) return toast("成员导入模板已下载");
    if (target.closest(".import-select")) {
      article.querySelector("#member-import-file")?.click();
      return;
    }
    if (target.closest(".commerce-orders-entry")) return navigate("order-management");
    if (target.closest(".voucher-entry")) return navigate("voucher-config");
    if (target.closest(".commerce-product-add,.commerce-product-edit")) return navigate("product-form");
    if (target.closest(".commerce-order-detail")) return navigate("admin-order-detail");
    if (target.closest(".refund-approve")) {
      pendingAction = "refund-approve";
      return modal("refund-approve", { title: "同意退款", copy: "确认回收未使用配额，并将 ¥399.00 原路退回吗？" });
    }
    if (target.closest(".refund-reject")) {
      pendingAction = "refund-reject";
      return modal("refund-reject", { title: "拒绝退款", copy: "确认拒绝本次退款申请吗？" });
    }
    const tab = target.closest(".rule-tabs span");
    if (tab) return activateSibling(tab, "span");
    const tick = target.closest(".permission-row .tick,.scope .tick");
    if (tick) { tick.classList.toggle("off"); return; }
    const moduleOption = target.closest(".module-option");
    if (moduleOption) {
      if (moduleOption.classList.contains("locked")) return toast("脑健康中心为固定核心模块");
      moduleOption.classList.toggle("selected");
      const enabled = moduleOption.classList.contains("selected");
      moduleOption.querySelector(".tick")?.classList.toggle("off", !enabled);
      const key = moduleKey(moduleOption.querySelector("b")?.textContent || "");
      moduleState[key] = enabled;
      syncMiniPreview(moduleOption, enabled);
      syncInstitutionModules();
      return toast(`${moduleOption.querySelector("b")?.textContent || "模块"}已更新`);
    }
    const filter = target.closest(".filter-tabs span,.category-tabs span");
    if (filter) return activateSibling(filter, "span");
    if (target.closest(".switch")) { target.closest(".switch").classList.toggle("off"); return toast("规则开关已更新"); }
    if (target.closest(".select")) return toast("筛选条件已切换");
    const action = target.closest(".a-action");
    if (action) {
      const actionText = action.textContent.trim();
      if (actionText.includes("处置") || actionText.includes("跟进")) {
        syncAdminInterventionForm(action.closest(".a-table-row"));
        return navigate("intervention-record-form");
      }
      return toast("操作已完成");
    }
    const button = target.closest(".a-btn");
    if (button) {
      if (button.closest("form")) return;
      if (text.includes("新增机构") || text.includes("添加机构")) return navigate("institution-form");
      if (text.includes("新增人工关怀")) return navigate("intervention-record-form");
      if (text.includes("导出") || text.includes("报表")) return toast("导出任务已创建，可在最近任务中查看进度");
      if (text.includes("保存") || text.includes("发布")) return toast("配置已保存并发布");
      return toast("操作入口已响应");
    }
    if (target.closest(".content-type,.report-template,.device-card,.package-card")) return toast("已打开详情");
  }

  document.addEventListener("click", event => {
    const article = activeArticle();
    if (!article || !article.contains(event.target)) return;
    if (mode === "mobile") handleMobileClick(event.target, article);
    else handleAdminClick(event.target, article);
  });

  function filterAdminBindingApplications() {
    const article = document.querySelector('[data-admin="member-binding"]');
    const toolbar = article?.querySelector(".binding-admin-toolbar");
    if (!article || !toolbar) return;
    const keyword = toolbar.querySelector('input[type="search"]')?.value.trim().toLowerCase() || "";
    const selects = toolbar.querySelectorAll("select");
    const organization = selects[0]?.value || "全部组织";
    const status = selects[1]?.value || "全部状态";
    article.querySelectorAll("[data-binding-row]").forEach(row => {
      const matchesKeyword = !keyword || row.textContent.toLowerCase().includes(keyword);
      const matchesOrganization = organization === "全部组织" || row.dataset.bindingOrg?.includes(organization);
      const matchesStatus = status === "全部状态" || row.dataset.bindingStatus === status;
      row.style.display = matchesKeyword && matchesOrganization && matchesStatus ? "" : "none";
    });
  }

  document.addEventListener("input", event => {
    if (event.target.matches(".binding-admin-search input")) filterAdminBindingApplications();
  });
  document.addEventListener("change", event => {
    if (event.target.matches(".binding-admin-toolbar select")) filterAdminBindingApplications();
  });

  document.addEventListener("submit", event => {
    const form = event.target.closest("form");
    if (!form) return;
    event.preventDefault();
    const value = selector => form.querySelector(selector)?.value.trim() || "";

    if (form.dataset.form === "partner") {
      if (!value("#partner-org")) return toast("请输入机构名称");
      if (!value("#partner-contact")) return toast("请输入联系人姓名");
      if (!/^1\d{10}$/.test(value("#partner-phone"))) return toast("请输入正确的 11 位联系人电话");
      form.reset();
      toast("合作申请已提交");
      return navigate("profile-center");
    }
    if (form.dataset.form === "institution-binding") {
      if (!/^1\d{10}$/.test(value("#binding-admin-phone"))) return toast("请输入正确的 11 位机构管理员手机号");
      const history = document.querySelector('[data-mobile="institution-binding"] .binding-history');
      if (history) {
        const phone = value("#binding-admin-phone");
        history.querySelector("b").textContent = "机构绑定申请";
        history.querySelector("p").textContent = `管理员 ${phone.slice(0, 3)}****${phone.slice(-4)} · 等待审核`;
        history.querySelector(".chip").textContent = "审核中";
      }
      form.reset();
      return toast("绑定申请已提交，审核结果将通过消息通知");
    }
    if (form.dataset.form === "profile") {
      if (!value("#profile-name")) return toast("请输入姓名");
      if (!/^1\d{10}$/.test(value("#profile-phone"))) return toast("请输入正确的 11 位手机号");
      const profile = document.querySelector('[data-mobile="profile-center"]');
      profile.querySelector(".profile-user h2").textContent = value("#profile-name");
      profile.querySelector(".profile-avatar").textContent = value("#profile-name").slice(0, 1);
      toast("个人信息已保存");
      return navigate("profile-center");
    }
    if (form.dataset.form === "password") {
      const current = value("#current-password");
      const next = value("#new-password");
      if (!current) return toast("请输入当前密码");
      if (next.length < 8) return toast("新密码不能少于 8 位");
      if (next !== value("#confirm-password")) return toast("两次输入的新密码不一致");
      form.reset();
      toast("登录密码已修改");
      return navigate("profile-center");
    }
    if (form.dataset.form === "warning") {
      if (!value("#warning-owner")) return toast("请输入负责人");
      if (!value("#warning-note")) return toast("请输入跟进记录");
      toast("处置记录已提交");
      return navigate("warning-detail");
    }
    if (form.dataset.form === "refund") {
      const quantity = Number(value("#refund-quantity"));
      if (!quantity || quantity < 1) return toast("请输入退款配额数量");
      if (!value("#refund-reason")) return toast("请选择退款原因");
      selectedOrder.status = "退款中";
      syncOrderDetail();
      toast("退款申请已提交，结果将通过消息通知");
      return navigate("order-detail");
    }
    if (form.dataset.adminForm === "institution") {
      if (!value("#admin-org-name")) return toast("请输入机构名称");
      if (!value("#admin-org-contact")) return toast("请输入联系人姓名");
      if (!/^1\d{10}$/.test(value("#admin-org-phone"))) return toast("请输入正确的 11 位联系人电话");
      toast("机构信息已保存");
      return navigate("institution-management");
    }
    if (form.dataset.adminForm === "intervention") {
      if (!value("#admin-case-owner")) return toast("请输入负责人");
      if (!value("#admin-case-note")) return toast("请输入跟进记录");
      toast("处置记录已提交");
      return navigate("intervention-ledger");
    }
    if (form.dataset.adminForm === "member") {
      if (!value("#member-name")) return toast("请输入成员姓名");
      if (!/^1\d{10}$/.test(value("#member-phone"))) return toast("请输入正确的 11 位手机号");
      toast("成员已新增并直接绑定到所选组织");
      return navigate("member-binding");
    }
    if (form.dataset.adminForm === "member-import") {
      toast("成员文件校验通过，已批量导入并建立绑定");
      return navigate("member-binding");
    }
    if (form.dataset.adminForm === "hierarchy") {
      if (!value("#hierarchy-name")) return toast("请输入组织名称");
      if (!value("#hierarchy-owner")) return toast("请输入负责人");
      toast("下级组织已创建，数据权限已自动继承");
      return navigate("hierarchy-permission");
    }
    if (form.dataset.adminForm === "classroom-publish") {
      if (!value("#classroom-title")) return toast("请输入内容标题");
      if (!value("#classroom-summary")) return toast("请输入内容摘要");
      toast("心智课堂内容已保存并按权限范围发布");
      return navigate("classroom-management");
    }
    if (form.dataset.adminForm === "classroom-category") {
      if (!value("#classroom-category-1")) return toast("请至少保留一个内容分类");
      toast("课堂分类与下级上传权限已保存");
      return navigate("classroom-management");
    }
    if (form.dataset.adminForm === "product") {
      if (!value("#admin-product-name")) return toast("请输入套餐名称");
      if (!value("#admin-product-quota")) return toast("请输入配额数量");
      if (!value("#admin-product-price")) return toast("请输入销售价格");
      if (!value("#admin-product-industry")) return toast("请输入适用行业");
      if (!value("#admin-product-description")) return toast("请输入商品说明");
      if (!value("#admin-product-notice")) return toast("请输入购买须知");
      toast("套餐商品已保存并同步至小程序");
      return navigate("commerce-center");
    }
    if (form.dataset.adminForm === "voucher") {
      if (!value("#voucher-name") || !value("#voucher-issuer")) return toast("请完善凭证模板信息");
      toast("电子消费凭证模板已保存");
      return navigate("commerce-center");
    }
  });

  document.addEventListener("input", event => {
    const input = event.target;
    if (input.matches("#login-phone,#login-code,#partner-phone,#profile-phone,#admin-org-phone,#binding-admin-phone,#member-phone")) {
      const limit = input.id === "login-code" ? 6 : 11;
      input.value = input.value.replace(/\D/g, "").slice(0, limit);
      input.closest(".login-field")?.classList.remove("error");
    }
    const query = input.value?.trim().toLowerCase();
    if (input.closest(".assessment-search")) {
      document.querySelectorAll('[data-mobile="assessment-list"] .scale-card').forEach(card => {
        card.style.display = !query || card.textContent.toLowerCase().includes(query) ? "flex" : "none";
      });
    }
    if (input.closest(".knowledge-search")) {
      document.querySelectorAll('[data-mobile="knowledge-center"] .featured-article,[data-mobile="knowledge-center"] .article-item').forEach(card => {
        card.style.display = !query || card.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    }
    if (input.closest(".search")) {
      const scope = input.closest("[data-admin]");
      scope?.querySelectorAll(".a-table-row").forEach(row => {
        row.style.display = !query || row.textContent.toLowerCase().includes(query) ? "grid" : "none";
      });
    }
    if (input.closest(".tree-search")) {
      input.closest(".org-tree")?.querySelectorAll(".tree-node").forEach(node => {
        node.style.display = !query || node.textContent.toLowerCase().includes(query) ? "flex" : "none";
      });
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    if (event.target.matches("#login-phone,#login-code")) {
      const login = document.querySelector('[data-mobile="login"]');
      return submitPhoneLogin(login);
    }
    if (event.target.matches("#ai-chat-input")) {
      event.preventDefault();
      return submitChatMessage(document.querySelector('[data-mobile="ai-explain"]'));
    }
  });

  window.addEventListener("message", event => {
    const message = event.data || {};
    if (message.type === "naoluopan:show") return show(message.mode, message.page);
    if (message.type === "naoluopan:modal-result" && message.ok && pendingAction) {
      if (typeof pendingAction === "object" && pendingAction.type === "order-cancel") {
        pendingAction = null;
        selectedOrder.status = "已取消";
        selectedOrder.trade = "未支付";
        syncOrderDetail();
        return toast("订单已取消");
      }
      if (typeof pendingAction === "object" && pendingAction.type.startsWith("binding-")) {
        const action = pendingAction;
        const approved = action.type.endsWith("approve");
        const applicationIds = action.applicationIds || [action.applicationId];
        const changed = applicationIds.filter(Boolean).filter(applicationId => applyBindingDecision(applicationId, approved)).length;
        pendingAction = null;
        if (!changed) return toast("申请已被其他管理员处理，当前页面已同步");
        return toast(approved ? `${changed} 条绑定申请已通过并同步` : `${changed} 条绑定申请已拒绝并同步`);
      }
      const approved = pendingAction === "refund-approve";
      pendingAction = null;
      selectedOrder.status = approved ? "已退款" : "已支付";
      syncOrderDetail();
      toast(approved ? "退款已通过，配额已回收并原路退款" : "退款申请已拒绝");
      return navigate("order-management");
    }
    if (message.type === "naoluopan:reset") {
      resetLogin();
      resetAssessment();
      return show(mode, mode === "mobile" ? "login" : "platform-dashboard");
    }
  });

  syncUnreadCount();
  syncBindingCounts();
  show(mode, page);
  if (document.fonts?.ready) document.fonts.ready.then(() => post("ready", { mode, page })); else post("ready", { mode, page });
})();
