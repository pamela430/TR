(() => {


const form = document.querySelector("#contact-form-2");
const message = document.querySelector("#form-message-2");

if (!form || !message) {
    console.error(
        "Deuxième formulaire ou message introuvable."
    );
    return;
}

const submitButton = form.querySelector(
    'input[type="submit"], button[type="submit"]'
);

// TA CLÉ WEB3FORMS
const accessKey =
    "b5961753-93bd-448e-9cf4-fdfa97c50bf3";


// ==========================================
// MESSAGE DE STATUT
// ==========================================

const setMessage = (text, isError = false) => {

    message.textContent = text;

    message.setAttribute(
        "role",
        isError ? "alert" : "status"
    );
};


// ==========================================
// ENVOI DU FORMULAIRE
// ==========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    if (!accessKey || accessKey.trim() === "") {

        setMessage(
            "Clé Web3Forms manquante.",
            true
        );

        return;
    }


    if (submitButton) {
        submitButton.disabled = true;
    }


    setMessage("Checking en cours…");


    // Récupération des données du formulaire
    const data = new FormData(form);


    // Données Web3Forms
    data.append(
        "access_key",
        accessKey
    );

    data.append(
        "subject",
        "Nouveau message depuis le deuxième formulaire"
    );

    data.append(
        "from_name",
        "Deuxième formulaire"
    );

    data.append(
        "botcheck",
        ""
    );


    try {

        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                body: data
            }
        );


        const result = await response.json();


        console.log(
            "Réponse Web3Forms :",
            result
        );


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Échec de connexion"
            );
        }


        // Formulaire envoyé
        form.reset();


        setMessage(
            "Message envoyé."
        );


    } catch (error) {

        console.error(
            "Erreur Web3Forms :",
            error
        );


        setMessage(
            "Une erreur est survenue. Réessayez.",
            true
        );


    } finally {

        if (submitButton) {
            submitButton.disabled = false;
        }

    }

});


})();

