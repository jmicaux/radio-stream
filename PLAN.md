# Plan de correction audio

## Constat

- Le flux radio fonctionne dans VLC.
- Dans l’extension, l’audio démarre puis se coupe quand l’onglet ou le contexte passe en arrière-plan.
- Les protections testées dans l’extension n’ont pas supprimé la coupure.

## Hypothèse

- Le problème vient du contexte d’exécution du lecteur dans le navigateur, pas du flux lui-même.
- Le lecteur audio hébergé par l’extension est trop facilement suspendu ou limité par le moteur du navigateur.

## Objectif

- Déplacer la lecture audio hors du contexte `chrome-extension://` pour utiliser un contexte plus stable.
- Garder la popup d’extension comme interface de sélection, mais faire tourner le player dans une vraie page dédiée.

## Plan

1. Créer une page player normale dédiée à la lecture audio.
2. Déplacer la logique `Audio` dans cette page.
3. Garder la popup comme simple contrôleur.
4. Ajouter un canal de message entre la popup, le background et la page player.
5. Vérifier que le player continue de jouer quand l’onglet n’est plus visible.
6. Retirer les contournements devenus inutiles dans l’extension.

## Critères de validation

- Le flux continue plus de 30 secondes sans revenir sur l’onglet.
- Le bouton de stop coupe bien le son.
- Le changement de station reste fluide.
- Le ZIP d’extension est régénéré avec la nouvelle architecture.
