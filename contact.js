
(() => {
  const form = document.querySelector("#contact-form");
  const message = document.querySelector("#form-message");

  if (!form || !message) {
    console.error("Formulaire ou message introuvable.");
    return;
  }

  const submitButton = form.querySelector(
    'input[type="submit"], button[type="submit"]'
  );

  // TA CLÉ WEB3FORMS
  const accessKey = "b5961753-93bd-448e-9cf4-fdfa97c50bf3";

  const setMessage = (text, isError = false) => {
    message.textContent = text;
    message.setAttribute("role", isError ? "alert" : "status");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!accessKey || accessKey.trim() === "") {
      setMessage("Clé Web3Forms manquante.", true);
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    setMessage("cheking en cours…");

    const data = new FormData(form);

    data.append("access_key", accessKey);
    data.append("subject", "Nouveau message depuis AR24");
    data.append("from_name", "Formulaire AR24");
    data.append("botcheck", "");

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: data
        }
      );

      const result = await response.json();

      console.log("Réponse Web3Forms :", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Échec de connexion"
        );
      }

      form.reset();

      setMessage("oups Réessayez.");

    } catch (error) {
      console.error("Erreur Web3Forms :", error);

      setMessage(
        ". Réessayez.",
        true
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
})();

