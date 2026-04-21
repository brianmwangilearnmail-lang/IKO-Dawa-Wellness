import React from 'react';
import { Leaf, ShieldCheck, Zap } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const AboutPage: React.FC = () => {
  const { siteContent } = useSite();

  return (
    <div className="relative z-20 py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--bg)]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-8">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-600 font-bold mb-4">
            {siteContent.about_eyebrow}
          </p>
          <h1 className="text-5xl md:text-8xl font-serif text-slate-950 leading-none">
            {siteContent.about_heading.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="italic">{siteContent.about_heading.split(' ').slice(-1)}</span>
          </h1>
        </div>
        <p className="text-base md:text-lg text-slate-500 max-w-sm leading-relaxed">
          {siteContent.about_intro}
        </p>
      </div>

      {/* Main Story Split */}
      <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-center mb-32">
        <div className="lg:col-span-5 relative">
          <div className="aspect-[3/4] rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl">
            <img
              src={siteContent.about_image_url}
              alt="Laboratory"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-emerald-950/10" />
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60" />
        </div>

        <div className="lg:col-span-7 space-y-10 text-left">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
            {siteContent.about_story_heading.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="italic">{siteContent.about_story_heading.split(' ').slice(-1)}</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-slate-900 font-bold text-sm uppercase tracking-widest border-b border-emerald-500/20 pb-2 w-max">
                {siteContent.about_beginning_title}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">{siteContent.about_beginning_text}</p>
            </div>
            <div className="space-y-4">
              <p className="text-slate-900 font-bold text-sm uppercase tracking-widest border-b border-emerald-500/20 pb-2 w-max">
                {siteContent.about_standards_title}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">{siteContent.about_standards_text}</p>
            </div>
          </div>
          <div className="pt-8 block">
            <div className="p-8 bg-slate-950 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="topo-pattern opacity-5" />
              <div className="relative z-10">
                <h4 className="text-xl font-serif mb-1">{siteContent.about_cta_title}</h4>
                <p className="text-white/40 text-xs">{siteContent.about_cta_subtitle}</p>
              </div>
              <button className="relative z-10 px-8 py-3 bg-white text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-md">
                {siteContent.about_cta_btn}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 text-emerald-600">
            <Leaf className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl mb-4 text-slate-950">{siteContent.value1_title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{siteContent.value1_text}</p>
        </div>

        <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl mb-4 text-slate-950">{siteContent.value2_title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{siteContent.value2_text}</p>
        </div>

        <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-blue-600">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl mb-4 text-slate-950">{siteContent.value3_title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{siteContent.value3_text}</p>
        </div>
      </div>
    </div>
  );
};
