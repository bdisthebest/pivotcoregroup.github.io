(function () {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const items = Array.from(carousel.querySelectorAll(".carousel-item"));

  function isScrollable() {
    const scrollable = carousel.scrollWidth > carousel.clientWidth + 2;
    carousel.classList.toggle("is-scrollable", scrollable);
    return scrollable;
  }

  function setActive(index) {
    items.forEach(i => i.classList.remove("is-active"));
    if (items[index]) items[index].classList.add("is-active");
  }

  function updateActiveItem() {
    if (!isScrollable()) {
      items.forEach(i => i.classList.remove("is-active"));
      return;
    }

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    const sl = carousel.scrollLeft;

    // Threshold to treat as "at the edge" (in px)
    const edgeThreshold = 16;

    // If at far left, highlight first
    if (sl <= edgeThreshold) {
      setActive(0);
      return;
    }

    // If at far right, highlight last
    if (sl >= maxScrollLeft - edgeThreshold) {
      setActive(items.length - 1);
      return;
    }

    // Otherwise highlight closest to viewport center
    const rect = carousel.getBoundingClientRect();
    const center = rect.left + rect.width / 2;

    let bestIndex = 0;
    let bestDist = Infinity;

    items.forEach((item, idx) => {
      const r = item.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(center - c);
      if (d < bestDist) {
        bestDist = d;
        bestIndex = idx;
      }
    });

    setActive(bestIndex);
  }

  carousel.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActiveItem);
  });

  window.addEventListener("resize", updateActiveItem);

  // Initial
  updateActiveItem();
})();