import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface FooterContact {
  phone: string;
  email: string;
  address: string;
}

interface FooterSocials {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

interface FooterConfig {
  contact: FooterContact;
  socials: FooterSocials;
  copyrightText: string;
}

const DEFAULT_FOOTER: FooterConfig = {
  contact: {
    phone: '09770074715',
    email: 'ccecom.com',
    address: 'Dumanjug, Cebu',
  },
  socials: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    youtube: '#',
  },
  copyrightText: '© 2026 CC Ecom. All Rights Reserved.',
};

// 🔥 DYNAMIC PERMANENT FIX for Footer / Parts (Cleaned single slash)
const getApiBaseUrl = () => {
  return `'https://cc-backend-production-00fe.up.railway.app/api/v1/parts/'`;
};

const API_BASE_URL = getApiBaseUrl();

// 🛠️ Helper function to safely pull error messages from FastAPI responses
const extractErrorMessage = (data: any, fallback: string): string => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ');
  }
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  return fallback;
};

const parseResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { detail: text || `Server error (Status ${response.status})` };
  }
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER);

  const fetchFooterSettings = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/parts/`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      const data = await parseResponse(response);

      if (!response.ok) {
        const msg = extractErrorMessage(data, `Failed to load footer (${response.status})`);
        console.error('[Footer] Config error:', msg);
        return;
      }

      const validConfig = data.config || data;
      if (validConfig && validConfig.footer) {
        setFooterConfig(validConfig.footer);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn('[Footer] Request timed out. Using defaults.');
      } else {
        console.error('[Footer] Failed to load footer configuration:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchFooterSettings();

    // Auto-poll every 5 seconds and sync on window focus
    const interval = setInterval(fetchFooterSettings, 5000);
    window.addEventListener('focus', fetchFooterSettings);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchFooterSettings);
    };
  }, [fetchFooterSettings]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 2500);
    }
  };

  const handleNavigationScroll = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button[type="button"]')) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer 
      onClick={handleNavigationScroll}
      className="relative bg-zinc-950 text-zinc-400 pt-0 pb-0 border-t border-zinc-900 font-sans selection:bg-sky-400 selection:text-black overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative z-10 border-b border-zinc-900 bg-zinc-900/10 backdrop-blur-[2px]">    
        <div className="max-w-7xl mx-auto text-center">    
          <a    
            href="#top"    
            className="text-[10px] uppercase tracking-[0.3em] font-semibold text-zinc-500 hover:text-sky-400 transition-colors duration-300 py-4 block w-full"    
          >    
            <span className="inline-block translate-y-[-1px] text-[8px] mr-1">▲</span> Back to Top    
          </a>    
        </div>    
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 pt-16 pb-16">    
        <div>    
          <h3 className="text-[11px] font-bold tracking-[0.25em] mb-6 text-zinc-200 uppercase">GET TO KNOW US</h3>    
          <ul className="space-y-3.5 text-xs font-light">    
            <li><Link to="/about" className="hover:text-sky-400 transition-colors duration-200 block">About Us</Link></li>    
            <li><Link to="/careers" className="hover:text-sky-400 transition-colors duration-200 block">Careers</Link></li>    
            <li><Link to="/blog" className="hover:text-sky-400 transition-colors duration-200 block">Blog</Link></li>    
          </ul>    
        </div>    

        <div>    
          <h3 className="text-[11px] font-bold tracking-[0.25em] mb-6 text-zinc-200 uppercase">SHOP WITH US</h3>    
          <ul className="space-y-3.5 text-xs font-light">    
            <li><Link to="/deals" className="hover:text-sky-400 transition-colors duration-200 block">Today&apos;s Deals</Link></li>    
            <li><Link to="/gift-cards" className="hover:text-sky-400 transition-colors duration-200 block">Gift Cards</Link></li>    
            <li><Link to="/categories" className="hover:text-sky-400 transition-colors duration-200 block">All Categories</Link></li>    
          </ul>    
        </div>    

        <div>    
          <h3 className="text-[11px] font-bold tracking-[0.25em] mb-6 text-sky-400 uppercase">MAKE MONEY WITH US</h3>    
          <ul className="space-y-3.5 text-xs font-normal text-zinc-300">    
            <li><Link to="/Collab" className="hover:text-sky-300 transition-colors duration-200 block">Affiliate Program</Link></li>    
            <li><Link to="/Collab" className="hover:text-sky-300 transition-colors duration-200 block">Become a Seller</Link></li>    
          </ul>    
        </div>    

        <div>    
          <h3 className="text-[11px] font-bold tracking-[0.25em] mb-6 text-zinc-200 uppercase">LET US HELP YOU</h3>    
          <ul className="space-y-3.5 text-xs font-light">    
            <li><Link to="/Profile" className="hover:text-sky-400 transition-colors duration-200 block">Your Account</Link></li>    
            <li><Link to="/orders" className="hover:text-sky-400 transition-colors duration-200 block">Your Orders</Link></li>    
            <li><Link to="/Support" className="hover:text-sky-400 transition-colors duration-200 block">Help Center</Link></li>    
          </ul>    
        </div>    

        <div className="flex flex-col justify-between space-y-6">    
          <div>    
            <h3 className="text-[11px] font-bold tracking-[0.25em] mb-5 text-zinc-200 uppercase">STAY IN TOUCH</h3>    
            <p className="text-[11px] font-light text-zinc-500 mb-4 leading-relaxed">Subscribe for private allocations &amp; collection arrivals.</p>    
            <form onSubmit={handleSubscribe} className="relative border-b border-zinc-800 pb-1 focus-within:border-sky-400 transition-colors duration-300">    
              <div className="flex items-center justify-between">    
                <input    
                  type="email"    
                  value={email}    
                  onChange={(e) => setEmail(e.target.value)}    
                  placeholder="Enter your email"    
                  className="bg-transparent w-full pr-12 text-xs text-white focus:outline-none font-light placeholder-zinc-600 py-1"    
                  required    
                />    
                <button    
                  type="submit"    
                  className="text-[10px] uppercase tracking-widest font-bold text-sky-400 hover:text-sky-300 absolute right-0 transition-colors cursor-pointer"    
                >    
                  Join    
                </button>    
              </div>    
            </form>    
            {subscribed && (    
              <p className="text-sky-400 text-[10px] font-mono tracking-wider mt-2 animate-pulse">✓ Registry logged.</p>    
            )}    
          </div>    

          <div className="space-y-3 pt-2 text-xs font-light border-t border-zinc-900">    
            <div className="flex gap-2 items-center">    
              <PhoneSVG />    
              <a href={`tel:${footerConfig.contact.phone}`} className="text-zinc-400 hover:text-sky-400 font-mono text-[11px] transition-colors">
                {footerConfig.contact.phone}
              </a>    
            </div>    
            <div className="flex gap-2 items-center">    
              <MailSVG />    
              <a href={`mailto:${footerConfig.contact.email}`} className="text-zinc-400 hover:text-sky-400 text-[11px] transition-colors truncate">
                {footerConfig.contact.email}
              </a>    
            </div>    
            <div className="flex gap-2 items-start text-zinc-500 text-[11px] font-light pt-0.5 leading-relaxed">    
              <LocationSVG />    
              <span>{footerConfig.contact.address}</span>    
            </div>    
          </div>    
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 border-t border-zinc-900 pt-8 pb-8">    
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">    
          <div className="flex items-center gap-4 justify-center md:justify-start">    
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Follow Logs</p>    
            <div className="flex gap-4 text-zinc-500">    
              <a href={footerConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors duration-200"><FacebookSVG /></a>    
              <a href={footerConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors duration-200"><TwitterSVG /></a>    
              <a href={footerConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors duration-200"><InstagramSVG /></a>    
              <a href={footerConfig.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors duration-200"><YoutubeSVG /></a>    
            </div>    
          </div>    

          <div className="text-center md:text-right text-[10px] tracking-widest uppercase font-mono text-zinc-600 leading-relaxed md:col-span-2">    
            Data Streams Intercept Protected <br />    
            By <span className="text-sky-400 font-bold">256-Bit SSL Encryption</span>    
          </div>    
        </div>
      </div>

      <div className="relative z-10 bg-zinc-950 border-t border-zinc-900 py-6">    
        <div className="max-w-7xl mx-auto px-6 sm:px-12">    
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-light text-zinc-500">    
            <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center md:justify-start">    
              <Link to="/Legal" className="hover:text-zinc-300 transition-colors">Conditions of Use</Link>    
              <Link to="/Legal" className="hover:text-zinc-300 transition-colors">Privacy Charter</Link>    
            </div>    
            <div className="font-mono text-[10px] tracking-tight">{footerConfig.copyrightText}</div>    
          </div>    
        </div>
      </div>    
    </footer>  
  );
};

const PhoneSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-sky-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-sky-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2" />
  </svg>
);

const LocationSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314-11.314z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FacebookSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
);

const TwitterSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
);

const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.23-.148-4.771-1.69-4.919-4.919C2.013 15.585 2 15.205 2 12c0-3.204.012-3.584.07-4.85.148-3.23 1.69-4.771 4.919-4.919 1.265-.058 1.645-.07 4.849-.07zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4z"/></svg>
);

const YoutubeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/></svg>
);

export default Footer;
