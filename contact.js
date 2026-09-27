(() => {


    const form = document.querySelector("#contact-form-2");
    const statusMessage = document.querySelector("#form-message-2");

    const messageDisplay =
        document.querySelector("#message_display");

    const messageHidden =
        document.querySelector("#message_id");

    if (
        !form ||
        !statusMessage ||
        !messageDisplay ||
        !messageHidden
    ) {
        console.error("Éléments du formulaire introuvables.");
        return;
    }

    const submitButton = form.querySelector(
        'input[type="submit"], button[type="submit"]'
    );

    const accessKey =
        "b5961753-93bd-448e-9cf4-fdfa97c50bf3";

    // VRAI MESSAGE
    let realMessage = "";


    // ==========================================
    // AFFICHER UNIQUEMENT DES POINTS
    // ==========================================

    function updateDisplay() {

        messageDisplay.value =
            "•".repeat(realMessage.length);

        messageHidden.value = realMessage;

    }


    // ==========================================
    // GESTION DU CLAVIER
    // ==========================================

    messageDisplay.addEventListener(
        "keydown",
        (event) => {

            const start =
                messageDisplay.selectionStart;

            const end =
                messageDisplay.selectionEnd;


            // ----------------------------------
            // CTRL + A
            // ----------------------------------

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "a"
            ) {
                event.preventDefault();

                messageDisplay.setSelectionRange(
                    0,
                    realMessage.length
                );

                return;
            }


            // ----------------------------------
            // BACKSPACE
            // ----------------------------------

            if (event.key === "Backspace") {

                event.preventDefault();

                if (start !== end) {

                    realMessage =
                        realMessage.slice(0, start) +
                        realMessage.slice(end);

                    updateDisplay();

                    messageDisplay.setSelectionRange(
                        start,
                        start
                    );

                } else if (start > 0) {

                    realMessage =
                        realMessage.slice(0, start - 1) +
                        realMessage.slice(start);

                    updateDisplay();

                    messageDisplay.setSelectionRange(
                        start - 1,
                        start - 1
                    );
                }

                return;
            }


            // ----------------------------------
            // DELETE
            // ----------------------------------

            if (event.key === "Delete") {

                event.preventDefault();

                if (start !== end) {

                    realMessage =
                        realMessage.slice(0, start) +
                        realMessage.slice(end);

                    updateDisplay();

                    messageDisplay.setSelectionRange(
                        start,
                        start
                    );

                } else {

                    realMessage =
                        realMessage.slice(0, start) +
                        realMessage.slice(start + 1);

                    updateDisplay();

                    messageDisplay.setSelectionRange(
                        start,
                        start
                    );
                }

                return;
            }


            // ----------------------------------
            // FLÈCHE GAUCHE
            // ----------------------------------

            if (event.key === "ArrowLeft") {

                event.preventDefault();

                const position =
                    Math.max(0, start - 1);

                messageDisplay.setSelectionRange(
                    position,
                    position
                );

                return;
            }


            // ----------------------------------
            // FLÈCHE DROITE
            // ----------------------------------

            if (event.key === "ArrowRight") {

                event.preventDefault();

                const position =
                    Math.min(
                        realMessage.length,
                        start + 1
                    );

                messageDisplay.setSelectionRange(
                    position,
                    position
                );

                return;
            }


            // ----------------------------------
            // HOME
            // ----------------------------------

            if (event.key === "Home") {

                event.preventDefault();

                messageDisplay.setSelectionRange(
                    0,
                    0
                );

                return;
            }


            // ----------------------------------
            // END
            // ----------------------------------

            if (event.key === "End") {

                event.preventDefault();

                messageDisplay.setSelectionRange(
                    realMessage.length,
                    realMessage.length
                );

                return;
            }


            // ----------------------------------
            // CARACTÈRES NORMAUX
            // ----------------------------------

            if (
                event.key.length === 1 &&
                !event.ctrlKey &&
                !event.altKey &&
                !event.metaKey
            ) {

                event.preventDefault();

                const newStart = start;
                const newEnd = end;

                realMessage =
                    realMessage.slice(0, newStart) +
                    event.key +
                    realMessage.slice(newEnd);

                updateDisplay();

                const newPosition =
                    newStart + 1;

                messageDisplay.setSelectionRange(
                    newPosition,
                    newPosition
                );
            }

        }
    );


    // ==========================================
    // COLLAGE
    // ==========================================

    messageDisplay.addEventListener(
        "paste",
        (event) => {

            event.preventDefault();

            const pastedText =
                event.clipboardData.getData("text");

            const start =
                messageDisplay.selectionStart;

            const end =
                messageDisplay.selectionEnd;

            realMessage =
                realMessage.slice(0, start) +
                pastedText +
                realMessage.slice(end);

            updateDisplay();

            const newPosition =
                start + pastedText.length;

            messageDisplay.setSelectionRange(
                newPosition,
                newPosition
            );
        }
    );


    // ==========================================
    // MESSAGE DE STATUT
    // ==========================================

    const setMessage = (
        text,
        isError = false
    ) => {

        statusMessage.textContent = text;

        statusMessage.setAttribute(
            "role",
            isError ? "alert" : "status"
        );

    };


    // ==========================================
    // ENVOI WEB3FORMS
    // ==========================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (
                !accessKey ||
                accessKey.trim() === ""
            ) {

                setMessage(
                    "Clé Web3Forms manquante.",
                    true
                );

                return;
            }


            if (realMessage.trim() === "") {

                setMessage(
                    "Veuillez entrer un message.",
                    true
                );

                return;
            }


            if (submitButton) {
                submitButton.disabled = true;
            }


            setMessage(
                "Checking en cours…"
            );


            // Met à jour la vraie valeur
            messageHidden.value =
                realMessage;


            const data =
                new FormData(form);


            data.append(
                "access_key",
                accessKey
            );

            data.append(
                "subject",
                "Nouveau message depuis AR24"
            );

            data.append(
                "from_name",
                "INFOS"
            );

            data.append(
                "botcheck",
                ""
            );


            try {

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {
                            method: "POST",
                            body: data
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Réponse Web3Forms :",
                    result
                );


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "Échec de connexion"
                    );

                }


                // Reset
                form.reset();

                realMessage = "";

                messageDisplay.value = "";
                messageHidden.value = "";


                setMessage(
                    "OUPS RESSAYER."
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

        }
    );


})();
