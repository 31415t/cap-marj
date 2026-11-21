# PRD : Document d'exigences produit
**Plateforme CAP-MARJ**

| Champ | Valeur |
|---|---|
| Version du document | 0.2 |
| Statut | Brouillon, à valider avec le client |
| Dernière mise à jour | 21 novembre 2026 |
| Phases couvertes | V0 Vitrine, puis V1 (fonctionnalités de base), puis V2 |
| Documents liés | [TRD](02_TRD_Exigences_Techniques.md) · [Appflow](03_Appflow.md) · [UX/UI](04_UX_UI_Design.md) · [Backend Schema](05_Backend_Schema.md) · [Plan d'implémentation](06_Plan_Implementation.md) |
| Rôle de ce document | Source de vérité du **quoi** et du **pourquoi**. Toute évolution de périmètre commence ici. |

---

## 1. Vision et objectifs

**Vision.** Offrir au CAP-MARJ une présence en ligne professionnelle et crédible, puis lui permettre de gérer à distance ses rendez-vous, inscriptions et paiements, sans perdre le contrôle sur des données sensibles.

**Objectifs par phase.**

| Phase | Objectif | Comment on saura que c'est atteint |
|---|---|---|
| V0 Vitrine | Faire valider l'identité, les contenus et la navigation par le client, sans backend | Le client valide par écrit les textes, photos, couleurs et navigation |
| V1 | Remplacer les échanges manuels (téléphone, messages) par des parcours en ligne fiables | Un rendez-vous peut être demandé, payé (preuve), validé et confirmé avec lien Meet, sans intervention du développeur |
| V2 | Ajouter les modules à forte valeur et forte sensibilité (tests, Q/R) | Un test peut être passé, analysé par un professionnel puis publié au bénéficiaire |

**Principe directeur.** Chaque version s'emboîte dans la suivante : le contenu, les composants et le modèle de données de la V0 sont réutilisés tels quels en V1 (voir TRD, section 3).

## 2. Contexte

- **Organisation** : Centre d'Appui Psycho-Médical Jean Renold Alphonse (CAP-MARJ), fondé le 10 octobre 2017 à Port-de-Paix (département du Nord-Ouest, Haïti).
- **Identité institutionnelle** : quatre axes (santé globale, recherche intégrée, entrepreneuriat social, engagement communautaire).
- **Équipe** : 9 membres fournis (10 emplacements prévus).
- **Offre** : 5 services (consultation, évaluation et accompagnement psychologique ; accompagnement académique et universitaire ; recherche intégrée ; formation et renforcement des capacités ; engagement communautaire et développement local).
- **Coordonnées, numéro fiscal et moyens de paiement** : détenus dans le jeu de données de départ (`src/data/seed/`), pas dans ce document.

## 3. Utilisateurs et rôles

| Rôle | Description | Disponible dès |
|---|---|---|
| Visiteur | Consulte le site, lit le blog et la FAQ, contacte le centre | V0 |
| Utilisateur | Personne avec compte : réserve, paie, s'inscrit, passe un test, pose une question | V1.1 |
| Professionnel | Psychologue ou responsable de branche : gère ses disponibilités, analyse les tests, répond aux questions | V1.1 |
| Finance | Valide ou rejette les preuves de paiement | V1.1 |
| Administrateur | Gère le contenu, les rôles et les paramètres | V1.0 |

La répartition exacte des rôles est à confirmer (voir PRD-Q08). Un même compte peut cumuler plusieurs rôles.

**Publics visés** : élèves et étudiants (orientation, mémoires), adultes et familles (consultation), chercheurs et jeunes professionnels, institutions et partenaires (recherche, formation, projets communautaires).

## 4. Périmètre par version

| Version | Contenu | Sortie |
|---|---|---|
| **V0 Vitrine** | Accueil, À propos, Équipe, Services (cartes avec bouton « Nous contacter »), FAQ, Contact, mentions légales et confidentialité (brouillons). Menu avec rubriques futures marquées « Bientôt » en mode démonstration. **Aucun article de blog n'est publié en V0 ; la rubrique Blog reste masquée en production et « Bientôt » en mode démonstration (FR-PUB-06).** Aucune base de données. | Lien de prévisualisation + démonstration au client |
| **V1.0** | Connexion administrateur, contenus modifiables (services, équipe, FAQ), blog, demandes de contact enregistrées et consultables | Le client met à jour son contenu seul |
| **V1.1** | Comptes utilisateurs, disponibilités, réservation de rendez-vous, parcours de paiement par preuve, validation manuelle, lien Google Meet, courriels de confirmation et de rappel | Parcours complet d'un rendez-vous payant |
| **V1.2** | Sessions de formation et d'ateliers avec inscription, registre des mémorants (inscription, suivi de statut, export) | Registre opérationnel |
| **V2** | Tests psychologiques avec score automatique et analyse du professionnel ; rubrique Questions/Réponses mixte (publique ou privée) | Modules sensibles livrés avec revue de sécurité dédiée |

**Hors périmètre (sauf avenant)** : paiement automatisé par API (MonCash et NatCash n'en proposent pas à ce jour), application mobile native, visioconférence intégrée, notes de séance et dossiers cliniques, SMS et WhatsApp automatisés, partage de documents, forfaits et abonnements, mode sombre, site multilingue complet, espace partenaires.

## 5. Exigences fonctionnelles

Priorité : **M** = indispensable, **S** = souhaitable, **C** = optionnel. Version = première livraison.

### 5.1 Site public

| ID | Exigence | Prio | Version |
|---|---|---|---|
| FR-PUB-01 | Page d'accueil présentant le centre, ses 4 axes, ses services, un aperçu de l'équipe, la galerie de moments clés, la FAQ et les moyens de contact | M | V0 |
| FR-PUB-02 | Page À propos avec l'historique complet | M | V0 |
| FR-PUB-03 | Page Équipe : fiche courte par membre, biographie complète au clic | M | V0 |
| FR-PUB-04 | Cartes services : nom, résumé, bouton d'action. Champs optionnels (cible, inclusions, prix) affichés dès qu'ils sont renseignés | M | V0 |
| FR-PUB-05 | Bouton d'action de chaque service déduit de son type de parcours (V0 : « Nous contacter » pour tous) | M | V0 |
| FR-PUB-06 | Menu qui affiche les rubriques futures en « Bientôt » en mode démonstration et les masque en production | M | V0 |
| FR-PUB-07 | Mention « En cas d'urgence » avec les numéros du centre, **affichée uniquement sur la page Contact et sur la page de rendez-vous** (jamais dans l'en-tête ou le pied de page globaux). La phrase d'orientation générique est obligatoire ; les numéros du centre sont cliquables (`tel:`). Aucun numéro d'urgence externe n'est affiché sans confirmation écrite du client (UX-Q06). | M | V0 |
| FR-PUB-08 | Mentions légales et politique de confidentialité accessibles depuis le pied de page | M | V0 |

### 5.2 Contact

| ID | Exigence | Prio | Version |
|---|---|---|---|
| FR-CON-01 | Coordonnées cliquables (téléphone, courriel, WhatsApp si fourni) et adresse | M | V0 |
| FR-CON-02 | Formulaire de contact (nom, moyen de contact, message, service concerné) avec protection anti-spam et avertissement « ne décrivez pas votre situation personnelle ici » | M | V0 |
| FR-CON-03 | Les demandes sont enregistrées et consultables par l'équipe | M | V1.0 |

### 5.3 Comptes et accès

| ID | Exigence | Prio | Version |
|---|---|---|---|
| FR-AUT-01 | Connexion administrateur avec authentification à deux facteurs obligatoire | M | V1.0 |
| FR-AUT-02 | Création de compte utilisateur (courriel + mot de passe ou lien magique), confirmation par courriel, réinitialisation | M | V1.1 |
| FR-AUT-03 | Espace « Mon espace » : rendez-vous, paiements et statuts de l'utilisateur | M | V1.1 |
| FR-AUT-04 | Gestion des rôles par l'administrateur | M | V1.1 |

### 5.4 Contenu administrable et blog

| ID | Exigence | Prio | Version |
|---|---|---|---|
| FR-CMS-01 | Modifier services, équipe, FAQ, informations de l'organisation sans développeur | M | V1.0 |
| FR-CMS-02 | Aperçu avant publication ; ordre d'affichage modifiable | S | V1.0 |
| FR-BLG-01 | Articles avec titre, résumé, image, corps, auteur crédité, catégorie, statut (brouillon, publié, archivé) | M | V1.0 |
| FR-BLG-02 | Publication réservée à l'équipe (règle validée) ; auteur affiché par nom, sans compte | M | V1.0 |
| FR-BLG-03 | Soumission d'articles par les étudiants avec validation | C | V2+ |

### 5.5 Rendez-vous et paiement

| ID | Exigence | Prio | Version |
|---|---|---|---|
| FR-RDV-01 | Un professionnel publie ses créneaux ; un créneau ne peut pas être réservé deux fois | M | V1.1 |
| FR-RDV-02 | L'utilisateur choisit service, mode (à distance ou au centre), créneau | M | V1.1 |
| FR-RDV-03 | Service payant : réservation provisoire à durée limitée, puis paiement, puis confirmation. Service gratuit : confirmation directe | M | V1.1 |
| FR-RDV-04 | Lien Google Meet créé automatiquement à la confirmation (repli : lien saisi manuellement par le professionnel) | M | V1.1 |
| FR-RDV-05 | Annulation et report selon une politique publiée | S | V1.1 |
| FR-RDV-06 | Rappel par courriel avant le rendez-vous | S | V1.1 |
| FR-PAY-01 | Affichage des moyens de paiement actifs (MonCash, NatCash, dépôt bancaire) à l'utilisateur connecté uniquement | M | V1.1 |
| FR-PAY-02 | Envoi de la preuve (photo ou PDF) et d'une référence de transaction | M | V1.1 |
| FR-PAY-03 | Validation ou rejet motivé par le rôle Finance ; l'utilisateur est notifié | M | V1.1 |
| FR-PAY-04 | Reçu simple après validation | S | V1.1 |

### 5.6 Inscriptions

| ID | Exigence | Prio | Version |
|---|---|---|---|
| FR-INS-01 | Sessions de formation et d'ateliers (date, lieu ou lien, places, date limite) | M | V1.2 |
| FR-INS-02 | Inscription avec formulaire, paiement si frais, confirmation | M | V1.2 |
| FR-INS-03 | Registre des mémorants : candidature, statut (candidat, accepté, en cours, terminé), export CSV | M | V1.2 |

### 5.7 Tests et Questions/Réponses

| ID | Exigence | Prio | Version |
|---|---|---|---|
| FR-TST-01 | Passer un test en ligne ; réponses enregistrées une seule fois | M | V2 |
| FR-TST-02 | Score calculé automatiquement côté serveur | M | V2 |
| FR-TST-03 | Le professionnel rédige son interprétation ; le résultat n'est visible par la personne qu'après publication | M | V2 |
| FR-QR-01 | La personne pose une question et choisit public ou privé | M | V2 |
| FR-QR-02 | Un professionnel répond ; les questions publiques passent par modération avant affichage | M | V2 |

## 6. Règles métier validées ou retenues par défaut

| ID | Règle | Origine |
|---|---|---|
| RM-01 | Chaque service a un type de parcours (`request`, `appointment`, `registration`, `test`) qui détermine son bouton et son flux | Décision de conception |
| RM-02 | Paiement uniquement par preuve : MonCash, NatCash, dépôt SOCEM ou KOPLES. Validation manuelle | Client |
| RM-03 | Le résultat d'un test n'est visible qu'après l'analyse du professionnel | **Client (validé)** |
| RM-04 | Questions/Réponses mixte : l'auteur choisit public ou privé | **Client (validé)** |
| RM-05 | Blog : publication par l'équipe uniquement ; travaux d'étudiants reçus par courriel | **Client (validé)** |
| RM-06 | Modération des questions publiques activée ; auteur affiché anonymement | Défaut, à confirmer (PRD-Q15) |
| RM-07 | Aucune donnée clinique n'est stockée en V1 | Défaut de sécurité |
| RM-08 | Les numéros de paiement ne sont visibles qu'après connexion, dans le parcours de paiement | Défaut de sécurité |
| RM-09 | Un rendez-vous payant n'est jamais confirmé avant validation de la preuve | Décision de conception |
| RM-10 | Aucun service d'urgence n'est assuré en ligne ; la mention d'urgence est permanente sur les pages concernées | Défaut de sécurité |
| RM-11 | Les mineurs ne créent pas de compte ; un responsable légal réserve pour eux | Défaut, à valider juridiquement (PRD-Q12) |
| RM-12 | La mention d'urgence ne figure que sur les pages Contact et Rendez-vous, jamais dans le pied de page global ; elle ne remplace pas un service d'urgence et le dit explicitement | Décision de conception (phase C3) |

### Tarification (décision du 21/11/2026, ex-PRD-Q05)

Les tarifs **varient selon la situation de la personne** ; aucun prix fixe n'est publié. En V0, le pied de page et les fiches service orientent vers le contact direct. En V1.1, le champ `price_note` (texte libre, ex. « Tarif adapté à la situation, nous consulter ») est utilisé à la place de `price_amount` pour les services concernés ; `price_amount` reste utilisé pour les services à tarif fixe (ex. frais d'inscription à une session). Devise : gourdes (HTG) par défaut ; dollars (USD) possible par service.

