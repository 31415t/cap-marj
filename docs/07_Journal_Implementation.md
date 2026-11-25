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

## [V0-C3] — Ouverture — 2026-11-21

**Phase précédente** : V0-C2 — Terminé — 37 tests verts, 3 fiches branchées sur le seed.

**Phase ouverte** : V0-C3 — Header, Footer, PageLayout

**Objectif** : Construire les trois composants de structure qui encadreront toutes les pages V0.

**Livrable vérifiable** : une page coquille avec header + footer + contenu fonctionne dans `/dev/design` et sur `/` ; le menu mobile s'ouvre/ferme ; les routes légales existent (pages vides) ; `npm run build` OK.

**Ce que prévoient les documents**
- PRD : §5.1 FR-PUB-06 (menu « Bientôt » en mode démo), FR-PUB-07 (mention d'urgence), FR-PUB-08 (liens légaux)
- UX/UI : §6 (En-tête 64 px, sceau 44 px, fond blanc, filet ; Pied de page marine ; panneau mobile plein écran), §11 (skip link, focus, menu mobile), §7 (mise en page accueil)
- Appflow : §2 (menu selon le mode)
- TRD : §4 (`src/app/`, `src/shared/ui/`), §5 (`VITE_DEMO_MODE`)
- Plan : §4 (lot V0-C)

**Ce qu'on a déjà**
- `src/config/features.ts`, `src/config/site.ts`
- `src/data/index.ts` (`getContentRepository()`)
- `src/shared/ui/Button.tsx`, `Badge.tsx`, `EmergencyNotice.tsx`
- `src/shared/styles/tokens.css`
- `lucide-react` installé (usage : menu mobile uniquement)

**Fichiers à mettre à jour**
- `src/App.tsx` — routes `/contact`, `/mentions-legales`, `/confidentialite` (pages vides)
- `src/features/dev/DesignPage.tsx` — envelopper dans `PageLayout`

**Fichiers à créer**
- `src/shared/ui/PageLayout.tsx`
- `src/shared/ui/Header.tsx`
- `src/shared/ui/Footer.tsx`
- `src/shared/ui/__tests__/Header.test.tsx`
- `src/shared/ui/__tests__/Footer.test.tsx`
- `src/app/routes.ts` (table de routes partagée, si utile pour les liens du header/footer)

**Ce qu'on doit trancher**
| Réf. | Question | Réponse par défaut | Bloque ? |
|---|---|---|---|
| PRD-Q01 | Graphie du nom | « CAP-MARJ » (header), « Centre d'Appui PsychoMédical Jean Renold Alphonse » (footer) | non |
| UX-Q01 | Logo vectoriel | Texte « CAP-MARJ » en Literata, pas d'image | non |
| UX-Q06 | Numéros d'urgence | Numéros du centre uniquement | non |
| PRD-Q19 | Horaires, réseaux | Adresse + téléphones + courriel | non |

**Ce qu'on doit changer et pourquoi**
| Réf. doc | Prévu | Changement | Raison | Impact |
|---|---|---|---|---|
| UX/UI §6 Axes | « Pas de pictogramme décoratif » | Test d'icônes à gauche du titre effectué, jugé acceptable, **reporté à la phase d'ajustement UI/UX (V0-F)** | Éviter la dette visuelle et juger l'ensemble en fin de V0 | `AxisBlock` reste sans icône pour l'instant ; décision tracée |
| UX/UI §6 En-tête | Sceau 44 px | Texte « CAP-MARJ » en Literata | Logo vectoriel non fourni | À remplacer quand le logo sera disponible |
| UX/UI §6 Pied de page | Sceau sur pastille blanche | Nom complet en Literata | Idem | À remplacer |
| Plan §4 | Lot V0-F = « Qualité » | Lot V0-F = « Qualité + ajustements UI/UX » (icônes, alignements, micro-détails) | Décision client : peaufiner l'UI en fin de V0, pas au fil de l'eau | À reporter dans 06_Plan_Implementation.md |

**Risques identifiés**
- Menu mobile : réinventer un composant complexe → panneau plein écran simple, fermeture Échap, focus piégé.
- Mode démo : afficher « Bientôt » en production → `VITE_DEMO_MODE` lu une seule fois, test unitaire.
- Skip link : oubli → premier élément focusable du `<body>`, cible `#main`.

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

## [V0-C3] — Header, Footer, PageLayout — 2026-11-21

**Statut** : Terminé
**Durée réelle** : non mesurée
**Documents de référence** : PRD §5.1 (FR-PUB-06, FR-PUB-07, FR-PUB-08), §6 (RM-12) ; UX/UI §6 (En-tête, Pied de page, Mention d'urgence), §11 (skip link, focus, menu mobile), §7 ; Appflow §2 ; TRD §4, §5 ; Plan §4

**Objectif de la phase**
Construire les trois composants de structure qui encadrent toutes les pages V0.

**Réalisé**
- `src/shared/ui/PageLayout.tsx` — skip link (« Aller au contenu principal »), `<main id="main">`, largeur `--largeur-page`, espacement cohérent, header + footer.
- `src/shared/ui/Header.tsx` — logo réel (`src/assets/capmarjlogo.webp`, 44 px, `alt=""` + `aria-label` sur le lien), menu desktop (Le centre, Services, FAQ, Contact), bouton « Nous contacter », menu mobile en panneau plein écran avec fermeture à la touche Échap et verrouillage du scroll.
- `src/shared/ui/Footer.tsx` — logo sur pastille blanche, nom complet, coordonnées (courriel + téléphones cliquables), liens légaux (mentions, confidentialité), lien « Nous contacter », paragraphe sur la tarification variable, copyright + numéro fiscal.
- `src/config/features.ts` — interrupteurs du TRD §5 (créé à cette étape, manquait depuis 1.2a).
- `src/vite-env.d.ts` — types `ImportMetaEnv` (créé à cette étape).
- `src/App.tsx` — routes `/contact`, `/mentions-legales`, `/confidentialite` (pages vides), `/` et `/dev/design` enveloppées dans `PageLayout`.
- Tests : `Header.test.tsx` (3), `Footer.test.tsx` (4, dont le test « pas de mention d'urgence dans le footer »).

**Écarts par rapport aux documents de base**
| Réf. doc | Prévu | Réalisé | Raison |
|---|---|---|---|
| PRD §5.1 FR-PUB-07 | Mention d'urgence sur les pages Contact et Rendez-vous | Retirée du Footer ; reste prévue sur Contact et Rendez-vous (V0-D) | L'implémentation initiale l'avait placée dans le footer global, contraire à la limitation du PRD ; le formulaire client ne mentionne aucune urgence |
| PRD §10 PRD-Q05 | « Prix publiés en gourdes » | Tarification variable ; pas de prix publié en V0 ; footer oriente vers le contact direct | Le client indique que les tarifs varient selon la situation (voir PRD mis à jour) |
| UX/UI §6 Axes | « Pas de pictogramme décoratif » | Test d'icônes à gauche du titre effectué, jugé acceptable, **reporté à la phase d'ajustement UI/UX (V0-F)** | Éviter la dette visuelle, juger l'ensemble en fin de V0 ; `AxisBlock` reste sans icône pour l'instant |
| UX/UI §6 En-tête / Pied | Sceau 44 px, pastille blanche | Logo réel `capmarjlogo.webp` en 44 px, `alt=""` + `aria-label` sur le lien | Logo fourni, meilleure accessibilité (pas de double lecture) |
| Plan §4 | Lot V0-F = « Qualité » | Lot V0-F = « Qualité + ajustements UI/UX » | Décision client : peaufiner l'UI en fin de V0, pas au fil de l'eau |

**Décisions prises**
- `EmergencyNotice` conservé comme composant, réservé aux pages Contact et Rendez-vous (FR-PUB-07) → à reporter dans le PRD (fait, FR-PUB-07 précisé) et RM-12 ajouté.
- Tarification variable : footer oriente vers le contact direct ; en V1.1, utiliser `priceNote` plutôt que `priceAmount` fixe → à reporter dans TRD-Q10 (fait).
- Logo : `alt=""` + `aria-label` sur le lien (évite la double lecture), `width`/`height` fixés pour le CLS.
- Menu mobile : Lucide `Menu` / `X` uniquement (usage fonctionnel), `aria-expanded`, `aria-controls`, fermeture Échap, scroll verrouillé.

**Fichiers créés / modifiés / supprimés**
- Créés : `src/shared/ui/PageLayout.tsx`, `Header.tsx`, `Footer.tsx`, `__tests__/Header.test.tsx`, `__tests__/Footer.test.tsx`, `src/config/features.ts`, `src/vite-env.d.ts`.
- Modifiés : `src/App.tsx` (routes + PageLayout), `src/features/dev/DesignPage.tsx` (enveloppé dans PageLayout), `src/shared/ui/AxisBlock.tsx` (retour à la version sans icône), `__tests__/AxisBlock.test.tsx` (retour à 1 test), `docs/01_PRD_Exigences_Produit.md` (FR-PUB-07, PRD-Q05, RM-12), `docs/02_TRD_Exigences_Techniques.md` (TRD-Q10).
- Supprimés : aucun.

**Vérifications**
- `npm run test` : 44 passed.
- `npm run build` : OK, logo hashé dans `dist/assets/`, HTML pré-rendu contient `<img>`.
- `npm run dev` : header et footer visibles, menu mobile fonctionnel, `/dev/design` intact.

**Reste à faire / points ouverts**
- Les pages Contact et Mentions légales / Confidentialité sont des placeholders (V0-D).
- Les liens `/#services` et `/#faq` du header pointent vers des ancres qui n'existent pas encore (elles seront créées en V0-D sur la page d'accueil).
- Phase d'ajustement UI/UX (V0-F) : icônes des axes, alignements, micro-détails.

**Prochaine étape recommandée**
V0-D : pages Accueil, À propos, Équipe, Contact, mentions légales, confidentialité.

## [V0-D] — Ouverture — 2026-11-21

**Phase précédente** : V0-C3 — Terminé — Header, Footer, PageLayout livrés, 44 tests verts.

**Phase ouverte** : V0-D — Pages publiques de la V0

**Objectif** : Construire les 7 pages de la V0 (Accueil, À propos, Équipe, Contact, Mentions légales, Confidentialité, 404) en assemblant les composants de C1–C3 et les données du seed, conformément à l'UX/UI §7 et au PRD §4.

**Livrable vérifiable** : les 7 routes sont accessibles, sans lien mort, avec le contenu du seed, responsive 360/768/1280, accessibles au clavier ; `npm run build` génère les 7 pages pré-rendues.

**Ce que prévoient les documents**
- PRD : §4 (contenu V0), §5.1 (FR-PUB-01 à 08), §5.2 (FR-CON-01, FR-CON-02), §8 (critères d'acceptation V0), §11 (interdits)
- UX/UI : §7 (mise en page de l'accueil, pages V0), §6 (composants), §8 (ton éditorial et libellés), §9 (photographie), §11 (accessibilité), §12 (contrôle), §14 (interdits)
- Appflow : §1 (plan du site), §2 (menu), §3 (V0 : le visiteur contacte le centre)
- TRD : §7 (performance, SEO), §8 (intégrations : Resend, Turnstile), §9 (accessibilité)
- Plan : §4 (lot V0-D), §12 (définition de « terminé »)

**Ce qu'on a déjà**
- `src/shared/ui/` : Button, Badge, EmergencyNotice, Field, Accordion, ServiceCard, TeamCard, AxisBlock, Header, Footer, PageLayout
- `src/data/` : contrats Zod, seed (organisation, 4 axes, 9 membres, 5 services, 5 FAQ), `getContentRepository()`
- `src/config/` : `site.ts`, `features.ts`
- `src/App.tsx` : routes `/`, `/contact`, `/mentions-legales`, `/confidentialite` (placeholders), `/dev/design`
- `src/assets/capmarjlogo.webp`
- `lucide-react` installé

**Fichiers à mettre à jour**
- `src/App.tsx` — remplacer les placeholders par les vraies pages, ajouter `/a-propos`, `/equipe`, `/404`
- `src/shared/ui/Header.tsx` — ajuster les liens si les routes changent (`/a-propos`, `/equipe`)
- `docs/07_Journal_Implementation.md` — cette entrée

**Fichiers à créer**
- `src/features/home/HomePage.tsx` (toutes les sections de l'accueil, avec ancres `#services` et `#faq`)
- `src/features/about/AboutPage.tsx`
- `src/features/team/TeamPage.tsx` (9 fiches + panneau « Lire la présentation »)
- `src/features/contact/ContactPage.tsx` (coordonnées, mention d'urgence, formulaire)
- `src/features/legal/LegalPage.tsx` (mentions légales)
- `src/features/legal/PrivacyPage.tsx` (confidentialité)
- `src/features/not-found/NotFoundPage.tsx` (404)
- `src/features/contact/ContactForm.tsx` (formulaire avec Turnstile, envoi vers `/api/contact`)
- `api/contact.ts` (fonction serveur Vercel)
- Tests : `HomePage.test.tsx`, `ContactForm.test.tsx`, `TeamPage.test.tsx` (au minimum)

**Ce qu'on doit trancher**
| Réf. | Question | Réponse par défaut | Bloque ? |
|---|---|---|---|
| PRD-Q17 | Contenu des 5 questions FAQ (0 réponse reçue) | Rédiger 8 questions pratiques (tarifs, déroulement, confidentialité, prise de RDV, urgences, paiement) ; le client valide | oui (pour la section FAQ de l'accueil) |
| PRD-Q18 | Consentement des photos | `photoPath: null` pour l'instant, placeholder initiale ; photos réelles uniquement si consentement écrit | non |
| PRD-Q19 | Horaires, réseaux sociaux | Adresse + téléphones + courriel uniquement | non |
| TRD-Q01 | Nom de domaine et courriel pro | Formulaire en prévisualisation : envoi vers l'adresse du développeur ; en production : domaine vérifié requis | oui (pour l'envoi réel) |
| UX-Q01 | Logo vectoriel | Logo `.webp` utilisé ; version vectorielle à demander | non |
| — | Texte de la page À propos | Utiliser l'historique du seed (déjà rédigé), structurer en sections | non |
| — | Mentions légales / confidentialité | Brouillons rédigés par nous, à relire par les juristes du centre | non (brouillon V0) |
| — | 404 | Page simple avec liens vers Accueil et Services | non |

**Ce qu'on doit changer et pourquoi**
| Réf. doc | Prévu | Changement | Raison | Impact |
|---|---|---|---|---|
| PRD §4 | « Services et FAQ : sections de l'accueil, atteintes par ancres » | On garde cette décision (pas de pages `/services` et `/faq` séparées en V0) | Conforme à l'UX/UI §7 | Les liens du header `/#services` et `/#faq` fonctionneront une fois l'accueil construit |
| PRD §8 | Formulaire « en prévisualisation, envoi vers l'adresse du développeur » | À implémenter tel quel ; Resend en mode démo tant que TRD-Q01 n'est pas résolu | Conforme | Envoi réel possible seulement quand le domaine sera vérifié |

**Risques identifiés**
- FAQ sans réponses (PRD-Q17) → bloquant pour la section FAQ ; parade : rédiger 8 questions/réponses par nous, faire valider
- Photos absentes (PRD-Q18) → placeholders initiaux ; parade : remplacer quand consentement obtenu
- Formulaire sans domaine vérifié (TRD-Q01) → envoi vers adresse développeur en prévisualisation ; parade : documenter la bascule
- Performance sur mobile 3G → images WebP, lazy loading, pas de JS inutile ; parade : Lighthouse à la fin
- SEO : titres et métadonnées par page → `react-helmet-async` (déjà dans `vite-react-ssg`) ; parade : un composant `PageMeta` par page

**Critères de sortie**
- [ ] Les 7 pages existent et sont accessibles sans lien mort
- [ ] Contenu issu exclusivement du seed (ou des brouillons validés)
- [ ] Ancres `#services` et `#faq` fonctionnelles sur l'accueil
- [ ] Formulaire de contact : validation, Turnstile, envoi vers `/api/contact`, états succès/erreur
- [ ] Mention d'urgence sur Contact uniquement (pas sur les autres pages)
- [ ] Panneau « Lire la présentation » sur la page Équipe (focus piégé, fermeture Échap)
- [ ] Responsive 360 / 768 / 1280
- [ ] Accessibilité clavier + contrastes
- [ ] `npm run test` vert
- [ ] `npm run build` vert (7 pages pré-rendues)
- [ ] Contrôle UX/UI §12 (9 questions) passé
- [ ] Critères d'acceptation PRD §8 vérifiés

## [V0-D + V0-E] — Pages publiques et formulaire de contact — 2026-11-24

**Statut** : Terminé (avec deux reports documentés : Turnstile, envoi réel)
**Durée réelle** : non mesurée
**Documents de référence** : PRD §4, §5.1 (FR-PUB-01 à 08), §5.2 (FR-CON-01, FR-CON-02), §6 (RM-12), §8 (critères d'acceptation V0), §11 ; UX/UI §6, §7, §8, §9, §11, §12, §14 ; Appflow §1, §2, §3 ; TRD §4, §7, §8, §9, §10 ; Plan §4 (lots V0-D, V0-E), §12

**Objectif de la phase**
Construire les 7 pages publiques de la V0 et rendre le formulaire de contact fonctionnel (fonction serveur, anti-spam, envoi courriel).

**Réalisé**

*Pages (V0-D)*
- `src/features/home/HomePage.tsx` — hero, 4 axes, 5 services + bloc « vous hésitez », résumé court du centre (2 phrases rédigées, remplace l'extrait de `history`), aperçu équipe (4 cartes), FAQ (6 questions), section contact avec lien vers `/contact`. Ancres `#services` et `#faq` fonctionnelles.
- `src/features/about/AboutPage.tsx` — article encyclopédique : chapeau, image placeholder, 6 sections en accordéon (`<details>` natif) : Identité et mission (ouverte par défaut), Les quatre axes, Services, Organisation et branches, Historique (timeline), Chiffres clés.
- `src/features/team/TeamPage.tsx` — 9 cartes, paragraphe d'introduction rédigé.
- `src/features/team/TeamMemberPage.tsx` — page dédiée par membre (`/equipe/:slug`), bio complète, flèche retour `ArrowLeft`, message « Membre introuvable » si slug inconnu.
- `src/features/contact/ContactPage.tsx` — coordonnées, mention d'urgence, formulaire.
- `src/features/not-found/NotFoundPage.tsx` — 404 avec deux liens (accueil, services).
- `src/features/legal/LegalPage.tsx` — mentions légales (brouillon, bandeau d'avertissement).
- `src/features/legal/PrivacyPage.tsx` — politique de confidentialité (brouillon, bandeau d'avertissement).
- `src/shared/ui/Timeline.tsx` — timeline datée (filet vertical, pastilles, jalons verts), `formatDate` gère les ISO partiels.
- `src/shared/ui/BackToTop.tsx` — bouton flottant « retour en haut » (apparaît après 600 px, `ArrowUp`, `aria-label`, respect de `prefers-reduced-motion`).
- `src/shared/ui/ScrollToTop.tsx` — supprimé, remplacé par `ScrollRestoration` (React Router) + `history.scrollRestoration = 'manual'` dans `main.tsx`.
- `src/data/seed/historique.json` — 4 événements (fondation 2017, 2018, 2020, 2026), 2 jalons ; les événements 2018 et 2020 sont des templates « à compléter avec le client ».
- `src/data/contracts/timelineEvent.ts` + export dans `index.ts` ; `listTimeline()` ajouté au port et à l'adaptateur mock.
- `src/data/seed/equipe.json` — ajout du `slug` aux 9 membres ; photos intégrées (`photoPath` renseigné, consentements obtenus via Google Forms).
- `src/shared/ui/TeamCard.tsx` — carte cliquable (`<Link>` vers `/equipe/:slug`), CTA « Voir le profil » avec `ArrowRight`, uniforme entre accueil et page Équipe.
- `src/shared/ui/AxisBlock.tsx` — retour à la version sans icône (décision reportée à V0-F).
- `src/shared/ui/Header.tsx` — menu mobile en panneau déroulant sous le header (remplace le plein écran), bouton hamburger/croix toujours visible, fermeture Échap, `sticky top-0 z-50`.
- `src/shared/ui/Footer.tsx` — logo sur pastille blanche, paragraphe sur la tarification variable orientant vers `/contact` ; mention d'urgence retirée du footer.

*Formulaire (V0-E)*
- `src/features/contact/ContactForm.tsx` — React Hook Form + Zod, champs nom, courriel, téléphone, service, message ; avertissement « ne décrivez pas votre situation personnelle » ; honeypot invisible ; états `idle` / `sending` / `success` / `error` ; message de succès avec lien « Envoyer un autre message ».
- `src/data/contracts/contactRequest.ts` — schéma Zod partagé client/serveur ; refine « au moins un courriel ou un téléphone » ; honeypot `website` (max 0).
- `api/contact.ts` — fonction Vercel : vérification méthode POST, limitation de débit (5 req / 10 min / IP), validation Zod, honeypot silencieux, envoi Resend, gestion des erreurs 400/405/429/502/503.
- `.env.example` — toutes les variables (publiques et secrets) documentées, sans valeur.
- `react-hook-form`, `@hookform/resolvers`, `@vercel/node` installés.

*Tests*
- `AboutPage.test.tsx` (6), `NotFoundPage.test.tsx` (1), `Timeline.test.tsx` (4), `HomePage.test.tsx` (6), `ContactForm.test.tsx` (3), `TeamCard.test.tsx` adapté (lien vers `/equipe/:slug`, CTA), `contracts.test.ts` étendu (`historique.json`, slugs uniques).

**Écarts par rapport aux documents de base**

| Réf. document | Prévu | Réalisé | Raison |
|---|---|---|---|
| Appflow §1 | « Équipe » = une page | Page liste `/equipe` + pages membres `/equipe/:slug` (pré-rendues SSG) | Décision client : page dédiée par membre type « mini Wikipedia », gain SEO (URL propre, meta, données structurées), partage, maintenance |
| PRD FR-PUB-03 | « biographie complète au clic » | Biographie complète sur la page dédiée du membre | Idem |
| UX/UI §6 Fiche équipe | « ouvre la page ou un panneau » | Ouvre la page dédiée | Idem ; un panneau demande piège de focus + Échap + verrouillage scroll (3 sources de bugs), la page est plus simple et meilleure pour le SEO |
| UX/UI §6 En-tête | Menu mobile en panneau plein écran | Panneau déroulant sous le header, bouton hamburger/croix toujours visible | Le plein écran recouvrait le bouton de fermeture (bug réel) et ne convenait pas au ton institutionnel ; le déroulant est plus sobre, plus accessible |
| UX/UI §6 Pied de page | Mention d'urgence dans le footer | Retirée du footer ; réservée aux pages Contact et Rendez-vous | FR-PUB-07 limite la mention aux pages Contact et Rendez-vous ; le formulaire client ne mentionne aucune urgence |
| PRD PRD-Q05 | « Prix publiés en gourdes » | Tarification variable ; footer oriente vers `/contact` | Le client indique que les tarifs varient selon la situation (RM-12 ajouté) |
| UX/UI §6 Axes | « Pas de pictogramme décoratif » | Test d'icônes à gauche du titre effectué, jugé acceptable, reporté à V0-F | Éviter la dette visuelle ; `AxisBlock` reste sans icône |
| PRD FR-PUB-02 | « Page À propos avec l'historique complet » | Article encyclopédique (6 accordéons) ; l'historique est une timeline datée dans une section dédiée | Décision client : distinguer « historique » (chronologie) de « à propos » (vue encyclopédique) ; l'historique fait partie du « à propos » |
| UX/UI §7 | « Le centre en bref » = extrait de l'historique | Résumé rédigé de 2 phrases (ne duplique plus `org.history`) | `org.history` est un pavé de 4 paragraphes, mal adapté à une section d'accueil ; le résumé renvoie vers `/a-propos` |
| TRD §8 | Turnstile anti-spam | Repli honeypot + limitation de débit (5 req / 10 min / IP) | Clés Turnstile non disponibles ; le TRD §8 prévoit explicitement ce repli |
| TRD-Q01 / PRD §8 | Envoi vers l'adresse du centre | `CONTACT_TO_EMAIL` paramétrable ; en prévisualisation, adresse du développeur | Domaine non vérifié chez Resend ; à basculer quand TRD-Q01 sera résolu |
| UX/UI §9 | Icônes : usage fonctionnel | `ArrowLeft` (retour page membre), `ArrowRight` (CTA carte équipe), `ArrowUp` (retour en haut), `Menu`/`X` (menu mobile) | Icônes fonctionnelles uniquement, trait 1,5 px, taille adaptée au contexte (16 px inline, 24 px navigation) ; emojis et banques génériques proscrits |
| — | Pas prévu explicitement | `BackToTop` (bouton retour en haut) | Demande client ; icône fonctionnelle, apparaît après 600 px, présent sur toutes les pages publiques via `PageLayout` |
| — | Pas prévu explicitement | `ScrollRestoration` + `history.scrollRestoration = 'manual'` | Correction d'un bug : les pages héritaient de la position de défilement de la page précédente ; le retour arrière restaure désormais la position |
| Plan §4 | Lot V0-F = « Qualité » | Lot V0-F = « Qualité + ajustements UI/UX » (icônes des axes, chevron d'accordéon, alignements, micro-détails) | Décision client : peaufiner l'UI en fin de V0, pas au fil de l'eau |

**Décisions prises**
- Pages membres dédiées + carte uniforme cliquable → à reporter dans Appflow §1, PRD FR-PUB-03, UX/UI §6, Backend Schema §4.2 (`team_members.slug`), TRD §4.
- Timeline datée + seed `historique.json` → à reporter dans PRD (nouvelle question PRD-Q23), UX/UI §7, Backend Schema §2 (`timeline_events`), Plan §4.
- À propos en article encyclopédique → à reporter dans PRD FR-PUB-02, UX/UI §7.
- Mention d'urgence hors footer → déjà reporté dans PRD FR-PUB-07 et RM-12.
- Tarification variable → déjà reporté dans PRD-Q05 et TRD-Q10.
- Menu mobile en panneau déroulant → à reporter dans UX/UI §6.
- Bouton « Voir toute l'équipe » sous la grille (et non à côté du titre) → journal seulement (le schéma UX/UI §7 est indicatif).
- CTA « Voir le profil » sur les cartes équipe : `<span>` à l'intérieur du `<Link>`, pas un bouton séparé (évite le double focus clavier) → journal seulement.
- `BackToTop` sur toutes les pages publiques via `PageLayout` → journal seulement.
- `ScrollRestoration` + `history.scrollRestoration = 'manual'` → journal seulement.
- Photos équipe intégrées (consentements obtenus via Google Forms) → à reporter dans PRD-Q18 (résolu).
- Textes rédactionnels à valider par le client : paragraphe d'introduction de la page Équipe, résumé du centre sur l'accueil, 6 questions/réponses de la FAQ, brouillons des mentions légales et de la politique de confidentialité.

**Fichiers créés / modifiés / supprimés**
- Créés : `src/features/home/HomePage.tsx`, `src/features/home/__tests__/HomePage.test.tsx`, `src/features/about/AboutPage.tsx`, `src/features/about/__tests__/AboutPage.test.tsx`, `src/features/team/TeamPage.tsx`, `src/features/team/TeamMemberPage.tsx`, `src/features/contact/ContactPage.tsx`, `src/features/contact/ContactForm.tsx`, `src/features/contact/__tests__/ContactForm.test.tsx`, `src/features/not-found/NotFoundPage.tsx`, `src/features/not-found/__tests__/NotFoundPage.test.tsx`, `src/features/legal/LegalPage.tsx`, `src/features/legal/PrivacyPage.tsx`, `src/shared/ui/Timeline.tsx`, `src/shared/ui/__tests__/Timeline.test.tsx`, `src/shared/ui/BackToTop.tsx`, `src/shared/ui/__tests__/BackToTop.test.tsx`, `src/data/seed/historique.json`, `src/data/contracts/timelineEvent.ts`, `src/data/contracts/contactRequest.ts`, `api/contact.ts`, `.env.example`.
- Modifiés : `src/App.tsx` (routes, `ScrollRestoration`, `getStaticPaths` pour `/equipe/:slug`), `src/main.tsx` (`history.scrollRestoration = 'manual'`), `src/shared/ui/TeamCard.tsx` (lien + CTA), `src/shared/ui/Header.tsx` (menu déroulant), `src/shared/ui/Footer.tsx` (logo, tarification, retrait urgence), `src/shared/ui/AxisBlock.tsx` (retour sans icône), `src/shared/ui/PageLayout.tsx` (`BackToTop`), `src/data/seed/equipe.json` (slugs + photos), `src/data/seed/faq.json` (6 questions réelles), `src/data/ports/content.ts` (`listTimeline`), `src/data/adapters/mock/content.ts` (`listTimeline`), `src/data/contracts/index.ts` (exports), `src/data/contracts/teamMember.ts` (`slug`), `src/data/contracts/__tests__/contracts.test.ts` (timeline, slugs), `src/features/dev/DesignPage.tsx` (retrait `PageLayout`), `package.json` (react-hook-form, @hookform/resolvers, @vercel/node).
- Supprimés : `src/shared/ui/ScrollToTop.tsx`, `src/shared/ui/__tests__/AxisBlock.test.tsx` (test SVG retiré).

**Vérifications**
- `npm run test` : tous les tests passent (décompte exact à confirmer avec `npm run test`).
- `npm run build` : OK ; les 9 pages membres sont pré-rendues dans `dist/equipe/<slug>/index.html` (vérifié).
- `npm run dev` : navigation entre pages, retour arrière restaure la position, bouton retour en haut fonctionnel, menu mobile déroulant, formulaire affiche les erreurs de validation.
- Tests API : reportés (décision client).

**Reste à faire / points ouverts**
- Turnstile : à brancher quand les clés seront disponibles (V1.0 probablement).
- Envoi réel vers l'adresse du centre : à basculer quand TRD-Q01 (domaine) sera résolu.
- Tests API (`api/contact.ts`) : à écrire, décision client de reporter.
- Textes rédactionnels à valider : paragraphe Équipe, résumé accueil, 6 FAQ, brouillons légaux.
- Photos : intégrées ; vérifier la qualité (poids, dimensions) au moment de V0-F.
- V0-F : responsive 360/768/1280, accessibilité, Lighthouse, contrôle UX/UI §12, ajustements UI/UX (icônes axes, chevron accordéon, alignements).
- V0-G : déploiement prévisualisation, script de démo, grille de retours client.
- Clôture V0 : validation écrite du client (critères PRD §8).

**Prochaine étape recommandée**
V0-F : qualité et ajustements UI/UX (responsive, accessibilité, Lighthouse, contrôle UX/UI §12).

## Correctif — CTA vers la page Contact — 2026-11-24

- Boutons « Nous contacter » du header (desktop et mobile) et des cartes services reliés à `/contact` avec des liens accessibles, tout en conservant le callback `onAction` des cartes.
- Ajout de `ButtonLink` pour partager le style des boutons sans imbriquer un bouton dans un lien.
- Tests ciblés Header et ServiceCard ajoutés ; tests ciblés (15), lint des fichiers modifiés et `npm run build` passent.

## [V0-D bis] — Menu définitif figé — 2026-11-24

**Statut** : Terminé (mise à jour documentaire, pas de code)
**Documents de référence** : Appflow §2, PRD FR-PUB-06, UX/UI §6

**Objectif** : Figer la structure du menu définitif avant V0-F, pour éviter de retoucher le Header à chaque version.

**Décision**
- Menu stable : Accueil · Le centre · Services · FAQ · Rubriques (sous-menu) · Mon espace / Se connecter · [Bouton CTA].
- Sous-menu « Rubriques » : Blog (V1.0), Questions et réponses (V2), Tests (V2).
- Desktop : déroulant au survol/clic. Mobile : accordéon.
- Visibilité V0 : masqué en production, visible en mode démo avec badge « Bientôt ».
- Bouton CTA : « Nous contacter » en V0/V1.0, « Prendre rendez-vous » à partir de V1.1.

**Écarts par rapport aux documents de base**
| Réf. doc | Prévu | Réalisé | Raison |
|---|---|---|---|
| Appflow §2 | Blog, Tests, Q/R en entrées séparées | Regroupés sous « Rubriques » (sous-menu) | Éviter un menu à 10 entrées en V2 ; lisibilité desktop et mobile |
| Appflow §2 | « Se connecter » en entrée séparée | Intégré comme « Mon espace / Se connecter » | Convention ; un seul point d'entrée qui change de libellé selon l'état |

**Fichiers modifiés**
- `docs/03_Appflow.md` (§2 remplacé)
- `docs/01_PRD_Exigences_Produit.md` (FR-PUB-06 reformulé)
- `docs/04_UX_UI_Design.md` (§6 En-tête complété)

**Reste à faire**
- Implémenter le sous-menu dans `Header.tsx` (V0-F ou V1.0 selon le moment où Blog s'active).
- En V0 production, le sous-menu est masqué : le Header actuel (sans sous-menu) reste valide jusqu'à V1.0.

**Prochaine étape recommandée**
V0-F : qualité et ajustements UI/UX.