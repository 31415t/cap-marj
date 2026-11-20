# UX/UI Design : système visuel et éditorial
**Plateforme CAP-MARJ**

| Champ | Valeur |
|---|---|
| Version du document | 0.1 |
| Statut | Brouillon, à valider sur maquette avec le client |
| Dernière mise à jour | 13 novembre 2026 |
| Phases couvertes | V0 Vitrine (détaillée), V1 et V2 (principes et composants à venir) |
| Documents liés | [PRD](01_PRD_Exigences_Produit.md) · [TRD](02_TRD_Exigences_Techniques.md) · [Appflow](03_Appflow.md) · [Backend Schema](05_Backend_Schema.md) · [Plan](06_Plan_Implementation.md) |
| Rôle de ce document | Source de vérité de l'**apparence, du ton et des composants**. Aucun code couleur ni taille n'est écrit en dur dans un composant : tout passe par les variables de la section 4. |

---

## 1. Intention

**Sujet** : un centre d'appui psycho-médical de Port-de-Paix, institution de santé, de recherche et d'action communautaire, créée en 2017.
**Publics** : élèves et étudiants, adultes et familles, professionnels, institutions partenaires. Beaucoup consulteront sur téléphone, en connexion limitée.
**Mission du site** : inspirer confiance en moins de dix secondes, expliquer clairement l'offre, rendre le contact évident.

**Parti pris : sobre, institutionnel, humain.**
- La couleur vient du **logo** (vert et bleu marine), pas d'une palette « bien-être » générique.
- La **photographie réelle** de l'équipe et des activités porte l'émotion ; le design reste calme autour.
- La typographie apporte l'autorité (empattements pour les titres) et la lisibilité (grotesque humaniste pour le texte).
- **Un seul élément marquant** : l'arc du sceau repris dans la mise en forme de la photo principale de l'accueil (section 7). Tout le reste est discipliné.

## 2. Revue du brief initial et décisions

Les propositions de départ (palette crème, bleu doux, vert sauge, typographie Inter ou Manrope, sections de cabinet individuel) étaient des pistes. L'intention est conservée, la forme est changée.

| Proposition initiale | Décision | Raison |
|---|---|---|
| Fond crème, bleu doux, vert sauge | **Palette extraite du logo** : vert #006818, bleu marine #204060, fond blanc et « brume » vert-gris | Une palette de bien-être générique conviendrait à n'importe quelle clinique ; le logo ancre l'identité du CAP-MARJ. Le fond crème associé à un empattement est devenu un signe courant de sites générés |
| Inter, Manrope, Source Sans | **Literata** (titres) + **Public Sans** (texte) | Choix délibéré plutôt que police par défaut ; Literata est conçue pour la lecture et couvre le français et le créole |
| Photos humaines authentiques | **Conservé**, avec règles strictes (section 9) | C'est le meilleur levier de crédibilité |
| Gros bouton « Prendre rendez-vous » | Conservé en intention ; libellé **« Nous contacter »** en V0 | On ne promet pas ce qui n'existe pas encore |
| Photo du psychologue, couples, adolescents | Remplacés par le contenu réel : 4 axes, 5 services, équipe de 9 | Le client est un centre, pas un cabinet individuel |
| Témoignages | Supprimés | Aucun fourni ; consentement écrit indispensable en santé mentale |
| Message rassurant | Remplacé par une présentation factuelle | Les slogans rassurants sans preuve sonnent creux |

## 3. Principes

1. **Chaque élément visuel porte une information.** Un filet, une bordure, un badge existe pour structurer, jamais pour décorer.
2. **La clarté avant l'effet.** Libellés simples, verbes précis, phrases courtes.
3. **Le calme.** Peu de couleurs, beaucoup d'espace, aucun effet qui attire l'attention hors de l'élément marquant.
4. **L'accessibilité est un plancher**, pas une option : contrastes, clavier, tailles, mouvement réduit.
5. **Le même mot pour la même chose**, sur tout le site.

## 4. Variables de design (source unique)

