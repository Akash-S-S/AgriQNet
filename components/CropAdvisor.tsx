
import React, { useState, useEffect } from 'react';
import { Sprout, Droplets, FlaskConical, MapPin, Loader2, CheckCircle, Clock, TrendingUp, DollarSign, X, Sun, Info, Leaf } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { SoilData, CropRecommendation } from '../types';

// Predefined dictionary for common crops to ensure high-quality, relevant images
const CROP_IMAGES: Record<string, string> = {
  'rice': 'https://images.unsplash.com/photo-1536617621572-1d5f1e6269a0?auto=format&fit=crop&w=800&q=80',
  'wheat': 'https://images.unsplash.com/photo-1501430654243-c934cec2e1c0?auto=format&fit=crop&w=800&q=80',
  'maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  'cotton': 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&w=800&q=80',
  'sugarcane': 'https://images.unsplash.com/photo-1601633596236-4c4c234a9040?auto=format&fit=crop&w=800&q=80',
  'soybean': 'https://images.unsplash.com/photo-1526346698789-22fd84310124?auto=format&fit=crop&w=800&q=80',
  'barley': 'https://images.unsplash.com/photo-1518563259397-59c23b3eb981?auto=format&fit=crop&w=800&q=80',
  'coffee': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  'tea': 'https://images.unsplash.com/photo-1558230263-5490726d691e?auto=format&fit=crop&w=800&q=80',
  'sunflower': 'https://images.unsplash.com/photo-1471193945509-9adadd0974ce?auto=format&fit=crop&w=800&q=80',
  'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
  'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
  'chili': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
  'grape': 'https://images.unsplash.com/photo-1537640538965-1756fb9880bb?auto=format&fit=crop&w=800&q=80',
};

const STORAGE_KEY = 'agriqnet_crop_advisor';

