interface CharacterType {
    letters: string;
    numbers: string;
    specials: string;
}

const characters: CharacterType = {
    letters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    specials: "!@#$%^&*?",
};

// Display the generated password
function displayGeneratedPassword(password: string) {
    const passwordDiv: HTMLElement | null = document.getElementById("generated-wrapper");
    if (passwordDiv) {
        passwordDiv.innerHTML = ""; // Clear previous content

        for (let char of password) {
            const span = document.createElement("span");
            span.textContent = char;

            // Add classes based on character type
            if (characters.letters.includes(char)) {
                span.classList.add("password-letters");
            } else if (characters.numbers.includes(char)) {
                span.classList.add("password-numbers");
            } else if (characters.specials.includes(char)) {
                span.classList.add("password-specials");
            }

            passwordDiv.appendChild(span);
        }
    }
}

function generatePassword(length: number): string {
    const charset: string = characters.letters + characters.numbers + characters.specials;
    let password: string = "";

    for (let i = 0; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
        console.log(password, 'PASSWORD')
    }

    return password.split("").sort(() => 0.5 - Math.random()).join("");
}

function generatePassphrase(length: number): void {
    fetch(chrome.runtime.getURL("./public/words.json"))
        .then((response) => response.json())
        .then((data) => {
            const words = data;
            const passwordDiv: HTMLElement | null = document.getElementById("generated-wrapper");
            if (passwordDiv) {
                passwordDiv.innerHTML = "";
                const span = document.createElement("span");
                for (let i = 0, n = words.length; i < length; ++i) {
                    const word = words[Math.floor(Math.random() * n)];
                    span.textContent += word;
                    if (i < length - 1) {
                        span.textContent += "-";
                    }
                }
                passwordDiv.appendChild(span);
            }
        });
}

const lengthInput: HTMLInputElement | null = document.getElementById("length");
const copiedPopup: HTMLElement | null = document.getElementById("copiedPopup");
const errorPopup: HTMLElement | null = document.getElementById("errorPopup");
const minNumbersInput: HTMLInputElement | null = document.getElementById("minNumbers");
const minSpecialsInput: HTMLInputElement | null = document.getElementById("minSpecials");
const onlyPassword: NodeListOf<HTMLElement> = document.getElementsByClassName("onlyPassword");

document.getElementById("passwordType").addEventListener("change", function () {
    if (this.checked) {
        lengthInput!.value = 12;
        lengthInput!.min = 6;
        lengthInput!.max = 50;
        for (let i = 0; i < onlyPassword.length; i++) {
            onlyPassword[i].style.display = "flex";
        }
        generatePassword(lengthInput!.value);
    }
});

document.getElementById("passphraseType").addEventListener("change", function () {
    if (this.checked) {
        lengthInput!.value = 3;
        lengthInput!.min = 3;
        lengthInput!.max = 20;
        for (let i = 0; i < onlyPassword.length; i++) {
            onlyPassword[i].style.display = "none";
        }
        generatePassphrase(lengthInput!.value);
    }
});

document.getElementById("generator").addEventListener("click", function () {
    const length = parseInt(lengthInput!.value);
    const type = document.querySelector('input[name="type"]:checked')!.value;

    if (type === "password") {
        if (length < 6) {
            lengthInput!.value = "6";
        }
        if (length > 50) {
            lengthInput!.value = "50";
        }
        console.log(typeof length)
        let final_password = generatePassword(length);
        displayGeneratedPassword(final_password)
    } else if (type === "passphrase") {
        if (length < 3) {
            lengthInput!.value = "3";
        }
        if (length > 20) {
            lengthInput!.value = "20";
        }
        generatePassphrase(length);
    }
});

document.getElementById("copy").addEventListener("click", function (e) {
    e.preventDefault();

    const spans = document.querySelectorAll("#generated-wrapper span");
    let password: string = "";
    for (const span of spans) {
        password += span.textContent;
    }

    if (password.length) {
        navigator.clipboard.writeText(password).then(() => {
            copiedPopup!.classList.add("show"); // Show the copied popup
            setTimeout(() => {
                copiedPopup!.classList.remove("show"); // Hide the copied popup after 1.5 seconds
            }, 1500);
        });
    }
});
