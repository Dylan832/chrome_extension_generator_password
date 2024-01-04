# Générateur de Mot de Passe

Il s'agit d'une extension Chrome qui offre les fonctionnalités suivantes :

- Génération d'un mot de passe sécurisé, dont la longueur peut varier entre 6 et 50 caractères.
- Possibilité de personnaliser le mot de passe en choisissant d'inclure des lettres, des chiffres et/ou des caractères spéciaux.
- Capacité de générer des phrases de passe, composées de 3 à 20 mots.

## Procédure d'Installation

Pour installer cette extension, veuillez suivre les étapes ci-dessous :

1. Téléchargez l'extension depuis la section 
[Releases](https://github.com/Dylan832/chrome_extension_generator_password/releases) 
sur GitHub ou directement via ce
[lien](https://gitlab.com/Dylan832/chrome_extension_generator_password/-/archive/main/chrome_extension_generator_password-main.zip).

2. Ouvrez votre navigateur Chrome et activez le mode développeur.
3. Sélectionnez l'option "Charger l'extension non empaquetée" et choisissez le dossier contenant l'extension téléchargée.

## Structure du projet

```
.
├── .gitignore
├── manifest.json
├── readme.md
├── images/
│   └── icon-128.png
└── popup/
    ├── popup.css
    ├── popup.html
    ├── popup.js
    └── words.json
```