const CropAdvisor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);

  // Initialize state from localStorage
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).recommendations : [];
    } catch {
      return [];
    }
  });

  const [soilData, setSoilData] = useState<SoilData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).soilData : {
        nitrogen: 40,
        phosphorus: 50,
        potassium: 40,
        ph: 6.5,
        rainfall: 1200
      };
    } catch {
      return {
        nitrogen: 40,
        phosphorus: 50,
        potassium: 40,
        ph: 6.5,
        rainfall: 1200
      };
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ recommendations, soilData }));
  }, [recommendations, soilData]);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const results = await GeminiService.recommendCrops(soilData);
      setRecommendations(results);
    } catch (err) {
      alert("Failed to get recommendations. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoilData({ ...soilData, [e.target.name]: parseFloat(e.target.value) });
  };

  const getCropImage = (cropName: string) => {
    const normalizedName = cropName.toLowerCase().trim();
    
    // 1. Check strict match
    if (CROP_IMAGES[normalizedName]) {
      return CROP_IMAGES[normalizedName];
    }

    // 2. Check partial match (e.g. "hybrid corn" -> matches "corn")
    const keys = Object.keys(CROP_IMAGES);
    for (const key of keys) {
      if (normalizedName.includes(key)) {
        return CROP_IMAGES[key];
      }
    }

    // 3. Fallback to dynamic service if not found
    const tags = `${cropName.replace(/\s+/g, ',')},agriculture,plant`;
    return `https://loremflickr.com/800/600/${tags}?lock=${cropName.length}`; 
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Detailed View Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setSelectedCrop(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="relative h-64 md:h-80">
               <img 
                 src={getCropImage(selectedCrop.name)} 
                 alt={selectedCrop.name} 
                 className="w-full h-full object-cover" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h2 className="text-4xl font-bold text-white mb-1">{selectedCrop.name}</h2>
                  <p className="text-green-300 font-medium italic text-lg">{selectedCrop.scientificName}</p>
               </div>
            </div>

            <div className="p-8 space-y-8">
               {/* Quick Stats Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
                    <CheckCircle className="mx-auto text-green-600 mb-2" size={24} />
                    <div className="text-xs text-gray-500 uppercase font-bold">Confidence</div>
                    <div className="text-xl font-bold text-gray-800">{selectedCrop.confidence}%</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                    <Clock className="mx-auto text-blue-600 mb-2" size={24} />
                    <div className="text-xs text-gray-500 uppercase font-bold">Growth Time</div>
                    <div className="text-xl font-bold text-gray-800 leading-tight text-sm md:text-base mt-1">{selectedCrop.growthPeriod}</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                    <TrendingUp className="mx-auto text-orange-600 mb-2" size={24} />
                    <div className="text-xs text-gray-500 uppercase font-bold">Yield</div>
                    <div className="text-xl font-bold text-gray-800 leading-tight text-sm md:text-base mt-1">{selectedCrop.yieldPotential}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 text-center">
                    <DollarSign className="mx-auto text-yellow-600 mb-2" size={24} />
                    <div className="text-xs text-gray-500 uppercase font-bold">Economy</div>
                    <div className="text-xl font-bold text-gray-800 leading-tight text-sm md:text-base mt-1 line-clamp-2">{selectedCrop.economicAnalysis.split('.')[0]}</div>
                  </div>
               </div>

               {/* Detailed Analysis */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                     <Info size={20} className="text-agri-600" /> Analysis
                   </h3>
                   <p className="text-gray-600 leading-relaxed text-justify">
                     {selectedCrop.description}
                   </p>
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-700 mb-2 text-sm">Economic Viability</h4>
                      <p className="text-sm text-gray-600">{selectedCrop.economicAnalysis}</p>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                     <Leaf size={20} className="text-agri-600" /> Requirements
                   </h3>
                   <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Droplets size={18} /></div>
                        <div>
                          <span className="text-xs text-gray-400 font-bold uppercase">Water Needs</span>
                          <p className="text-sm font-medium text-gray-700">{selectedCrop.requirements.water}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Sun size={18} /></div>
                        <div>
                          <span className="text-xs text-gray-400 font-bold uppercase">Sunlight</span>
                          <p className="text-sm font-medium text-gray-700">{selectedCrop.requirements.sun}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><MapPin size={18} /></div>
                        <div>
                          <span className="text-xs text-gray-400 font-bold uppercase">Soil Preference</span>
                          <p className="text-sm font-medium text-gray-700">{selectedCrop.requirements.soil}</p>
                        </div>
                      </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Input Section */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-agri-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-agri-100 rounded-xl text-agri-600">
                <FlaskConical size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Soil Data</h2>
                <p className="text-sm text-gray-500">Enter your field parameters</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (N)</label>
                <input type="range" name="nitrogen" min="0" max="140" value={soilData.nitrogen} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-agri-500" />
                <div className="text-right text-xs text-agri-600 font-bold">{soilData.nitrogen} mg/kg</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (P)</label>
                <input type="range" name="phosphorus" min="0" max="100" value={soilData.phosphorus} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-agri-500" />
                <div className="text-right text-xs text-agri-600 font-bold">{soilData.phosphorus} mg/kg</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (K)</label>
                <input type="range" name="potassium" min="0" max="100" value={soilData.potassium} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-agri-500" />
                <div className="text-right text-xs text-agri-600 font-bold">{soilData.potassium} mg/kg</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                  <input type="number" name="ph" step="0.1" value={soilData.ph} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-agri-500 outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
                  <input type="number" name="rainfall" value={soilData.rainfall} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-agri-500 outline-none" />
                </div>
              </div>
            </div>

            <button 
              onClick={handleRecommend}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-agri-600 to-agri-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-agri-500/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sprout />}
              Analyze & Recommend
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full md:w-2/3">
          {recommendations.length === 0 && !loading ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl p-12">
               <Sprout size={48} className="mb-4 text-gray-300" />
               <p className="text-lg">Enter soil details to get AI-powered crop advice.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {recommendations.map((crop, idx) => (
                 <div 
                  key={idx} 
                  onClick={() => setSelectedCrop(crop)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer transform hover:-translate-y-1"
                >
                    <div className="h-40 overflow-hidden relative">
                      {/* Use dynamic semantic image source */}
                      <img 
                        src={getCropImage(crop.name)} 
                        alt={crop.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-agri-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> {crop.confidence}% Match
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{crop.name}</h3>
                      <p className="text-xs text-gray-400 italic mb-3">{crop.scientificName}</p>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{crop.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Droplets size={14} className="text-blue-500" />
                          <span>{crop.requirements.water}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Sun size={14} className="text-orange-500" />
                          <span>{crop.requirements.sun}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                         <span className="text-xs font-bold text-agri-600 uppercase tracking-wide group-hover:underline">Click for Analysis</span>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropAdvisor;
