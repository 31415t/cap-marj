# Journal d'implémentation — Plateforme CAP-MARJ

| Champ | Valeur |
|---|---|
| Rôle | Trace du **fait** : ce qui a été réalisé, les écarts avec les six documents de base, l'état vérifiable du dépôt |
| Ne remplace pas | PRD (quoi/pourquoi) · TRD (comment) · Appflow (écrans/statuts) · UX/UI (apparence) · Backend Schema (données) · Plan (quand/ordre) |
| Convention | Une entrée par phase close ; jamais de réécriture d'une entrée passée ; les écarts sont obligatoires |
| Documents liés | 01_PRD… à 06_Plan… |

## Sommaire des phases
| ID | Titre | Statut | Date |
|---|---|---|---|
| 1.1 | Fondations techniques | Terminé | 2026-11-… |
| 1.2a | Contrats, seed, adaptateur mock | Terminé | 2026-11-… |
| ... | ... | ... | ... |

## [1.1 + 1.2a + 1.2b] — Fondations techniques et socle de données — 2026-11-20

**Statut** : Terminé
**Durée réelle** : non mesurée
**Documents de référence** : TRD §2 (stack), §3 (architecture), §4 (structure), §5 (config), §10 (qualité) ; UX/UI §4 (tokens), §5 (typographie) ; Backend Schema §11 (correspondance seed)

**Objectif de la phase**
Disposer d'un dépôt qui build en SSG, valide ses contrats de données, et expose un système visuel de base utilisable par toutes les pages V0.

**Réalisé**
- Dépôt initialisé : React 19.3.1, React DOM 19.3.1, Vite 8.3.8, TypeScript 6.0.3 strict, `vite-react-ssg@0.9.2`, `react-router-dom@6.30.6`, Tailwind CSS 4.3.5 (`@tailwindcss/vite`), Fontsource (`@fontsource-variable/literata@5.3.0`, `@fontsource-variable/public-sans@5.3.0`), Zod 4.6.7, Vitest 5.1.1.
- Point d'entrée SSG (`src/main.tsx` exporte `createRoot = ViteReactSSG({ routes })`), table de routes minimale (`src/App.tsx`).
- Build SSG vérifié : `dist/index.html` contient `data-server-rendered="true"` et le contenu pré-rendu.
- Contrats Zod dans `src/data/contracts/` : `common`, `service`, `organisation`, `axe`, `teamMember`, `faq`, `index`.
- Seed JSON dans `src/data/seed/` : `organisation.json`, `axes.json` (4), `equipe.json` (9), `services.json` (5), `faq.json` (5).
- Port `ContentRepository` + adaptateur mock (`src/data/ports/content.ts`, `src/data/adapters/mock/content.ts`) + `src/data/index.ts` avec bascule `VITE_DATA_SOURCE`.
- Config : `src/config/features.ts` (interrupteurs TRD §5), `src/config/site.ts`.
- Tokens de design (`src/shared/styles/tokens.css`) et mapping Tailwind (`src/index.css`, `@theme inline`).
- Page `/dev/design` (dev uniquement) montrant boutons, champs, badge, fiche service.
- Tests Vitest : 8 tests sur les contrats et le seed (positions uniques, slugs valides, tous les services en `request`), dans `src/data/contracts/__tests__/contracts.test.ts`.
- `index.html` : `lang="fr"`, titre « CAP-MARJ ».

**Écarts par rapport aux documents de base**
| Réf. document | Prévu | Réalisé | Raison |
|---|---|---|---|
| TRD §2 | « React 18 + Vite » | React 19.3.1 + Vite 8.3.8 | `vite-react-ssg@0.9.2` supporte React 19 ; rétrogradation en React 18 testée puis annulée |
| TRD §2 | « React Router » (sans version) | `react-router-dom@6.30.6` | `vite-react-ssg` déclare `peerOptional ^6.14.1` ; la v7 casse l'installation |
| TRD §2 | Tailwind CSS (sans version) | Tailwind CSS 4.3.5 (`@tailwindcss/vite`) | v4 compatible Vite 8, configuration CSS-first (`@theme inline`) |
| TRD §2 | Polices auto-hébergées WOFF2 | Fontsource (`@fontsource-variable/*@5.3.0`) | Auto-hébergement assuré par npm, aucune requête tierce ; poids à vérifier au build |
| TRD §3.1 | `ServiceSchema.id: z.string().uuid()` | Seed avec UUID valides | Respect strict du contrat ; les IDs lisibles (`service-01`) ont été remplacés |
| TRD §7 / ADR-001 | « pré-rendu statique à valider par un court essai en V0 » | `vite-react-ssg` adopté dès le départ | Décision client : SEO fondamental, pré-rendu retenu |
| UX/UI §5 | « 2 familles, ≤ 100 Ko » | À vérifier | Poids des polices variables non encore mesuré au build |

