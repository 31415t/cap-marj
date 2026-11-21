export function LegalPage() {
  return (
    <article className="py-8 space-y-6 max-w-[var(--mesure)]">
      <h1 className="text-h1 font-titre text-encre">Mentions légales</h1>
      <p className="text-petit text-attention-texte bg-attention-fond p-3 rounded-[var(--rayon-fiche)]">
        Brouillon à faire relire par les juristes du centre avant publication.
      </p>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Éditeur du site</h2>
        <p className="text-corps text-encre-douce">
          Centre d'Appui PsychoMédical Jean Renold Alphonse (CAP-MARJ)<br />
          Route Myriam II, Prolongée, Grand Lakou, Port-de-Paix, Haïti<br />
          Courriel : capmarj2017@gmail.com<br />
          Téléphones : 33623544, 47606868, 47606734, 42543517<br />
          Numéro fiscal : 000-528-695-7
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Directeur de la publication</h2>
        <p className="text-corps text-encre-douce">
          Jean Renold Alphonse, fondateur du CAP-MARJ.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Hébergement</h2>
        <p className="text-corps text-encre-douce">
          Le site est hébergé par Vercel Inc. Les données sont stockées dans l'Union
          européenne et aux États-Unis (à préciser après validation du TRD-Q07).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Propriété intellectuelle</h2>
        <p className="text-corps text-encre-douce">
          L'ensemble des contenus (textes, photographies, logo) est la propriété du
          CAP-MARJ, sauf mention contraire. Toute reproduction sans autorisation écrite
          est interdite.
        </p>
      </section>
    </article>
  )
}