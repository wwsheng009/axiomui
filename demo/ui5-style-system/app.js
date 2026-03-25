(function () {
  var STORAGE_PREFIX = "ui5-style-system-demo:";
  var app = document.getElementById("demo-app");
  var root = document.documentElement;
  var dialog = document.getElementById("demo-dialog");
  var popover = document.getElementById("demo-popover");
  var sideNav = document.getElementById("demo-side-nav");
  var tokenGroupsHost = document.getElementById("token-groups");
  var tokenSearchInput = document.getElementById("token-search");
  var tokenEmptyState = document.getElementById("token-empty");
  var acceptanceReviewPanel = document.querySelector("[data-acceptance-review-panel]");
  var acceptanceReviewUrlReady = false;
  var syncAcceptanceReviewUrlState = function () {};
  var EVIDENCE_ROOT = "../../tmp/ui5-style-system-shots/";
  var EVIDENCE_MANIFEST_PATH = EVIDENCE_ROOT + "manifest.json";
  var evidenceManifest = null;
  var EVIDENCE_TARGETS = {
    matrix: { slug: "matrix", label: "Matrix Evidence" },
    worklist: { slug: "worklist", label: "Worklist Evidence" },
    objectPage: { slug: "object-page", label: "Object Page Evidence" },
    objectHistory: { slug: "object-page-tab-object-history", label: "History Evidence" },
    tokens: { slug: "tokens", label: "Tokens Evidence" },
    acceptance: { slug: "acceptance", label: "Acceptance Evidence" }
  };
  var ACCEPTANCE_EVIDENCE_MAP = {
    "button-states": "matrix",
    "button-selected": "matrix",
    "field-states": "objectPage",
    "field-family": "objectPage",
    "list-states": "worklist",
    "list-highlight-focus": "objectPage",
    "dialog-shell": "matrix",
    "popover-contrast": "matrix",
    "card-surface": "worklist",
    "card-loading": "matrix",
    "header-spacing": "worklist",
    "header-hierarchy": "objectPage",
    "tabs-indicator": "objectPage",
    "nav-collapse": "matrix",
    "feedback-strip": "worklist",
    "feedback-layering": "objectHistory"
  };

  var TOKEN_GROUPS = [
    {
      title: "Button",
      description: "Default, hover, active and selected button tokens.",
      docs: [
        { label: "Core Matrix", href: "../../docs/analysis/ui5-style-system/core-component-state-matrices.md" },
        { label: "Button System", href: "../../docs/analysis/ui5-style-system/components/button-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" }
      ],
      tokens: [
        "--sapButton_Background",
        "--sapButton_BorderColor",
        "--sapButton_TextColor",
        "--sapButton_Hover_Background",
        "--sapButton_Active_Background",
        "--sapButton_Selected_Background"
      ]
    },
    {
      title: "Field / Input",
      description: "Field wrapper, focus and value-state tokens.",
      docs: [
        { label: "Core Matrix", href: "../../docs/analysis/ui5-style-system/core-component-state-matrices.md" },
        { label: "Field System", href: "../../docs/analysis/ui5-style-system/components/field-and-input-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" },
        { label: "Object Page", href: "./object-page.html" }
      ],
      tokens: [
        "--sapField_Background",
        "--sapField_BorderColor",
        "--sapField_TextColor",
        "--sapField_PlaceholderTextColor",
        "--sapField_Focus_BorderColor",
        "--sapField_InvalidBackground",
        "--sapField_WarningBackground",
        "--sapField_SuccessBackground"
      ]
    },
    {
      title: "List / Row",
      description: "Row background, hover, selection and active tokens.",
      docs: [
        { label: "Core Matrix", href: "../../docs/analysis/ui5-style-system/core-component-state-matrices.md" },
        { label: "List System", href: "../../docs/analysis/ui5-style-system/components/list-table-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" },
        { label: "Worklist", href: "./worklist.html" },
        { label: "Object Page", href: "./object-page.html" }
      ],
      tokens: [
        "--sapList_Background",
        "--sapList_BorderColor",
        "--sapList_Hover_Background",
        "--sapList_SelectionBackgroundColor",
        "--sapList_SelectionBorderColor",
        "--sapList_Active_Background",
        "--sapList_Active_TextColor"
      ]
    },
    {
      title: "Dialog / Popover",
      description: "Overlay radius, shadow and semantic header tokens.",
      docs: [
        { label: "Core Matrix", href: "../../docs/analysis/ui5-style-system/core-component-state-matrices.md" },
        { label: "Dialog System", href: "../../docs/analysis/ui5-style-system/components/dialog-and-popover-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" }
      ],
      tokens: [
        "--sapContent_Shadow3",
        "--sapElement_BorderCornerRadius",
        "--sapWarningBorderColor",
        "--sapErrorBorderColor",
        "--sapSuccessBorderColor",
        "--sapInformationBorderColor"
      ]
    },
    {
      title: "Card",
      description: "Surface, border, radius and hover elevation tokens.",
      docs: [
        { label: "Secondary Matrix", href: "../../docs/analysis/ui5-style-system/secondary-component-state-matrices.md" },
        { label: "Card System", href: "../../docs/analysis/ui5-style-system/components/card-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" },
        { label: "Worklist", href: "./worklist.html" },
        { label: "Object Page", href: "./object-page.html" }
      ],
      tokens: [
        "--sapTile_Background",
        "--sapTile_BorderColor",
        "--sapTile_BorderCornerRadius",
        "--sapTile_SeparatorColor",
        "--sapTile_Hover_Background",
        "--sapTile_Active_Background"
      ]
    },
    {
      title: "Header / Shell",
      description: "Toolbar, page header and shell background tokens.",
      docs: [
        { label: "Secondary Matrix", href: "../../docs/analysis/ui5-style-system/secondary-component-state-matrices.md" },
        { label: "Header System", href: "../../docs/analysis/ui5-style-system/components/toolbar-header-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" },
        { label: "Worklist", href: "./worklist.html" },
        { label: "Object Page", href: "./object-page.html" }
      ],
      tokens: [
        "--sapToolbar_Background",
        "--sapPageHeader_Background",
        "--sapPageHeader_TextColor",
        "--sapShell_Navigation_Background",
        "--sapShell_Hover_Background",
        "--sapShell_Active_Background"
      ]
    },
    {
      title: "Tabs / Navigation",
      description: "Tab, indicator and shell-navigation tokens.",
      docs: [
        { label: "Secondary Matrix", href: "../../docs/analysis/ui5-style-system/secondary-component-state-matrices.md" },
        { label: "Tabs System", href: "../../docs/analysis/ui5-style-system/components/tabs-navigation-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" },
        { label: "Object Page", href: "./object-page.html" }
      ],
      tokens: [
        "--sapTab_TextColor",
        "--sapTab_Selected_TextColor",
        "--sapTab_Selected_Indicator_Dimension",
        "--sapShell_Navigation_TextColor",
        "--sapShell_Navigation_Selected_TextColor",
        "--sapContent_FocusColor"
      ]
    },
    {
      title: "Message / Feedback",
      description: "Inline feedback and semantic feedback tokens.",
      docs: [
        { label: "Secondary Matrix", href: "../../docs/analysis/ui5-style-system/secondary-component-state-matrices.md" },
        { label: "Feedback System", href: "../../docs/analysis/ui5-style-system/components/message-feedback-system.md" }
      ],
      pages: [
        { label: "Matrix", href: "./matrix.html" },
        { label: "Worklist", href: "./worklist.html" },
        { label: "Object Page", href: "./object-page.html" }
      ],
      tokens: [
        "--sapNeutralBackground",
        "--sapNeutralBorderColor",
        "--sapSuccessBackground",
        "--sapWarningBackground",
        "--sapErrorBackground",
        "--sapMessage_BorderWidth"
      ]
    }
  ];

  function readPreference(key, fallback) {
    try {
      return window.localStorage.getItem(STORAGE_PREFIX + key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writePreference(key, value) {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, value);
    } catch (error) {
      // Ignore storage errors so the demo still works in restrictive contexts.
    }
  }

  function readQueryParam(key, fallback) {
    try {
      var params = new URLSearchParams(window.location.search);
      var value = params.get(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function normalizeDensityValue(value) {
    return value === "compact" || value === "cozy" ? value : "";
  }

  function normalizeDirectionValue(value) {
    return value === "rtl" || value === "ltr" ? value : "";
  }

  function classifyTokenValue(tokenName, value) {
    var lowerName = (tokenName || "").toLowerCase();
    if (!value) {
      return "size";
    }
    if (lowerName.indexOf("shadow") !== -1) {
      return "shadow";
    }
    if (value.indexOf("rgb") === 0 || value.indexOf("#") === 0 || value.indexOf("hsl") === 0) {
      return "color";
    }
    if (value.indexOf("gradient") !== -1) {
      return "color";
    }
    if (value.indexOf("shadow") !== -1 || value.indexOf("rgba") !== -1 && value.indexOf("0px") !== -1) {
      return "shadow";
    }
    if (value.indexOf("rem") !== -1 || value.indexOf("px") !== -1 || value.indexOf("%") !== -1) {
      return "size";
    }
    return "size";
  }

  function buildLinkList(items) {
    if (!items || !items.length) {
      return null;
    }

    var list = document.createElement("div");
    list.className = "demo-token-links";

    items.forEach(function (item) {
      var link = document.createElement("a");
      link.className = "demo-token-link";
      link.href = item.href;
      link.textContent = item.label;
      list.appendChild(link);
    });

    return list;
  }

  function renderTokenGroups() {
    if (!tokenGroupsHost) {
      return;
    }

    var computedStyle = window.getComputedStyle(root);
    var fragment = document.createDocumentFragment();
    var filterValue = tokenSearchInput ? tokenSearchInput.value.trim().toLowerCase() : "";
    var visibleGroupCount = 0;

    TOKEN_GROUPS.forEach(function (group) {
      var matchesGroup = !filterValue || group.title.toLowerCase().indexOf(filterValue) !== -1 || group.description.toLowerCase().indexOf(filterValue) !== -1 || group.tokens.some(function (tokenName) {
        return tokenName.toLowerCase().indexOf(filterValue) !== -1;
      });

      if (!matchesGroup) {
        return;
      }

      var card = document.createElement("section");
      card.className = "demo-token-card";

      var head = document.createElement("div");
      head.className = "demo-token-card__head";

      var title = document.createElement("h3");
      title.className = "demo-token-card__title";
      title.textContent = group.title;

      var description = document.createElement("p");
      description.className = "demo-token-card__copy";
      description.textContent = group.description;

      head.appendChild(title);
      head.appendChild(description);

      var docLinks = buildLinkList(group.docs);
      var pageLinks = buildLinkList(group.pages);

      if (docLinks) {
        head.appendChild(docLinks);
      }

      if (pageLinks) {
        head.appendChild(pageLinks);
      }

      card.appendChild(head);

      var list = document.createElement("div");
      list.className = "demo-token-list";

      group.tokens.forEach(function (tokenName) {
        var item = document.createElement("div");
        item.className = "demo-token-item";

        var meta = document.createElement("div");
        meta.className = "demo-token-item__meta";

        var name = document.createElement("div");
        name.className = "demo-token-item__name";
        name.textContent = tokenName;

        var value = computedStyle.getPropertyValue(tokenName).trim() || "(empty)";
        var valueNode = document.createElement("div");
        valueNode.className = "demo-token-item__value";
        valueNode.textContent = value;

        meta.appendChild(name);
        meta.appendChild(valueNode);

        var swatch = document.createElement("div");
        var tokenKind = classifyTokenValue(tokenName, value);
        swatch.className = "demo-token-item__swatch";
        swatch.setAttribute("data-token-kind", tokenKind);

        if (tokenKind === "color") {
          swatch.style.background = value;
        } else if (tokenKind === "shadow") {
          swatch.style.boxShadow = value;
        } else {
          swatch.textContent = value.replace(/\s+/g, "");
        }

        item.appendChild(meta);
        item.appendChild(swatch);
        list.appendChild(item);
      });

      card.appendChild(list);
      fragment.appendChild(card);
      visibleGroupCount += 1;
    });

    tokenGroupsHost.innerHTML = "";
    tokenGroupsHost.appendChild(fragment);

    if (tokenEmptyState) {
      tokenEmptyState.hidden = visibleGroupCount !== 0;
    }
  }

  function buildEvidenceHref(key) {
    var definition = EVIDENCE_TARGETS[key];
    var density = app ? app.getAttribute("data-density") || "cozy" : "cozy";
    var direction = root.getAttribute("dir") || "ltr";

    if (!definition) {
      return "#";
    }

    return EVIDENCE_ROOT + definition.slug + "-" + density + "-" + direction + ".png";
  }

  function findEvidenceEntry(key, density, direction) {
    var definition = EVIDENCE_TARGETS[key];
    var entries = evidenceManifest && evidenceManifest.entries;

    if (!definition || !entries || !entries.length) {
      return null;
    }

    return entries.find(function (entry) {
      return entry.slug === definition.slug && entry.density === density && entry.dir === direction;
    }) || null;
  }

  function formatEvidenceTimestamp(value) {
    if (!value) {
      return "Unavailable";
    }

    var parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  function setEvidenceManifestState(text) {
    document.querySelectorAll("[data-evidence-manifest-state]").forEach(function (node) {
      node.textContent = text;
    });
  }

  function syncEvidenceLinks() {
    var density = app ? app.getAttribute("data-density") || "cozy" : "cozy";
    var direction = root.getAttribute("dir") || "ltr";
    var directionLabel = direction.toUpperCase();
    var readyCount = 0;
    var totalCount = 0;

    document.querySelectorAll("[data-evidence-link]").forEach(function (link) {
      var key = link.getAttribute("data-evidence-link");
      var definition = EVIDENCE_TARGETS[key];
      var entry = findEvidenceEntry(key, density, direction);
      var state = evidenceManifest ? (entry ? "ready" : "missing") : "unknown";

      if (!definition) {
        return;
      }

      var label = link.getAttribute("data-evidence-label") || definition.label;
      link.href = buildEvidenceHref(key);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = label;
      link.title = label + " (" + density + " / " + directionLabel + " / " + state + ")";
      link.setAttribute("data-evidence-state", state);

      if (link.hasAttribute("data-evidence-summary-item")) {
        totalCount += 1;
        readyCount += state === "ready" ? 1 : 0;
      }
    });

    document.querySelectorAll("[data-evidence-variant]").forEach(function (node) {
      node.textContent = density + " / " + directionLabel;
    });

    document.querySelectorAll("[data-evidence-count=\"ready\"]").forEach(function (node) {
      node.textContent = String(readyCount);
    });

    document.querySelectorAll("[data-evidence-count=\"total\"]").forEach(function (node) {
      node.textContent = String(totalCount);
    });

    document.querySelectorAll("[data-evidence-generated-at]").forEach(function (node) {
      node.textContent = evidenceManifest ? formatEvidenceTimestamp(evidenceManifest.generatedAt) : "Manifest unavailable";
    });

    if (typeof window.Event === "function") {
      document.dispatchEvent(new window.Event("ui5-style-system:evidence-sync"));
    }
  }

  function loadEvidenceManifest() {
    if (!document.querySelector("[data-evidence-link]")) {
      return;
    }

    setEvidenceManifestState("Loading screenshot manifest...");

    if (!window.fetch) {
      setEvidenceManifestState("Manifest unavailable in this browser context. Links still point to the expected PNG paths.");
      syncEvidenceLinks();
      return;
    }

    window.fetch(EVIDENCE_MANIFEST_PATH, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Manifest request failed with status " + response.status);
        }
        return response.json();
      })
      .then(function (manifest) {
        evidenceManifest = manifest;
        setEvidenceManifestState("Manifest loaded from the latest screenshot export.");
        syncEvidenceLinks();
      })
      .catch(function () {
        evidenceManifest = null;
        setEvidenceManifestState("Manifest unavailable. Links still point to the expected PNG paths.");
        syncEvidenceLinks();
      });
  }

  function setTabState(tabbar, targetId, syncLocation) {
    if (!tabbar || !targetId) {
      return false;
    }

    var matched = false;
    var tabs = tabbar.querySelectorAll("[data-tab-target]");

    tabs.forEach(function (candidate) {
      var isSelected = candidate.getAttribute("data-tab-target") === targetId;
      candidate.classList.toggle("is-selected", isSelected);
      candidate.setAttribute("aria-selected", String(isSelected));
      matched = matched || isSelected;
    });

    if (!matched) {
      return false;
    }

    tabbar.querySelectorAll("[data-tab-panel]").forEach(function (panel) {
      var isActive = panel.id === targetId;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    if (syncLocation && window.history && window.history.replaceState) {
      var url = new URL(window.location.href);
      url.searchParams.set("tab", targetId);
      url.hash = targetId;
      window.history.replaceState(null, "", url.toString());
    }

    return true;
  }

  function initAcceptanceReviewPanel() {
    var reviewPanel = acceptanceReviewPanel;
    if (!reviewPanel) {
      return;
    }

    var items = Array.prototype.slice.call(document.querySelectorAll("[data-acceptance-item]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-acceptance-card]"));
    var triageList = reviewPanel.querySelector("[data-acceptance-triage-list]");
    var triageEmptyState = reviewPanel.querySelector("[data-acceptance-triage-empty]");
    var triageSearchInput = reviewPanel.querySelector("[data-acceptance-triage-search]");

    if (!items.length) {
      return;
    }

    writePreference(
      "acceptance-filter",
      normalizeAcceptanceFilter(readQueryParam("review", readPreference("acceptance-filter", "all")))
    );
    writePreference(
      "acceptance-triage-filter",
      normalizeTriageFilter(readQueryParam("queue", readPreference("acceptance-triage-filter", "all")))
    );
    writePreference(
      "acceptance-triage-search",
      readQueryParam("search", readPreference("acceptance-triage-search", ""))
    );

    function setExportState(text) {
      reviewPanel.querySelectorAll("[data-acceptance-export-state]").forEach(function (node) {
        node.textContent = text;
      });
    }

    function normalizeAcceptanceStatus(value) {
      if (value === "pass" || value === "issue" || value === "blocked" || value === "pending") {
        return value;
      }

      if (value === "reviewed") {
        return "pass";
      }

      return "pending";
    }

    function readStoredStatus(itemId, fallback) {
      return normalizeAcceptanceStatus(
        readPreference("acceptance-status:" + itemId, readPreference("acceptance-review:" + itemId, fallback))
      );
    }

    function writeStoredStatus(itemId, value) {
      var normalizedValue = normalizeAcceptanceStatus(value);
      writePreference("acceptance-status:" + itemId, normalizedValue);
      writePreference("acceptance-review:" + itemId, normalizedValue);
    }

    function normalizeAcceptanceFilter(value) {
      if (value === "all" || value === "pending" || value === "pass" || value === "issue" || value === "blocked") {
        return value;
      }

      if (value === "reviewed") {
        return "pass";
      }

      return "all";
    }

    function normalizeTriageFilter(value) {
      if (value === "all" || value === "blocked" || value === "issue" || value === "pending" || value === "ready" || value === "missing") {
        return value;
      }

      return "all";
    }

    function buildCurrentReviewUrl() {
      var url = new URL(window.location.href);
      var density = normalizeDensityValue(app ? app.getAttribute("data-density") || "cozy" : "cozy") || "cozy";
      var direction = normalizeDirectionValue(root.getAttribute("dir") || "ltr") || "ltr";
      var reviewFilter = normalizeAcceptanceFilter(readPreference("acceptance-filter", "all"));
      var triageFilter = normalizeTriageFilter(readPreference("acceptance-triage-filter", "all"));
      var triageSearch = readPreference("acceptance-triage-search", "");

      url.searchParams.set("density", density);
      url.searchParams.set("dir", direction);
      url.searchParams.set("review", reviewFilter);
      url.searchParams.set("queue", triageFilter);

      if (triageSearch) {
        url.searchParams.set("search", triageSearch);
      } else {
        url.searchParams.delete("search");
      }

      return url.toString();
    }

    function summarizeCurrentReviewUrlState() {
      var density = normalizeDensityValue(app ? app.getAttribute("data-density") || "cozy" : "cozy") || "cozy";
      var direction = (normalizeDirectionValue(root.getAttribute("dir") || "ltr") || "ltr").toUpperCase();
      var reviewFilter = normalizeAcceptanceFilter(readPreference("acceptance-filter", "all"));
      var triageFilter = normalizeTriageFilter(readPreference("acceptance-triage-filter", "all"));
      var triageSearch = readPreference("acceptance-triage-search", "").trim();
      var summary = density + " / " + direction + ", review filter " + reviewFilter + ", triage queue " + triageFilter;

      if (triageSearch) {
        summary += ', search "' + triageSearch + '"';
      }

      return summary + ".";
    }

    function fallbackCopyText(text) {
      var field = document.createElement("textarea");
      var copied = false;

      field.value = text;
      field.setAttribute("readonly", "readonly");
      field.style.position = "fixed";
      field.style.inset = "0 auto auto -9999px";
      document.body.appendChild(field);
      field.select();

      try {
        copied = document.execCommand("copy");
      } catch (error) {
        copied = false;
      }

      field.remove();
      return copied;
    }

    function copyCurrentReviewUrl() {
      var shareUrl = buildCurrentReviewUrl();

      syncAcceptanceReviewUrlState();

      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(shareUrl).then(function () {
          setExportState("Copied review URL for " + summarizeCurrentReviewUrlState());
        }).catch(function () {
          if (fallbackCopyText(shareUrl)) {
            setExportState("Copied review URL for " + summarizeCurrentReviewUrlState());
            return;
          }

          setExportState("Review URL is synced in the address bar. Copy it manually if clipboard access is blocked.");
        });
        return;
      }

      if (fallbackCopyText(shareUrl)) {
        setExportState("Copied review URL for " + summarizeCurrentReviewUrlState());
        return;
      }

      setExportState("Review URL is synced in the address bar. Copy it manually if clipboard access is blocked.");
    }

    syncAcceptanceReviewUrlState = function () {
      if (!acceptanceReviewUrlReady || !window.history || !window.history.replaceState) {
        return;
      }

      window.history.replaceState(null, "", buildCurrentReviewUrl());
    };

    function getAcceptanceStatusLabel(value) {
      var normalizedValue = normalizeAcceptanceStatus(value);

      if (normalizedValue === "pass") {
        return "Pass";
      }

      if (normalizedValue === "issue") {
        return "Issue";
      }

      if (normalizedValue === "blocked") {
        return "Blocked";
      }

      return "Pending";
    }

    function getEvidenceStateLabel(value) {
      if (value === "ready") {
        return "Evidence ready";
      }

      if (value === "missing") {
        return "Evidence missing";
      }

      return "Evidence pending";
    }

    function getTriageSortWeight(value) {
      if (value === "blocked") {
        return 0;
      }

      if (value === "issue") {
        return 1;
      }

      return 2;
    }

    function entryMatchesTriageFilter(entry, filterValue) {
      if (filterValue === "all") {
        return true;
      }

      if (filterValue === "ready" || filterValue === "missing") {
        return Boolean(entry.evidence) && entry.evidence.state === filterValue;
      }

      return entry.status === filterValue;
    }

    function entryMatchesTriageSearch(entry, searchValue) {
      if (!searchValue) {
        return true;
      }

      var haystack = [
        entry.component,
        entry.text,
        entry.note,
        entry.id,
        entry.evidence ? entry.evidence.label : ""
      ].concat(entry.links.map(function (link) {
        return link.label;
      })).join(" ").toLowerCase();

      return haystack.indexOf(searchValue) !== -1;
    }

    function syncTriageToolbar(entries) {
      var filterValue = normalizeTriageFilter(readPreference("acceptance-triage-filter", "all"));
      var triageView = getCurrentTriageView(entries);
      var counts = {
        all: entries.length,
        blocked: 0,
        issue: 0,
        pending: 0,
        ready: 0,
        missing: 0
      };

      entries.forEach(function (entry) {
        counts[entry.status] += 1;
        if (entry.evidence && (entry.evidence.state === "ready" || entry.evidence.state === "missing")) {
          counts[entry.evidence.state] += 1;
        }
      });

      reviewPanel.querySelectorAll("[data-acceptance-triage-filter]").forEach(function (button) {
        var isActive = button.getAttribute("data-acceptance-triage-filter") === filterValue;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      Object.keys(counts).forEach(function (key) {
        reviewPanel.querySelectorAll("[data-acceptance-triage-filter-count=\"" + key + "\"]").forEach(function (node) {
          node.textContent = String(counts[key]);
        });
      });

      if (triageSearchInput && triageSearchInput.value !== readPreference("acceptance-triage-search", "")) {
        triageSearchInput.value = readPreference("acceptance-triage-search", "");
      }

      reviewPanel.querySelectorAll("[data-acceptance-triage-bulk]").forEach(function (button) {
        var action = button.getAttribute("data-acceptance-triage-bulk");
        button.disabled = !triageView.items.length;
        button.title = triageView.items.length
          ? "Set " + triageView.items.length + " visible queue item" + (triageView.items.length === 1 ? "" : "s") + " to " + action + "."
          : "No visible queue items match the current triage view.";
      });
    }

    function serializeTriageEntry(entry) {
      return {
        id: entry.id,
        anchor: entry.anchor,
        component: entry.component,
        text: entry.text,
        status: entry.status,
        note: entry.note,
        coverage: entry.coverage,
        evidence: entry.evidence,
        links: entry.links
      };
    }

    function getCurrentTriageView(entries) {
      var filterValue = normalizeTriageFilter(readPreference("acceptance-triage-filter", "all"));
      var searchValue = readPreference("acceptance-triage-search", "").trim();
      var normalizedSearchValue = searchValue.toLowerCase();
      var triageEntries = Array.isArray(entries) ? entries : collectTriageEntries();

      return {
        filter: filterValue,
        search: searchValue,
        items: triageEntries.filter(function (entry) {
          return entryMatchesTriageFilter(entry, filterValue) && entryMatchesTriageSearch(entry, normalizedSearchValue);
        })
      };
    }

    function applyStatusToTriageView(nextState) {
      var normalizedState = normalizeAcceptanceStatus(nextState);
      var triageView = getCurrentTriageView();

      if (!triageView.items.length) {
        setExportState("No visible triage findings match the current queue view.");
        return;
      }

      triageView.items.forEach(function (entry) {
        updateItemReviewState(getItemByAcceptanceId(entry.id), normalizedState);
      });

      refreshReviewPanelState();
      applyFilter(normalizeAcceptanceFilter(readPreference("acceptance-filter", "all")));
      setExportState(
        "Set " + triageView.items.length + " visible triage finding" + (triageView.items.length === 1 ? "" : "s") + " to " + normalizedState + "."
      );
    }

    function ensureItemAnchor(item) {
      var itemId = item.getAttribute("data-acceptance-id");

      if (!itemId) {
        return "";
      }

      if (!item.id) {
        item.id = "acceptance-" + itemId;
      }

      return item.id;
    }

    function syncCoverageLabel(item) {
      var label = item.querySelector("[data-acceptance-coverage-label]");
      var coverage = item.getAttribute("data-acceptance-coverage") || "covered";
      if (label) {
        label.textContent = coverage === "covered" ? "Covered by demo" : "Needs surface";
      }
    }

    function ensureStatusControls(item) {
      var meta = item.querySelector(".demo-checklist__meta");
      var existingGroup = meta ? meta.querySelector("[data-acceptance-status-group]") : null;
      var toggle = item.querySelector("[data-acceptance-review-toggle]");

      if (!meta) {
        return null;
      }

      if (existingGroup) {
        return existingGroup;
      }

      var group = document.createElement("div");
      group.className = "demo-review-pill-group";
      group.setAttribute("data-acceptance-status-group", "");

      [
        { value: "pending", label: "Pending" },
        { value: "pass", label: "Pass" },
        { value: "issue", label: "Issue" },
        { value: "blocked", label: "Blocked" }
      ].forEach(function (status) {
        var button = document.createElement("button");
        button.className = "demo-review-pill demo-review-pill--status";
        button.type = "button";
        button.textContent = status.label;
        button.setAttribute("data-acceptance-status-value", status.value);
        button.setAttribute("aria-pressed", "false");
        group.appendChild(button);
      });

      if (toggle) {
        toggle.replaceWith(group);
      } else {
        meta.appendChild(group);
      }

      return group;
    }

    function ensureNoteField(item) {
      var noteWrap = item.querySelector("[data-acceptance-note-wrap]");
      var links = item.querySelector(".demo-checklist__links");

      if (noteWrap) {
        return noteWrap.querySelector("[data-acceptance-note]");
      }

      noteWrap = document.createElement("div");
      noteWrap.className = "demo-checklist__note";
      noteWrap.setAttribute("data-acceptance-note-wrap", "");

      var noteLabel = document.createElement("span");
      noteLabel.className = "demo-checklist__note-label";
      noteLabel.textContent = "Reviewer note";

      var field = document.createElement("label");
      field.className = "repro-field repro-field--textarea";

      var textarea = document.createElement("textarea");
      textarea.rows = 2;
      textarea.placeholder = "Capture what still needs a visual pass or what changed.";
      textarea.setAttribute("data-acceptance-note", "");

      field.appendChild(textarea);
      noteWrap.appendChild(noteLabel);
      noteWrap.appendChild(field);

      if (links) {
        item.insertBefore(noteWrap, links);
      } else {
        item.appendChild(noteWrap);
      }

      return textarea;
    }

    function syncNoteField(item) {
      var noteField = item.querySelector("[data-acceptance-note]");
      var noteValue = noteField ? noteField.value.trim() : "";
      item.setAttribute("data-acceptance-has-note", noteValue ? "true" : "false");
    }

    function ensureEvidenceLink(item) {
      var itemId = item.getAttribute("data-acceptance-id");
      var evidenceKey = ACCEPTANCE_EVIDENCE_MAP[itemId];
      var links = item.querySelector(".demo-checklist__links");
      var evidenceLink = links ? links.querySelector("[data-acceptance-evidence-link]") : null;

      if (!evidenceKey || !links) {
        return;
      }

      if (!evidenceLink) {
        evidenceLink = document.createElement("a");
        evidenceLink.className = "demo-token-link";
        evidenceLink.setAttribute("data-acceptance-evidence-link", "");
        evidenceLink.setAttribute("data-evidence-link", evidenceKey);
        evidenceLink.setAttribute("data-evidence-label", "Evidence PNG");
        links.appendChild(evidenceLink);
      } else {
        evidenceLink.setAttribute("data-evidence-link", evidenceKey);
      }
    }

    function syncStatusControls(item) {
      var reviewState = normalizeAcceptanceStatus(item.getAttribute("data-acceptance-review") || "pending");
      var buttons = item.querySelectorAll("[data-acceptance-status-value]");

      if (!buttons.length) {
        return;
      }

      buttons.forEach(function (button) {
        var value = button.getAttribute("data-acceptance-status-value");
        var isSelected = value === reviewState;
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });
    }

    function getItemByAcceptanceId(itemId) {
      return items.find(function (item) {
        return item.getAttribute("data-acceptance-id") === itemId;
      }) || null;
    }

    function updateItemReviewState(item, nextState) {
      if (!item) {
        return;
      }

      var normalizedState = normalizeAcceptanceStatus(nextState);
      var itemId = item.getAttribute("data-acceptance-id");

      item.setAttribute("data-acceptance-review", normalizedState);
      writeStoredStatus(itemId, normalizedState);
      syncStatusControls(item);
    }

    function updateItemNote(item, nextValue) {
      if (!item) {
        return;
      }

      var itemId = item.getAttribute("data-acceptance-id");
      var noteField = ensureNoteField(item);
      var normalizedValue = typeof nextValue === "string" ? nextValue : "";

      if (noteField) {
        noteField.value = normalizedValue;
      }

      writePreference("acceptance-note:" + itemId, normalizedValue);
      syncNoteField(item);
    }

    function isTriagePreviewExpanded(itemId) {
      return readPreference("acceptance-triage-preview:" + itemId, "collapsed") === "expanded";
    }

    function writeTriagePreviewState(itemId, isExpanded) {
      writePreference("acceptance-triage-preview:" + itemId, isExpanded ? "expanded" : "collapsed");
    }

    function collectTriageEntries() {
      return items.map(function (item, index) {
        var reviewState = normalizeAcceptanceStatus(item.getAttribute("data-acceptance-review") || "pending");
        var noteField = item.querySelector("[data-acceptance-note]");
        var noteValue = noteField ? noteField.value.trim() : "";
        var isOpen = reviewState === "issue" || reviewState === "blocked" || (reviewState === "pending" && Boolean(noteValue));
        var card = item.closest("[data-acceptance-card]");
        var componentTitle = card ? card.querySelector(".demo-checklist-card__title") : null;
        var itemText = item.querySelector(".demo-checklist__text");
        var evidenceLink = item.querySelector("[data-acceptance-evidence-link]");

        item.setAttribute("data-acceptance-open", isOpen ? "true" : "false");
        ensureItemAnchor(item);

        if (!isOpen) {
          return null;
        }

        return {
          id: item.getAttribute("data-acceptance-id") || "",
          anchor: item.id,
          component: componentTitle ? componentTitle.textContent.trim() : "",
          text: itemText ? itemText.textContent.trim() : "",
          status: reviewState,
          note: noteValue,
          coverage: item.getAttribute("data-acceptance-coverage") || "covered",
          evidence: evidenceLink ? {
            key: evidenceLink.getAttribute("data-evidence-link"),
            label: evidenceLink.textContent.trim() || "Evidence PNG",
            state: evidenceLink.getAttribute("data-evidence-state") || "unknown",
            href: evidenceLink.href
          } : null,
          links: Array.prototype.slice.call(item.querySelectorAll(".demo-checklist__links a"))
            .filter(function (link) {
              return !link.hasAttribute("data-acceptance-evidence-link");
            })
            .map(function (link) {
              return {
                label: link.textContent.trim(),
                href: link.href
              };
            }),
          order: index
        };
      }).filter(Boolean).sort(function (left, right) {
        var weightDelta = getTriageSortWeight(left.status) - getTriageSortWeight(right.status);
        return weightDelta || left.order - right.order;
      });
    }

    function createReviewTag(label, attributeName, attributeValue) {
      var tag = document.createElement("span");
      tag.className = "demo-review-tag";
      tag.textContent = label;

      if (attributeName && attributeValue) {
        tag.setAttribute(attributeName, attributeValue);
      }

      return tag;
    }

    function createTriageAction(label, href, options) {
      var action = document.createElement("a");
      action.className = "demo-token-link";
      action.textContent = label;
      action.href = href;

      if (options && options.jumpTarget) {
        action.setAttribute("data-acceptance-jump", options.jumpTarget);
      } else {
        action.target = "_blank";
        action.rel = "noopener";
      }

      if (options && options.evidenceState) {
        action.setAttribute("data-evidence-state", options.evidenceState);
      }

      return action;
    }

    function createTriageStatusGroup(entry) {
      var wrap = document.createElement("div");
      var label = document.createElement("span");
      var group = document.createElement("div");

      wrap.className = "demo-review-triage__status";
      label.className = "demo-review-triage__status-label";
      label.textContent = "Review status";
      group.className = "demo-review-pill-group demo-review-pill-group--triage";

      [
        { value: "pending", label: "Pending" },
        { value: "pass", label: "Pass" },
        { value: "issue", label: "Issue" },
        { value: "blocked", label: "Blocked" }
      ].forEach(function (status) {
        var button = document.createElement("button");
        var isSelected = entry.status === status.value;
        button.className = "demo-review-pill demo-review-pill--status";
        button.type = "button";
        button.textContent = status.label;
        button.setAttribute("data-acceptance-triage-status-value", status.value);
        button.setAttribute("data-acceptance-triage-item-id", entry.id);
        button.setAttribute("aria-pressed", String(isSelected));
        button.classList.toggle("is-selected", isSelected);
        group.appendChild(button);
      });

      wrap.appendChild(label);
      wrap.appendChild(group);

      return wrap;
    }

    function createTriageNoteField(entry) {
      var wrap = document.createElement("div");
      var label = document.createElement("span");
      var field = document.createElement("label");
      var textarea = document.createElement("textarea");

      wrap.className = "demo-review-triage__note-field";
      label.className = "demo-review-triage__note-label";
      label.textContent = "Reviewer note";
      field.className = "repro-field repro-field--textarea";
      textarea.rows = 3;
      textarea.placeholder = "Capture what still needs a visual pass or what changed.";
      textarea.value = entry.note || "";
      textarea.setAttribute("data-acceptance-triage-note", "");
      textarea.setAttribute("data-acceptance-triage-item-id", entry.id);

      field.appendChild(textarea);
      wrap.appendChild(label);
      wrap.appendChild(field);

      return wrap;
    }

    function createTriagePreview(entry) {
      var wrap;
      var toggle;
      var media;
      var image;
      var caption;
      var isExpanded;

      if (!entry.evidence || !entry.evidence.href) {
        return null;
      }

      isExpanded = isTriagePreviewExpanded(entry.id);
      wrap = document.createElement("div");
      toggle = document.createElement("button");
      media = document.createElement("figure");
      image = document.createElement("img");
      caption = document.createElement("figcaption");

      wrap.className = "demo-review-triage__preview";
      wrap.setAttribute("data-acceptance-preview-open", String(isExpanded));

      toggle.className = "demo-token-link demo-token-link--button demo-review-triage__preview-toggle";
      toggle.type = "button";
      toggle.textContent = isExpanded ? "Hide preview" : "Show preview";
      toggle.setAttribute("data-acceptance-preview-toggle", "");
      toggle.setAttribute("data-acceptance-triage-item-id", entry.id);
      toggle.setAttribute("aria-expanded", String(isExpanded));
      toggle.setAttribute("data-evidence-state", entry.evidence.state || "unknown");

      media.className = "demo-review-triage__preview-media";
      media.hidden = !isExpanded;
      media.setAttribute("data-acceptance-preview-media", "");

      image.className = "demo-review-triage__preview-image";
      image.alt = entry.component + " evidence preview";
      image.loading = "lazy";
      image.decoding = "async";
      if (isExpanded) {
        image.src = entry.evidence.href;
      } else {
        image.setAttribute("data-src", entry.evidence.href);
      }

      caption.className = "demo-review-triage__preview-caption";
      caption.textContent = (entry.evidence.label || "Evidence PNG") + " for the current density and direction.";

      media.appendChild(image);
      media.appendChild(caption);
      wrap.appendChild(toggle);
      wrap.appendChild(media);

      return wrap;
    }

    function buildTriageEntryNode(entry) {
      var article = document.createElement("article");
      var head = document.createElement("div");
      var titleWrap = document.createElement("div");
      var component = document.createElement("p");
      var text = document.createElement("p");
      var badges = document.createElement("div");
      var note = createTriageNoteField(entry);
      var controls = document.createElement("div");
      var preview = createTriagePreview(entry);
      var actions = document.createElement("div");

      article.className = "demo-review-triage__item";
      article.setAttribute("data-acceptance-triage-entry", "");
      article.setAttribute("data-acceptance-triage-status", entry.status);
      article.setAttribute("data-acceptance-triage-item-id", entry.id);

      head.className = "demo-review-triage__item-head";
      titleWrap.className = "demo-review-triage__title-wrap";
      component.className = "demo-review-triage__component";
      component.textContent = entry.component || "Acceptance Item";
      text.className = "demo-review-triage__text";
      text.textContent = entry.text;
      badges.className = "demo-review-triage__badges";
      badges.appendChild(createReviewTag(getAcceptanceStatusLabel(entry.status), "data-acceptance-status", entry.status));

      if (entry.evidence) {
        badges.appendChild(createReviewTag(getEvidenceStateLabel(entry.evidence.state), "data-evidence-state", entry.evidence.state));
      }

      if (entry.note) {
        badges.appendChild(createReviewTag("Note attached", "data-acceptance-note-state", "noted"));
      }

      titleWrap.appendChild(component);
      titleWrap.appendChild(text);
      head.appendChild(titleWrap);
      head.appendChild(badges);
      article.appendChild(head);

      article.appendChild(note);

      controls.className = "demo-review-triage__controls";
      controls.appendChild(createTriageStatusGroup(entry));
      article.appendChild(controls);

      if (preview) {
        article.appendChild(preview);
      }

      actions.className = "demo-review-triage__actions";
      actions.appendChild(createTriageAction("Jump to checklist", "#" + entry.anchor, { jumpTarget: entry.anchor }));

      if (entry.evidence && entry.evidence.href) {
        actions.appendChild(createTriageAction(entry.evidence.label, entry.evidence.href, { evidenceState: entry.evidence.state }));
      }

      entry.links.forEach(function (link) {
        actions.appendChild(createTriageAction(link.label, link.href));
      });

      article.appendChild(actions);

      return article;
    }

    function renderTriageList() {
      if (!triageList) {
        return;
      }

      var entries = collectTriageEntries();
      var triageView = getCurrentTriageView(entries);
      var visibleEntries = triageView.items;
      var readyCount = 0;
      var notedCount = 0;

      triageList.querySelectorAll("[data-acceptance-triage-entry]").forEach(function (node) {
        node.remove();
      });

      entries.forEach(function (entry) {
        readyCount += entry.evidence && entry.evidence.state === "ready" ? 1 : 0;
        notedCount += entry.note ? 1 : 0;
      });

      visibleEntries.forEach(function (entry) {
        triageList.appendChild(buildTriageEntryNode(entry));
      });

      if (triageEmptyState) {
        triageEmptyState.hidden = visibleEntries.length > 0;
        triageEmptyState.textContent = entries.length
          ? "No open findings match the current queue filter or search."
          : "No open findings yet. Issue, blocked, or noted pending checks will surface here.";
      }

      document.querySelectorAll("[data-acceptance-triage-count=\"total\"]").forEach(function (node) {
        node.textContent = String(entries.length);
      });

      document.querySelectorAll("[data-acceptance-triage-count=\"ready\"]").forEach(function (node) {
        node.textContent = String(readyCount);
      });

      document.querySelectorAll("[data-acceptance-triage-count=\"noted\"]").forEach(function (node) {
        node.textContent = String(notedCount);
      });

      syncTriageToolbar(entries);
    }

    function collectReviewCounts() {
      var counts = {
        total: items.length,
        covered: 0,
        pending: 0,
        pass: 0,
        issue: 0,
        blocked: 0,
        noted: 0
      };

      items.forEach(function (item) {
        var reviewState = normalizeAcceptanceStatus(item.getAttribute("data-acceptance-review") || "pending");

        if ((item.getAttribute("data-acceptance-coverage") || "covered") === "covered") {
          counts.covered += 1;
        }

        if (reviewState === "pass") {
          counts.pass += 1;
        } else if (reviewState === "issue") {
          counts.issue += 1;
        } else if (reviewState === "blocked") {
          counts.blocked += 1;
        } else {
          counts.pending += 1;
        }

        var noteField = item.querySelector("[data-acceptance-note]");
        if (noteField && noteField.value.trim()) {
          counts.noted += 1;
        }
      });

      return counts;
    }

    function refreshSummary() {
      var counts = collectReviewCounts();

      Object.keys(counts).forEach(function (key) {
        document.querySelectorAll("[data-acceptance-count=\"" + key + "\"]").forEach(function (node) {
          node.textContent = String(counts[key]);
        });
      });
    }

    function refreshReviewPanelState() {
      refreshSummary();
      renderTriageList();
      syncFindingsExportButton();
    }

    function downloadArtifact(content, filename, mimeType) {
      if (!window.URL || !window.Blob) {
        return false;
      }

      var blob = new Blob([content], { type: mimeType });
      var blobUrl = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");

      anchor.href = blobUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(blobUrl);

      return true;
    }

    function buildFindingsMarkdown(snapshot) {
      var visibleItems = Array.isArray(snapshot.triage.visibleItems) ? snapshot.triage.visibleItems : snapshot.triage.items;
      var queueScope = "filter " + (snapshot.triage.filter || "all");

      if (snapshot.triage.search) {
        queueScope += ', search "' + snapshot.triage.search + '"';
      }

      var lines = [
        "# UI5 Style System Acceptance Findings",
        "",
        "- Generated: " + snapshot.generatedAt,
        "- Variant: " + snapshot.density + " / " + snapshot.dir.toUpperCase(),
        "- Filter: " + snapshot.filter,
        "- Review counts: pending " + snapshot.counts.pending + ", pass " + snapshot.counts.pass + ", issue " + snapshot.counts.issue + ", blocked " + snapshot.counts.blocked + ", noted " + snapshot.counts.noted,
        "- Evidence: " + snapshot.evidence.ready + "/" + snapshot.evidence.total + " ready" + (snapshot.evidence.manifestGeneratedAt ? " (manifest " + snapshot.evidence.manifestGeneratedAt + ")" : ""),
        "- Open findings: " + snapshot.triage.total,
        "- Triage queue: " + queueScope + ", exporting " + visibleItems.length + " of " + snapshot.triage.total + " open findings",
        ""
      ];

      if (!visibleItems.length) {
        lines.push("## Status");
        lines.push("");
        lines.push(snapshot.triage.total ? "No open findings match the current triage queue view." : "No open findings were recorded in this review snapshot.");
        lines.push("");
        return lines.join("\n");
      }

      lines.push("## Open Findings");
      lines.push("");

      visibleItems.forEach(function (entry, index) {
        lines.push("### " + (index + 1) + ". " + entry.component + " [" + getAcceptanceStatusLabel(entry.status) + "]");
        lines.push("");
        lines.push("- Acceptance item: " + entry.text);
        lines.push("- Checklist anchor: `" + entry.anchor + "`");
        lines.push("- Coverage: " + entry.coverage);

        if (entry.evidence && entry.evidence.href) {
          lines.push("- Evidence: [" + (entry.evidence.label || "Evidence PNG") + "](" + entry.evidence.href + ") (" + (entry.evidence.state || "unknown") + ")");
        } else {
          lines.push("- Evidence: unavailable");
        }

        if (entry.links && entry.links.length) {
          lines.push("- References: " + entry.links.map(function (link) {
            return "[" + link.label + "](" + link.href + ")";
          }).join(", "));
        }

        if (entry.note) {
          lines.push("- Reviewer note: " + entry.note);
        } else {
          lines.push("- Reviewer note: none");
        }

        lines.push("");
      });

      return lines.join("\n");
    }

    function exportFindingsMarkdown() {
      var snapshot = buildAcceptanceSnapshot();
      var filename = "ui5-style-system-findings-" + snapshot.density + "-" + snapshot.dir + ".md";
      var markdown = buildFindingsMarkdown(snapshot);
      var visibleCount = Array.isArray(snapshot.triage.visibleItems) ? snapshot.triage.visibleItems.length : snapshot.triage.total;

      if (!downloadArtifact(markdown, filename, "text/markdown;charset=utf-8")) {
        setExportState("Findings export is not available in this browser context.");
        return;
      }

      setExportState(
        visibleCount === snapshot.triage.total
          ? "Exported " + visibleCount + " open findings to " + filename + "."
          : "Exported " + visibleCount + " of " + snapshot.triage.total + " open findings to " + filename + "."
      );
    }

    function syncFindingsExportButton() {
      var findingsButton = reviewPanel.querySelector("[data-acceptance-export-findings]");
      var triageEntries;
      var triageView;
      var openCount;
      var visibleCount;

      if (!findingsButton) {
        return;
      }

      triageEntries = collectTriageEntries();
      triageView = getCurrentTriageView(triageEntries);
      openCount = triageEntries.length;
      visibleCount = triageView.items.length;

      findingsButton.textContent = !openCount
        ? "Export Findings MD"
        : visibleCount === openCount
          ? "Export Findings MD (" + visibleCount + ")"
          : "Export Findings MD (" + visibleCount + "/" + openCount + ")";
      findingsButton.title = "Export the current triage queue view as Markdown.";
    }

    function buildAcceptanceSnapshot() {
      var density = app ? app.getAttribute("data-density") || "cozy" : "cozy";
      var direction = root.getAttribute("dir") || "ltr";
      var filter = normalizeAcceptanceFilter(readPreference("acceptance-filter", "all"));
      var evidenceSummaryLinks = Array.prototype.slice.call(document.querySelectorAll("[data-evidence-summary-item]"));
      var triageEntries = collectTriageEntries();
      var triageView = getCurrentTriageView(triageEntries);

      return {
        generatedAt: new Date().toISOString(),
        density: density,
        dir: direction,
        filter: filter,
        counts: collectReviewCounts(),
        evidence: {
          manifestLoaded: Boolean(evidenceManifest),
          manifestGeneratedAt: evidenceManifest ? evidenceManifest.generatedAt : null,
          ready: evidenceSummaryLinks.filter(function (link) {
            return link.getAttribute("data-evidence-state") === "ready";
          }).length,
          total: evidenceSummaryLinks.length,
          links: evidenceSummaryLinks.map(function (link) {
            return {
              label: link.getAttribute("data-evidence-label") || link.textContent.trim(),
              key: link.getAttribute("data-evidence-link"),
              state: link.getAttribute("data-evidence-state") || "unknown",
              href: link.href
            };
          })
        },
        triage: {
          total: triageEntries.length,
          visible: triageView.items.length,
          filter: triageView.filter,
          search: triageView.search,
          ready: triageEntries.filter(function (entry) {
            return entry.evidence && entry.evidence.state === "ready";
          }).length,
          noted: triageEntries.filter(function (entry) {
            return Boolean(entry.note);
          }).length,
          items: triageEntries.map(serializeTriageEntry),
          visibleItems: triageView.items.map(serializeTriageEntry)
        },
        items: items.map(function (item) {
          var card = item.closest("[data-acceptance-card]");
          var evidenceLink = item.querySelector("[data-acceptance-evidence-link]");
          var componentTitle = card ? card.querySelector(".demo-checklist-card__title") : null;

          return {
            id: item.getAttribute("data-acceptance-id"),
            component: componentTitle ? componentTitle.textContent.trim() : "",
            text: (item.querySelector(".demo-checklist__text") || {}).textContent ? item.querySelector(".demo-checklist__text").textContent.trim() : "",
            status: normalizeAcceptanceStatus(item.getAttribute("data-acceptance-review") || "pending"),
            review: normalizeAcceptanceStatus(item.getAttribute("data-acceptance-review") || "pending"),
            coverage: item.getAttribute("data-acceptance-coverage") || "covered",
            note: (item.querySelector("[data-acceptance-note]") || {}).value || "",
            evidence: evidenceLink ? {
              key: evidenceLink.getAttribute("data-evidence-link"),
              state: evidenceLink.getAttribute("data-evidence-state") || "unknown",
              href: evidenceLink.href
            } : null,
            links: Array.prototype.slice.call(item.querySelectorAll(".demo-checklist__links a")).map(function (link) {
              return {
                label: link.textContent.trim(),
                href: link.href
              };
            })
          };
        })
      };
    }

    function exportAcceptanceSnapshot() {
      var snapshot = buildAcceptanceSnapshot();
      var filename = "ui5-style-system-review-" + snapshot.density + "-" + snapshot.dir + ".json";

      if (!downloadArtifact(JSON.stringify(snapshot, null, 2), filename, "application/json")) {
        setExportState("JSON export is not available in this browser context.");
        return;
      }

      setExportState("Exported " + snapshot.items.length + " acceptance items to " + filename + ".");
    }

    function applyAcceptanceSnapshot(snapshot) {
      if (!snapshot || !Array.isArray(snapshot.items)) {
        throw new Error("Snapshot does not contain an items array.");
      }

      var itemMap = {};
      var hasTriageState = snapshot.triage && (typeof snapshot.triage.filter === "string" || typeof snapshot.triage.search === "string");

      items.forEach(function (item) {
        itemMap[item.getAttribute("data-acceptance-id")] = item;
      });

      if (snapshot.density === "cozy" || snapshot.density === "compact") {
        setDensity(snapshot.density);
      }

      if (snapshot.dir === "ltr" || snapshot.dir === "rtl") {
        setDirection(snapshot.dir);
      }

      snapshot.items.forEach(function (entry) {
        var item = itemMap[entry.id];
        if (!item) {
          return;
        }

        var reviewState = normalizeAcceptanceStatus(entry.status || entry.review);
        var noteValue = typeof entry.note === "string" ? entry.note : "";

        updateItemReviewState(item, reviewState);
        updateItemNote(item, noteValue);
      });

      if (hasTriageState) {
        writePreference("acceptance-triage-filter", normalizeTriageFilter(snapshot.triage.filter || "all"));
        writePreference("acceptance-triage-search", typeof snapshot.triage.search === "string" ? snapshot.triage.search : "");
      }

      if (triageSearchInput) {
        triageSearchInput.value = readPreference("acceptance-triage-search", "");
      }

      refreshReviewPanelState();
      applyFilter(normalizeAcceptanceFilter(snapshot.filter));
      syncEvidenceLinks();
      syncAcceptanceReviewUrlState();
      setExportState(
        hasTriageState
          ? "Imported " + snapshot.items.length + " acceptance items and restored the triage queue view from review JSON."
          : "Imported " + snapshot.items.length + " acceptance items from review JSON."
      );
    }

    function importAcceptanceSnapshot(file) {
      if (!file) {
        return;
      }

      if (!window.FileReader) {
        setExportState("JSON import is not available in this browser context.");
        return;
      }

      var reader = new FileReader();

      reader.onload = function () {
        try {
          var snapshot = JSON.parse(String(reader.result || "{}"));
          applyAcceptanceSnapshot(snapshot);
        } catch (error) {
          setExportState("Import failed: " + (error && error.message ? error.message : "Invalid JSON."));
        }
      };

      reader.onerror = function () {
        setExportState("Import failed: the selected file could not be read.");
      };

      reader.readAsText(file);
    }

    function applyFilter(value) {
      value = normalizeAcceptanceFilter(value);

      document.querySelectorAll("[data-acceptance-filter]").forEach(function (button) {
        var isActive = button.getAttribute("data-acceptance-filter") === value;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      items.forEach(function (item) {
        var reviewState = normalizeAcceptanceStatus(item.getAttribute("data-acceptance-review") || "pending");
        item.hidden = value !== "all" && reviewState !== value;
      });

      cards.forEach(function (card) {
        card.hidden = !card.querySelector("[data-acceptance-item]:not([hidden])");
      });

      writePreference("acceptance-filter", value);
      syncAcceptanceReviewUrlState();
    }

    items.forEach(function (item) {
      var itemId = item.getAttribute("data-acceptance-id");
      var initialReview = readStoredStatus(itemId, item.getAttribute("data-acceptance-review") || "pending");
      var noteField = ensureNoteField(item);
      var statusGroup = ensureStatusControls(item);
      var initialNote = readPreference("acceptance-note:" + itemId, "");
      item.setAttribute("data-acceptance-review", normalizeAcceptanceStatus(initialReview));
      ensureEvidenceLink(item);
      if (noteField) {
        updateItemNote(item, initialNote);
        noteField.addEventListener("input", function () {
          updateItemNote(item, noteField.value);
          refreshReviewPanelState();
        });
      }
      syncCoverageLabel(item);
      ensureItemAnchor(item);
      syncStatusControls(item);

      if (statusGroup) {
        statusGroup.querySelectorAll("[data-acceptance-status-value]").forEach(function (button) {
          button.addEventListener("click", function () {
            var nextState = normalizeAcceptanceStatus(button.getAttribute("data-acceptance-status-value"));
            updateItemReviewState(item, nextState);
            refreshReviewPanelState();
            applyFilter(normalizeAcceptanceFilter(readPreference("acceptance-filter", "all")));
          });
        });
      }
    });

    reviewPanel.querySelectorAll("[data-acceptance-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-acceptance-filter") || "all");
      });
    });

    reviewPanel.querySelectorAll("[data-acceptance-triage-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        writePreference("acceptance-triage-filter", normalizeTriageFilter(button.getAttribute("data-acceptance-triage-filter") || "all"));
        renderTriageList();
        syncAcceptanceReviewUrlState();
      });
    });

    reviewPanel.querySelectorAll("[data-acceptance-triage-bulk]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyStatusToTriageView(button.getAttribute("data-acceptance-triage-bulk") || "pending");
      });
    });

    if (triageSearchInput) {
      triageSearchInput.value = readPreference("acceptance-triage-search", "");
      triageSearchInput.addEventListener("input", function () {
        writePreference("acceptance-triage-search", triageSearchInput.value);
        renderTriageList();
        syncAcceptanceReviewUrlState();
      });
    }

    var resetButton = reviewPanel.querySelector("[data-acceptance-reset]");
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        items.forEach(function (item) {
          var itemId = item.getAttribute("data-acceptance-id");
          updateItemReviewState(item, "pending");
          updateItemNote(item, "");
        });
        refreshReviewPanelState();
        applyFilter("all");
        setExportState("Reset acceptance statuses and notes for all items.");
      });
    }

    var importButton = reviewPanel.querySelector("[data-acceptance-import]");
    var importInput = reviewPanel.querySelector("[data-acceptance-import-file]");
    if (importButton && importInput) {
      importButton.addEventListener("click", function () {
        importInput.click();
      });

      importInput.addEventListener("change", function () {
        importAcceptanceSnapshot(importInput.files && importInput.files[0]);
        importInput.value = "";
      });
    }

    var copyUrlButton = reviewPanel.querySelector("[data-acceptance-copy-url]");
    if (copyUrlButton) {
      copyUrlButton.addEventListener("click", copyCurrentReviewUrl);
    }

    var exportButton = reviewPanel.querySelector("[data-acceptance-export]");
    if (exportButton) {
      exportButton.addEventListener("click", exportAcceptanceSnapshot);
    }

    var exportFindingsButton = reviewPanel.querySelector("[data-acceptance-export-findings]");
    if (exportFindingsButton) {
      exportFindingsButton.addEventListener("click", exportFindingsMarkdown);
    }

    if (triageList) {
      triageList.addEventListener("input", function (event) {
        var noteInput = event.target.closest("[data-acceptance-triage-note]");

        if (!noteInput) {
          return;
        }

        updateItemNote(
          getItemByAcceptanceId(noteInput.getAttribute("data-acceptance-triage-item-id")),
          noteInput.value
        );
        refreshSummary();
      });

      triageList.addEventListener("change", function (event) {
        var noteInput = event.target.closest("[data-acceptance-triage-note]");

        if (!noteInput) {
          return;
        }

        updateItemNote(
          getItemByAcceptanceId(noteInput.getAttribute("data-acceptance-triage-item-id")),
          noteInput.value
        );
        refreshReviewPanelState();
        applyFilter(normalizeAcceptanceFilter(readPreference("acceptance-filter", "all")));
      });

      triageList.addEventListener("click", function (event) {
        var previewToggle = event.target.closest("[data-acceptance-preview-toggle]");
        var statusButton = event.target.closest("[data-acceptance-triage-status-value]");
        var jumpLink = event.target.closest("[data-acceptance-jump]");
        var targetId = jumpLink ? jumpLink.getAttribute("data-acceptance-jump") : "";
        var targetItem = targetId ? document.getElementById(targetId) : null;

        if (previewToggle) {
          var previewItemId = previewToggle.getAttribute("data-acceptance-triage-item-id");
          var previewWrap = previewToggle.closest(".demo-review-triage__preview");
          var previewMedia = previewWrap ? previewWrap.querySelector("[data-acceptance-preview-media]") : null;
          var previewImage = previewMedia ? previewMedia.querySelector("img") : null;
          var nextExpanded = previewToggle.getAttribute("aria-expanded") !== "true";

          event.preventDefault();
          writeTriagePreviewState(previewItemId, nextExpanded);

          if (previewWrap) {
            previewWrap.setAttribute("data-acceptance-preview-open", String(nextExpanded));
          }

          previewToggle.setAttribute("aria-expanded", String(nextExpanded));
          previewToggle.textContent = nextExpanded ? "Hide preview" : "Show preview";

          if (previewMedia) {
            previewMedia.hidden = !nextExpanded;
          }

          if (nextExpanded && previewImage && !previewImage.getAttribute("src")) {
            previewImage.src = previewImage.getAttribute("data-src") || "";
          }

          return;
        }

        if (statusButton) {
          var triageItem = getItemByAcceptanceId(statusButton.getAttribute("data-acceptance-triage-item-id"));
          var nextState = statusButton.getAttribute("data-acceptance-triage-status-value");

          event.preventDefault();
          updateItemReviewState(triageItem, nextState);
          refreshReviewPanelState();
          applyFilter(normalizeAcceptanceFilter(readPreference("acceptance-filter", "all")));
          return;
        }

        if (!jumpLink || !targetItem) {
          return;
        }

        event.preventDefault();
        applyFilter("all");
        window.location.hash = targetId;

        if (typeof targetItem.scrollIntoView === "function") {
          targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }

    document.addEventListener("ui5-style-system:evidence-sync", renderTriageList);

    refreshReviewPanelState();
    applyFilter(normalizeAcceptanceFilter(readPreference("acceptance-filter", "all")));
    syncEvidenceLinks();
    acceptanceReviewUrlReady = true;
    syncAcceptanceReviewUrlState();
  }

  function syncToggleButtons(attribute, value) {
    var selector = attribute === "density" ? "[data-density-value]" : "[data-dir-value]";
    document.querySelectorAll(selector).forEach(function (button) {
      var buttonValue = attribute === "density" ? button.getAttribute("data-density-value") : button.getAttribute("data-dir-value");
      var isActive = buttonValue === value;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setDensity(value) {
    app.setAttribute("data-density", value);
    syncToggleButtons("density", value);
    writePreference("density", value);
    syncEvidenceLinks();
    syncAcceptanceReviewUrlState();
  }

  function setDirection(value) {
    root.setAttribute("dir", value);
    syncToggleButtons("dir", value);
    writePreference("dir", value);
    syncEvidenceLinks();
    syncAcceptanceReviewUrlState();
  }

  document.querySelectorAll("[data-density-value]").forEach(function (button) {
    button.addEventListener("click", function () {
      setDensity(button.getAttribute("data-density-value"));
    });
  });

  document.querySelectorAll("[data-dir-value]").forEach(function (button) {
    button.addEventListener("click", function () {
      setDirection(button.getAttribute("data-dir-value"));
    });
  });

  if (tokenSearchInput) {
    tokenSearchInput.addEventListener("input", renderTokenGroups);
  }

  if (dialog) {
    document.querySelectorAll("[data-open-dialog]").forEach(function (button) {
      button.addEventListener("click", function () {
        dialog.hidden = false;
      });
    });

    document.querySelectorAll("[data-close-dialog]").forEach(function (button) {
      button.addEventListener("click", function () {
        dialog.hidden = true;
      });
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.hidden = true;
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (dialog) {
        dialog.hidden = true;
      }
      if (popover) {
        popover.hidden = true;
      }
    }
  });

  if (popover) {
    document.querySelectorAll("[data-toggle-popover]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        popover.hidden = !popover.hidden;
      });
    });

    document.addEventListener("click", function (event) {
      if (!popover.hidden && !event.target.closest(".repro-popover-anchor")) {
        popover.hidden = true;
      }
    });
  }

  document.querySelectorAll("[data-tabs]").forEach(function (tabbar) {
    var tabs = tabbar.querySelectorAll("[data-tab-target]");
    var shouldSyncLocation = tabbar.getAttribute("data-tab-sync") === "query";
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        setTabState(tabbar, tab.getAttribute("data-tab-target"), shouldSyncLocation);
      });
    });

    if (shouldSyncLocation) {
      var params = new URLSearchParams(window.location.search);
      var requestedTab = params.get("tab");

      if (!requestedTab && window.location.hash) {
        requestedTab = window.location.hash.slice(1);
      }

      if (requestedTab) {
        setTabState(tabbar, requestedTab, false);
      }

      window.addEventListener("hashchange", function () {
        if (window.location.hash) {
          setTabState(tabbar, window.location.hash.slice(1), false);
        }
      });
    }
  });

  if (sideNav) {
    document.querySelectorAll("[data-toggle-nav]").forEach(function (button) {
      button.addEventListener("click", function () {
        sideNav.classList.toggle("is-collapsed");
        button.textContent = sideNav.classList.contains("is-collapsed") ? ">" : "Collapse";
      });
    });

    sideNav.querySelectorAll("[data-nav-item]").forEach(function (item) {
      item.addEventListener("click", function () {
        sideNav.querySelectorAll("[data-nav-item]").forEach(function (candidate) {
          candidate.classList.remove("is-selected");
        });
        item.classList.add("is-selected");
      });
    });
  }

  document.querySelectorAll("[data-close-message]").forEach(function (button) {
    button.addEventListener("click", function () {
      var message = button.closest(".repro-message");
      if (!message) {
        return;
      }
      message.classList.add("is-closing");
      window.setTimeout(function () {
        message.remove();
      }, 200);
    });
  });

  document.querySelectorAll("[data-toggle-notification-group]").forEach(function (button) {
    button.addEventListener("click", function () {
      var group = button.closest(".repro-notification-group");
      if (group) {
        group.classList.toggle("is-collapsed");
      }
    });
  });

  setDensity(
    normalizeDensityValue(readQueryParam("density", readPreference("density", app.getAttribute("data-density") || "cozy"))) || "cozy"
  );
  setDirection(
    normalizeDirectionValue(readQueryParam("dir", readPreference("dir", root.getAttribute("dir") || "ltr"))) || "ltr"
  );
  renderTokenGroups();
  initAcceptanceReviewPanel();
  syncEvidenceLinks();
  loadEvidenceManifest();
}());
