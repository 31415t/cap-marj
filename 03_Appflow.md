# Appflow : parcours utilisateurs et flux
**Plateforme CAP-MARJ**

| Champ | Valeur |
|---|---|
| Version du document | 0.1 |
| Statut | Brouillon, à valider avec le client |
| Dernière mise à jour | 13 novembre 2026 |
| Phases couvertes | V0 Vitrine, V1.0 à V1.2, V2 |
| Documents liés | [PRD](01_PRD_Exigences_Produit.md) · [TRD](02_TRD_Exigences_Techniques.md) · [UX/UI](04_UX_UI_Design.md) · [Backend Schema](05_Backend_Schema.md) · [Plan](06_Plan_Implementation.md) |
| Rôle de ce document | Décrit **ce qui se passe, écran par écran et statut par statut**. Les diagrammes utilisent Mermaid (affichage natif sur GitHub et la plupart des éditeurs Markdown). |

Légende : trait plein = disponible dans la version indiquée ; trait pointillé = rubrique prévue, pas encore livrée.

---

## 1. Plan du site

```mermaid
flowchart TD
  H["Accueil"] --> A["À propos : historique"]
  H --> E["Équipe"]
  H --> S["Services"]
  H --> F["FAQ"]
  H --> C["Contact"]
  H --> L["Mentions légales"]
  H --> P["Confidentialité"]
  H -.-> B["Blog : V1.0"]
  H -.-> T["Passer un test : V2"]
  H -.-> Q["Questions et réponses : V2"]
  H -.-> M["Mon espace : V1.1"]
  M -.-> M1["Mes rendez-vous"]
  M -.-> M2["Mes paiements"]
  M -.-> M3["Mes résultats : V2"]
  S -.-> R1["Réserver : V1.1"]
  S -.-> R2["S'inscrire : V1.2"]
  AD["Administration : V1.0"] -.-> AD1["Contenus"]
  AD -.-> AD2["Demandes reçues"]
  AD -.-> AD3["Paiements à valider : V1.1"]
  AD -.-> AD4["Disponibilités : V1.1"]
  AD -.-> AD5["Registre des mémorants : V1.2"]
```

Il n'existe pas de page « Payer un service » isolée : le paiement fait partie du parcours de réservation ou d'inscription, et l'état des paiements se consulte dans « Mon espace ». Cette décision est proposée pour éviter qu'une personne paie sans avoir réservé.

## 2. Menu principal selon le mode

| Rubrique | V0 démonstration | V0 production | Activée en |
|---|---|---|---|
| Le centre (À propos, Équipe) | Visible | Visible | V0 |
| Services | Visible | Visible | V0 |
| FAQ | Visible | Visible | V0 |
| Contact | Visible | Visible | V0 |
| Blog | « Bientôt » | Masqué | V1.0 |
| Passer un test | « Bientôt » | Masqué | V2 |
| Questions et réponses | « Bientôt » | Masqué | V2 |
| Se connecter | « Bientôt » | Masqué | V1.1 |
| Bouton principal | Nous contacter | Nous contacter | Devient Prendre rendez-vous en V1.1 |

Une rubrique « Bientôt » n'est pas cliquable et ne mène à aucune page vide.

## 3. V0 : le visiteur contacte le centre

```mermaid
sequenceDiagram
  actor V as Visiteur
  participant W as Site
  participant API as Fonction contact
  participant T as Turnstile
  participant R as Resend
  V->>W: Remplit le formulaire
  W->>W: Valide les champs
  W->>API: Envoie les données et le jeton anti-spam
  API->>T: Vérifie le jeton
  T-->>API: Valide ou refuse
  alt jeton valide
    API->>R: Envoie le courriel à l'équipe
    API-->>W: Accusé de réception
    W-->>V: Message de confirmation
  else jeton refusé
    API-->>W: Refus
    W-->>V: Erreur claire et nouvel essai possible
  end
```

**Écran Contact** : coordonnées cliquables, adresse, mention d'urgence, formulaire (nom, moyen de contact, service concerné, message), avertissement de confidentialité. Un visiteur qui arrive depuis une carte service voit le service déjà sélectionné.

**V1.0** : la même fonction enregistre aussi la demande dans la base ; l'équipe la consulte dans l'administration avec un statut (nouvelle, en cours, traitée, archivée).

## 4. Le bouton d'action d'un service