```css
:root {
  /* Couleurs de marque (extraites du logo) */
  --vert-cap:        #006818;
  --vert-cap-fonce:  #004F12;   /* survol, actif */
  --marine:          #204060;

  /* Texte et surfaces */
  --encre:           #1B2A3A;   /* texte principal */
  --encre-douce:     #4A5A6A;   /* texte secondaire */
  --papier:          #FFFFFF;
  --brume:           #EDF2EF;   /* sections alternées */
  --seve:            #DCEBDD;   /* badges, surbrillance légère */
  --bordure:         #C9D4CE;
  --bordure-champ:   #6F867B;   /* contour des champs, 3:1 minimum */

  /* États */
  --erreur:          #B3261E;
  --attention-texte: #7A4E00;
  --attention-fond:  #FFF3D6;

  /* Typographie */
  --police-titre: 'Literata', Georgia, 'Times New Roman', serif;
  --police-texte: 'Public Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --t-petit: 0.875rem;
  --t-corps: 1.0625rem;
  --t-lead:  1.25rem;
  --t-h3:    1.375rem;
  --t-h2:    clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem);
  --t-h1:    clamp(2.25rem, 1.6rem + 2.8vw, 3.5rem);

  /* Espacement (base 4 px) */
  --e-1: 0.25rem;  --e-2: 0.5rem;  --e-3: 0.75rem;  --e-4: 1rem;
  --e-6: 1.5rem;   --e-8: 2rem;    --e-12: 3rem;    --e-16: 4rem;  --e-24: 6rem;

  /* Formes */
  --rayon-controle: 6px;       /* boutons, champs */
  --rayon-fiche: 2px;          /* fiches, conteneurs */
  --largeur-page: 1180px;
  --mesure: 68ch;              /* largeur maximale d'un paragraphe */
  --ombre-superposition: 0 8px 24px rgba(27, 42, 58, 0.18); /* menus et fenêtres seulement */
}
```

**Contrastes vérifiés (WCAG 2.1)** : texte normal ≥ 4,5:1, grands textes et composants ≥ 3:1.

| Association | Rapport | Verdict |
|---|---|---|
| Encre sur papier | 14,6:1 | AAA |
| Encre douce sur papier / sur brume | 7,1:1 / 6,3:1 | AAA / AA |
| Vert CAP sur papier (liens, texte) | 7,0:1 | AAA |
| Blanc sur vert CAP (bouton) | 7,0:1 | AAA |
| Blanc sur vert foncé (survol) | 9,9:1 | AAA |
| Marine sur papier / blanc sur marine | 10,7:1 | AAA |
| Marine sur sève (badge) | 8,6:1 | AAA |
| Erreur sur papier | 6,5:1 | AA |
| Texte d'attention sur son fond | 6,5:1 | AA |
| Bordure de champ sur papier / sur brume | 3,9:1 / 3,5:1 | AA composants |

À revérifier avec un outil dès que les teintes ou fonds changent.

## 5. Typographie

| Rôle | Police | Graisse | Taille | Interligne |
|---|---|---|---|---|
| Titre 1 | Literata | 600 | `--t-h1` | 1,1 |
| Titre 2 | Literata | 600 | `--t-h2` | 1,2 |
| Titre 3 | Literata | 600 | `--t-h3` | 1,3 |
| Introduction | Public Sans | 400 | `--t-lead` | 1,5 |
| Corps | Public Sans | 400 | `--t-corps` | 1,6 |
| Libellés, boutons | Public Sans | 600 | 1 rem | 1,2 |
| Légendes, aides | Public Sans | 400 | `--t-petit` | 1,45 |
| Prix | Literata, chiffres alignés | 600 | `--t-h3` | 1,2 |

- Polices **auto-hébergées** (WOFF2, sous-ensemble latin étendu), `font-display: swap`, deux familles au maximum.
- Casse de phrase partout. **Pas de majuscules d'ambiance**, pas de petits titres au-dessus des titres.
- Alignement à gauche. Les paragraphes ne dépassent jamais `--mesure`. Pas de texte justifié, pas de long texte centré.

## 6. Composants

### Bouton
| Variante | Style | Usage |
|---|---|---|
| Principal | Fond vert CAP, texte blanc, hauteur 48 px, rayon 6 px | Une action principale par écran |
| Secondaire | Contour marine 1,5 px, texte marine, fond transparent | Action alternative |
| Lien | Texte vert, soulignement décalé de 3 px | Navigation dans le texte |

Survol : fond vert foncé. Focus : anneau double (2 px blanc puis 4 px marine). Désactivé : texte et contour grisés avec explication proche. **Aucune flèche ajoutée aux libellés.**

### Champ de formulaire
Libellé toujours visible au-dessus (jamais le seul placeholder), hauteur 48 px, contour `--bordure-champ`, focus 2 px marine. Erreur : contour et message sous le champ, avec pictogramme, annoncée aux lecteurs d'écran. Texte d'aide en `--encre-douce`.

### Fiche service

Deux états, même composant.

