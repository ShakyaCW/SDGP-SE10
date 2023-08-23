const form = document.getElementById("contact-form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent the form from submitting

  // Get form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Create email link
  const mailto = `mailto:rimazrizwan2001717@gmail.com?subject=${subject}&body=${message}`;

  // Open email client
  window.open(mailto);

  // Reset form
  form.reset();
});