## 7. Inventaire des contenus reçus

| Élément | État | Action nécessaire |
|---|---|---|
| Identité (nom, courriel, téléphones, adresse, date de création, numéro fiscal) | Reçu | Confirmer la graphie officielle du nom (PRD-Q01) |
| Logo | **Fourni en WebP (`capmarjlogo.webp`), utilisé dans l'en-tête et le pied de page** | Obtenir si possible la version vectorielle ou PNG haute définition (UX-Q01, non bloquant) |
| Historique | Reçu | Corriger l'incohérence « quatre axes » / trois listés (PRD-Q03) |
| Équipe | 9 présentations reçues, formats inégaux (de 1 ligne à un CV complet) | Normaliser en titre, rôle, résumé, biographie |
| Photos équipe et moments clés | Liens Drive | Télécharger, vérifier la qualité, obtenir les consentements (PRD-Q18) |
| Services | 5 descriptions en paragraphes | Compléter cible, inclusions, prix, payant ou gratuit (PRD-Q06) — la tarification variable est tranchée (voir §6) |
| Moyens de paiement | 3 canaux reçus | Aucune, à saisir dans la configuration |
| Décisions de la section 6 | 4 sur 6 reçues | Modération et anonymat du Q/R manquants (PRD-Q15) |
| FAQ | 5 questions, **réponses à vérifier dans `faq.json` (non confirmées par le journal)** | Réécrire avec de vraies questions pratiques (PRD-Q17) |
| Mentions légales, confidentialité | À rédiger | Brouillon par nous, relecture par les juristes du centre |
| Horaires, réseaux sociaux, nom de domaine | Non reçus | Voir PRD-Q19 et TRD-Q01 |

