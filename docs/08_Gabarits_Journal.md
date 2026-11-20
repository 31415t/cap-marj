# Gabarits du journal d'implémentation — Plateforme CAP-MARJ

| Champ | Valeur |
|---|---|
| Rôle | Modèles à copier pour ouvrir et clore une phase |
| Convention | Une entrée par phase ; jamais de réécriture d'une entrée passée |
| Documents liés | `07_Journal_Implementation.md` |

---

## Gabarit A — Ouverture de phase

## [<ID phase>] — Ouverture — <date ISO>

**Phase précédente** : <ID> — <statut> — <une phrase de bilan>

**Phase ouverte** : <ID> — <titre>

**Objectif** : <1 à 3 phrases>

**Livrable vérifiable** : <test vert, build OK, démo, fichier précis>

**Ce que prévoient les documents**
- PRD : <section(s)>
- TRD : <section(s)>
- Appflow : <section(s)>
- UX/UI : <section(s)>
- Backend Schema : <section(s)>
- Plan : <section(s)>

**Ce qu'on a déjà** (fichiers existants réutilisés)
- `chemin/…` — <rôle dans cette phase>

**Fichiers à mettre à jour**
- `chemin/…` — <nature de la modification>

**Fichiers à créer**
- `chemin/…` — <rôle>

**Ce qu'on doit trancher**
| Réf. | Question | Réponse par défaut | Bloque ? |
|---|---|---|---|
| … | … | … | oui/non |

**Ce qu'on doit changer et pourquoi**
| Réf. doc | Prévu | Changement | Raison | Impact |
|---|---|---|---|---|
| … | … | … | … | … |

**Risques identifiés**
- <risque> → <parade>

**Critères de sortie**
- [ ] <critère 1>
- [ ] <critère 2>

---

## Gabarit B — Clôture de phase

## [<ID phase>] — <Titre court> — <date ISO>

**Statut** : Terminé | Partiel | Bloqué
**Durée réelle** : <heures ou « non mesurée »>
**Documents de référence** : <liste des sections précises>

**Objectif de la phase**
<1 à 3 phrases>

**Réalisé**
- <fait 1, avec le fichier/dossier concerné>

**Écarts par rapport aux documents de base**
| Réf. document | Prévu | Réalisé | Raison |
|---|---|---|---|
| … | … | … | … |

**Décisions prises (à reporter dans les documents si structurantes)**
- <décision> → <document à mettre à jour, ou « journal seulement »>

**Fichiers créés / modifiés / supprimés**
- Créés : `chemin/…`
- Modifiés : `chemin/…`
- Supprimés : `chemin/…`

**Vérifications**
- `npm run test` : X passed
- `npm run build` : OK / échec (détail)
- Autres : <Lighthouse, accessibilité, etc.>

**Reste à faire / points ouverts**
- <point 1>

**Prochaine étape recommandée**
<1 phrase>