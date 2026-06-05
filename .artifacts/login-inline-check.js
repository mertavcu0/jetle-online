
    window.addEventListener("DOMContentLoaded", function () {
      const form = document.getElementById("loginForm");
      const card = document.querySelector(".login-card");
      const cardStyles = card ? window.getComputedStyle(card) : null;

      console.log("LOGIN_UI_READY", {
        cardFound: Boolean(card),
        messageFound: Boolean(document.getElementById("authMessage"))
      });

      console.log("LOGIN_FORM_READY", {
        formFound: Boolean(form),
        emailFound: Boolean(document.querySelector('input[name="email"]')),
        passwordFound: Boolean(document.querySelector('input[name="password"]')),
        rememberFound: Boolean(document.querySelector('input[name="remember"]'))
      });

      console.log("LOGIN_STYLES_APPLIED", {
        cardBackground: cardStyles?.backgroundColor || "",
        cardRadius: cardStyles?.borderRadius || "",
        cardShadow: cardStyles?.boxShadow || ""
      });
    });
  
