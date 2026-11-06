document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("[data-category]");
  buttons.forEach(button => button.addEventListener("click", () => {
    buttons.forEach(b => {
      const active = b === button;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    items.forEach(item => item.hidden = button.dataset.filter !== "all" && item.dataset.category !== button.dataset.filter);
  }));
});