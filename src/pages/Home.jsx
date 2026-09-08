import React from 'react';
import SpendForm from '../components/SpendForm';
import { TrendingDown, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Abstract background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Stop overpaying for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">AI tools</span>
          </h1>
          <p className="text-xl text-textMuted max-w-2xl mx-auto mb-10 leading-relaxed">
            Startups waste thousands annually on redundant licenses and unoptimized API tiers. Get an instant, data-backed audit of your AI stack.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-textMuted font-medium">
            <div className="flex items-center gap-2">
              <Zap className="text-primary" size={18} /> Instant Analysis
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="text-success" size={18} /> Maximize ROI
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-purple-400" size={18} /> Privacy First
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 relative z-10">
        <SpendForm />
      </section>
    </div>
  );
}