```
V0 (ce qu'on a)                     V1 (carte complète)
┌─────────────────────────┐        ┌─────────────────────────┐
│ Nom du service (titre 3)│        │ Nom du service          │
│ Résumé, 3 lignes max    │        │ Pour : cible            │
│                         │        │ Ce qui est inclus :     │
│                         │        │  ✓ élément              │
│                         │        │  ✓ élément              │
│ [Nous contacter]        │        │ Prix       [Prendre RDV]│
└─────────────────────────┘        └─────────────────────────┘
```
Contour 1 px `--bordure`, rayon 2 px, **ni ombre, ni effet de survol qui soulève**. Les champs optionnels (cible, inclusions, prix) n'apparaissent que s'ils sont renseignés. Le prix est affiché en chiffres alignés ; « Gratuit » ou « Sur devis » selon le cas. Aucun badge « populaire » ou « recommandé ».

### Fiche équipe
Photo en ratio 4:5, coins francs, nom en Literata, fonction en `--encre-douce`, résumé de deux lignes, lien « Lire la présentation » qui ouvre la page ou un panneau (focus piégé, fermeture à la touche Échap). Pas d'avatars ronds. Les présentations très courtes (une ligne) et très longues (CV complet) doivent s'afficher proprement.

### Axes du centre
Quatre blocs de texte (nom en Literata, une phrase), séparés par de fins filets verticaux sur grand écran. Pas de cartes, pas de pictogramme décoratif.

### Questions fréquentes
Éléments `details/summary` natifs, titre de la question en gras, ouverture de 150 ms sans autre effet.

### Badge « Bientôt »
Fond sève, texte marine, casse de phrase, taille petite. Non cliquable.

### Mention d'urgence
Bandeau à contour marine, fond brume, texte clair : le centre ne peut pas répondre aux urgences par le site ; en cas de danger immédiat, contacter les secours ou se rendre au service d'urgence le plus proche ; numéros du centre en lien cliquable. **Aucun numéro d'urgence extérieur n'est affiché sans confirmation du client** (UX-Q06).

### En-tête et pied de page
En-tête de 64 px, fond blanc, filet inférieur, sceau de 44 px, nom court « CAP-MARJ » en Literata, menu, bouton principal. Pas de flou ni de transparence. Sur mobile, le menu s'ouvre en panneau plein écran. Pied de page sur fond marine : coordonnées, liens légaux, mention d'urgence ; le sceau y figure sur une pastille blanche (le fichier du logo est en couleur sur fond blanc).

## 7. Mise en page de l'accueil (V0)

Grille à 12 colonnes (4 sur mobile), largeur maximale 1180 px, sections séparées par 96 px (64 px sur mobile), fonds alternés papier et brume. Alignement à gauche.

```
┌──────────────────────────────────────────────────────────────────────┐
│ (sceau) CAP-MARJ     Le centre   Services   FAQ   Contact  [Nous contacter] │
├──────────────────────────────────────────────────────────────────────┤
│ HERO                                                                 │
│  Titre 1 (7 col)                                  ╭────────────────  │
│  Phrase d'introduction                           ╱   photo cadrée   │
│  [Nous contacter]  Découvrir nos services       │    dans un arc    │
│                                                  ╲   (sceau)       │
│                                                   ╰────────────────  │
├──────────────────────────────────────────────────────────────────────┤
│ Les quatre axes   │ Santé globale │ Recherche │ Entrepreneuriat │ Engagement │
├──────────────────────────────────────────────────────────────────────┤
│ Services          ┌────┐ ┌────┐ ┌────┐                               │
│                   │ 1  │ │ 2  │ │ 3  │                               │
│                   └────┘ └────┘ └────┘                               │
│                   ┌────┐ ┌────┐  Vous hésitez ? Écrivez-nous. [Contact] │
│                   │ 4  │ │ 5  │                                      │
│                   └────┘ └────┘                                      │
├──────────────────────────────────────────────────────────────────────┤
│ Le centre en bref   texte (7 col)            photo (5 col)           │
│ [Lire l'historique complet]                                          │
├──────────────────────────────────────────────────────────────────────┤
│ L'équipe (aperçu de 4)   fiche  fiche  fiche  fiche   [Voir toute l'équipe] │
├──────────────────────────────────────────────────────────────────────┤
│ Moments clés   mosaïque asymétrique de 4 à 5 photos réelles          │
├──────────────────────────────────────────────────────────────────────┤
│ FAQ   6 questions en accordéon (7 col)                               │
├──────────────────────────────────────────────────────────────────────┤
│ Contact   coordonnées + mention d'urgence │ formulaire               │
├──────────────────────────────────────────────────────────────────────┤
│ Pied de page                                                         │
└──────────────────────────────────────────────────────────────────────┘
```

