import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AVAILABLE_TOOLS = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'
];

const USE_CASES = ['coding', 'writing', 'research', 'mixed', 'data'];

export default function SpendForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamSize: 1,
    primaryUseCase: 'mixed',
    tools: []
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('aiSpendData');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data');
      }
    } else {
      // Default tool
      setFormData(prev => ({
        ...prev,
        tools: [{ id: Date.now(), name: 'ChatGPT', plan: 'Plus', monthlySpend: 20, seats: 1 }]
      }));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('aiSpendData', JSON.stringify(formData));
  }, [formData]);

  const addTool = () => {
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, { id: Date.now(), name: '', plan: '', monthlySpend: 0, seats: 1 }]
    }));
  };

  const removeTool = (id) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.id !== id)
    }));
  };

  const updateTool = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out tools with no name
    const activeTools = formData.tools.filter(t => t.name);
    if (activeTools.length === 0) {
      alert("Please add at least one AI tool.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        teamSize: Number(formData.teamSize),
        primaryUseCase: formData.primaryUseCase,
        tools: activeTools.map(t => ({
          name: t.name,
          plan: t.plan,
          monthlySpend: Number(t.monthlySpend),
          seats: Number(t.seats)
        }))
      };

      // CALL SUPABASE EDGE FUNCTION
      const { data, error } = await supabase.functions.invoke('process-audit', {
        body: payload
      });

      if (error) throw error;
      
      // Navigate to results page with the server-calculated data
      navigate('/results', { 
        state: { 
          auditResults: data.auditResults, 
          summary: data.summary,
          reportId: data.reportId,
          inputData: payload 
        } 
      });
    } catch (error) {
      console.error("Audit failed:", error);
      alert("Failed to process audit. Have you deployed the Supabase Edge Function?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-3xl mx-auto mt-12 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Your AI Tech Stack</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Company Basics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-background rounded-lg border border-border">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Team Size</label>
            <input 
              type="number" 
              min="1"
              className="input w-full" 
              value={formData.teamSize}
              onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Primary AI Use Case</label>
            <select 
              className="input w-full"
              value={formData.primaryUseCase}
              onChange={(e) => setFormData({...formData, primaryUseCase: e.target.value})}
            >
              {USE_CASES.map(uc => (
                <option key={uc} value={uc}>{uc.charAt(0).toUpperCase() + uc.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Tools</h3>
            <button 
              type="button" 
              onClick={addTool}
              className="text-primary hover:text-primaryHover flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add Tool
            </button>
          </div>
          
          {formData.tools.length === 0 && (
            <div className="text-center py-8 text-textMuted bg-background rounded-lg border border-border border-dashed">
              No tools added yet. Click 'Add Tool' to get started.
            </div>
          )}

          {formData.tools.map((tool, index) => (
            <div key={tool.id} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-background p-4 rounded-lg border border-border group relative">
              <div className="w-full md:w-1/4">
                <label className="block text-xs text-textMuted mb-1">Tool Name</label>
                <select 
                  className="input w-full text-sm py-2 px-3"
                  value={tool.name}
                  onChange={(e) => updateTool(tool.id, 'name', e.target.value)}
                  required
                >
                  <option value="">Select tool...</option>
                  {AVAILABLE_TOOLS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-xs text-textMuted mb-1">Plan/Tier</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pro, Enterprise" 
                  className="input w-full text-sm py-2 px-3"
                  value={tool.plan}
                  onChange={(e) => updateTool(tool.id, 'plan', e.target.value)}
                  required
                />
              </div>
              
              <div className="w-1/2 md:w-1/5">
                <label className="block text-xs text-textMuted mb-1">Seats</label>
                <input 
                  type="number" 
                  min="1"
                  className="input w-full text-sm py-2 px-3"
                  value={tool.seats}
                  onChange={(e) => updateTool(tool.id, 'seats', e.target.value)}
                  required
                />
              </div>

              <div className="w-1/2 md:w-1/5">
                <label className="block text-xs text-textMuted mb-1">Monthly Spend ($)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  className="input w-full text-sm py-2 px-3"
                  value={tool.monthlySpend}
                  onChange={(e) => updateTool(tool.id, 'monthlySpend', e.target.value)}
                  required
                />
              </div>

              <div className="w-full md:w-auto flex justify-end">
                <button 
                  type="button" 
                  onClick={() => removeTool(tool.id)}
                  className="text-textMuted hover:text-danger p-2 transition-colors focus:outline-none"
                  aria-label="Remove tool"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            className="btn-primary w-full flex justify-center items-center gap-2 py-3 text-lg"
            disabled={loading || formData.tools.length === 0}
          >
            {loading ? 'Analyzing Spend...' : 'Audit My Stack'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}
