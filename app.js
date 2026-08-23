(() => {
  "use strict";

  const raw = window.GUN_ATLAS_DATA;
  const CATEGORY_META = {
    accessible: {
      short: "一般要件",
      label: "一般要件で認められる",
      code: "A / GENERAL ACCESS",
      definition: "特定目的の立証を原則とせず、欠格要件・免許・登録などの一般要件で少なくとも一部銃種を取得可能。",
      generic: "一定の欠格要件、免許、登録などを満たせば、特定目的の立証なしに少なくとも一部の銃種を取得できる制度があります。",
    },
    purpose: {
      short: "目的限定",
      label: "目的限定で認められる",
      code: "B / PURPOSE-BASED",
      definition: "狩猟・競技・収集・自衛など、法律上認められた目的と許可が必要。",
      generic: "狩猟、スポーツ射撃、収集、自衛など、認められた目的と行政上の許可を得れば、少なくとも一部の銃種を所持できます。",
    },
    exceptional: {
      short: "例外的",
      label: "例外的にのみ認められる",
      code: "C / EXCEPTIONAL",
      definition: "特別許可、職業・身分要件、発給停止などにより、一般市民の新規取得は極めて限定的。",
      generic: "特別許可、職業・身分要件、免許発給の停止などにより、一般市民が新たに取得できるのは例外的です。",
    },
    prohibited: {
      short: "原則禁止",
      label: "一般市民の所持は原則禁止",
      code: "D / PROHIBITED",
      definition: "一般市民による銃器の新規取得・所持を法令上原則として認めない。",
      generic: "一般市民による銃器の新規取得・所持は原則として認められていません。公的機関などの例外は含みません。",
    },
  };

  const statusSets = {
    accessible: new Set(raw.accessibleCodes.split(/\s+/)),
    exceptional: new Set(raw.exceptionalCodes.split(/\s+/)),
    prohibited: new Set(raw.prohibitedCodes.split(/\s+/)),
  };
  const supplemental = new Set(raw.supplementalCodes.split(/\s+/));
  const displayNames = {
    ja: new Intl.DisplayNames(["ja"], { type: "region" }),
    en: new Intl.DisplayNames(["en"], { type: "region" }),
  };

  function categoryFor(code) {
    if (statusSets.accessible.has(code)) return "accessible";
    if (statusSets.exceptional.has(code)) return "exceptional";
    if (statusSets.prohibited.has(code)) return "prohibited";
    return "purpose";
  }

  const countries = raw.codePairs
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [code3, code2] = pair.split(":");
      const ja = raw.customNames.ja[code3] || displayNames.ja.of(code2) || code3;
      const en = raw.customNames.en[code3] || displayNames.en.of(code2) || code3;
      return {
        code3,
        code2,
        ja,
        en,
        category: categoryFor(code3),
        supplemental: supplemental.has(code3),
      };
    })
    .sort((a, b) => a.ja.localeCompare(b.ja, "ja"));

  const countriesByCode = new Map(countries.map((country) => [country.code3, country]));
  const geometryByCode = new Map();
  let selectedCode = "JPN";
  let activeFilter = "all";
  let searchTerm = "";
  let projection;
  let pathGenerator;
  let zoomBehavior;
  let mapFeatures = [];

  const panel = {
    code: document.querySelector("#panel-code"),
    coordinate: document.querySelector("#panel-coordinate"),
    status: document.querySelector("#panel-status"),
    country: document.querySelector("#panel-country"),
    countryEn: document.querySelector("#panel-country-en"),
    summary: document.querySelector("#panel-summary"),
    definition: document.querySelector("#panel-definition"),
    source: document.querySelector("#panel-source"),
  };

  function coreCountries(list = countries) {
    return list.filter((country) => !country.supplemental);
  }

  function updateCounts() {
    const core = coreCountries();
    document.querySelector('[data-count="all"]').textContent = core.length;
    Object.keys(CATEGORY_META).forEach((category) => {
      document.querySelector(`[data-count="${category}"]`).textContent = core.filter(
        (country) => country.category === category,
      ).length;
    });
  }

  function coordinateFor(country) {
    const marker = raw.markers[country.code3];
    const feature = geometryByCode.get(country.code3);
    const coordinate = marker || (feature && d3.geoCentroid(feature));
    if (!coordinate || !Number.isFinite(coordinate[0])) return "位置情報なし";
    const [lon, lat] = coordinate;
    const ns = lat >= 0 ? "N" : "S";
    const ew = lon >= 0 ? "E" : "W";
    return `${Math.abs(lat).toFixed(0)}°${ns} · ${Math.abs(lon).toFixed(0)}°${ew}`;
  }

  function sourceFor(country) {
    if (raw.officialSources[country.code3]) {
      return { url: raw.officialSources[country.code3], label: "公的資料を確認" };
    }
    const anchor = country.en.replaceAll(" ", "_");
    return {
      url: `https://en.wikipedia.org/wiki/Overview_of_gun_laws_by_nation#${encodeURIComponent(anchor)}`,
      label: "比較表の脚注を確認",
    };
  }

  function selectCountry(code, options = {}) {
    const country = countriesByCode.get(code);
    if (!country) return;
    selectedCode = code;
    const meta = CATEGORY_META[country.category];
    const source = sourceFor(country);

    panel.code.textContent = `${country.code2} / ${country.code3}${country.supplemental ? " · 補足" : ""}`;
    panel.coordinate.textContent = coordinateFor(country);
    panel.status.textContent = meta.label;
    panel.status.className = `status-label ${country.category}`;
    panel.country.textContent = country.ja;
    panel.countryEn.textContent = country.en;
    panel.summary.textContent = raw.notes[country.code3] || meta.generic;
    panel.definition.textContent = meta.definition;
    panel.source.href = source.url;
    panel.source.innerHTML = `${source.label} <span aria-hidden="true">↗</span>`;

    document.querySelectorAll(".country, .micro-marker").forEach((element) => {
      element.classList.toggle("is-selected", element.dataset.code === country.code3);
    });

    if (options.scroll) {
      document.querySelector("#explorer").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function normalized(value) {
    return value.toLocaleLowerCase("ja").normalize("NFKC");
  }

  function visibleCountries() {
    return countries.filter((country) => {
      const categoryMatches = activeFilter === "all" || country.category === activeFilter;
      const haystack = normalized(`${country.ja} ${country.en} ${country.code2} ${country.code3}`);
      return categoryMatches && (!searchTerm || haystack.includes(normalized(searchTerm)));
    });
  }

  function renderDirectory() {
    const container = document.querySelector("#country-groups");
    const summary = document.querySelector("#result-summary");
    const visible = visibleCountries();
    container.replaceChildren();

    const supplementalCount = visible.filter((country) => country.supplemental).length;
    const coreCount = visible.length - supplementalCount;
    summary.textContent = supplementalCount
      ? `${coreCount}か国 ＋ 補足${supplementalCount}地域を表示`
      : `${coreCount}か国を表示`;

    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "条件に一致する国がありません。検索語または区分を変更してください。";
      container.append(empty);
      return;
    }

    Object.entries(CATEGORY_META).forEach(([category, meta]) => {
      const items = visible.filter((country) => country.category === category);
      if (!items.length) return;

      const section = document.createElement("section");
      section.className = `country-group group-${category}`;
      const heading = document.createElement("div");
      heading.className = "country-group-heading";
      heading.innerHTML = `<p>${meta.code}</p><h3>${meta.short}</h3><b>${coreCountries(items).length}</b>`;

      const grid = document.createElement("div");
      grid.className = "country-button-grid";
      items.forEach((country) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "country-button";
        button.dataset.code = country.code3;
        button.innerHTML = `<strong>${country.ja}${country.supplemental ? "<sup>補足</sup>" : ""}</strong><span>${country.en} · ${country.code3}</span>`;
        button.addEventListener("click", () => selectCountry(country.code3, { scroll: true }));
        grid.append(button);
      });

      section.append(heading, grid);
      container.append(section);
    });
  }

  function applyMapFilter() {
    document.querySelectorAll(".country[data-code], .micro-marker[data-code]").forEach((element) => {
      const country = countriesByCode.get(element.dataset.code);
      const dim = activeFilter !== "all" && country && country.category !== activeFilter;
      element.classList.toggle("is-dimmed", Boolean(dim));
    });
  }

  function setFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll(".filter-button").forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderDirectory();
    applyMapFilter();
  }

  function showTooltip(event, country) {
    const tooltip = document.querySelector("#map-tooltip");
    tooltip.innerHTML = `<b>${country.ja}</b><span>${CATEGORY_META[country.category].label}</span>`;
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
    tooltip.setAttribute("aria-hidden", "false");
  }

  function hideTooltip() {
    document.querySelector("#map-tooltip").setAttribute("aria-hidden", "true");
  }

  function attachMapInteraction(selection) {
    selection
      .on("pointerenter", (event, country) => showTooltip(event, country))
      .on("pointermove", (event) => {
        const tooltip = document.querySelector("#map-tooltip");
        tooltip.style.left = `${event.clientX}px`;
        tooltip.style.top = `${event.clientY}px`;
      })
      .on("pointerleave", hideTooltip)
      .on("click", (event, country) => {
        event.stopPropagation();
        selectCountry(country.code3);
      });
  }

  function drawMap() {
    const svgElement = document.querySelector("#world-map");
    const width = Math.max(svgElement.clientWidth, 320);
    const height = Math.max(svgElement.clientHeight, 430);
    const svg = d3.select(svgElement);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("g.map-root").remove();

    projection = d3.geoEqualEarth().fitExtent(
      [[24, 62], [width - 24, height - 48]],
      { type: "Sphere" },
    );
    pathGenerator = d3.geoPath(projection);

    const root = svg.append("g").attr("class", "map-root");
    root.append("path").datum({ type: "Sphere" }).attr("class", "sphere").attr("d", pathGenerator);
    root.append("path").datum(d3.geoGraticule10()).attr("class", "graticule").attr("d", pathGenerator);

    const drawable = mapFeatures.map((feature) => {
      const originalCode = String(feature.id || "");
      const code = raw.geometryAliases[originalCode] || originalCode;
      return { feature, code, country: countriesByCode.get(code) };
    });

    const paths = root
      .append("g")
      .selectAll("path")
      .data(drawable)
      .join("path")
      .attr("d", (item) => pathGenerator(item.feature))
      .attr("class", (item) => {
        if (!item.country) return "country non-country";
        return `country ${item.country.category}${item.country.code3 === selectedCode ? " is-selected" : ""}`;
      })
      .attr("data-code", (item) => item.country?.code3 || null)
      .attr("aria-label", (item) => item.country ? `${item.country.ja}：${CATEGORY_META[item.country.category].label}` : null);

    attachMapInteraction(paths.filter((item) => Boolean(item.country)).datum((item) => item.country));

    const markerCountries = Object.keys(raw.markers)
      .map((code) => countriesByCode.get(code))
      .filter(Boolean);
    const markers = root
      .append("g")
      .attr("class", "micro-markers")
      .selectAll("circle")
      .data(markerCountries)
      .join("circle")
      .attr("class", (country) => `micro-marker ${country.category}${country.code3 === selectedCode ? " is-selected" : ""}`)
      .attr("data-code", (country) => country.code3)
      .attr("cx", (country) => projection(raw.markers[country.code3])[0])
      .attr("cy", (country) => projection(raw.markers[country.code3])[1])
      .attr("r", 3.6)
      .attr("aria-label", (country) => `${country.ja}：${CATEGORY_META[country.category].label}`);
    attachMapInteraction(markers);

    zoomBehavior = d3
      .zoom()
      .scaleExtent([1, 7])
      .translateExtent([[-width * 0.3, -height * 0.3], [width * 1.3, height * 1.3]])
      .on("zoom", (event) => root.attr("transform", event.transform));
    svg.call(zoomBehavior).on("dblclick.zoom", null);
    applyMapFilter();
  }

  async function loadMap() {
    const svg = document.querySelector("#world-map");
    try {
      const response = await fetch("./data/world.geojson");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const geojson = await response.json();
      mapFeatures = geojson.features.filter((feature) => feature.id !== "ATA");
      mapFeatures.forEach((feature) => {
        const originalCode = String(feature.id || "");
        const code = raw.geometryAliases[originalCode] || originalCode;
        if (!geometryByCode.has(code)) geometryByCode.set(code, feature);
      });
      drawMap();
      selectCountry(selectedCode);

      let resizeTimer;
      new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(drawMap, 120);
      }).observe(svg);
    } catch (error) {
      svg.outerHTML = `<div class="empty-state" role="alert">地図データを読み込めませんでした。ページを再読み込みしてください。</div>`;
      console.error("Map load failed", error);
    }
  }

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });

  document.querySelector("#country-search").addEventListener("input", (event) => {
    searchTerm = event.target.value.trim();
    renderDirectory();
  });

  document.querySelectorAll("[data-map-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const svg = d3.select("#world-map");
      if (!zoomBehavior) return;
      const action = button.dataset.mapAction;
      if (action === "reset") {
        svg.transition().duration(260).call(zoomBehavior.transform, d3.zoomIdentity);
      } else {
        svg.transition().duration(220).call(zoomBehavior.scaleBy, action === "zoom-in" ? 1.5 : 1 / 1.5);
      }
    });
  });

  updateCounts();
  renderDirectory();
  selectCountry(selectedCode);
  loadMap();
})();
