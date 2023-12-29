// ! FAIRE UN DISPLAY NONE SUR LES DIV PLUTOT QUE LES INPUTS

// Sélection des éléments du DOM
const lengthInput = document.getElementById("length");
const passwordInput = document.getElementById("password");
const copiedPopup = document.getElementById("copiedPopup");

const lettersCheckbox = document.getElementById("letters");
const numbersCheckbox = document.getElementById("numbers");
const specialsCheckbox = document.getElementById("specials");

const minNumbersInput = document.getElementById("minNumbers");
const minSpecialsInput = document.getElementById("minSpecials");

const onlyPassword = document.getElementById("onlyPassword");
// const test = document.querySelector'

// A l'ouverture de l'extension je génère un mot de passe
generatePassword(lengthInput.value);

// Fonction pour vérifier si toutes les cases sont décochées
function checkAllUnchecked() {
  if (
    !lettersCheckbox.checked &&
    !numbersCheckbox.checked &&
    !specialsCheckbox.checked
  ) {
    lettersCheckbox.checked = true;
  }
}

// Ajout des écouteurs d'événements
lettersCheckbox.addEventListener("change", checkAllUnchecked);
numbersCheckbox.addEventListener("change", checkAllUnchecked);
specialsCheckbox.addEventListener("change", checkAllUnchecked);

// Fonction pour générer un mot de passe
function generatePassword(length) {
  let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";
  let specials = "!@#$%^&*?";

  let password = "";
  let charset = "";

  let minNumbers = minNumbersInput.value;
  let minSpecials = minSpecialsInput.value;

  // Vérifiez que la somme des minimums ne dépasse pas la longueur totale
  if (parseInt(minNumbers) + parseInt(minSpecials) > length) {
    alert(
      "La somme des minimums ne peut pas dépasser la longueur totale du mot de passe !"
    );
    return;
  }

  // Ajoutez le nombre minimum de chiffres
  for (let i = 0; i < minNumbers; ++i) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Ajoutez le nombre minimum de caractères spéciaux
  for (let i = 0; i < minSpecials; ++i) {
    password += specials.charAt(Math.floor(Math.random() * specials.length));
  }

  // Complétez le reste du mot de passe avec un mélange de lettres, chiffres et caractères spéciaux
  charset = letters + numbers + specials;
  for (let i = password.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Mélangez le mot de passe pour que les chiffres et les caractères spéciaux ne soient pas tous au début
  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  passwordInput.value = password;
}

// Fonction pour générer une phrase de passe
function generatePassphrase(length) {
  let password = "";
  fetch(chrome.runtime.getURL("/popup/words.json"))
    .then((response) => response.json())
    .then((data) => {
      words = data;
      for (let i = 0, n = words.length; i < length; ++i) {
        password += words[Math.floor(Math.random() * n)] + "-";
      }
      password = password.slice(0, -1);
      passwordInput.value = password;
    });
}

// Ecouteurs d'événements pour les boutons radio
document.getElementById("passwordType").addEventListener("change", function () {
  if (this.checked) {
    lengthInput.value = 12;
    lengthInput.min = 6;
    // Affichez les éléments "onlyPassword"

    onlyPassword.style.display = "block";

    generatePassword(lengthInput.value);
  }
});

document
  .getElementById("passphraseType")
  .addEventListener("change", function () {
    if (this.checked) {
      lengthInput.value = 3;
      lengthInput.min = 3;
      // Cachez les éléments "onlyPassword"

      onlyPassword.style.display = "none";

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
    generatePassword(length);
  } else if (type === "passphrase") {
    if (length < 3) {
      length = 3;
      lengthInput.value = length;
    }
    generatePassphrase(length);
  }
});

document.getElementById("copy").addEventListener("click", function (e) {
  e.preventDefault();
  let password = passwordInput.value;
  if (password.length) {
    // 2. On copie le texte dans le presse-papier
    navigator.clipboard.writeText(password).then(() => {
      // 3. On affiche l'alert
      copiedPopup.classList.add("show");
      setTimeout(function () {
        copiedPopup.classList.remove("show");
      }, 1500);
    });
  }
});
