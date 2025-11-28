
import React, { useState, useEffect } from 'react';
import { FlaskConical, Leaf, AlertCircle, Loader2, Calendar, Scale, CheckCircle2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { FertilizerPlan } from '../types';

const STORAGE_KEY = 'agriqnet_fertilizer_advisor';

const FertilizerAdvisor: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Initialize state from localStorage
  const savedData = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { return {}; }
  })();

  const [crop, setCrop] = useState(savedData.crop || '');
  const [soilType, setSoilType] = useState(savedData.soilType || 'Loamy');
  const [plans, setPlans] = useState<FertilizerPlan[]>(savedData.plans || []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ crop, soilType, plans }));
  }, [crop, soilType, plans]);

  const handleRecommend = async () => {
    if(!crop) return;
    setLoading(true);
    setPlans([]); // Clear previous plans
    try {
      const results = await GeminiService.recommendFertilizer(crop, soilType);
      setPlans(results);
    } catch (err) {
      console.error(err);
      alert("Unable to generate recommendations. Please check your API key or connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-agri-100">
        <div className="text-center max-w-2xl mx-auto mb-8">
           <div className="inline-flex p-3 rounded-full bg-yellow-100 text-yellow-600 mb-4">
             <FlaskConical size={32} />
           </div>
           <h2 className="text-3xl font-bold text-gray-800">Smart Fertilizer Calculator</h2>
           <p className="text-gray-500 mt-2">Get precise nutrient dosage plans tailored to your specific crop and soil type to maximize yield while maintaining soil health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-700">Target Crop</label>
             <input 
              type="text" 
              placeholder="e.g. Tomato, Corn, Wheat"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all text-gray-900 placeholder-gray-400"
            />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-700">Soil Condition</label>
             <select 
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all text-gray-900"
             >
               <option value="Loamy">Loamy (Balanced)</option>
               <option value="Clay">Clay (Heavy)</option>
               <option value="Sandy">Sandy (Drains fast)</option>
               <option value="Silt">Silt (Retains moisture)</option>
               <option value="Peaty">Peaty (Acidic)</option>
             </select>
           </div>
        </div>

        <button 
          onClick={handleRecommend}
          disabled={loading || !crop}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Generate Nutrient Plan'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex flex-col h-full hover:border-yellow-300 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
              <div className="p-2 bg-green-50 rounded-full text-green-600 group-hover:bg-green-100 transition-colors">
                <Leaf size={20} />
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
            </div>
            
            <div className="mt-auto space-y-4">
              <div className="bg-yellow-50 rounded-xl p-4 space-y-4 border border-yellow-100">
                 {/* Frequency Section */}
                 <div className="flex gap-4 items-start">
                    <div className="bg-white p-2 rounded-lg text-yellow-600 shadow-sm shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Application Frequency</h4>
                      <p className="text-gray-900 font-medium text-sm">{plan.applicationFrequency}</p>
                    </div>
                 </div>

                 <div className="h-px bg-yellow-200 w-full opacity-50"></div>

                 {/* Dosage Section */}
                 <div className="flex gap-4 items-start">
                    <div className="bg-white p-2 rounded-lg text-yellow-600 shadow-sm shrink-0">
                      <Scale size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Recommended Dosage</h4>
                      <p className="text-gray-900 font-medium text-sm">{plan.dosage}</p>
                    </div>
                 </div>
              </div>

              {plan.warnings && plan.warnings.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-xs uppercase tracking-wide">
                    <AlertCircle size={14} />
                    <span>Important Warnings</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.warnings.map((w, i) => (
                      <li key={i} className="flex gap-2 text-xs text-red-800 leading-snug">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FertilizerAdvisor;
