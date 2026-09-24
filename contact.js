
(() => {
  const form = document.querySelector("#contact-form");
  const message = document.querySelector("#form-message");

  if (!form || !message) return;

  const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');

  // Mets ta vraie clé Web3Forms ici ou définis window.WEB3FORMS_ACCESS_KEY ailleurs
  const accessKey = window.WEB3FORMS_ACCESS_KEY || "b5961753-93bd-448e-9cf4-fdfa97c50bf3";

  const setMessage = (text, isError = false) => {
    message.textContent = text;
    message.setAttribute("role", isError ? "alert" : "status");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Vérification de la clé
    if (!accessKey || accessKey === "b5961753-93bd-448e-9cf4-fdfa97c50bf3") {
      setMessage("Veuillez configurer votre clé Web3Forms avant l'envoi.", true);
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    setMessage("Envoi en cours…");

    const data = new FormData(form);

    data.append("access_key", accessKey);
    data.append("subject", "Nouveau message depuis AR24");
    data.append("from_name", "Formulaire AR24");

    // Anti-spam Web3Forms
    data.append("botcheck", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Échec de l'envoi");
      }

      form.reset();
      setMessage("Votre message a bien été envoyé.");
    } catch (error) {
      console.error("Erreur Web3Forms :", error);
      setMessage("Impossible d'envoyer le message. Réessayez.", true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
})();