```mermaid
flowchart TD
  CTA["Bouton de la carte service"] --> W{"Type de parcours"}
  W -->|"request"| R1["Formulaire de demande"]
  W -->|"appointment"| A0{"Connecté ?"}
  W -->|"registration"| I0{"Connecté ?"}
  W -->|"test"| T0{"Connecté ?"}
  A0 -->|"Non"| LOG["Connexion ou création de compte"]
  I0 -->|"Non"| LOG
  T0 -->|"Non"| LOG
  LOG --> RET["Retour à l'étape demandée"]
  A0 -->|"Oui"| A1["Parcours rendez-vous, section 6"]
  I0 -->|"Oui"| I1["Parcours inscription, section 7"]
  T0 -->|"Oui"| T1["Parcours test, section 8"]
  RET --> A1
```

| Type | Libellé du bouton | Disponible |
|---|---|---|
| `request` | Nous contacter | V0 |
| `appointment` | Prendre rendez-vous | V1.1 |
| `registration` | S'inscrire | V1.2 |
| `test` | Commencer le test | V2 |

En V0, tous les services sont de type `request`. Passer un service à un autre type en V1 se fait en modifiant sa fiche, sans changer l'interface.

## 5. Compte et accès (V1.0 et V1.1)

```mermaid
flowchart TD
  S0["Créer un compte"] --> S1["Courriel et mot de passe"]
  S1 --> S2["Courriel de confirmation"]
  S2 --> S3["Lien cliqué : compte activé"]
  S3 --> S4["Complète nom et téléphone"]
  S4 --> S5["Retour à la page d'origine"]
  L0["Se connecter"] --> L1{"Identifiants valides ?"}
  L1 -->|"Non"| L2["Message générique, nouvel essai"]
  L1 -->|"Oui"| L3{"Rôle administrateur ou Finance ?"}
  L3 -->|"Oui"| L4["Code de double authentification"]
  L3 -->|"Non"| L5["Mon espace"]
  L4 --> L6["Administration"]
  R0["Mot de passe oublié"] --> R1["Message identique, que le compte existe ou non"]
  R1 --> R2["Lien de réinitialisation envoyé si le compte existe"]
```

## 6. Rendez-vous (V1.1)

```mermaid
flowchart TD
  A["Choix du service"] --> B["Choix du mode : à distance ou au centre"]
  B --> C["Choix du professionnel et du créneau"]
  C --> D["Récapitulatif : service, créneau, prix"]
  D --> E{"Service payant ?"}
  E -->|"Non"| K["Rendez-vous confirmé"]
  E -->|"Oui"| F["Créneau retenu pendant 24 h"]
  F --> G["Page de paiement : moyens, montant, code de réservation"]
  G --> H["La personne paie hors du site"]
  H --> I["Dépose la preuve et la référence de transaction"]
  I --> J["Finance examine la preuve"]
  J --> J1{"Décision"}
  J1 -->|"Validée"| K
  J1 -->|"Rejetée avec motif"| J2["Nouvelle preuve possible avant la fin du délai"]
  J2 --> I
  F -.->|"Aucune preuve dans le délai"| X["Créneau libéré, rendez-vous expiré"]
  K --> M["Lien Meet créé ou saisi par le professionnel"]
  M --> N["Courriels de confirmation puis rappel"]
```

**Statuts du rendez-vous**

```mermaid
stateDiagram-v2
  state "En attente de paiement" as pending_payment
  state "Preuve soumise" as proof_submitted
  state "Confirmé" as confirmed
  state "Réalisé" as completed
  state "Annulé" as cancelled
  state "Expiré" as expired
  state "Absent" as no_show
  [*] --> pending_payment: Service payant
  [*] --> confirmed: Service gratuit
  pending_payment --> proof_submitted: Preuve envoyée
  pending_payment --> expired: Délai dépassé
  pending_payment --> cancelled: Annulation
  proof_submitted --> confirmed: Paiement validé
  proof_submitted --> pending_payment: Preuve rejetée
  confirmed --> completed: Séance tenue
  confirmed --> no_show: Absence
  confirmed --> cancelled: Annulation
```

**Statuts du paiement**

```mermaid
stateDiagram-v2
  state "En attente de preuve" as awaiting_proof
  state "Preuve soumise" as proof_submitted
  state "Validé" as validated
  state "Rejeté" as rejected
  state "Remboursé" as refunded
  [*] --> awaiting_proof
  awaiting_proof --> proof_submitted: Preuve envoyée
  proof_submitted --> validated: Finance valide
  proof_submitted --> rejected: Finance rejette avec motif
  rejected --> proof_submitted: Nouvelle preuve
  validated --> refunded: Remboursement décidé par Finance
```