**Élément marquant** : la photo principale est découpée dans un grand arc de cercle, débordant du bord droit de l'écran, qui rappelle le sceau. Sur mobile, l'arc passe sous le titre. Si les photos reçues ne s'y prêtent pas, repli : panneau marine avec le sceau en grand, sans autre effet.

**Case vide dans la grille des services** : la sixième place accueille un court bloc de texte avec un lien vers le contact, ce qui règle l'effet « 5 cartes » sans élément décoratif.

### Pages V0
| Page | Contenu | Remarques |
|---|---|---|
| Services et FAQ | Sections de l'accueil, atteintes par les ancres `#services` et `#faq` depuis le menu | Pages dédiées ajoutées en V1 si le contenu le justifie |
| À propos | Historique complet, les quatre axes développés, branches | Texte en colonne de 68 caractères |
| Équipe | 9 fiches, présentation complète au clic | Ordre défini par `position` |
| Contact | Coordonnées, adresse, urgence, formulaire | Service pré-sélectionné si on vient d'une carte |
| Mentions légales, confidentialité | Texte brut mis en forme | Brouillons relus par les juristes du centre |

## 8. Ton éditorial et libellés

- Vouvoiement, phrases courtes, voix active, casse de phrase, vocabulaire simple.
- Dire ce qui se passe : « Nous contacter », « Envoyer le message », « Prendre rendez-vous ».
- Une action garde son nom partout : « Envoyer le message » donne « Message envoyé ».
- Les erreurs expliquent le problème et la solution, sans s'excuser et sans vague.
- Aucune promesse de résultat, aucun superlatif, aucun jargon de marketing.

| Élément | Texte proposé (à valider) |
|---|---|
| Titre principal | Centre d'Appui Psycho-Médical, à Port-de-Paix |
| Introduction | Depuis 2017, le CAP-MARJ accompagne les personnes et les communautés du Nord-Ouest : santé globale, recherche, entrepreneuriat social et engagement communautaire. |
| Bouton principal | Nous contacter |
| Lien secondaire | Découvrir nos services |
| Bloc hésitation (services) | Vous ne savez pas quel service choisir ? Écrivez-nous, nous vous orienterons. |
| Message envoyé | Votre message est envoyé. Nous vous répondrons dans les meilleurs délais. |
| Message en erreur | Le message n'a pas pu être envoyé. Vérifiez votre connexion puis réessayez. |
| Avertissement du formulaire | Ne décrivez pas votre situation personnelle dans ce formulaire. Nous en parlerons lors de notre échange. |

## 9. Photographie et iconographie

**Photographie**
- Uniquement des photos réelles de l'équipe et des activités du centre, avec consentement des personnes visibles. **Aucune photo de bénéficiaire.**
- Aucune photo de banque d'images présentée comme celle du centre.
- Lumière naturelle, cadrage simple ; aucun filtre, aucune surimpression colorée, aucun texte sur l'image.
- Formats : principale 16:10, équipe 4:5, galerie en mélange 3:2 et 1:1. Largeur maximale 1600 px, WebP ou AVIF, poids selon le TRD, données EXIF supprimées.
- Chaque image a un texte alternatif qui décrit la scène (« Séance de formation dans la salle du centre »), pas « photo ».

**Icônes** : un seul jeu en traits fins (1,5 px, 20 ou 24 px), utilisé pour la navigation, les états et les formulaires. Pas d'icône décorative au-dessus des titres, pas d'émojis.

## 10. Mouvement

- Mouvement uniquement quand il répond à une action : ouverture du menu, déploiement d'une question, apparition d'un message (150 à 200 ms).
- Aucun défilement animé, aucune animation d'entrée de section, aucun effet de survol qui déplace ou soulève.
- `prefers-reduced-motion` désactive toute animation.

## 11. Accessibilité et responsive

- WCAG 2.1 AA : lien d'évitement, structure de titres cohérente, `lang="fr"`, focus visible partout, zones tactiles d'au moins 44 px, aucune information transmise par la seule couleur, formulaires avec libellés et erreurs annoncées.
- Taille de texte de base 17 px ; le site reste utilisable à 200 % de zoom.
- Points de rupture : 480, 768, 1024, 1280 px. Conception mobile d'abord. Le menu devient un panneau sous 1024 px.
- Aucun contenu essentiel dans une image ; aucun carrousel automatique.

## 12. Contrôle avant chaque livraison

