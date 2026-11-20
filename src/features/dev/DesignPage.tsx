export function DesignPage() {
  return (
    <div className="p-8 space-y-8" style={{ maxWidth: 'var(--largeur-page)' }}>
      <h1 className="text-h1 font-titre text-encre">Design system — CAP-MARJ</h1>

      <section>
        <h2 className="text-h2 font-titre text-marine mb-4">Boutons</h2>
        <div className="flex gap-4">
          <button className="bg-vert-cap text-papier px-6 h-12 rounded-(--rayon-controle) font-semibold">
            Nous contacter
          </button>
          <button className="border-[1.5px] border-marine text-marine px-6 h-12 rounded-(--rayon-controle) font-semibold">
            Découvrir nos services
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-titre text-marine mb-4">Champs</h2>
        <div className="max-w-md space-y-2">
          <label className="block text-petit font-semibold text-encre">Courriel</label>
          <input
            className="w-full h-12 px-3 border border-(--bordure-champ) rounded-(--rayon-controle) focus:outline-none focus:ring-2 focus:ring-marine"
            placeholder="vous@exemple.com"
          />
          <p className="text-petit text-erreur">Format de courriel invalide.</p>
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-titre text-marine mb-4">Badge « Bientôt »</h2>
        <span className="bg-seve text-marine text-petit px-3 py-1 rounded-(--rayon-fiche)">
          Bientôt
        </span>
      </section>

      <section>
        <h2 className="text-h2 font-titre text-marine mb-4">Fiche service (V0)</h2>
        <div className="border border-bordure rounded-(--rayon-fiche) p-6 max-w-sm space-y-3">
          <h3 className="text-h3 font-titre text-encre">Consultation psychologique</h3>
          <p className="text-corps text-encre-douce">
            Consultation, évaluation psychologique et psychothérapie pour enfants, adolescents, adultes et familles.
          </p>
          <button className="bg-vert-cap text-papier px-5 h-10 rounded-(--rayon-controle) text-petit font-semibold">
            Nous contacter
          </button>
        </div>
      </section>
    </div>
  )
}