**Décisions prises**
- `vite-react-ssg` + React Router v6 + React 19 : combinaison retenue → à reporter dans TRD §2 et ADR-001.
- Tailwind v4 (et non v3) : à reporter dans TRD §2.
- Fontsource pour l'auto-hébergement : à reporter dans TRD §2 et §7.
- Ne pas utiliser `overrides` pour `react-helmet-async` (faux conflit, build OK) : journal seulement.
- Convention contrat au singulier / seed au pluriel (sauf `organisation.json` et `equipe.json`) : journal seulement.

**Fichiers créés / modifiés / supprimés**
- Créés : `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/shared/styles/tokens.css`, `src/data/contracts/*.ts` (7 fichiers), `src/data/seed/*.json` (5 fichiers), `src/data/ports/content.ts`, `src/data/adapters/mock/content.ts`, `src/data/index.ts`, `src/config/features.ts`, `src/config/site.ts`, `src/features/dev/DesignPage.tsx`, `src/data/contracts/__tests__/contracts.test.ts`.
- Modifiés : `package.json` (scripts `dev`/`build`/`test`, dépendances), `vite.config.ts` (plugin Tailwind), `tsconfig.app.json` (`resolveJsonModule`), `index.html` (`lang="fr"`, titre).
- Supprimés : aucun.

**Vérifications**
- `npm run test` : 8 passed.
- `npm run build` : OK, `dist/index.html` pré-rendu.
- `npm run dev` : page `/dev/design` affiche les styles attendus (bouton vert, polices, tokens).
- Alerte VS Code `Unknown at rule @theme` : faux positif, à ignorer (extension Tailwind IntelliSense + `files.associations` recommandés).

**Reste à faire / points ouverts**
- Mesurer le poids des polices au build (objectif UX/UI §5 : ≤ 100 Ko).
- Créer `src/shared/ui/` et les composants partagés (V0-C, sous-étapes C1 à C3).
- Décider si les six documents + ce journal sont déplacés dans `docs/` (déjà fait : les 7 fichiers sont dans `docs/`).
- Questions client encore ouvertes : PRD-Q01 (graphie), Q17 (réponses FAQ), Q18 (consentement photos), Q19 (horaires/réseaux), TRD-Q01 (domaine).

**Prochaine étape recommandée**
V0-C sous-étape C1 : Button, Field, Badge, EmergencyNotice, Accordion + tests, puis enrichissement de `/dev/design`.

## [V0-C1] — Ouverture — 2026-11-20

**Phase précédente** : 1.1 + 1.2a + 1.2b — Terminé — Socle SSG, contrats, seed, tokens et page `/dev/design` validés.

**Phase ouverte** : V0-C1 — Composants partagés de base (Button, Field, Badge, EmergencyNotice, Accordion)

**Objectif** : Construire les cinq composants partagés les plus simples de la V0, avec leurs variantes et états, et enrichir `/dev/design` pour les montrer tous.

**Livrable vérifiable** : `/dev/design` affiche les 5 composants dans tous leurs états ; `npm run test` couvre Button, Field et Accordion ; `npm run build` passe.

