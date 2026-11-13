import React, { useState } from 'react';
import { ArrowRight, X, ShieldCheck, Truck, RefreshCw, Banknote, FileText } from 'lucide-react';
import { MissionSection } from './MissionSection';

interface FooterProps {
  onNavigate?: (view: 'home' | 'shop' | 'about' | 'contact') => void;
  showManifesto?: boolean;
}

type PolicyType = 'livraison' | 'retours' | 'paiement' | 'confidentialite' | 'cgv' | null;

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate, showManifesto = true }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [activePolicyModal, setActivePolicyModal] = useState<PolicyType>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed) {
      setEmailError('Veuillez renseigner votre adresse e-mail.');
      setSubmissionFeedback(null);
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setEmailError('Format d’adresse e-mail invalide.');
      setSubmissionFeedback(null);
      return;
    }

    setEmailError(null);

    // Functional submission: persist locally
    try {
      const stored = JSON.parse(localStorage.getItem('fremkys_subscribers') || '[]');
      if (!stored.includes(trimmed)) {
        stored.push(trimmed);
        localStorage.setItem('fremkys_subscribers', JSON.stringify(stored));
      }
    } catch {
      // Fallback if localStorage is unavailable
    }

    // Functional dispatch path: generate direct opt-in mailto to official concierge
    const subject = encodeURIComponent('Inscription Liste Privée - Maison FREMKYS');
    const body = encodeURIComponent(
      `Bonjour Maison FREMKYS,\n\nJe souhaite inscrire mon adresse e-mail (${trimmed}) à la liste de diffusion privée de vos prochaines collections.\n\nCordialement.`
    );

    // Open user's email client for genuine dispatch
    window.location.href = `mailto:contact@fremkys.com?subject=${subject}&body=${body}`;

    setSubmissionFeedback(
      `Demande d'inscription préparée pour ${trimmed}. Vérifiez l'envoi dans votre messagerie.`
    );
  };

  return (
    <div className="w-full select-none">
      
      {/* 1. Pre-Footer Manifesto Banner with Clip-path Reveal & Parallax (Shown only on Home) */}
      {showManifesto && <MissionSection />}

      {/* 2. Pure Black Luxury Minimalist Footer */}
      <footer className="w-full bg-[#000000] text-white py-12 md:py-16 px-4 sm:px-8 md:px-14 border-t border-neutral-900">
        <div className="max-w-[1680px] mx-auto">
          
          {/* Top 5-Column Navigation Grid: Mobile 1 column, Tablet 2 columns, Desktop 5 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 xl:gap-12">
            
            {/* Column 1: BOUTIQUE (Unnecessary category titles removed) */}
            <div className="space-y-3">
              <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 pb-1">
                BOUTIQUE
              </h5>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('shop')} 
                    className="font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors cursor-pointer text-left py-0.5 min-h-[36px] flex items-center"
                  >
                    La Collection
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('shop')} 
                    className="font-sans text-[14px] font-medium text-white hover:text-neutral-200 transition-colors cursor-pointer text-left py-0.5 min-h-[36px] flex items-center"
                  >
                    Nouveautés Spring 26
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: LA MAISON (Unnecessary fake titles removed) */}
            <div className="space-y-3">
              <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 pb-1">
                LA MAISON
              </h5>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('about')} 
                    className="font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors cursor-pointer text-left py-0.5 min-h-[36px] flex items-center"
                  >
                    À propos de FREMKYS
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('contact')} 
                    className="font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors cursor-pointer text-left py-0.5 min-h-[36px] flex items-center"
                  >
                    Contact &amp; Conciergerie
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: SERVICES & ENGAGEMENTS */}
            <div className="space-y-3">
              <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 pb-1">
                SERVICES &amp; ENGAGEMENTS
              </h5>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActivePolicyModal('livraison')}
                    className="font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors cursor-pointer text-left py-0.5 min-h-[36px] flex items-center"
                  >
                    Livraison 58 Wilayas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActivePolicyModal('retours')}
                    className="font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors cursor-pointer text-left py-0.5 min-h-[36px] flex items-center"
                  >
                    Échanges sous 7 jours
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActivePolicyModal('paiement')}
                    className="font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors cursor-pointer text-left py-0.5 min-h-[36px] flex items-center"
                  >
                    Paiement à la livraison
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: SUIVEZ-NOUS */}
            <div className="space-y-3">
              <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 pb-1">
                SUIVEZ-NOUS
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.instagram.com/fremkys.boutique/?__pwa=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 space-x-reverse font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors group py-0.5 min-h-[36px]"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 stroke-[1.8] text-neutral-400 group-hover:text-white shrink-0" />
                    <span>Instagram (@fremkys.boutique)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/213774296525"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 space-x-reverse font-sans text-[14px] font-normal text-neutral-300 hover:text-white transition-colors group py-0.5 min-h-[36px]"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-400 shrink-0" />
                    <span>WhatsApp (+213 774 29 65 25)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: LETTRE D'INFORMATION */}
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <h5 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 pb-1">
                LETTRE D'INFORMATION
              </h5>
              <p className="font-sans text-[14px] text-neutral-400 font-normal leading-[1.6]">
                Recevez en avant-première nos nouvelles créations, invitations privées et actualités de la Maison.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="pt-1 space-y-2">
                <div className={`border-b transition-colors pb-1.5 flex items-center justify-between ${
                  emailError ? 'border-red-500' : 'border-neutral-700 focus-within:border-white'
                }`}>
                  <input
                    type="email"
                    placeholder="Votre adresse e-mail"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    className="w-full bg-transparent text-[14px] font-sans text-white placeholder-neutral-500 focus:outline-none py-1"
                  />
                  <button
                    type="submit"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-white hover:opacity-60 transition-opacity pl-2 cursor-pointer text-sm"
                    title="Envoyer la demande d'inscription"
                    aria-label="Envoyer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {emailError && (
                  <p className="font-sans text-[11px] text-red-400 font-light leading-tight">
                    {emailError}
                  </p>
                )}

                {submissionFeedback && (
                  <p className="font-sans text-[11px] text-neutral-200 font-light leading-tight bg-neutral-900 p-2 border border-neutral-800">
                    {submissionFeedback}
                  </p>
                )}
              </form>
            </div>

          </div>

          {/* 3. Official FREMKYS Signature Wordmark: Mobile 48px, Desktop 72px */}
          <div className="w-full overflow-hidden mt-12 sm:mt-16 mb-8 sm:mb-10 flex items-center justify-center text-center">
            <span className="font-serif text-[42px] sm:text-[48px] md:text-6xl lg:text-[72px] font-normal tracking-[-0.02em] leading-[1.1] uppercase select-none text-white">
              FREMKYS
            </span>
          </div>

          {/* 4. Bottom Line: Clean French Legal Mentions (Mobile 10px, Desktop 11px) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-neutral-500 font-normal text-center sm:text-left pt-6 border-t border-neutral-900">
            <div className="flex items-center space-x-6 md:space-x-8">
              <button 
                onClick={() => setActivePolicyModal('confidentialite')} 
                className="hover:text-white transition-colors cursor-pointer py-1"
              >
                POLITIQUE DE CONFIDENTIALITÉ
              </button>
              <button 
                onClick={() => setActivePolicyModal('cgv')} 
                className="hover:text-white transition-colors cursor-pointer py-1"
              >
                CONDITIONS GÉNÉRALES DE VENTE
              </button>
            </div>
            <div>
              <span>2026 &copy; FREMKYS. TOUS DROITS RÉSERVÉS.</span>
            </div>
          </div>

          {/* 5. Designer Credit */}
          <div className="mt-5 pt-[18px] border-t border-[rgba(255,255,255,0.08)] flex justify-center text-center">
            <a
              href="https://wa.me/213552864430?text=Bonjour%20tahat%20!%20J'ai%20vu%20le%20site%20de%20Fremkys%20et%20je%20veux%20un%20site%20comme%20celui-ci."
              target="_blank"
              rel="nofollow noopener"
              className="group inline-flex flex-col items-center justify-center space-y-1 font-sans no-underline transition-all duration-200 select-none cursor-pointer"
            >
              {/* Line 1 */}
              <div className="flex items-baseline justify-center space-x-1.5 text-center">
                <span className="text-[10px] tracking-[0.18em] uppercase text-neutral-500 font-normal">
                  SITE CONÇU PAR
                </span>
                <span className="text-[13px] font-semibold text-[#e5e5e5] lowercase tracking-normal">
                  tahat<span className="designer-blue-dot text-[#2563EB] font-bold text-[14px] leading-none inline-block transition-transform duration-300 group-hover:scale-150">.</span>
                </span>
              </div>

              {/* Line 2 with Hover text swap */}
              <div className="h-[18px] flex items-center justify-center text-[11px] font-normal tracking-wide">
                <span className="text-[#8a8a8a] group-hover:hidden transition-colors">
                  envie d'un site comme celui-ci ? &rarr;
                </span>
                <span className="text-[#2563EB] hidden group-hover:inline transition-colors font-medium">
                  Parler au designer &rarr;
                </span>
              </div>
            </a>
          </div>

        </div>
      </footer>

      {/* Operational Policy & Legal Detail Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#121212] text-white max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-neutral-800 text-left">
            <button
              onClick={() => setActivePolicyModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>

            {activePolicyModal === 'livraison' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <Truck className="w-5 h-5" />
                  <h3 className="font-serif text-lg uppercase tracking-wide">Livraison dans les 58 Wilayas</h3>
                </div>
                <div className="text-xs text-neutral-300 leading-relaxed space-y-2.5 font-sans pt-1">
                  <p>
                    • <strong>Couverture Nationale :</strong> Nous assurons la livraison sécurisée à domicile ou en point relais (Stop Desk) selon la grille tarifaire officielle de votre wilaya.
                  </p>
                  <p>
                    • <strong>Délais d'expédition :</strong> 24h à 48h pour le Nord et les grandes métropoles, 48h à 72h pour les Hauts-Plateaux et le Sud.
                  </p>
                  <p>
                    • <strong>Suivi &amp; Appel préalable :</strong> Notre transporteur vous contacte systématiquement par téléphone avant le passage pour convenir de l'horaire de remise en main propre.
                  </p>
                </div>
              </div>
            )}

            {activePolicyModal === 'retours' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <RefreshCw className="w-5 h-5" />
                  <h3 className="font-serif text-lg uppercase tracking-wide">Politique d'Échange sous 7 Jours</h3>
                </div>
                <div className="text-xs text-neutral-300 leading-relaxed space-y-2.5 font-sans pt-1">
                  <p>
                    • <strong>Droit d'essayage :</strong> Essayez votre création en toute sérénité à domicile lors de la livraison.
                  </p>
                  <p>
                    • <strong>Échange sous 7 jours :</strong> En cas de taille inadaptée ou de changement d'avis, un échange de taille ou de modèle est garanti dans un délai de 7 jours ouvrés.
                  </p>
                  <p>
                    • <strong>Condition impérative :</strong> La pièce doit être intacte, non portée, non lavée et comporter ses étiquettes et scellés d'origine.
                  </p>
                </div>
              </div>
            )}

            {activePolicyModal === 'paiement' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <Banknote className="w-5 h-5" />
                  <h3 className="font-serif text-lg uppercase tracking-wide">Paiement à la Livraison (Cash on Delivery)</h3>
                </div>
                <div className="text-xs text-neutral-300 leading-relaxed space-y-2.5 font-sans pt-1">
                  <p>
                    • <strong>Zéro risque :</strong> Vous ne payez aucun acompte en ligne. Le règlement s'effectue directement en espèces (Dinars Algériens - DZD) auprès du livreur.
                  </p>
                  <p>
                    • <strong>Vérification du colis :</strong> Vous inspectez l'emballage et la conformité de votre commande avant de remettre le paiement.
                  </p>
                  <p>
                    • <strong>Facture &amp; Reçu :</strong> Un reçu officiel vous est remis lors de la livraison pour votre garantie.
                  </p>
                </div>
              </div>
            )}

            {activePolicyModal === 'confidentialite' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-serif text-lg uppercase tracking-wide">Politique de Confidentialité</h3>
                </div>
                <div className="text-xs text-neutral-300 leading-relaxed space-y-2.5 font-sans pt-1">
                  <p>
                    • <strong>Protection des Données :</strong> Vos coordonnées (nom, numéro de téléphone, adresse) sont strictement confidentielles et réservées au traitement de votre commande.
                  </p>
                  <p>
                    • <strong>Non-divulgation :</strong> La Maison FREMKYS ne cède ni ne commercialise aucune de vos informations personnelles à des tiers à des fins publicitaires.
                  </p>
                  <p>
                    • <strong>Droits du Client :</strong> Vous pouvez à tout moment demander la modification ou la suppression de vos données en contactant notre conciergerie.
                  </p>
                </div>
              </div>
            )}

            {activePolicyModal === 'cgv' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-serif text-lg uppercase tracking-wide">Conditions Générales de Vente</h3>
                </div>
                <div className="text-xs text-neutral-300 leading-relaxed space-y-2.5 font-sans pt-1">
                  <p>
                    • <strong>Commandes :</strong> Toute commande passée sur la boutique en ligne fait l'objet d'un appel téléphonique de confirmation préalable par un conseiller FREMKYS.
                  </p>
                  <p>
                    • <strong>Tarifs :</strong> Les prix sont affichés en Dinars Algériens (DZD) toutes taxes comprises. Les frais de livraison sont calculés selon la wilaya de destination.
                  </p>
                  <p>
                    • <strong>Garantie Authenticité :</strong> Toutes les créations sont certifiées de haute facture artisanale et emballées dans un coffret de protection officiel.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-5 mt-4 border-t border-neutral-800 flex items-center justify-end">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-6 py-2.5 bg-white text-black text-[11px] uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