Répondre honnêtement à ces questions sur chaque écran :
1. Si on remplace le logo, la page pourrait-elle appartenir à une autre clinique ? Si oui, quel élément la rend spécifique au CAP-MARJ ?
2. Y a-t-il des cartes identiques répétées avec les mêmes ombres et les mêmes arrondis ?
3. Un chiffre, un numéro ou une étiquette est-il là sans que le contenu soit une suite ?
4. Une majuscule d'ambiance, une flèche ou un mot isolé en couleur dans un titre ?
5. Un dégradé, un flou, une ombre ou un effet sans fonction ?
6. Le texte est-il vrai, précis, validé, sans promesse ?
7. Les photos sont-elles réelles et consenties ?
8. Contraste, clavier, 360 px : tout est-il vérifié ?
9. Qu'est-ce qu'on peut retirer sans perdre d'information ?

## 13. Informations manquantes

| Réf | Information manquante | Question à poser au client | Réponse par défaut (suggestion) | Bloque |
|---|---|---|---|---|
| UX-Q01 | Logo exploitable | Avez-vous le logo en fichier vectoriel (SVG, PDF, AI) ou en PNG haute définition, avec version à fond transparent et version blanche ? | Nous nettoyons et recadrons le JPG reçu (qualité provisoire) et créons une version blanche pour le pied de page | V0 |
| UX-Q02 | Charte graphique existante | Existe-t-il des règles de couleurs ou de polices (papier à en-tête, affiches) ? | Non : palette du logo | V0 |
| UX-Q03 | Photos | Quelles photos sont disponibles, en quelle qualité ? Une séance photo est-elle possible ? | Utiliser celles du dossier partagé ; repli panneau marine pour l'accueil | V0 |
| UX-Q04 | Vocabulaire pour désigner les personnes accompagnées | Comment le centre les nomme-t-il (bénéficiaires, patients, usagers) ? | « Personnes accompagnées » dans les textes généraux, « vous » dans les parcours | V0 |
| UX-Q05 | Registre de langue | Vouvoiement ? | Vouvoiement | V0 |
| UX-Q06 | Numéros d'urgence locaux | Quels numéros peut-on afficher en cas d'urgence ? | Seulement les numéros du centre et la phrase d'orientation générique | V0 |
| UX-Q07 | Descriptions courtes des quatre axes | Valider des textes d'une phrase tirés de l'historique | Rédigés par nous, validés par le client | V0 |
| UX-Q08 | Légendes des photos de moments clés | Date et lieu de chaque photo ? | Légendes factuelles courtes fournies par le client ; sinon aucune légende | V0 |
| UX-Q09 | Résumé court de chaque service (160 caractères) | Valider nos résumés tirés des descriptions fournies | Rédigés par nous, validés par le client | V0 |

## 14. Les interdits

**Aspect général**
- Pas de fond crème associé à un titre à empattements et à un accent terracotta, ni de fond noir à accent fluo : ce sont des signatures de sites générés.
- Pas de dégradés décoratifs, de flou « verre dépoli », de formes abstraites flottantes, de motifs de fond.
- Pas d'ombre portée sur les fiches, pas d'effet qui soulève au survol.
- Pas de rangées de cartes identiques avec le même arrondi, la même ombre et la même icône.
- Pas de mode sombre en V0 et V1.

**Typographie et texte**
- Pas de petit titre en majuscules espacées au-dessus d'un titre.
- Pas de numérotation « 01, 02, 03 » sauf pour une vraie suite d'étapes.
- Pas de mot isolé en couleur ou en italique au milieu d'un titre.
- Pas de flèche ajoutée au texte d'un lien ou d'un bouton ; pas de chaîne de mots reliés par des points médians.
- Pas de texte factice, pas de superlatif, pas de promesse de guérison ou de résultat, pas de chiffres inventés.
- Pas de texte de moins de 16 px pour le contenu, pas de long paragraphe centré ou justifié.

**Images et mouvement**
- Pas de photo de banque d'images, pas de photo de bénéficiaire, pas de filtre ou surimpression sur les photos.
- Pas d'émojis comme pictogrammes ; pas d'icône décorative au-dessus des titres.
- Pas d'animation d'entrée sur chaque section, pas de défilement animé (parallaxe), pas de carrousel automatique, pas de vidéo ou son qui démarre seul.
- Pas de fenêtre surgissante, de bandeau de cookies inutile, ni d'agent conversationnel.

**Interaction**
- Pas de placeholder utilisé à la place d'un libellé.
- Pas d'information transmise par la seule couleur.
- Pas de contraste inférieur à 4,5:1 pour le texte courant.
- Pas de badge « populaire » ou « recommandé » sur les services.
- Aucune couleur, taille ou espacement écrit en dur dans un composant : uniquement les variables.

## Journal des modifications

| Date | Version | Modification | Auteur |
|---|---|---|---|
| 13/11/2026 | 0.1 | Création : palette extraite du logo, typographie, composants, mise en page de l'accueil | Développeur |
