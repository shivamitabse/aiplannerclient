import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SharedReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/report/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Report Not Found</h1>
        <p className="text-textMuted mb-8">This audit report does not exist or has been removed.</p>
        <Link to="/" className="btn-primary">Create Your Own Audit</Link>
      </div>
    );
  }

  const { auditData, summary } = report;
  const { auditResults, inputData } = auditData;
  const { recommendations, totalMonthlySavings, totalAnnualSavings, currentMonthlySpend } = auditResults;
  const isOptimized = recommendations.length === 0 || (recommendations.length === 1 && recommendations[0].tool === 'General');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Spend Audit Report</h1>
          <div className="text-textMuted mt-1">
            Team Size: {inputData.teamSize} &bull; Primary Use: <span className="capitalize">{inputData.primaryUseCase}</span>
          </div>
        </div>
        <Link to="/" className="btn-primary text-sm hidden sm:block">Run Your Own Audit</Link>
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
          <p className="text-textMuted leading-relaxed">{summary}</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Current Stack (${currentMonthlySpend}/mo)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {inputData.tools.map((t, i) => (
            <div key={i} className="bg-surfaceHighlight p-4 rounded-lg border border-border">
              <div className="font-bold text-lg">{t.name}</div>
              <div className="text-sm text-textMuted mb-2">{t.plan} Plan</div>
              <div className="flex justify-between text-sm">
                <span>{t.seats} seat(s)</span>
                <span className="font-medium">${t.monthlySpend}/mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOptimized ? (
        <div className="card border-success/30 bg-success/5 mb-12 flex flex-col items-center text-center py-10">
          <CheckCircle2 className="text-success w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Highly Optimized Stack</h2>
          <p className="text-textMuted max-w-md">
            This team's AI spend is well optimized for their size and use case.
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
      
      <div className="text-center sm:hidden pb-8">
        <Link to="/" className="btn-primary w-full block text-center py-3">Run Your Own Audit</Link>
      </div>
    </div>
  );
}