## 8. Critères d'acceptation de la V0

1. Toutes les pages listées en 4 sont accessibles, sans lien mort, en français correct et sans texte factice.
2. Le contenu affiché provient exclusivement du jeu de données de départ, validé par le client.
3. Affichage correct à 360 px, 768 px et 1280 px de largeur.
4. Contrastes conformes WCAG 2.1 AA, navigation clavier complète, textes alternatifs sur les images.
5. Formulaire de contact fonctionnel avec protection anti-spam (en prévisualisation, envoi vers l'adresse du développeur).
6. Aucun secret dans le dépôt ni dans le code client.
7. Performance : page d'accueil chargée en moins de 2,5 s au plus gros élément visible sur connexion mobile moyenne, mesurée par Lighthouse.
8. Le client a validé par écrit : couleurs et typographie, textes, photos, navigation.

## 9. Risques et hypothèses

| Risque | Impact | Parade |
|---|---|---|
| Contenus incomplets ou tardifs (prix, inclusions, FAQ) | Retard V1.1 | La V0 ne dépend d'aucun de ces éléments ; collecte parallèle |
| Photos de faible qualité | Rendu amateur | Sélection ensemble avec le client ; recadrage ; demande de nouvelles photos si besoin |
| Preuves de paiement falsifiables | Perte financière | Validation manuelle, référence de transaction obligatoire, journal d'audit |
| Création du lien Meet automatique complexe avec un compte Gmail | Retard V1.1 | Repli manuel prévu dès le départ (TRD-Q04) |
| Données de santé mal protégées | Atteinte à la confidentialité | Règles de sécurité du TRD, aucun dossier clinique en V1, revue avant V2 |
| Droits sur les tests psychométriques | Risque juridique | N'intégrer que des tests dont le centre détient les droits (PRD-Q14) |
| Élargissement progressif du périmètre | Dérive de coût | Tout ajout passe par ce document et par un avenant |

**Hypothèses** : le site est en français ; le centre fournit les contenus ; le client valide chaque phase par écrit avant la suivante ; les comptes d'hébergement sont ouverts au nom du client.

## 10. Informations manquantes

*(PRD-Q05 a été résolu le 21/11/2026 et reporté au §6 ; voir journal des modifications.)*

| Réf | Information manquante | Question à poser au client | Réponse par défaut (suggestion) | Bloque |
|---|---|---|---|---|
| PRD-Q01 | Graphie officielle du nom | « PsychoMédical » (formulaire) ou « Psycho-Médical » (logo) ? | Centre d'Appui Psycho-Médical Jean Renold Alphonse (CAP-MARJ), comme sur le logo | V0 |
| PRD-Q02 | Lien entre axes, branches et services | Les 4 axes et les branches (Santé mentale, Recherche, Affaires sanitaires…) sont-ils la même chose ? | Axes = identité (accueil) ; branches = organisation interne (page Équipe) ; services = offre | V0 |
| PRD-Q03 | Quatrième axe absent du texte du fondateur | Le texte doit-il lister les quatre axes ? | Oui, corriger pour lister les quatre | V0 |
| PRD-Q04 | Langues du site | Français seul, ou aussi créole ? | Français seul ; structure prête pour d'autres langues sans traduction | V0 |
| PRD-Q06 | Cible, inclusions, payant ou gratuit par service | Voir tableau pré-rempli ci-dessous | Tableau pré-rempli par nous, corrigé par le client | V1.1 |
| PRD-Q07 | Sens de « devenir membre » | Membre de quoi : bénéficiaire, mémorant, abonné ? | Pas de statut « membre » ; un simple compte utilisateur ; « mémorant » = type d'inscription (V1.2) | V1.1 |
| PRD-Q08 | Répartition des rôles | Qui valide les paiements, répond au Q/R, analyse les tests, gère le contenu ? | Administrateur = fondateur ; Finance = responsable logistique et financier ; Professionnel = psychologues et coordonnateurs | V1.0 |
| PRD-Q09 | Règles de rendez-vous | Durée, disponibilités, annulation, présentiel ou distance ? | 60 min par défaut ; créneaux saisis par chaque professionnel ; annulation gratuite jusqu'à 24 h avant ; distance (Meet) et présentiel | V1.1 |
| PRD-Q10 | Délais autour du paiement | Combien de temps garder un créneau en attente de preuve ? | 24 h pour envoyer la preuve ; ensuite bloqué jusqu'à décision ; objectif de validation : 24 h ouvrées | V1.1 |
| PRD-Q11 | Remboursement et annulation d'un rendez-vous payé | Quelle politique ? | Pas de remboursement automatique ; décision au cas par cas par Finance ; politique publiée | V1.1 |
| PRD-Q12 | Mineurs | Élèves de 15 à 17 ans : qui réserve ? | Comptes réservés aux 18 ans et plus ; réservation par un responsable légal | V1.1 |
| PRD-Q13 | Conservation et accès aux données | Durée de conservation ? Qui a accès à quoi ? | Données administratives uniquement en V1 ; durée à fixer avec les juristes du centre | V1.1 |
| PRD-Q14 | Tests à intégrer | Quels tests ? Quels droits d'usage ? Quelle grille de score ? | Un seul test pilote fourni par le centre, avec grille écrite et droits confirmés | V2 |
| PRD-Q15 | Modération et anonymat du Q/R (non répondus au formulaire) | Valider les questions publiques avant affichage ? Afficher le nom de l'auteur ? | Modération activée ; auteur anonyme ; questions privées réservées au professionnel | V2 |
| PRD-Q16 | Blog : rubriques, rythme, droits | Quelles rubriques ? Qui rédige, à quelle fréquence ? Autorisation pour les travaux d'étudiants ? | Rubriques Actualités, Articles professionnels, Travaux d'étudiants ; autorisation écrite obligatoire pour ces derniers | V1.0 |
| PRD-Q17 | FAQ | Quelles sont les vraies questions des visiteurs ? | 8 questions pratiques rédigées par nous (tarifs, déroulement, confidentialité, prise de rendez-vous, urgences, paiement) ; le client valide | V0 |
| PRD-Q18 | Consentement et droits photo | Les personnes photographiées ont-elles consenti à la publication ? | Seules les photos de l'équipe et d'activités avec consentement ; aucune photo de bénéficiaire | V0 |
| PRD-Q19 | Horaires, réseaux sociaux | Quels horaires et quels comptes afficher ? | Adresse, téléphones et courriel uniquement tant qu'on n'a rien d'autre | V0 |
| PRD-Q20 | Partage de documents (liste initiale, absent de la liste validée) | Toujours souhaité ? | Hors périmètre V1 ; à réévaluer après V2 | V2 |
| PRD-Q21 | Champs du registre des mémorants | Quelles informations collecter ? | Nom, prénom, courriel, téléphone, université, filière, niveau, thème de mémoire, statut | V1.2 |
| PRD-Q22 | Calendrier souhaité | Date de présentation et de lancement visées ? | Démonstration V0 dans les 3 semaines suivant la réception des contenus complémentaires | V0 |

**Tableau pré-rempli des services (PRD-Q06), à valider :**

| Service | Parcours proposé | Cible proposée | Payant ? |
|---|---|---|---|
| 1. Consultation, évaluation et accompagnement psychologique | `appointment` | Enfants, adolescents, adultes, familles, personnes en situation de vulnérabilité | Payant — **tarification variable (voir §6)** |
| 2. Accompagnement académique et universitaire | `registration` (rendez-vous d'orientation possible) | Élèves, étudiants, chercheurs, jeunes professionnels | À confirmer (frais d'inscription ?) |
| 3. Recherche intégrée et expertise scientifique | `request` | Institutions, organisations, chercheurs | Sur devis |
| 4. Formation et renforcement des capacités | `registration` (sessions) | Professionnels, étudiants, institutions, acteurs communautaires | Selon la session |
| 5. Engagement communautaire et développement local | `request` | Communautés, acteurs locaux, partenaires | Sur demande |

## 11. Les interdits

**Sur le contenu et la communication**
- Ne promettre aucun résultat ni guérison ; aucune formule du type « services efficaces » sans preuve. La question de FAQ « Pourquoi vos services sont-ils si efficaces ? » est à reformuler.
- Ne publier aucun témoignage, photo de bénéficiaire ou travail d'étudiant sans consentement écrit.
- Ne jamais utiliser de texte factice (lorem ipsum) ni de photos de banque d'images présentées comme celles du centre.
- Ne jamais inventer de chiffres (nombre de bénéficiaires, années d'expérience, statistiques).
- Ne publier aucun texte institutionnel rédigé par nous sans validation écrite du client.

**Sur les fonctionnalités**
- Aucun bouton « Payer en ligne » ou équivalent laissant croire à un paiement instantané : le paiement se fait par preuve.
- Aucun lien de menu mort en production : une rubrique non prête est masquée.
- Aucun diagnostic automatique ni interprétation automatique de test.
- Aucun score affiché avant l'analyse du professionnel.
- Aucune donnée clinique stockée en V1.
- Aucune fonctionnalité hors périmètre ajoutée sans mise à jour de ce document et avenant au devis.

**Sur les données**
- Ne jamais afficher les numéros de paiement hors du parcours de paiement connecté.
- Ne jamais envoyer d'information de santé par courriel ou message ; les notifications restent neutres.

**Sur la gouvernance documentaire (nouveau)**
- Ne jamais modifier un document de base (01 à 06) dans le même geste qu'une implémentation, sans entrée de journal dédiée (voir doc 06 §11). Un changement de PRD exige une ligne au journal des modifications, avec date, version, citation avant/après et validation écrite du client.

## 12. Glossaire

| Terme | Sens |
|---|---|
| Parcours | Suite d'étapes déclenchée par le bouton d'action d'un service |
| Preuve de paiement | Photo ou PDF du reçu de transfert ou de dépôt, accompagné d'une référence |
| Mémorant | Étudiant en cours de mémoire de fin d'études, accompagné par le centre |
| Mode démonstration | Configuration où les rubriques futures sont visibles en « Bientôt » |
| Seed | Jeu de données de départ, identique en forme aux futures tables |

## Journal des modifications

| Date | Version | Modification | Auteur |
|---|---|---|---|
| 13/11/2026 | 0.1 | Création à partir des réponses au formulaire et des décisions de cadrage | Développeur |
| 21/11/2026 | 0.2 | Intégration des décisions de la phase C : mention d'urgence limitée aux pages Contact et Rendez-vous (FR-PUB-07 précisé, RM-12 ajouté) ; tarification variable (ex-PRD-Q05, reportée au §6) ; précision sur le blog (aucun article publié en V0) ; logo WebP signalé comme fourni ; règle de gouvernance documentaire ajoutée aux interdits | Développeur |