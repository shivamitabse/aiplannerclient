import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, AlertTriangle, ArrowLeft, Mail, Share2, Sparkles } from 'lucide-react';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [isConsultation, setIsConsultation] = useState(false);
  const leadFormRef = useRef(null);

  useEffect(() => {
    if (!location.state || !location.state.auditResults) {
      navigate('/');
      return;
    }

    const fetchSummary = async () => {
      try {
        const { auditResults, inputData } = location.state;
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/summary`, {
          teamSize: inputData.teamSize,
          tools: inputData.tools,
          auditResults
        });
        setSummary(res.data.summary);
      } catch (err) {
        console.error(err);
        setSummary("We analyzed your tech stack and found areas for optimization. Review the recommendations below.");
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [location, navigate]);

  if (!location.state || !location.state.auditResults) return null;

  const { auditResults, inputData } = location.state;
  const { recommendations, totalMonthlySavings, totalAnnualSavings, currentMonthlySpend } = auditResults;

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadLoading(true);
    try {
      const payload = {
        email, company, role,
        auditData: { auditResults, inputData },
        summary,
        isConsultation
      };
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/lead`, payload);
      
      const url = `${window.location.origin}/audit/${res.data.reportId}`;
      setShareUrl(url);
    } catch (err) {
      console.error(err);
      alert('Failed to save report.');
    } finally {
      setLeadLoading(false);
    }
  };

  const handleBookConsultation = () => {
    setIsConsultation(true);
    if (leadFormRef.current) {
      leadFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Find the email input and focus it
      const emailInput = leadFormRef.current.querySelector('input[type="email"]');
      if (emailInput) emailInput.focus();
    }
  };

  const handleTwitterShare = () => {
    const text = `I just found potential savings of $${totalAnnualSavings.toLocaleString()}/year on my AI spend using AI Spendly! Check out my full report:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const isOptimized = recommendations.length === 0 || (recommendations.length === 1 && recommendations[0].tool === 'General');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Audit Form
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Audit Results</h1>
        <p className="text-xl text-textMuted max-w-2xl mx-auto">
          We've analyzed your ${currentMonthlySpend}/mo AI spend for your team of {inputData.teamSize}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center col-span-1 md:col-span-1 border-primary/30 bg-primary/5">
          <div className="text-sm font-medium text-textMuted mb-2">Potential Annual Savings</div>
          <div className="text-5xl font-extrabold text-white">${totalAnnualSavings.toLocaleString()}</div>
          <div className="text-success text-sm mt-2 font-medium">
            ${totalMonthlySavings.toLocaleString()}/mo
          </div>
        </div>
        
        <div className="card col-span-1 md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
            <Sparkles size={20} /> AI Summary
          </div>
          {loadingSummary ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-surfaceHighlight rounded w-3/4"></div>
              <div className="h-4 bg-surfaceHighlight rounded w-full"></div>
              <div className="h-4 bg-surfaceHighlight rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-textMuted leading-relaxed">{summary}</p>
          )}
        </div>
      </div>

      {isOptimized ? (
        <div className="card border-success/30 bg-success/5 mb-12 flex flex-col items-center text-center py-10">
          <CheckCircle2 className="text-success w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Highly Optimized!</h2>
          <p className="text-textMuted max-w-md">
            Your current AI stack is well-aligned with your team size and use case. Keep **AI Spendly** in mind as you scale to ensure your costs stay lean!
          </p>
        </div>
      ) : (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Action Plan</h2>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="card flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-surfaceHighlight p-3 rounded-lg flex-shrink-0 mt-1">
                  {rec.tool === 'General' ? <Sparkles className="text-primary" /> : <AlertTriangle className="text-warning text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">
                    {rec.tool === 'General' ? 'Architecture Tip' : `Optimize ${rec.tool}`}
                  </h3>
                  <p className="text-textMuted mb-3 leading-relaxed">{rec.message}</p>
                </div>
                {rec.potentialSavings > 0 && (
                  <div className="text-right flex-shrink-0 w-full md:w-auto">
                    <div className="text-success font-bold text-xl">+${rec.potentialSavings}/mo</div>
                    <div className="text-xs text-textMuted">savings</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {totalMonthlySavings > 500 && (
        <div className="card bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/50 text-center mb-12 p-8">
          <h3 className="text-2xl font-bold mb-3 text-white">Need help implementing these changes?</h3>
          <p className="text-textMuted mb-6 max-w-lg mx-auto">
            Our experts can help you migrate to a more cost-effective API architecture without losing productivity.
          </p>
          <button 
            onClick={handleBookConsultation}
            className="btn-primary"
          >
            Book a Free Consultation
          </button>
        </div>
      )}

      {/* Lead Capture */}
      <div 
        ref={leadFormRef}
        className={`card max-w-2xl mx-auto transition-all duration-500 ${isConsultation ? 'border-primary shadow-primary/20 bg-primary/5 ring-1 ring-primary/50' : 'bg-surfaceHighlight/30 border-border'}`}
      >
        {shareUrl ? (
          <div className="text-center py-6">
            <CheckCircle2 className="text-success w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {isConsultation ? 'Consultation Booked!' : 'Report Saved!'}
            </h3>
            <p className="text-textMuted mb-6">
              {isConsultation ? "We've received your request and emailed you the report." : "We've emailed you a copy of this report."}
            </p>
            <div className="bg-surface p-4 rounded-lg flex flex-col sm:flex-row items-center gap-3 border border-border">
              <span className="truncate text-sm text-textMuted flex-1 text-left w-full sm:w-auto">{shareUrl}</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-1.5 flex-1 sm:flex-initial"
                >
                  <Share2 size={14} /> Copy
                </button>
                <button 
                  onClick={handleTwitterShare}
                  className="bg-black hover:bg-zinc-800 text-white px-3 py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm flex-1 sm:flex-initial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={`p-2 rounded-full ${isConsultation ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold">
                {isConsultation ? 'Book Your Free Consultation' : 'Save & Share This Report'}
              </h3>
            </div>
            <p className="text-center text-textMuted mb-6 text-sm">
              {isConsultation 
                ? 'Enter your details below to schedule your audit review and save this report.'
                : 'Enter your email to get a shareable public URL and keep this audit for your records.'
              }
            </p>
            
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <input 
                type="email" 
                placeholder="Work Email" 
                className="input w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Company (Optional)" 
                  className="input w-full"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Your Role (Optional)" 
                  className="input w-full"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2"
                disabled={leadLoading}
              >
                {leadLoading ? 'Processing...' : (isConsultation ? 'Book Consultation & Save Report' : 'Get My Report')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
