import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useSite } from '../context/SiteContext';

// ─────────────────────────────────────────────────────────────────────────────
// Contact Page
// ─────────────────────────────────────────────────────────────────────────────
export const ContactPage: React.FC = () => {
  const { siteContent } = useSite();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('contact_messages').insert([{
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error submitting form:', error);
      setPopup({ show: true, type: 'error', message: 'Failed to send message. Please try again later.' });
    } else {
      setPopup({ show: true, type: 'success', message: 'Message sent successfully! We will get back to you shortly.' });
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="relative z-20 py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--bg)]">
      <div className="grid lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-12 h-full flex flex-col justify-center">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-emerald-600 mb-6">Connect</p>
            <h1 className="text-5xl md:text-8xl font-serif text-slate-950 leading-none mb-8">
              {siteContent.contact_heading.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="italic">{siteContent.contact_heading.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-md">{siteContent.contact_subtext}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-12 pt-8">
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{siteContent.contact_email_label}</p>
              <a href={`mailto:${siteContent.contact_email}`} className="text-lg font-serif text-slate-900 border-b border-transparent hover:border-emerald-500 transition-colors block italic">
                {siteContent.contact_email}
              </a>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{siteContent.contact_phone_label}</p>
              <a href={`tel:${siteContent.contact_phone}`} className="text-lg font-serif text-slate-900 border-b border-transparent hover:border-emerald-500 transition-colors block italic">
                {siteContent.contact_phone}
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="topo-pattern opacity-5" />
          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">First Name</label>
                <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium" placeholder="First Name" required disabled={isSubmitting} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Last Name</label>
                <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium" placeholder="Last Name" required disabled={isSubmitting} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium" placeholder="your@email.com" required disabled={isSubmitting} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Topic of Interest</label>
              <div className="relative">
                <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-emerald-500 transition-all appearance-none font-medium cursor-pointer" required disabled={isSubmitting}>
                  <option value="">Select Topic</option>
                  <option value="order">Order Protocol</option>
                  <option value="product">Formulation Question</option>
                  <option value="wholesale">Collaborations</option>
                  <option value="other">General Inquiry</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Your Message</label>
              <textarea rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-emerald-500 transition-all resize-none font-medium placeholder:text-slate-300" placeholder="Describe your inquiry..." required disabled={isSubmitting}></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-950 hover:bg-emerald-700 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all mt-4 shadow-xl active:scale-95 disabled:opacity-50">
              {isSubmitting ? 'Transmitting...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {popup.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setPopup({ ...popup, show: false })} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center border border-slate-100">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 ${popup.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {popup.type === 'success' ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              </div>
              <h3 className="font-serif text-3xl text-slate-950 mb-4 italic">{popup.type === 'success' ? 'Received' : 'Connection Error'}</h3>
              <p className="text-slate-500 mb-10 leading-relaxed text-sm">{popup.message}</p>
              <button onClick={() => setPopup({ ...popup, show: false })} className="w-full py-4 bg-slate-950 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg">Dismiss</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Science Page
// ─────────────────────────────────────────────────────────────────────────────
export const SciencePage: React.FC = () => {
  const { siteContent } = useSite();

  return (
    <div className="relative z-20 py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--bg)]">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-8">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-600 font-bold mb-4">{siteContent.science_eyebrow}</p>
          <h1 className="text-5xl md:text-8xl font-serif text-slate-950 leading-none">
            {siteContent.science_heading.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="italic text-emerald-800">{siteContent.science_heading.split(' ').slice(-1)}</span>
          </h1>
        </div>
        <p className="text-base md:text-lg text-slate-500 max-w-sm leading-relaxed">{siteContent.science_intro}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl">
            <img src={siteContent.science_image_url} alt="Microscope" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-emerald-950/10" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100/30 rounded-full blur-[100px] -z-10" />
        </div>

        <div className="space-y-12 order-1 lg:order-2">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight italic">{siteContent.science_story_heading}</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{siteContent.science_story_body}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl mb-2 italic">{siteContent.science_card1_title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{siteContent.science_card1_text}</p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl mb-2 italic">{siteContent.science_card2_title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{siteContent.science_card2_text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Privacy Page
// ─────────────────────────────────────────────────────────────────────────────
export const PrivacyPage: React.FC = () => {
  const { siteContent } = useSite();

  return (
    <div className="relative z-20 py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-[var(--bg)]">
      <div className="mb-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-600 font-bold mb-6">{siteContent.privacy_intro}</p>
        <h1 className="text-5xl md:text-7xl font-serif text-slate-950 leading-none mb-4 italic">Privacy Policy</h1>
        <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mt-8">{siteContent.privacy_revised}</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 space-y-12 text-slate-600 leading-relaxed shadow-2xl relative overflow-hidden">
        <div className="topo-pattern opacity-5" />
        <section className="relative z-10">
          <h2 className="font-serif text-2xl text-slate-950 mb-4 italic">{siteContent.privacy_section1_title}</h2>
          <p className="border-l-2 border-emerald-500/20 pl-6">{siteContent.privacy_section1_text}</p>
        </section>
        <section className="relative z-10">
          <h2 className="font-serif text-2xl text-slate-950 mb-4 italic">{siteContent.privacy_section2_title}</h2>
          <p className="border-l-2 border-emerald-500/20 pl-6">{siteContent.privacy_section2_text}</p>
        </section>
        <section className="relative z-10">
          <h2 className="font-serif text-2xl text-slate-950 mb-4 italic">{siteContent.privacy_section3_title}</h2>
          <p className="border-l-2 border-emerald-500/20 pl-6">{siteContent.privacy_section3_text}</p>
        </section>
      </div>
    </div>
  );
};
