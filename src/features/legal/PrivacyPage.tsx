export function PrivacyPage() {
  return (
    <article className="py-8 space-y-6 max-w-[var(--mesure)]">
      <h1 className="text-h1 font-titre text-encre">Politique de confidentialité</h1>
      <p className="text-petit text-attention-texte bg-attention-fond p-3 rounded-[var(--rayon-fiche)]">
        Brouillon à faire relire par les juristes du centre avant publication.
      </p>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Données collectées</h2>
        <p className="text-corps text-encre-douce">
          Le site collecte uniquement les données que vous transmettez volontairement via
          le formulaire de contact : nom, moyen de contact, service concerné, message.
          Aucune donnée de santé n'est demandée ni stockée via le site.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Finalité</h2>
        <p className="text-corps text-encre-douce">
          Ces données servent uniquement à répondre à votre demande. Elles ne sont ni
          vendues ni partagées avec des tiers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Conservation</h2>
        <p className="text-corps text-encre-douce">
          Les demandes de contact sont conservées le temps nécessaire au traitement, puis
          archivées ou supprimées. La durée exacte sera fixée avec les juristes du centre.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Vos droits</h2>
        <p className="text-corps text-encre-douce">
          Vous pouvez demander l'accès, la rectification ou la suppression de vos données
          en écrivant à capmarj2017@gmail.com.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-h2 font-titre text-marine">Cookies</h2>
        <p className="text-corps text-encre-douce">
          Le site n'utilise aucun cookie publicitaire ni traceur. Les polices et les
          ressources sont auto-hébergées.
        </p>
      </section>
    </article>
  )
}