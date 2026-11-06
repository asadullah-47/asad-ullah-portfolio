document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = "The form passed frontend validation, but no message was sent or saved. A backend or form service will be connected later.";
    status.classList.add("notice");
  });
});