**Règles**
1. Le créneau est réservé pour la durée du délai (24 h par défaut) ; deux personnes ne peuvent jamais retenir le même créneau.
2. Un rendez-vous payant n'est **jamais** confirmé avant la validation de la preuve.
3. Les numéros de paiement ne sont montrés qu'à une personne connectée ayant une réservation en attente.
4. Chaque décision de Finance enregistre l'auteur, la date et le motif.
5. Le lien Meet n'est créé qu'à la confirmation ; si la création automatique échoue, le professionnel est alerté et peut coller un lien.
6. Un rendez-vous concernant un mineur est réservé par un responsable légal, avec une case dédiée (PRD-Q12).

## 7. Inscriptions et registre des mémorants (V1.2)

```mermaid
flowchart TD
  A["Choix d'une session ou du programme de mémorants"] --> B["Connexion"]
  B --> C["Formulaire d'inscription"]
  C --> D{"Frais d'inscription ?"}
  D -->|"Oui"| E["Parcours de paiement, section 6"]
  D -->|"Non"| F["Inscription enregistrée"]
  E --> F
  F --> G{"Type"}
  G -->|"Session ou atelier"| H["Confirmation avec date, lieu ou lien"]
  G -->|"Mémorant"| I["Examen de la candidature par un responsable"]
  I --> J{"Décision"}
  J -->|"Acceptée"| K["Ajout au registre : en cours"]
  J -->|"Refusée"| L["Notification neutre"]
  K --> M["Statut mis à jour jusqu'à : terminé"]
```

Le registre est consultable par les rôles autorisés, avec recherche, filtre par statut et export CSV.

## 8. Test psychologique (V2)

```mermaid
stateDiagram-v2
  state "En cours" as in_progress
  state "Soumis" as submitted
  state "En analyse" as under_review
  state "Résultat publié" as released
  [*] --> in_progress: Début du test
  in_progress --> submitted: Réponses envoyées, une seule fois
  submitted --> under_review: Score calculé côté serveur
  under_review --> released: Professionnel rédige et publie son interprétation
  released --> [*]
```

- Avant la publication, la personne voit uniquement : « Vos réponses sont enregistrées. Vous serez prévenu(e) quand votre résultat sera disponible. »
- La notification de publication est neutre ; le détail s'affiche dans « Mon espace ».
- Le score brut n'apparaît nulle part côté personne avant la publication (RM-03).

## 9. Questions et réponses (V2)

```mermaid
flowchart TD
  A["La personne écrit sa question"] --> B{"Visibilité choisie"}
  B -->|"Privée"| C["Question visible de l'auteur et des professionnels"]
  B -->|"Publique"| D["Question visible des professionnels seulement, en attente"]
  C --> E["Un professionnel répond"]
  D --> E
  E --> F{"Privée ?"}
  F -->|"Oui"| G["Réponse visible de l'auteur, notification neutre"]
  F -->|"Non"| H["Modération par un responsable"]
  H --> I{"Décision"}
  I -->|"Approuvée"| J["Publiée, auteur anonyme par défaut"]
  I -->|"Refusée"| K["Reste privée, l'auteur est informé"]
```

Une question publique n'apparaît jamais sur le site avant sa réponse et sa modération. Un message rappelle à l'auteur de ne pas y mettre d'information personnelle.

## 10. Blog et contenu (V1.0)

```mermaid
flowchart TD
  A["Administrateur crée un article"] --> B["Brouillon"]
  B --> C["Aperçu"]
  C --> D{"Prêt ?"}
  D -->|"Non"| B
  D -->|"Oui"| E["Publié : visible de tous"]
  E --> F["Archivé si retiré"]
  G["Texte d'étudiant reçu par courriel"] --> H["Autorisation écrite jointe"]
  H --> A
```

L'auteur est un nom affiché, pas un compte. Le statut « en révision » est prévu dans la base pour une soumission future par les étudiants (FR-BLG-03).

## 11. Notifications

| Événement | Destinataire | Canal | Contenu |
|---|---|---|---|
| Demande de contact reçue | Équipe | Courriel | Nom, service concerné, message |
| Compte créé | Utilisateur | Courriel | Lien de confirmation |
| Réservation retenue | Utilisateur | Courriel | Code de réservation, heure limite pour la preuve |
| Preuve soumise | Finance | Courriel | Lien vers l'administration |
| Paiement validé ou rejeté | Utilisateur | Courriel | Statut et motif éventuel, sans détail de santé |
| Rendez-vous confirmé | Utilisateur et professionnel | Courriel | Date, heure, mode, lien Meet |
| Rappel | Utilisateur | Courriel | 24 h avant |
| Résultat publié | Utilisateur | Courriel | « Un document est disponible dans votre espace » |

