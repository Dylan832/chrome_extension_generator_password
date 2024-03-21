// Sélection des éléments du DOM
const lengthInput = document.getElementById("length");
// const passwordInput = document.getElementById("password");
const copiedPopup = document.getElementById("copiedPopup");
const errorPopup = document.getElementById("errorPopup");

/*
const lettersCheckbox = document.getElementById("letters");
const numbersCheckbox = document.getElementById("numbers");
const specialsCheckbox = document.getElementById("specials");
*/

const minNumbersInput = document.getElementById("minNumbers");
const minSpecialsInput = document.getElementById("minSpecials");

const onlyPassword = document.getElementsByClassName("onlyPassword");

// When I open the extension, I generate a password
generatePassword(lengthInput.value);

// Function to check if all boxes are unchecked
/*function checkAllUnchecked() {
    if (
        !lettersCheckbox.checked &&
        !numbersCheckbox.checked &&
        !specialsCheckbox.checked
    ) {
        lettersCheckbox.checked = true;
    }
}*/

// Adding event listeners
// lettersCheckbox.addEventListener("change", checkAllUnchecked);
// numbersCheckbox.addEventListener("change", checkAllUnchecked);
// specialsCheckbox.addEventListener("change", checkAllUnchecked);

// Function to generate a password
function generatePassword(length) {
    let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let specials = "!@#$%^&*?";

    let password = "";
    let charset = "";

    let minNumbers = minNumbersInput.value;
    let minSpecials = minSpecialsInput.value;

    // Check that the sum of the minimums does not exceed the total length
    if (parseInt(minNumbers) + parseInt(minSpecials) > length) {
        errorPopup.classList.add("show");
        setTimeout(function () {
            errorPopup.classList.remove("show");
        }, 2000);

        return;
    }

    // Add the minimum number of digits
    for (let i = 0; i < minNumbers; ++i) {
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    // Add the minimum number of special characters
    for (let i = 0; i < minSpecials; ++i) {
        password += specials.charAt(Math.floor(Math.random() * specials.length));
    }

    // Complete the rest of the password with a mixture of letters, numbers and special characters.
    charset = letters + numbers + specials;
    for (let i = password.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    // Mix up the password so that numbers and special characters are not all at the beginning.
    password = password
        .split("")
        .sort(function () {
            return 0.5 - Math.random();
        })
        .join("");
    console.log(password);

    // Create span elements for each password character
    let passwordDiv = document.getElementById("generated-wrapper");
    passwordDiv.innerHTML = ""; // Delete current content
    for (let char of password) {
        let span = document.createElement("span");
        span.textContent = char;

        // Add a class based on the character type
        if (letters.includes(char)) {
            span.className = "password-letters";
        } else if (numbers.includes(char)) {
            span.className = "password-numbers";
        } else if (specials.includes(char)) {
            span.className = "password-specials";
        }

        passwordDiv.appendChild(span);
    }
}

// Function to generate a passphrase
function generatePassphrase(length) {
    fetch(chrome.runtime.getURL("/popup/words.json"))
        .then((response) => response.json())
        .then((data) => {
            let words = data;
            let passwordDiv = document.getElementById("generated-wrapper");
            passwordDiv.innerHTML = ""; // Delete current content
            let span = document.createElement("span"); // Create a single span element
            for (let i = 0, n = words.length; i < length; ++i) {
                let word = words[Math.floor(Math.random() * n)];
                span.textContent += word;
                // Add a dash after each word, except the last.
                if (i < length - 1) {
                    span.textContent += "-";
                }
            }
            passwordDiv.appendChild(span);
        });
}

// Event listeners for radio buttons
document.getElementById("passwordType").addEventListener("change", function () {
    if (this.checked) {
        lengthInput.value = 12;
        lengthInput.min = 6;
        lengthInput.max = 50;

        // Show "onlyPassword" elements
        for (let i = 0; i < onlyPassword.length; i++) {
            onlyPassword[i].style.display = "flex";
        }

        generatePassword(lengthInput.value);
    }
});

document
    .getElementById("passphraseType")
    .addEventListener("change", function () {
        if (this.checked) {
            lengthInput.value = 3;
            lengthInput.min = 3;
            lengthInput.max = 20;
            // Hide "onlyPassword" elements
            for (let i = 0; i < onlyPassword.length; i++) {
                onlyPassword[i].style.display = "none";
            }
            generatePassphrase(lengthInput.value);
        }
    });

document.getElementById("generator").addEventListener("click", function () {
    let length = lengthInput.value;
    let type = document.querySelector('input[name="type"]:checked').value;

    if (type === "password") {
        if (length < 6) {
            length = 6;
            lengthInput.value = length;
        }
        if (length > 50) {
            length = 50;
            lengthInput.value = length;
        }
        generatePassword(length);
    } else if (type === "passphrase") {
        if (length < 3) {
            length = 3;
            lengthInput.value = length;
        }
        if (length > 20) {
            length = 20;
            lengthInput.value = length;
        }
        generatePassphrase(length);
    }
});

document.getElementById("copy").addEventListener("click", function (e) {
    e.preventDefault();
    // Select all span elements in the password div
    let spans = document.querySelectorAll("#generated-wrapper span");

    // Browse each span element and add its contents to the password variable.
    let password = "";
    for (let span of spans) {
        password += span.textContent;
    }

    if (password.length) {
        // 2. Copy the text to the word clipboard
        navigator.clipboard.writeText(password).then(() => {
            // 3. The alert is displayed
            copiedPopup.classList.add("show");
            setTimeout(function () {
                copiedPopup.classList.remove("show");
            }, 1500);
        });
    }
});
