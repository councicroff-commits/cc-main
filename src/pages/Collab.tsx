// src/pages/Collab.tsx
import React, { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Loader2, AlertCircle, X, ArrowRight } from 'lucide-react';

interface ProgramCard {
  id: number;
  title: string;
  description: string;
  badge: string;
  perk: string;
}

const Collab: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProgramId = searchParams.get('program');

  // EmailJS form state and modal controls
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // EmailJS Credentials matching your Support page
  const SERVICE_ID = "service_3b1n6pf"; 
  const TEMPLATE_ID = "template_usy7zmb";
  const PUBLIC_KEY = "32RSWwfXlMqGSXsWe";

  const programs: ProgramCard[] = [
    {
      id: 1,
      title: 'Affiliate Program',
      badge: 'Influence',
      description: 'Monetize your visual presence. Earn premium commission tiers by sharing curated aesthetics with your audience.',
      perk: 'Up to 15% Commission'
    },
    {
      id: 2,
      title: 'Associates Program',
      badge: 'Network',
      description: 'Integrate into our enterprise layer. Build deep content architectures using specialized API monetization resources.',
      perk: 'Advanced API Tools'
    },
    {
      id: 3,
      title: 'Become a Seller',
      badge: 'Enterprise',
      description: 'Deploy your premium creations directly through our digital storefront matrix and instantly reach elite global buyers.',
      perk: 'Global Storefront Access'
    },
    {
      id: 4,
      title: 'Delivery Partners',
      badge: 'Logistics',
      description: 'Drive the final architectural milestone. Partner with us to execute white-glove, high-precision luxury delivery tracks.',
      perk: 'Elite Delivery Tiers'
    },
    {
      id: 5,
      title: 'Brand Registry',
      badge: 'Protection',
      description: 'Secure your house intellectual properties. Lock down unique engineering traits and manage brand distribution rights.',
      perk: 'IP Priority Protection'
    },
    {
      id: 6,
      title: 'Advertise Our Products',
      badge: 'Visibility',
      description: 'Launch cinematic advertising pipelines. Put your catalog directly at the core focal points of premium consumer tracks.',
      perk: 'Targeted High-Intent Placements'
    }
  ];

  const activeProgram = programs.find((p) => p.id.toString() === selectedProgramId);

  const handleApplyClick = (id: number) => {
    setSearchParams({ program: id.toString() });
    setStatus('idle');
  };

  const closeModal = () => {
    setSearchParams({});
    setStatus('idle');
  };

  // EmailJS Send Application Handler
  const sendApplicationEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('submitting');
    setErrorMessage('');

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(
        () => {
          setStatus('success');
          formRef.current?.reset();
          // Reset status back to idle after 5 seconds
          setTimeout(() => {
            setStatus('idle');
          }, 5000);
        },
        (error) => {
          console.error('EmailJS Error:', error);
          setStatus('error');
          setErrorMessage(error?.text || 'Transmission interrupted. Please try again.');
          setTimeout(() => {
            setStatus('idle');
          }, 5000);
        }
      );
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen overflow-hidden selection:bg-sky-500/30 font-sans">
      
      {/* ================================================= */}  
      {/* HERO SECTION / LANDING AXIS */}  
      {/* ================================================= */}  
      <section className="relative pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-0 w-[600px] md:w-[1000px] h-[400px] bg-sky-500/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(240,240,245,0.6)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="px-5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 backdrop-blur-xl shadow-sm">
              <span className="text-[10px] tracking-[0.45em] uppercase font-semibold text-sky-600">
                Ecosystem Framework
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.35em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 drop-shadow-sm">
            Make Money With Us
          </h1>

          <p className="mt-6 text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Unleash enterprise capabilities. Seamlessly align your brand, audience, or logistical networks with our luxury infrastructure.
          </p>
        </div>
      </section>

      {/* ================================================= */}  
      {/* CARD GRID LAYOUT ECOSYSTEM */}  
      {/* ================================================= */}  
      <section className="relative pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => {
            const isHovered = hoveredCard === program.id;
            
            return (
              <div
                key={program.id}
                onMouseEnter={() => setHoveredCard(program.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative overflow-hidden rounded-[28px] bg-zinc-50 border border-zinc-200/80 p-8 transition-all duration-500 hover:border-sky-500/40 shadow-xl shadow-zinc-200/50 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {isHovered && (
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-500/10 blur-[40px] rounded-full pointer-events-none transition-opacity duration-500" />
                )}

                <div className="flex justify-between items-start mb-6">
                  <span className="px-3.5 py-1 rounded-full bg-zinc-200/60 border border-zinc-300/60 text-zinc-700 text-[9px] uppercase font-bold tracking-widest">
                    {program.badge}
                  </span>
                  
                  <span className="text-zinc-400 group-hover:text-sky-600 transition-colors duration-300 text-xs font-light">
                    0{program.id} //
                  </span>
                </div>

                <h3 className="text-zinc-900 text-xl font-bold tracking-tight group-hover:text-sky-700 transition-colors duration-300">
                  {program.title}
                </h3>

                <p className="mt-3 text-zinc-600 text-xs font-light leading-relaxed min-h-[64px]">
                  {program.description}
                </p>

                <div className="mt-6 pt-5 border-t border-zinc-200/60 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Primary Asset</span>
                    <span className="text-zinc-800 text-[11px] font-medium tracking-wide">{program.perk}</span>
                  </div>

                  <button
                    onClick={() => handleApplyClick(program.id)}
                    className="px-5 py-2 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-md transition-all duration-300 hover:bg-sky-600 hover:scale-[1.03] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================= */}  
      {/* QUICK INQUIRY INTAKE SUB-LAYER */}  
      {/* ================================================= */}  
      <section className="relative py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.04),transparent_65%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="uppercase tracking-[0.5em] text-sky-600 text-[10px] font-bold block mb-3">Enterprise Access</span>
          <h2 className="text-zinc-900 text-2xl sm:text-3xl font-black tracking-tight">Can't Find Your Deployment?</h2>
          <p className="mt-4 text-zinc-600 text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto">
            Contact our strategic operations pipeline directly to craft custom architectural cross-integrations.
          </p>

          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 text-white font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-sky-500/25 hover:scale-[1.03] transition-all duration-500"
            >
              Contact Operations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* EMAILJS APPLICATION MODAL LAYER                   */}
      {/* ================================================= */}
      {activeProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-[28px] bg-white border border-zinc-200 p-8 shadow-2xl overflow-hidden text-zinc-900">
            
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-sky-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-[9px] uppercase font-bold tracking-widest">
                  {activeProgram.badge} Tier
                </span>
                <h3 className="text-zinc-900 text-xl font-bold tracking-tight mt-2">
                  Apply for {activeProgram.title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 flex items-center justify-center transition-colors text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-zinc-900 text-lg font-bold">Application Transmitted</h4>
                <p className="mt-2 text-zinc-600 text-xs font-light">
                  Our strategic operations team has received your submission and will reach out shortly.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 px-6 py-2.5 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-sky-600 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={sendApplicationEmail} className="space-y-4">
                {/* Hidden variables for EmailJS template synchronization */}
                <input type="hidden" name="program_title" value={activeProgram.title} />
                <input type="hidden" name="program_badge" value={activeProgram.badge} />
                <input type="hidden" name="to_email" value="ccexccecom@gmail.com" />

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1.5">
                    Full Name / Entity
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name or organization"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1.5">
                    Portfolio / Social / Network Link
                  </label>
                  <input
                    type="text"
                    name="user_link"
                    placeholder="https://yourdomain.com or profile handle"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1.5">
                    Deployment Proposal / Background
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    required
                    placeholder="Briefly describe your vision or infrastructure capabilities..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-[11px] font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> {errorMessage || 'Failed to send. Please try again.'}
                  </p>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status !== 'idle'}
                    className={`px-7 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] shadow-md transition-all cursor-pointer flex items-center gap-2
                      ${status === 'success' 
                        ? 'bg-emerald-500 text-white' 
                        : status === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 text-white hover:scale-[1.02]'
                      }
                      disabled:opacity-70 disabled:cursor-not-allowed
                    `}
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Transmitting...
                      </>
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sent Successfully
                      </>
                    ) : (
                      'Submit Application →'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Collab;
