// src/pages/Support.tsx
import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Support = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // EmailJS credentials provided
    const SERVICE_ID = "service_3b1n6pf"; 
    const TEMPLATE_ID = "template_usy7zmb";
    const PUBLIC_KEY = "32RSWwfXlMqGSXsWe";

    if (form.current) {
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
        .then(() => {
          setStatus('success');
          form.current?.reset();
          setTimeout(() => setStatus('idle'), 5000);
        }, (error) => {
          console.error('EmailJS Error:', error);
          setStatus('error');
          setTimeout(() => setStatus('idle'), 5000);
        });
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-28 pb-16 selection:bg-sky-500/30">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-transparent">
            Support & Contact
          </h1>
          <p className="text-zinc-600 text-lg max-w-md mx-auto">
            Premium assistance for your CC Ecom journey. We typically respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Contact Details Side */}
          <div className="lg:col-span-2 space-y-8">
            {[
              { icon: <Phone />, title: "Call Us", value: "+63 977 007 4715" },
              { icon: <Mail />, title: "Email Us", value: "ccexccecom@gmail.com" },
              { icon: <MapPin />, title: "Visit Us", value: "Cebu, Philippines" }
            ].map((method, index) => (
              <div key={index} className="group flex gap-5 p-3 rounded-2xl hover:bg-zinc-50 transition-colors duration-300 border border-transparent hover:border-zinc-200">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                  {React.cloneElement(method.icon as React.ReactElement, { size: 20 })}
                </div>
                <div>
                  <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">{method.title}</h3>
                  <p className="text-lg font-semibold text-zinc-900">{method.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-3 bg-zinc-50/80 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-orange-500 opacity-60" />
            
            <h3 className="text-2xl font-bold mb-8 text-zinc-900">Send a Message</h3>
            
            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-wider">Full Name</label>
                  <input 
                    required
                    name="name"
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full bg-white px-6 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all placeholder:text-zinc-400 text-zinc-900" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-wider">Email Address</label>
                  <input 
                    required
                    name="email"
                    type="email" 
                    placeholder="PLEASE ADD YOUR EMAIL" 
                    className="w-full bg-white px-6 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all placeholder:text-zinc-400 text-zinc-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-wider">Message</label>
                <textarea 
                  required
                  name="message"
                  placeholder="How can we help you today?" 
                  rows={4} 
                  className="w-full bg-white px-6 py-4 rounded-2xl border border-zinc-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 transition-all resize-none placeholder:text-zinc-400 text-zinc-900"
                ></textarea>
              </div>

              <button 
                disabled={status !== 'idle'}
                type="submit" 
                className={`w-full py-5 rounded-2xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer
                  ${status === 'success' 
                    ? 'bg-emerald-500 text-white' 
                    : status === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-[#ff9900] hover:bg-[#e68a00] text-zinc-950 shadow-lg shadow-orange-500/20 active:scale-95'
                  }
                  disabled:opacity-70 disabled:cursor-not-allowed
                `}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Message Sent
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Try Again
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