Aucune notification ne contient d'information de santé.

## 12. États standard

| Situation | Ce que dit l'interface | Action proposée |
|---|---|---|
| Liste vide (ex. aucun rendez-vous) | « Vous n'avez pas encore de rendez-vous. » | Bouton « Prendre rendez-vous » |
| Chargement | Indicateur de squelette de page | n/a |
| Erreur réseau | « La connexion a été interrompue. Vos informations n'ont pas été envoyées. » | Bouton « Réessayer » |
| Erreur de saisie | Message sous le champ, précisant le format attendu | Correction en place |
| Accès refusé | « Cette page est réservée à l'équipe. » | Lien vers l'accueil ou la connexion |
| Page introuvable | « Cette page n'existe pas ou a été déplacée. » | Liens vers l'accueil et les services |
| Créneau pris entre-temps | « Ce créneau vient d'être réservé. Choisissez-en un autre. » | Retour à la liste des créneaux |

Chaque erreur dit ce qui s'est passé et ce qu'il faut faire ensuite.

## 13. Informations manquantes

| Réf | Information manquante | Question à poser au client | Réponse par défaut (suggestion) | Bloque |
|---|---|---|---|---|
| FLW-Q01 | Réservation sans compte | Une personne peut-elle réserver sans créer de compte ? | Non : compte obligatoire (suivi des paiements, sécurité) | V1.1 |
| FLW-Q02 | Mode de connexion | Mot de passe ou lien envoyé par courriel ? | Courriel et mot de passe, avec réinitialisation | V1.1 |
| FLW-Q03 | Délai d'examen d'une preuve | En combien de temps Finance répond-elle ? | 24 h ouvrées ; rappel automatique à Finance au-delà | V1.1 |
| FLW-Q04 | Preuve rejetée | La personne peut-elle renvoyer une preuve ? | Oui, tant que le délai de réservation n'est pas écoulé | V1.1 |
| FLW-Q05 | Annulation | Qui peut annuler et jusqu'à quand ? | Utilisateur jusqu'à 24 h avant ; professionnel à tout moment avec motif ; notification dans les deux cas | V1.1 |
| FLW-Q06 | Candidature de mémorant | Faut-il une validation avant l'ajout au registre ? | Oui, par un responsable désigné | V1.2 |
| FLW-Q07 | Sessions complètes | Liste d'attente ? | Non : inscriptions closes quand la session est complète | V1.2 |
| FLW-Q08 | Rendez-vous pour un enfant | Quelles informations demander ? | Case « concerne un mineur » et prénom de l'enfant, rien d'autre | V1.1 |
| FLW-Q09 | Langue des notifications | Français seulement ? | Français | Non bloquant |

## 14. Les interdits

**Navigation**
- Aucune impasse : chaque écran, y compris les erreurs, propose une action suivante.
- Aucun lien mort ni rubrique vide visible en production.
- Aucun libellé de bouton variable pour une même action : une action garde son nom sur tout le parcours (« Prendre rendez-vous » donne « Rendez-vous demandé »).

**Sécurité des parcours**
- Ne jamais indiquer si une adresse courriel possède déjà un compte (connexion, réinitialisation, inscription).
- Ne jamais accepter une redirection vers une adresse externe après la connexion.
- Ne jamais exposer l'identifiant d'un objet d'autrui : l'accès se vérifie côté serveur, pas par le secret de l'URL.
- Ne jamais afficher les moyens de paiement à une personne non connectée ou sans réservation en attente.
- Ne jamais autoriser un envoi de formulaire illimité : anti-spam et limitation de débit partout.

**Règles métier**
- Ne jamais confirmer un rendez-vous payant sans validation de la preuve.
- Ne jamais réserver un créneau sans verrou de durée limitée.
- Ne jamais publier une question, un résultat ou un article sans l'étape de validation prévue.
- Ne jamais effectuer une action irréversible (annulation, rejet de paiement, suppression) sans confirmation explicite.
- Ne jamais envoyer d'information de santé dans une notification.

## Journal des modifications

| Date | Version | Modification | Auteur |
|---|---|---|---|
| 13/11/2026 | 0.1 | Création | Développeur |
