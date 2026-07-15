'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageCropper } from '../../components/ImageCropper';

export default function AdminDashboard() {
  const [content, setContent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [siteMode, setSiteMode] = useState('design');
  const [croppingImageSrc, setCroppingImageSrc] = useState(null);
  const [croppingPath, setCroppingPath] = useState(null);
  const [croppingIndex, setCroppingIndex] = useState(null);
  const [croppingAspect, setCroppingAspect] = useState(16 / 9);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSite = params.get('site') || 'design';
    setSiteMode(initialSite);
    
    setContent(null);
    fetch(`/api/content?site=${initialSite}`)
      .then(res => res.json())
      .then(data => setContent(data));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await fetch(`/api/content?site=${siteMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleImageSelect = (e, path, index = null, aspect = 16 / 9) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setCroppingImageSrc(url);
    setCroppingPath(path);
    setCroppingIndex(index);
    setCroppingAspect(aspect);
    e.target.value = '';
  };

  const handleCropDone = async (croppedFile) => {
    const formData = new FormData();
    
    // Calculate folder and old URL for garbage collection and organization
    const folderName = croppingPath[0] || 'general';
    let oldUrl = null;
    
    if (croppingIndex !== null) {
      const images = content[croppingPath[0]][croppingPath[1]];
      if (images && images[croppingIndex]) {
        oldUrl = images[croppingIndex];
      }
    } else if (croppingPath.length === 3) {
      const items = content[croppingPath[0]];
      if (items && items[croppingPath[1]]) {
        oldUrl = items[croppingPath[1]][croppingPath[2]];
      }
    } else if (croppingPath.length === 2) {
      oldUrl = content[croppingPath[0]][croppingPath[1]];
    }

    formData.append('file', croppedFile);
    formData.append('site', siteMode); // Append the current site (print or design)
    formData.append('folder', folderName);
    if (oldUrl && oldUrl.startsWith('http')) {
      formData.append('oldUrl', oldUrl);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        if (croppingIndex !== null) {
          const newImages = [...(content[croppingPath[0]][croppingPath[1]] || [])];
          newImages[croppingIndex] = data.url;
          updateField(croppingPath, newImages);
        } else {
          updateField(croppingPath, data.url);
        }
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setCroppingImageSrc(null);
      setCroppingPath(null);
      setCroppingIndex(null);
      setCroppingAspect(16 / 9);
    }
  };

  const updateField = (path, value) => {
    setContent(prev => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General & Offers', icon: Icons.Megaphone },
    { id: 'hero', label: 'Hero Section', icon: Icons.Type },
    { id: 'services', label: 'Service Categories', icon: Icons.Layers },
    { id: 'contact', label: 'Contact & Social', icon: Icons.Contact },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-black font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 md:h-screen z-20 shadow-sm md:shadow-none">
        <div className="p-8 pb-4">
          <h1 className="font-black text-2xl tracking-tight leading-none mb-1">
            PRYSAL
          </h1>
          <p className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Admin Workspace</p>
          <div className="inline-flex items-center space-x-1 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">
            {siteMode === 'design' ? <Icons.MonitorSmartphone size={10} /> : <Icons.Printer size={10} />}
            <span className="uppercase">{siteMode} Hub</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hidden md:block">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 w-full p-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-black text-white shadow-lg scale-100' 
                  : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-black scale-95 hover:scale-100'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-gray-400'} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto p-4 space-x-2 hide-scrollbar border-b border-gray-100 bg-white shadow-inner">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-6 border-t border-gray-100 hidden md:block space-y-3">
          <a href="/" target="_blank" className="flex items-center justify-center space-x-2 w-full p-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            <Icons.ExternalLink size={18} />
            <span>View Live Site</span>
          </a>
          <button onClick={handleLogout} className="flex items-center justify-center space-x-2 w-full p-4 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
            <Icons.LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:h-screen overflow-hidden">
        
        {/* Sticky Top Action Bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 md:px-10 py-5 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-10 shadow-sm gap-4">
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-1">
              <h2 className="text-2xl font-black">{tabs.find(t => t.id === activeTab)?.label} - {siteMode.toUpperCase()} HUB</h2>
            </div>
            <p className="text-sm text-gray-500 font-medium hidden md:block">Manage your website content securely.</p>
          </div>
          <div className="flex items-center space-x-4">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="hidden md:flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-bold text-sm"
                >
                  <Icons.CheckCircle2 size={16} />
                  <span>Published</span>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-brand-gradient text-white px-6 md:px-8 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-2 transition-all"
            >
              <Icons.Save size={18} />
              <span>{isSaving ? 'Saving...' : 'Publish'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
          <div className="max-w-4xl mx-auto">
            
            {/* GENERAL & OFFERS TAB */}
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* Special Offer */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Icons.Megaphone size={24} /></div>
                    <h3 className="text-xl font-bold">Top Notification Bar</h3>
                  </div>
                  <div className="space-y-6">
                    <label className="flex items-center space-x-3 cursor-pointer group w-max">
                      <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${content.offer.isActive ? 'bg-black' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${content.offer.isActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </div>
                      <input type="checkbox" checked={content.offer.isActive} onChange={(e) => updateField(['offer', 'isActive'], e.target.checked)} className="hidden" />
                      <span className="font-semibold text-gray-700 group-hover:text-black">Show notification bar on site</span>
                    </label>
                    
                    <AnimatePresence>
                      {content.offer.isActive && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-2">
                            <div className="flex justify-between items-end mb-2">
                              <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Offer Text</label>
                              <span className={`text-xs font-bold ${content.offer.text?.length >= 80 ? 'text-red-500' : 'text-gray-400'}`}>{content.offer.text?.length || 0}/80</span>
                            </div>
                            <input 
                              type="text" 
                              value={content.offer.text}
                              onChange={(e) => updateField(['offer', 'text'], e.target.value)}
                              maxLength={80}
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium text-lg"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Custom Festive Banner */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-pink-50 text-pink-500 rounded-xl"><Icons.Image size={24} /></div>
                    <h3 className="text-xl font-bold">Custom Festive Banner</h3>
                  </div>
                  <div className="space-y-6">
                    <label className="flex items-center space-x-3 cursor-pointer group w-max">
                      <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${content.customHero?.isActive ? 'bg-black' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${content.customHero?.isActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </div>
                      <input type="checkbox" checked={content.customHero?.isActive || false} onChange={(e) => updateField(['customHero', 'isActive'], e.target.checked)} className="hidden" />
                      <span className="font-semibold text-gray-700 group-hover:text-black">Enable custom banner section</span>
                    </label>

                    <AnimatePresence>
                      {content.customHero?.isActive && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden">
                          <div className="pt-4">
                            <div className="flex justify-between items-end mb-2">
                              <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Headline</label>
                              <span className={`text-xs font-bold ${content.customHero.headline?.length >= 60 ? 'text-red-500' : 'text-gray-400'}`}>{content.customHero.headline?.length || 0}/60</span>
                            </div>
                            <input 
                              type="text" 
                              value={content.customHero.headline || ''}
                              onChange={(e) => updateField(['customHero', 'headline'], e.target.value)}
                              maxLength={60}
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all"
                              placeholder="e.g. Special Festive Offer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Subheadline</label>
                              <span className={`text-xs font-bold ${content.customHero.subheadline?.length >= 120 ? 'text-red-500' : 'text-gray-400'}`}>{content.customHero.subheadline?.length || 0}/120</span>
                            </div>
                            <input 
                              type="text" 
                              value={content.customHero.subheadline || ''}
                              onChange={(e) => updateField(['customHero', 'subheadline'], e.target.value)}
                              maxLength={120}
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-lg focus:bg-white focus:ring-2 focus:ring-black transition-all"
                              placeholder="e.g. Celebrate with 20% off all printing services this season."
                            />
                          </div>
                          
                          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="flex items-center space-x-3 cursor-pointer group mb-4 w-max">
                              <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${content.customHero.hasButton ? 'bg-black' : 'bg-gray-300'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${content.customHero.hasButton ? 'translate-x-7' : 'translate-x-1'}`}></div>
                              </div>
                              <input type="checkbox" checked={content.customHero.hasButton || false} onChange={(e) => updateField(['customHero', 'hasButton'], e.target.checked)} className="hidden" />
                              <span className="font-semibold text-gray-700 group-hover:text-black">Enable Action Button</span>
                            </label>

                            <AnimatePresence>
                              {content.customHero.hasButton && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="pt-2">
                                    <div className="flex justify-between items-end mb-2">
                                      <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Button Text <span className="text-xs lowercase font-normal text-gray-400">(Links directly to WhatsApp)</span></label>
                                      <span className={`text-xs font-bold ${content.customHero.buttonText?.length >= 20 ? 'text-red-500' : 'text-gray-400'}`}>{content.customHero.buttonText?.length || 0}/20</span>
                                    </div>
                                    <input 
                                      type="text" 
                                      value={content.customHero.buttonText || ''}
                                      onChange={(e) => updateField(['customHero', 'buttonText'], e.target.value)}
                                      maxLength={20}
                                      className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-black transition-all shadow-sm"
                                      placeholder="e.g. Grab Offer"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          <div className="pt-2">
                            <label className="block text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Background Image <span className="text-xs lowercase font-normal text-gray-400">(Highly Recommended)</span></label>
                            {content.customHero?.image && (
                              <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                                <img 
                                  src={content.customHero.image.startsWith('http') ? content.customHero.image : content.customHero.image.startsWith('/uploads') ? content.customHero.image : `/api/image?path=${content.customHero.image}`} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                  alt="Custom Banner Preview"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <label className="bg-white text-black px-6 py-3 rounded-full font-bold cursor-pointer hover:scale-105 transition-transform flex items-center space-x-2 shadow-xl">
                                    <Icons.UploadCloud size={18} />
                                    <span>Replace Image</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, ['customHero', 'image'], null, 21 / 9)} />
                                  </label>
                                </div>
                              </div>
                            )}
                            {!content.customHero?.image && (
                              <label className="w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-black">
                                <Icons.Image size={32} className="mb-2" />
                                <span className="font-bold">Upload Banner Background</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, ['customHero', 'image'], null, 21 / 9)} />
                              </label>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* HERO SECTION TAB */}
            {activeTab === 'hero' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                  <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Icons.Type size={24} /></div>
                  <h3 className="text-xl font-bold">Main Hero Dashboard</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Main Headline</label>
                      <span className={`text-xs font-bold ${content.hero.headline?.length >= 60 ? 'text-red-500' : 'text-gray-400'}`}>{content.hero.headline?.length || 0}/60</span>
                    </div>
                    <input 
                      type="text" 
                      value={content.hero.headline}
                      onChange={(e) => updateField(['hero', 'headline'], e.target.value)}
                      maxLength={60}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-3xl focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Sub-headline</label>
                      <span className={`text-xs font-bold ${content.hero.subheadline?.length >= 250 ? 'text-red-500' : 'text-gray-400'}`}>{content.hero.subheadline?.length || 0}/250</span>
                    </div>
                    <textarea 
                      value={content.hero.subheadline}
                      onChange={(e) => updateField(['hero', 'subheadline'], e.target.value)}
                      maxLength={250}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl resize-none h-32 font-medium text-lg focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <label className="block text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Hero Slider Gallery <span className="text-xs font-normal lowercase text-gray-400">(Upload exactly 5 images)</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[0, 1, 2, 3, 4].map((idx) => {
                        const img = content.hero.images && content.hero.images[idx];
                        return (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 group transition-all hover:border-gray-300">
                            {img ? (
                              <>
                                <img src={img.startsWith('http') ? img : img.startsWith('/uploads') ? img : `/api/image?path=${img}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity space-y-3">
                                  <label className="bg-white text-black p-3 rounded-full font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                    <Icons.UploadCloud size={18} />
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, ['hero', 'images'], idx, 1 / 1)} />
                                  </label>
                                  <button 
                                    onClick={() => {
                                      const newImages = [...(content.hero.images || [])];
                                      newImages[idx] = null;
                                      updateField(['hero', 'images'], newImages);
                                    }}
                                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                                  >
                                    <Icons.Trash2 size={18} />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label className="cursor-pointer text-center flex flex-col items-center justify-center w-full h-full hover:bg-gray-100 transition-colors p-4 text-gray-400 hover:text-black">
                                <Icons.Plus size={28} className="mb-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">Slot {idx + 1}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, ['hero', 'images'], idx, 1 / 1)} />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {content.categories && content.categories.map((category, idx) => (
                  <div key={category.id} className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 mb-6 border-b border-gray-50 pb-4">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl font-black text-lg shadow-sm">{idx + 1}</div>
                      <h4 className="font-bold text-gray-800 text-xl">{category.title || `Category ${idx + 1}`}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
                      {/* Text Content */}
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Category Title</label>
                            <span className={`text-xs font-bold ${category.title?.length >= 50 ? 'text-red-500' : 'text-gray-400'}`}>{category.title?.length || 0}/50</span>
                          </div>
                          <input 
                            type="text" 
                            value={category.title}
                            onChange={(e) => updateField(['categories', idx, 'title'], e.target.value)}
                            maxLength={50}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-black transition-all"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Description</label>
                            <span className={`text-xs font-bold ${category.desc?.length >= 150 ? 'text-red-500' : 'text-gray-400'}`}>{category.desc?.length || 0}/150</span>
                          </div>
                          <textarea 
                            value={category.desc}
                            onChange={(e) => updateField(['categories', idx, 'desc'], e.target.value)}
                            maxLength={150}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none h-28 font-medium focus:bg-white focus:ring-2 focus:ring-black transition-all"
                          />
                        </div>
                      </div>
                      
                      {/* Image Preview */}
                      <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Cover Image</label>
                        {category.image ? (
                          <div className="relative aspect-[5/4] rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                            <img 
                              src={category.image.startsWith('http') ? category.image : category.image.startsWith('/uploads') ? category.image : `/api/image?path=${category.image}`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                              alt="Category Preview"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <label className="bg-white text-black px-4 py-2 rounded-full font-bold cursor-pointer hover:scale-105 transition-transform flex items-center space-x-2 text-sm shadow-xl">
                                <Icons.UploadCloud size={16} />
                                <span>Change Image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, ['categories', idx, 'image'], null, 5 / 4)} />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full aspect-[5/4] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-black">
                            <Icons.Image size={28} className="mb-2" />
                            <span className="font-bold text-sm">Upload Image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, ['categories', idx, 'image'], null, 5 / 4)} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CONTACT & SOCIAL TAB */}
            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* Contact Info */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Icons.Contact size={24} /></div>
                    <h3 className="text-xl font-bold">Contact Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Phone Number</label>
                      <input 
                        type="text" 
                        value={content.contact.phone}
                        onChange={(e) => updateField(['contact', 'phone'], e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-lg focus:bg-white focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
                      <input 
                        type="text" 
                        value={content.contact.email}
                        onChange={(e) => updateField(['contact', 'email'], e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-lg focus:bg-white focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Icons.Share2 size={24} /></div>
                    <h3 className="text-xl font-bold">Social Media Profiles</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        <Icons.Instagram size={16} /> <span>Instagram URL</span>
                      </label>
                      <input 
                        type="text" 
                        value={content.social?.instagram || ''}
                        onChange={(e) => updateField(['social', 'instagram'], e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-black transition-all"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        <Icons.Facebook size={16} /> <span>Facebook URL</span>
                      </label>
                      <input 
                        type="text" 
                        value={content.social?.facebook || ''}
                        onChange={(e) => updateField(['social', 'facebook'], e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-black transition-all"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        <Icons.MessageCircle size={16} /> <span>WhatsApp URL</span>
                      </label>
                      <input 
                        type="text" 
                        value={content.social?.whatsapp || ''}
                        onChange={(e) => updateField(['social', 'whatsapp'], e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-black transition-all"
                        placeholder="https://wa.me/..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </main>

      {croppingImageSrc && (
        <ImageCropper 
          imageSrc={croppingImageSrc} 
          aspect={croppingAspect}
          onCropDone={handleCropDone} 
          onCancel={() => {
            setCroppingImageSrc(null);
            setCroppingPath(null);
            setCroppingIndex(null);
          }} 
        />
      )}
    </div>
  );
}