**Ce que prévoient les documents**
- UX/UI : §6 (Bouton, Champ, Badge « Bientôt », Mention d'urgence, Questions fréquentes), §14 (interdits), §11 (accessibilité)
- TRD : §4 (structure `src/shared/ui/`), §10 (tests Testing Library), §9 (accessibilité)
- Plan : §4 (lot V0-C), §12 (définition de « terminé »)
- PRD : §5.1 FR-PUB-06 (badge « Bientôt »), FR-PUB-07 (mention d'urgence), §5.2 FR-CON-02 (champs du formulaire)

**Ce qu'on a déjà**
- `src/shared/styles/tokens.css` — variables de design à utiliser exclusivement
- `src/index.css` — mapping Tailwind (`bg-vert-cap`, `text-encre`, etc.)
- `src/features/dev/DesignPage.tsx` — page à enrichir
- `src/App.tsx` — route `/dev/design` conditionnée par `import.meta.env.DEV`
- `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` — déjà installés

**Fichiers à mettre à jour**
- `src/features/dev/DesignPage.tsx` — ajouter les 5 composants et leurs états
- `src/App.tsx` — inchangé (la route existe déjà)

**Fichiers à créer**
- `src/shared/ui/Button.tsx`
- `src/shared/ui/Field.tsx`
- `src/shared/ui/Badge.tsx`
- `src/shared/ui/EmergencyNotice.tsx`
- `src/shared/ui/Accordion.tsx`
- `src/shared/ui/__tests__/Button.test.tsx`
- `src/shared/ui/__tests__/Field.test.tsx`
- `src/shared/ui/__tests__/Accordion.test.tsx`
- `src/test/setup.ts` (setup Testing Library + jsdom, si pas déjà fait)

**Ce qu'on doit trancher**
| Réf. | Question | Réponse par défaut | Bloque ? |
|---|---|---|---|
| UX-Q06 | Numéros d'urgence locaux à afficher | Seulement les numéros du centre + phrase d'orientation générique | non |
| — | Jeu d'icônes (Lucide ?) | Reporter à C2 (fiches équipe/services) ; C1 n'en a pas besoin | non |
| — | `Button` : faut-il un `asChild` pour rendre un `<a>` stylé comme un bouton ? | Non en C1 ; le lien stylé est une variante `link` | non |

**Ce qu'on doit changer et pourquoi**
| Réf. doc | Prévu | Changement | Raison | Impact |
|---|---|---|---|---|
| — | — | Aucun changement prévu | — | — |

**Risques identifiés**
- Accordéon : risque de réinventer un composant JS alors que `details/summary` natif suffit → parade : utiliser le natif, styler uniquement.
- Field : risque d'utiliser le placeholder comme label → parade : label toujours visible, `aria-describedby` pour l'aide et l'erreur.
- Focus : risque d'oublier l'anneau double (2 px blanc + 4 px marine) → parade : classe utilitaire `focus-ring` dans `src/shared/styles/`.

**Critères de sortie**
- [ ] Les 5 composants existent dans `src/shared/ui/`
- [ ] Aucune couleur/taille en dur : uniquement les variables de `tokens.css`
- [ ] `/dev/design` montre chaque composant dans ses variantes et états (défaut, hover, focus, disabled, erreur)
- [ ] Tests Vitest pour Button, Field, Accordion (états clés et accessibilité)
- [ ] `npm run test` vert
- [ ] `npm run build` vert
- [ ] Contrôle UX/UI §12 (9 questions) passé

## [V0-C1] — Composants partagés de base — 2026-11-20

**Statut** : Terminé
**Durée réelle** : non mesurée
**Documents de référence** : UX/UI §6 (Bouton, Champ, Badge, Mention d'urgence, Questions fréquentes), §11 (accessibilité), §14 (interdits) ; TRD §4 (structure `src/shared/ui/`), §10 (tests Testing Library) ; Plan §4 (lot V0-C)

**Objectif de la phase**
Construire les cinq composants partagés les plus simples de la V0 et enrichir `/dev/design`.

**Réalisé**
- `src/shared/ui/Button.tsx` — 3 variantes (primary, secondary, link), état disabled, focus-visible avec anneau double via `ring-papier` + `ring-offset-marine`, `type="button"` par défaut.
- `src/shared/ui/Badge.tsx` — badge « Bientôt » (fond sève, texte marine, rayon fiche).
- `src/shared/ui/EmergencyNotice.tsx` — bandeau `role="note"` avec phrase d'orientation générique et numéros cliquables optionnels (`tel:`).
- `src/shared/ui/Field.tsx` — input / textarea / select, label toujours visible, aide et erreur associées via `aria-describedby`, `aria-invalid`, `role="alert"`.
- `src/shared/ui/Accordion.tsx` — `details`/`summary` natifs, indicateur `+` qui pivote via `group-open`, aucune logique JS de contrôle.
- Tests : `Button.test.tsx` (6), `Badge.test.tsx` (2), `EmergencyNotice.test.tsx` (3), `Field.test.tsx` (5), `Accordion.test.tsx` (2).
- Configuration de test : `vitest.config.ts`, `src/test/setup.ts`, `types` ajoutés dans `tsconfig.app.json`, `@testing-library/user-event` installé.
- `/dev/design` enrichi : boutons (4 états), champs (input, erreur, textarea, select), badge, mention d'urgence avec les numéros du `site.ts`, accordéon à deux questions.

**Écarts par rapport aux documents de base**
| Réf. document | Prévu | Réalisé | Raison |
|---|---|---|---|
| UX/UI §6 Bouton | Focus : anneau double 2 px blanc + 4 px marine | `ring-2 ring-papier ring-offset-2 ring-offset-marine` | Rendu fidèle à l'intention ; Tailwind n'a pas de « double ring » natif, le ring-offset fait office de second anneau |
| UX/UI §6 Champ | Hauteur 48 px, contour `--bordure-champ` | `h-12` + `border-[var(--bordure-champ)]` | Conforme |
| UX/UI §6 Accordéon | Ouverture 150 ms | Pas d'animation explicite | `details/summary` natif, animation native du navigateur ; `prefers-reduced-motion` respecté par défaut |

**Décisions prises**
- `Button` n'expose pas de `asChild` ; le lien stylé est une variante `link` (déjà noté en ouverture de C1) : journal seulement.
- `EmergencyNotice` reçoit ses numéros en prop, pas en import direct : facilite les tests et la réutilisation (page Contact, page Rendez-vous) : journal seulement.
- `Field` utilise `useId` pour générer un id stable côté client et serveur (compatible SSG) : journal seulement.

**Fichiers créés / modifiés / supprimés**
- Créés : `src/shared/ui/Button.tsx`, `Badge.tsx`, `EmergencyNotice.tsx`, `Field.tsx`, `Accordion.tsx`, `src/shared/ui/__tests__/Button.test.tsx`, `Badge.test.tsx`, `EmergencyNotice.test.tsx`, `Field.test.tsx`, `Accordion.test.tsx`, `vitest.config.ts`, `src/test/setup.ts`.
- Modifiés : `src/features/dev/DesignPage.tsx`, `tsconfig.app.json` (types de test), `package.json` (ajout `@testing-library/user-event`).
- Supprimés : aucun.

**Vérifications**
- `npm run test` : 26 passed (8 contrats + 6 Button + 2 Badge + 3 EmergencyNotice + 5 Field + 2 Accordion).
- `npm run build` : OK.
- `npm run dev` : `/dev/design` montre les 5 composants dans tous leurs états.

**Reste à faire / points ouverts**
- Ajouter les composants dans l'ordre d'apparition des pages réelles (l'ordre de `/dev/design` suit UX/UI §6).
- Installer Lucide au moment de C2 (icônes fonctionnelles uniquement).

**Prochaine étape recommandée**
V0-C2 : fiches Service, Équipe, Axe, avec les données du seed.

## [V0-C2] — Ouverture — 2026-11-20

**Phase précédente** : V0-C1 — Terminé — 5 composants de base livrés, 26 tests verts, `/dev/design` à jour.

**Phase ouverte** : V0-C2 — Fiches Service, Équipe, Axe

**Objectif** : Construire les trois composants de présentation qui affichent les données du seed (services, membres, axes), avec leurs deux états pour la fiche service (V0 minimal / V1 complet), et les brancher dans `/dev/design` avec les vraies données.

**Livrable vérifiable** : `/dev/design` affiche les 5 services, 9 membres et 4 axes du seed ; tests Vitest couvrent l'affichage conditionnel des champs optionnels (audience, inclusions, prix) ; `npm run build` OK.

**Ce que prévoient les documents**
- PRD : §5.1 FR-PUB-03 (fiche équipe, bio au clic), FR-PUB-04 (cartes service : nom, résumé, champs optionnels affichés dès qu'ils sont renseignés), FR-PUB-05 (bouton déduit du `workflowType`)
- UX/UI : §6 Fiche service (deux états), Fiche équipe (ratio 4:5, pas d'avatar rond), Axes (4 blocs, filets verticaux, pas de cartes), §9 (photographie), §14 (interdits)
- Appflow : §4 (bouton d'action selon `workflowType`)
- Backend Schema : §11 (correspondance seed → tables), §4.2 (`services`, `team_members`, `axes`)
- TRD : §4 (`src/features/services/`, `team/`, `home/`), §10 (tests composants)
- Plan : §4 (lot V0-C), §12 (définition de « terminé »)

**Ce qu'on a déjà**
- `src/data/contracts/service.ts`, `teamMember.ts`, `axe.ts` — schémas Zod à réutiliser
- `src/data/seed/services.json` (5), `equipe.json` (9), `axes.json` (4) — données réelles
- `src/data/ports/content.ts` + `src/data/adapters/mock/content.ts` + `src/data/index.ts` — accès aux données via `getContentRepository()`
- `src/shared/ui/Button.tsx`, `Badge.tsx` — à réutiliser dans les fiches
- `src/shared/styles/tokens.css` — variables à utiliser exclusivement
- `src/features/dev/DesignPage.tsx` — page à enrichir

**Fichiers à mettre à jour**
- `src/features/dev/DesignPage.tsx` — ajouter les 3 fiches avec données du seed
- `package.json` — ajouter `lucide-react`

**Fichiers à créer**
- `src/shared/ui/ServiceCard.tsx`
- `src/shared/ui/TeamCard.tsx`
- `src/shared/ui/AxisBlock.tsx`
- `src/shared/ui/__tests__/ServiceCard.test.tsx`
- `src/shared/ui/__tests__/TeamCard.test.tsx`
- `src/shared/ui/__tests__/AxisBlock.test.tsx`

**Ce qu'on doit trancher**
| Réf. | Question | Réponse par défaut | Bloque ? |
|---|---|---|---|
| PRD-Q05 | Les prix sont-ils publiés en V0 ? | Non : en V0, `isPaid: false` pour tous les services, `priceAmount: null`, `priceNote: null`. Le champ prix ne s'affiche pas. Les prix arrivent en V1.1 (PRD-Q05). | non |
| PRD-Q06 | Cible, inclusions, payant/gratuit par service | Le seed actuel a `audience` renseigné, `inclusions: []`, `isPaid: false`. Les inclusions et le payant seront tranchés en V1.1. En V0, seuls `name`, `summary`, `audience` et le bouton s'affichent. | non |
| UX-Q01 | Logo vectoriel | `photoPath: null` pour les 9 membres → TeamCard affiche un placeholder (initiale sur fond sève). Le logo réel sera traité en V0-D (header). | non |
| UX-Q04 | Vocabulaire « personnes accompagnées » | Utiliser « personnes accompagnées » dans les textes généraux, « vous » dans les parcours. Impacte les libellés de la fiche service. | non |

**Ce qu'on doit changer et pourquoi**
| Réf. doc | Prévu | Changement | Raison | Impact |
|---|---|---|---|---|
| UX/UI §6 Fiche service | Deux états, même composant | La fiche V1 (avec inclusions et prix) sera préparée dès C2 mais les champs ne s'afficheront que s'ils sont renseignés (déjà prévu par FR-PUB-04) | Aucun changement, on implémente exactement le prévu | — |
| UX/UI §9 Photographie | Photos réelles uniquement | `photoPath: null` dans le seed | Photos non encore fournies par le client (PRD-Q18 en attente) | Placeholder initiale pour TeamCard ; à remplacer quand les photos seront disponibles |

**Risques identifiés**
- Fiche service : risque d'afficher un prix nul ou un badge « Gratuit » non prévu → parade : afficher le prix uniquement si `isPaid` ou `priceNote` non nul, sinon rien.
- Fiche équipe : risque d'avatar rond (interdit UX/UI §14) → parade : photo en ratio 4:5, coins francs.
- Axes : risque de transformer les 4 blocs en cartes avec ombre (interdit UX/UI §14) → parade : filets verticaux uniquement, pas de fond, pas d'ombre.
- Lucide : risque d'icônes décoratives au-dessus des titres (interdit UX/UI §14) → parade : usage fonctionnel uniquement (flèche du lien « Lire la présentation », chevron de l'accordéon si besoin).
- `lucide-react` : vérifier la compatibilité React 19 (devrait être OK, mais à tester au build).

**Critères de sortie**
- [ ] `ServiceCard` affiche nom, résumé, audience, bouton ; les champs optionnels (inclusions, prix) n'apparaissent que s'ils sont renseignés
- [ ] `TeamCard` affiche photo (ou placeholder initiale), nom, fonction, résumé court, lien « Lire la présentation »
- [ ] `AxisBlock` affiche nom + résumé, 4 blocs avec filets verticaux (pas de cartes)
- [ ] Aucune couleur/taille en dur
- [ ] `/dev/design` montre les 5 services, 9 membres, 4 axes du seed
- [ ] Tests Vitest pour les 3 composants
- [ ] `npm run test` vert
- [ ] `npm run build` vert
- [ ] Contrôle UX/UI §12 (9 questions) passé

## [V0-C2] — Fiches Service, Équipe, Axe — 2026-11-20

**Statut** : Terminé
**Durée réelle** : non mesurée
**Documents de référence** : PRD §5.1 (FR-PUB-03, FR-PUB-04, FR-PUB-05) ; UX/UI §6 (Fiche service, Fiche équipe, Axes), §9, §14 ; Appflow §4 ; Backend Schema §11 ; TRD §4, §10 ; Plan §4

**Objectif de la phase**
Construire les trois composants de présentation qui affichent les données du seed.

**Réalisé**
- `src/shared/ui/AxisBlock.tsx` — nom + résumé, filets verticaux sur grand écran, pas de carte.
- `src/shared/ui/TeamCard.tsx` — photo ratio 4:5 ou placeholder initiale, nom, fonction, résumé court, lien « Lire la présentation » (callback `onReadMore`).
- `src/shared/ui/ServiceCard.tsx` — nom, résumé, audience, inclusions conditionnelles, prix conditionnel (`priceAmount` ou `priceNote`), bouton `ctaLabel`.
- Tests : `AxisBlock.test.tsx` (1), `TeamCard.test.tsx` (4), `ServiceCard.test.tsx` (6).
- `/dev/design` : sections « Axes », « Fiches équipe », « Fiches service » alimentées par le seed via `getContentRepository()`.
- `lucide-react` installé (pas encore utilisé en C2, disponible pour C3).

**Écarts par rapport aux documents de base**
| Réf. document | Prévu | Réalisé | Raison |
|---|---|---|---|
| UX/UI §6 Fiche équipe | « Lire la présentation » ouvre la page ou un panneau | Bouton appelle `onReadMore` (branché sur `alert` dans `/dev/design`) | Le panneau sera implémenté en V0-D avec la page Équipe |
| UX/UI §6 Fiche service | Deux états, même composant | Un seul composant, champs optionnels conditionnels | Conforme à FR-PUB-04 |
| UX/UI §9 Photographie | Photos réelles | `photoPath: null` → placeholder initiale | Photos non fournies (PRD-Q18) |

**Décisions prises**
- `TeamCard` : placeholder = initiales (2 premières lettres des mots du nom) sur fond sève. À remplacer quand les photos seront disponibles.
- `ServiceCard` : prix affiché uniquement si `isPaid && priceAmount != null` ou `priceNote != null`. Pas de badge « Gratuit » (non prévu par le PRD).
- `ServiceCard` : le libellé du bouton vient de `ctaLabel`, pas d'un mapping codé en dur (FR-PUB-05).
- `onReadMore` et `onAction` sont des callbacks : le comportement réel (navigation, panneau) est décidé par la page qui instancie le composant. journal seulement.

**Fichiers créés / modifiés / supprimés**
- Créés : `src/shared/ui/AxisBlock.tsx`, `TeamCard.tsx`, `ServiceCard.tsx`, `__tests__/AxisBlock.test.tsx`, `__tests__/TeamCard.test.tsx`, `__tests__/ServiceCard.test.tsx`.
- Modifiés : `src/features/dev/DesignPage.tsx` (sections axes/équipe/services), `package.json` (ajout `lucide-react`).
- Supprimés : aucun.

**Vérifications**
- `npm run test` : 37 passed.
- `npm run build` : OK.
- `npm run dev` : `/dev/design` affiche 4 axes, 9 membres, 5 services du seed.

**Reste à faire / points ouverts**
- Le panneau « Lire la présentation » sera implémenté en V0-D (page Équipe).
- `onAction` de `ServiceCard` sera branché en V0-D (vers `/contact`).

**Prochaine étape recommandée**
V0-C3 : Header, Footer, PageLayout.

## [V0-C3] — Ouverture — 2026-11-20

**Phase précédente** : V0-C2 — Terminé — 37 tests verts, 3 fiches branchées sur le seed.

**Phase ouverte** : V0-C3 — Header, Footer, PageLayout

**Objectif** : Construire les trois composants de structure qui encadreront toutes les pages V0 : en-tête (logo, menu, bouton), pied de page (coordonnées, liens légaux, mention d'urgence), et mise en page générique (largeur, espacement, skip link).

**Livrable vérifiable** : une page coquille avec header + footer + contenu fonctionne dans `/dev/design` et sur `/` ; le menu mobile s'ouvre/ferme ; les liens légaux pointent vers des routes (même vides) ; `npm run build` OK.

**Ce que prévoient les documents**
- PRD : §5.1 FR-PUB-06 (menu avec « Bientôt » en mode démo), FR-PUB-07 (mention d'urgence sur contact/rendez-vous), FR-PUB-08 (mentions légales et confidentialité depuis le pied de page)
- UX/UI : §6 En-tête et pied de page (hauteur 64 px, sceau 44 px, fond blanc, filet inférieur, pas de flou), §11 (skip link, focus visible, menu mobile), §7 (mise en page accueil)
- Appflow : §2 (menu selon le mode)
- TRD : §4 (`src/app/` pour le routeur, `src/shared/ui/` pour header/footer), §5 (`VITE_DEMO_MODE`)
- Plan : §4 (lot V0-C)

**Ce qu'on a déjà**
- `src/config/features.ts` — interrupteurs
- `src/config/site.ts` — coordonnées du centre
- `src/data/index.ts` — `getContentRepository()` pour l'organisation
- `src/shared/ui/Button.tsx`, `Badge.tsx`, `EmergencyNotice.tsx` — à réutiliser
- `src/shared/styles/tokens.css` — `--largeur-page`, `--e-*`, etc.
- `src/App.tsx` — table de routes à enrichir

**Fichiers à mettre à jour**
- `src/App.tsx` — ajouter les routes `/contact`, `/mentions-legales`, `/confidentialite` (pages vides pour l'instant)
- `src/features/dev/DesignPage.tsx` — envelopper dans `PageLayout` pour tester

**Fichiers à créer**
- `src/shared/ui/Header.tsx`
- `src/shared/ui/Footer.tsx`
- `src/shared/ui/PageLayout.tsx`
- `src/shared/ui/__tests__/Header.test.tsx`
- `src/shared/ui/__tests__/Footer.test.tsx`

**Ce qu'on doit trancher**
| Réf. | Question | Réponse par défaut | Bloque ? |
|---|---|---|---|
| PRD-Q01 | Graphie du nom : « PsychoMédical » (formulaire) ou « Psycho-Médical » (logo) ? | Utiliser « CAP-MARJ » comme nom court dans le header, et « Centre d'Appui PsychoMédical Jean Renold Alphonse » comme nom complet dans le footer (cohérent avec le CSV) | non (à confirmer client) |
| UX-Q01 | Logo vectoriel | Pas encore fourni → utiliser un texte « CAP-MARJ » en Literata, sans image | non |
| UX-Q06 | Numéros d'urgence locaux | Seulement les numéros du centre | non |
| PRD-Q19 | Horaires, réseaux sociaux | Adresse + téléphones + courriel uniquement | non |

**Ce qu'on doit changer et pourquoi**
| Réf. doc | Prévu | Changement | Raison | Impact |
|---|---|---|---|---|
| UX/UI §6 En-tête | Sceau de 44 px | Texte « CAP-MARJ » en Literata (pas de logo vectoriel) | Logo non fourni (UX-Q01) | À remplacer quand le logo sera disponible |
| UX/UI §6 Pied de page | Sceau sur pastille blanche | Nom complet en Literata | Idem | À remplacer |

**Risques identifiés**
- Menu mobile : risque de réinventer un composant complexe → parade : panneau plein écran simple, fermeture à la touche Échap, focus piégé.
- Mode démo : risque d'afficher « Bientôt » en production → parade : `VITE_DEMO_MODE` lu une seule fois, test unitaire.
- Skip link : risque d'oubli → parade : premier élément focusable du `<body>`, cible `#main`.

**Critères de sortie**
- [ ] `Header` : logo texte, menu (Le centre, Services, FAQ, Contact), bouton « Nous contacter », menu mobile fonctionnel
- [ ] `Footer` : nom complet, coordonnées, liens légaux, mention d'urgence, copyright
- [ ] `PageLayout` : skip link, `<main id="main">`, largeur `--largeur-page`, espacement cohérent
- [ ] Mode démo : rubriques futures en « Bientôt » non cliquables
- [ ] Routes légales créées (pages vides)
- [ ] Tests Vitest pour Header et Footer
- [ ] `npm run test` vert
- [ ] `npm run build` vert
- [ ] Contrôle UX/UI §12 passé