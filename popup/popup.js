// Sélection des éléments du DOM
const lengthInput = document.getElementById("length");
const passwordInput = document.getElementById("password");
const copiedPopup = document.getElementById("copiedPopup");
const errorPopup = document.getElementById("errorPopup");

const lettersCheckbox = document.getElementById("letters");
const numbersCheckbox = document.getElementById("numbers");
const specialsCheckbox = document.getElementById("specials");

const minNumbersInput = document.getElementById("minNumbers");
const minSpecialsInput = document.getElementById("minSpecials");

const onlyPassword = document.getElementsByClassName("onlyPassword");

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
// lettersCheckbox.addEventListener("change", checkAllUnchecked);
// numbersCheckbox.addEventListener("change", checkAllUnchecked);
// specialsCheckbox.addEventListener("change", checkAllUnchecked);

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
    errorPopup.classList.add("show");
    setTimeout(function () {
      errorPopup.classList.remove("show");
    }, 2000);

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
  console.log(password);
  // Mélangez le mot de passe pour que les chiffres et les caractères spéciaux ne soient pas tous au début
  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  // Créez des éléments span pour chaque caractère du mot de passe
  let passwordDiv = document.getElementById("generated-wrapper");
  passwordDiv.innerHTML = ""; // Effacez le contenu actuel
  for (let char of password) {
    let span = document.createElement("span");
    span.textContent = char;

    // Ajoutez une classe en fonction du type de caractère
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

// Fonction pour générer une phrase de passe
function generatePassphrase(length) {
  fetch(chrome.runtime.getURL("/popup/words.json"))
    .then((response) => response.json())
    .then((data) => {
      let words = data;
      let passwordDiv = document.getElementById("generated-wrapper");
      passwordDiv.innerHTML = ""; // Effacez le contenu actuel
      let span = document.createElement("span"); // Créez un seul élément span
      for (let i = 0, n = words.length; i < length; ++i) {
        let word = words[Math.floor(Math.random() * n)];
        span.textContent += word;
        // Ajoutez un tiret après chaque mot, sauf le dernier
        if (i < length - 1) {
          span.textContent += "-";
        }
      }
      passwordDiv.appendChild(span);
    });
}

// Ecouteurs d'événements pour les boutons radio
document.getElementById("passwordType").addEventListener("change", function () {
  if (this.checked) {
    lengthInput.value = 12;
    lengthInput.min = 6;
    lengthInput.max = 50;

    // Affichez les éléments "onlyPassword"
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
      // Cachez les éléments "onlyPassword"
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
  // Sélectionnez tous les éléments span dans la div du mot de passe
  let spans = document.querySelectorAll("#generated-wrapper span");

  // Parcourez chaque élément span et ajoutez son contenu à la variable password
  let password = "";
  for (let span of spans) {
    password += span.textContent;
  }

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
