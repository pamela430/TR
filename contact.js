(() => {
  const form = document.querySelector("#contact-form");
  const message = document.querySelector("#form-message");
  const submitButton = form?.querySelector('input[type="submit"]');
  const accessKey = window.WEB3FORMS_ACCESS_KEY || "REMPLACEZ_PAR_VOTRE_CLE_WEB3FORMS";

  const setMessage = (text, isError = false) => {
    message.textContent = text;
    message.setAttribute("role", isError ? "alert" : "status");
  };

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (accessKey.startsWith("REMPLACEZ_")) {
      setMessage("Ajoutez votre clé Web3Forms dans contact.js avant l'envoi.", true);
      return;
    }

    submitButton.disabled = true;
    setMessage("Envoi en cours…");

    const data = new FormData(form);
    data.append("access_key", accessKey);
    data.append("subject", "Nouveau message depuis AR24");
    data.append("from_name", "Formulaire AR24");
    data.append("botcheck", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Échec de l'envoi");
      }

      form.reset();
      setMessage("Votre message a bien été envoyé.");
    } catch {
      setMessage("Impossible d'envoyer le message. Réessayez.", true);
    } finally {
      submitButton.disabled = false;
    }
  });
})();

// Définissez cette valeur avec votre clé publique Web3Forms :
// window.WEB3FORMS_ACCESS_KEY = "votre-cle";
