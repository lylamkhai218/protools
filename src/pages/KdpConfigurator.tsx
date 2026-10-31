import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShoppingCart,
  Maximize2,
  X,
  Search,
  Plus,
  Minus,
  FileText,
  Shield,
  Layers,
  Cpu,
  Box,
  Printer,
  PhoneCall,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import {
  KdpShape,
  KdpPlateMaterial,
  KdpSealMaterial,
  KdpEdgeFinish,
  KdpMountingType,
  KdpStandardPlatePreset,
  KdpCableRequirement,
  KdpPlacedHole,
  KDP_MEMBRANE_RANGES,
  KDP_STANDARD_PRESETS,
  KDP_MATERIALS,
  KDP_MOUNTING_OPTIONS,
  autoPlaceKdpMembranes
} from '../data/kdpData';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface KdpConfiguratorProps {
  onNavigate: (tab: string, filter?: string, search?: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export default function KdpConfigurator({ onNavigate, onAddToCart }: KdpConfiguratorProps) {
  const { t, locale } = useTranslation();

  const tt = (key: string, params?: Record<string, string | number>, fallback?: string) => {
    let str = t(key, fallback);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  };

  // Wizard Steps: 1 = Plate Adjustment, 2 = Cable Specification, 3 = CAD Plate Layout, 4 = BOM & Technical Specs
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('kdp-24-17');

  // Step 1: Plate Parameters
  const [shape, setShape] = useState<KdpShape>('rectangular');
  const [width, setWidth] = useState<number>(148);
  const [height, setHeight] = useState<number>(58);
  const [thickness, setThickness] = useState<number>(14);
  const [cornerRadius, setCornerRadius] = useState<number>(10);
  const [material, setMaterial] = useState<KdpPlateMaterial>('plastic-pa6');
  const [sealMaterial, setSealMaterial] = useState<KdpSealMaterial>('elastomer');
  const [edgeFinish, setEdgeFinish] = useState<KdpEdgeFinish>('deburred');
  const [mountingType, setMountingType] = useState<KdpMountingType>('holes');

  // Step 2: Cable Specification List
  const [cables, setCables] = useState<KdpCableRequirement[]>([
    { id: 'cb-1', label: 'Cáp điều khiển tín hiệu cảm biến', diameter: 5.5, quantity: 8, color: '#3b82f6' },
    { id: 'cb-2', label: 'Cáp nguồn servo cỡ nhỏ', diameter: 8.5, quantity: 4, color: '#6366f1' },
    { id: 'cb-3', label: 'Cáp Ethernet công nghiệp M12', diameter: 6.2, quantity: 2, color: '#8b5cf6' }
  ]);

  // Quick add cable state
  const [newCableLabel, setNewCableLabel] = useState<string>('Cáp tín hiệu mới');
  const [newCableDia, setNewCableDia] = useState<number>(6.5);
  const [newCableQty, setNewCableQty] = useState<number>(2);

  // Success toast
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Handle preset selection
  const handleSelectPreset = (preset: KdpStandardPlatePreset) => {
    setSelectedPresetId(preset.id);
    setShape(preset.shape);
    setWidth(preset.width);
    setHeight(preset.height);
    setThickness(preset.thickness);
    setMaterial(preset.material);

    // Populate cables from preset openings
    const presetCables: KdpCableRequirement[] = preset.openings.map((op, idx) => ({
      id: `preset-cb-${idx}`,
      label: `Cáp Ø${(op.dMin + op.dMax) / 2}mm (${op.dMin}-${op.dMax}mm)`,
      diameter: Math.round(((op.dMin + op.dMax) / 2) * 10) / 10,
      quantity: op.count,
      color: '#3b82f6'
    }));
    setCables(presetCables);
  };

  // Add custom cable
  const handleAddCable = () => {
    const dia = Number(newCableDia) || 6;
    const qty = Number(newCableQty) || 1;
    const newItem: KdpCableRequirement = {
      id: `cb-${Date.now()}`,
      label: newCableLabel || `Cáp Ø${dia}mm`,
      diameter: dia,
      quantity: qty,
      color: '#3b82f6'
    };
    setCables(prev => [...prev, newItem]);
    setNewCableLabel('Cáp tín hiệu mới');
    setNewCableDia(6.5);
    setNewCableQty(2);
  };

  const handleRemoveCable = (id: string) => {
    setCables(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCables(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, quantity: Math.max(1, c.quantity + delta) };
      }
      return c;
    }));
  };

  // Auto-placement computation
  const placementResult = useMemo(() => {
    return autoPlaceKdpMembranes(width, height, shape, cables, 16, 4);
  }, [width, height, shape, cables]);

  // Total cables count
  const totalCablesCount = useMemo(() => {
    return cables.reduce((sum, c) => sum + c.quantity, 0);
  }, [cables]);

  // Selected Material Meta
  const selectedMaterialMeta = useMemo(() => {
    return KDP_MATERIALS.find(m => m.id === material) || KDP_MATERIALS[0];
  }, [material]);


  // Add to Cart
  const handleAddToCart = () => {
    const prod: Product = {
      id: `mp-kdp-${Date.now()}`,
      name: `Tấm Luồn Cáp KDP On-Demand (${width}x${height}mm, ${placementResult.placedHoles.length} cáp, ${selectedMaterialMeta.abbreviation})`,
      sku: `MP-KDP-CUSTOM-${width}X${height}-${selectedMaterialMeta.abbreviation}`,
      brand: 'Murrplastik',
      category: 'Tấm / Khung & Đệm luồn cáp (KDP/KDL)',
      categorySlug: 'murrplastik',
      origin: 'CHLB Đức (Made in Germany)',
      image: '/images/products/murr/drawings/murr_cable-entry-plate-plastic-type-kdpz-208290_2d.webp',
      images: ['/images/products/murr/drawings/murr_cable-entry-plate-plastic-type-kdpz-208290_2d.webp'],
      stock: 50,
      stockStatus: 'In Stock',
      stockLocation: 'Gia công theo yêu cầu (Lead-time 2-3 tuần)',
      price: 'Liên hệ báo giá dự án',
      unit: 'tấm',
      shortDesc: `Tấm màng luồn cáp công nghiệp KDP Murrplastik không đầu jack, kích thước ${width}x${height}mm, ${placementResult.placedHoles.length} màng cao su đúc.`,
      specs: {
        'Kích thước': `${width} x ${height} x ${thickness} mm`,
        'Hình dạng': shape === 'round' ? 'Tròn' : 'Chữ nhật',
        'Vật liệu tấm': selectedMaterialMeta.name,
        'Gioăng làm kín': sealMaterial === 'elastomer' ? 'Cao su EPDM' : 'PU Foam',
        'Tổng số cáp luồn': `${placementResult.placedHoles.length} sợi`,
        'Mật độ điền đầy': `${placementResult.packingDensity}%`
      }
    };

    onAddToCart(prod, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-[#00478D] cursor-pointer"
                >
                  Protools
                </button>
                <span>/</span>
                <span className="text-slate-600">Digital Toolbox</span>
                <span>/</span>
                <span className="text-blue-600 font-bold">KDP Configurator</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{t('kdp.title')}</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-xs font-bold uppercase">
                  {t('kdp.badge')}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                {t('kdp.subtitle')}
              </p>
            </div>

            {/* Switch to KDL */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => onNavigate('kdl-configurator')}
                aria-label={t('kdp.switch_to_kdl')}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-300 hover:border-red-300 rounded-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <span>{t('kdp.switch_to_kdl')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Wizard Bar (Responsive 2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-100 print:hidden">
            {[
              { step: 1, title: t('kdp.step1_title'), desc: t('kdp.step1_desc') },
              { step: 2, title: t('kdp.step2_title'), desc: t('kdp.step2_desc') },
              { step: 3, title: t('kdp.step3_title'), desc: t('kdp.step3_desc') },
              { step: 4, title: t('kdp.step4_title'), desc: t('kdp.step4_desc') }
            ].map(s => {
              const isActive = currentStep === s.step;
              const isPast = currentStep > s.step;
              const stepTitleClean = s.title.includes('. ') ? s.title.split('. ')[1] : s.title;
              return (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${t('kdp.step_prefix')} ${s.step}: ${s.title}`}
                  className={`text-left p-2.5 rounded-xs border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
                    isActive
                      ? 'bg-blue-50 border-blue-600 shadow-xs'
                      : isPast
                      ? 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      : 'bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-mono tabular-nums ${isActive ? 'text-blue-700' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                      {t('kdp.step_prefix')} {s.step}
                    </span>
                    {isPast && <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />}
                  </div>
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {stepTitleClean}
                  </div>
                  <div className="text-2xs text-slate-500 hidden sm:block truncate mt-0.5">
                    {s.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN WIZARD BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* STEP 1: PLATE ADJUSTMENT */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Standard Presets Selector */}
            <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {t('kdp.std_plates_title')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t('kdp.std_plates_desc')}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-xs">
                  {KDP_STANDARD_PRESETS.length} Presets
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {KDP_STANDARD_PRESETS.map(preset => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3.5 rounded-xs border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-2xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-xs">
                          {preset.series}
                        </span>
                        <span className="text-2xs font-mono text-slate-500">{preset.ipRating}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{preset.name}</div>
                      <div className="text-2xs text-slate-500 mt-1 line-clamp-2">{preset.cableRangeDesc}</div>
                      <div className="mt-2 text-2xs font-mono text-slate-600 pt-2 border-t border-slate-100 flex justify-between">
                        <span>{preset.width}x{preset.height}mm</span>
                        <span className="font-bold text-red-600">Max: {preset.maxCables} {t('kdp.cables_unit')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom On-Demand Dimensions & Material Configuration */}
            <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight pb-3 border-b border-slate-100 mb-4">
                {t('kdp.custom_plate_title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Shape & Dimensions */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-2xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      {t('kdp.shape_label')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'rectangular' as KdpShape, label: t('kdp.shape_rect') },
                        { id: 'rectangular-radius' as KdpShape, label: t('kdp.shape_rect_radius') },
                        { id: 'round' as KdpShape, label: t('kdp.shape_round') }
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => setShape(s.id)}
                          className={`py-2 px-2 text-xs font-bold rounded-xs border text-center transition-all cursor-pointer ${
                            shape === s.id
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {shape !== 'round' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdp.width_label')}</label>
                        <input
                          type="number"
                          min={50}
                          max={400}
                          value={width}
                          onChange={e => setWidth(Number(e.target.value))}
                          className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdp.height_label')}</label>
                        <input
                          type="number"
                          min={30}
                          max={300}
                          value={height}
                          onChange={e => setHeight(Number(e.target.value))}
                          className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdp.diameter_label')}</label>
                      <input
                        type="number"
                        min={40}
                        max={300}
                        value={width}
                        onChange={e => {
                          setWidth(Number(e.target.value));
                          setHeight(Number(e.target.value));
                        }}
                        className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white"
                      />
                    </div>
                  )}

                  {shape === 'rectangular-radius' && (
                    <div>
                      <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdp.radius_label')}</label>
                      <input
                        type="number"
                        min={2}
                        max={30}
                        value={cornerRadius}
                        onChange={e => setCornerRadius(Number(e.target.value))}
                        className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* Materials Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-2xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      {t('kdp.material_label')}
                    </label>
                    <div className="space-y-1.5">
                      {KDP_MATERIALS.map(m => {
                        const isSelected = material === m.id;
                        const matDescKey = `kdp.mat_${m.id.replace(/-/g, '_')}_desc`;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setMaterial(m.id)}
                            className={`p-2.5 rounded-xs border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/50 border-blue-600 ring-1 ring-blue-600'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{m.abbreviation} - {m.name.split(' (')[0]}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                            </div>
                            <div className="text-2xs text-slate-500 mt-0.5 line-clamp-1">
                              {t(matDescKey, m.description)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Seal & Mounting */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-2xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      {t('kdp.seal_label')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSealMaterial('elastomer')}
                        className={`p-2.5 rounded-xs border text-left cursor-pointer ${
                          sealMaterial === 'elastomer' ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold' : 'border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="text-xs">{t('kdp.seal_epdm')}</div>
                        <div className="text-2xs text-slate-500">{t('kdp.seal_epdm_desc')}</div>
                      </button>
                      <button
                        onClick={() => setSealMaterial('pu-foam')}
                        className={`p-2.5 rounded-xs border text-left cursor-pointer ${
                          sealMaterial === 'pu-foam' ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold' : 'border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="text-xs">{t('kdp.seal_pu')}</div>
                        <div className="text-2xs text-slate-500">{t('kdp.seal_pu_desc')}</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                      {t('kdp.mounting_label')}
                    </label>
                    <div className="space-y-1.5">
                      {KDP_MOUNTING_OPTIONS.map(opt => {
                        const nameKey = `kdp.mount_${opt.id}_name`;
                        const descKey = `kdp.mount_${opt.id}_desc`;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => setMountingType(opt.id)}
                            className={`p-2.5 rounded-xs border cursor-pointer ${
                              mountingType === opt.id ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'border-slate-200'
                            }`}
                          >
                            <div className="text-xs font-bold text-slate-900">{t(nameKey, opt.name)}</div>
                            <div className="text-2xs text-slate-500">{t(descKey, opt.description)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  {t('kdp.plate_size')} <span className="font-mono font-bold text-slate-900">{width} x {height} mm</span> ({selectedMaterialMeta.abbreviation})
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xs shadow-xs cursor-pointer"
                >
                  <span>{t('kdp.btn_continue_cables')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CABLE HOLE SPECIFICATION */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Cable Requirements */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {tt('kdp.cable_title', { count: cables.length })}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t('kdp.cable_desc')}
                    </p>
                  </div>

                  <button
                    onClick={() => setCables([])}
                    className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('kdp.clear_all')}</span>
                  </button>
                </div>

                {/* Cable Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-mono text-2xs uppercase">
                        <th className="py-2 px-2 font-bold">{t('kdp.col_cable_desc')}</th>
                        <th className="py-2 px-2 font-bold text-center">{t('kdp.col_od')}</th>
                        <th className="py-2 px-2 font-bold text-center">{t('kdp.col_membrane_range')}</th>
                        <th className="py-2 px-2 font-bold text-center">{t('kdp.col_qty')}</th>
                        <th className="py-2 px-2 text-right">{t('kdp.col_action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cables.map(c => {
                        const matchedRange = KDP_MEMBRANE_RANGES.find(r => c.diameter >= r.dMin && c.diameter <= r.dMax)
                          || KDP_MEMBRANE_RANGES[KDP_MEMBRANE_RANGES.length - 1];
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-2 font-bold text-slate-900">
                              {c.label}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono tabular-nums font-bold text-slate-800">
                              Ø{c.diameter} mm
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-xs bg-blue-50 text-blue-700">
                                {matchedRange.label}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <div className="inline-flex items-center border border-slate-200 rounded-xs">
                                <button
                                  onClick={() => handleUpdateQty(c.id, -1)}
                                  aria-label={`Giảm số lượng cáp ${c.label}`}
                                  className="min-w-[28px] min-h-[28px] flex items-center justify-center p-1 hover:bg-slate-100 cursor-pointer text-slate-600 focus-visible:outline-1 focus-visible:outline-blue-500"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 font-mono tabular-nums font-bold text-xs">{c.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQty(c.id, 1)}
                                  aria-label={`Tăng số lượng cáp ${c.label}`}
                                  className="min-w-[28px] min-h-[28px] flex items-center justify-center p-1 hover:bg-slate-100 cursor-pointer text-slate-600 focus-visible:outline-1 focus-visible:outline-blue-500"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-2 text-right">
                              <button
                                onClick={() => handleRemoveCable(c.id)}
                                aria-label={`Xóa sợi cáp ${c.label}`}
                                className="text-slate-500 hover:text-red-600 cursor-pointer p-1.5 rounded-xs hover:bg-red-50 min-w-[28px] min-h-[28px] flex items-center justify-center focus-visible:outline-1 focus-visible:outline-blue-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {cables.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-xs text-slate-400 italic">
                            {t('kdp.no_cables')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Quick Add Form */}
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xs">
                  <div className="text-xs font-mono font-bold text-slate-700 mb-2">{t('kdp.add_cable_title')}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                    <div className="sm:col-span-2">
                      <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdp.cable_desc_label')}</label>
                      <input
                        type="text"
                        value={newCableLabel}
                        onChange={e => setNewCableLabel(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white"
                        placeholder={t('kdp.cable_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdp.cable_dia_label')}</label>
                      <input
                        type="number"
                        step={0.5}
                        min={1.5}
                        max={45}
                        value={newCableDia}
                        onChange={e => setNewCableDia(Number(e.target.value))}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <button
                        onClick={handleAddCable}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('kdp.btn_add_cable')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Density & Capacity Verification */}
            <div className="space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                  {t('kdp.packing_density')}
                </h3>

                <div className="p-4 bg-slate-50 rounded-xs border border-slate-200 text-center mb-4">
                  <div className="text-2xs font-mono text-slate-500 uppercase">{t('kdp.packing_density_ratio')}</div>
                  <div className={`text-3xl font-black font-mono mt-1 ${
                    placementResult.packingDensity > 60 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {placementResult.packingDensity}%
                  </div>
                  <div className="text-2xs text-slate-500 mt-1">
                    {t('kdp.safety_standard_note')}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('kdp.total_cables_label')}</span>
                    <span className="font-bold font-mono">{totalCablesCount} {t('kdp.cables_unit')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('kdp.placed_holes_label')}</span>
                    <span className="font-bold font-mono text-green-700">{placementResult.placedHoles.length} {t('kdp.holes_unit')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('kdp.min_spacing_label')}</span>
                    <span className="font-bold font-mono text-slate-800">≥ 4.0 mm</span>
                  </div>
                </div>

                {/* Validation status */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {!placementResult.isExceeded ? (
                    <div className="p-2.5 bg-green-50 border border-green-200 rounded-xs flex items-center gap-2 text-xs text-green-800">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span>{tt('kdp.capacity_ok', { count: totalCablesCount })}</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xs flex items-center gap-2 text-xs text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{t('kdp.capacity_exceeded')}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xs shadow-xs cursor-pointer"
                  >
                    <span>{t('kdp.btn_continue_matrix')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xs cursor-pointer"
                  >
                    {t('kdp.change_plate')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE 2D CAD PLATE LAYOUT */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Live CAD Vector Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <span>{t('kdp.drawing_title')} ({width}x{height}mm)</span>
                      <span className="text-2xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-xs font-bold">
                        {tt('kdp.holes_placed', { count: placementResult.placedHoles.length })}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t('kdp.drawing_desc')}
                    </p>
                  </div>

                  <div className="text-2xs font-mono text-slate-600">
                    {t('kdp.plate_material')} <span className="font-bold text-slate-900">{selectedMaterialMeta.name.split(' (')[0]}</span>
                  </div>
                </div>

                {/* CAD Drawing Canvas */}
                <div className="bg-slate-900 p-8 rounded-sm flex items-center justify-center overflow-x-auto min-h-[380px]">
                  <svg
                    viewBox={`0 0 ${width + 20} ${height + 20}`}
                    className="w-full max-w-[560px] h-auto drop-shadow-2xl select-none"
                  >
                    {/* Background Grid Pattern */}
                    <defs>
                      <pattern id="cadGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect x="0" y="0" width={width + 20} height={height + 20} fill="#090d16" />
                    <rect x="0" y="0" width={width + 20} height={height + 20} fill="url(#cadGrid)" />

                    {/* Plate Body */}
                    {shape === 'round' ? (
                      <circle
                        cx={width / 2 + 10}
                        cy={height / 2 + 10}
                        r={width / 2}
                        fill="#1e293b"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <rect
                        x="10"
                        y="10"
                        width={width}
                        height={height}
                        rx={shape === 'rectangular-radius' ? cornerRadius : 3}
                        fill="#1e293b"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Mounting Holes / Studs */}
                    {shape !== 'round' ? (
                      <>
                        <circle cx="16" cy="16" r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx={width + 4} cy="16" r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="16" cy={height + 4} r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx={width + 4} cy={height + 4} r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                      </>
                    ) : (
                      <>
                        <circle cx={10 + width / 2} cy="15" r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx={10 + width / 2} cy={height + 5} r="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                      </>
                    )}

                    {/* Render Membrane Cable Holes */}
                    {placementResult.placedHoles.map((hole, idx) => (
                      <g key={hole.id} className="cursor-pointer">
                        {/* Outer membrane seal ring */}
                        <circle
                          cx={hole.x + 10}
                          cy={hole.y + 10}
                          r={hole.r}
                          fill="#0284c7"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        {/* Inner cable pass-through hole */}
                        <circle
                          cx={hole.x + 10}
                          cy={hole.y + 10}
                          r={hole.r * 0.65}
                          fill="#0f172a"
                          stroke="#7dd3fc"
                          strokeWidth="0.8"
                        />
                        {/* Size annotation */}
                        <text
                          x={hole.x + 10}
                          y={hole.y + 12}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="3.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {hole.d}
                        </text>
                      </g>
                    ))}

                    {/* Dimensional Dimensions Marks */}
                    <line x1="10" y1={height + 16} x2={width + 10} y2={height + 16} stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 1" />
                    <text x={width / 2 + 10} y={height + 19} textAnchor="middle" fill="#38bdf8" fontSize="4" fontFamily="monospace">
                      {width} mm
                    </text>
                  </svg>
                </div>

                <div className="mt-3 flex items-center justify-between text-2xs text-slate-500 font-mono">
                  <span>{t('kdp.safety_margin_note')}</span>
                  <span>{t('kdp.density_label')} {placementResult.packingDensity}%</span>
                </div>
              </div>
            </div>

            {/* Right Col: Hole Matrix Breakdown & Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                  {t('kdp.matrix_summary_title')}
                </h3>

                <div className="space-y-2 text-xs">
                  {KDP_MEMBRANE_RANGES.map(rng => {
                    const count = placementResult.placedHoles.filter(h => h.membraneRange === rng.label).length;
                    if (count === 0) return null;
                    return (
                      <div key={rng.id} className="p-2.5 bg-slate-50 rounded-xs border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                          <div>
                            <div className="font-bold text-slate-900">{t('kdp.cable_range_label')} {rng.label}</div>
                            <div className="text-2xs text-slate-500">{t('kdp.membrane_dia_label')} Ø{rng.holeDia}mm</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-xs">
                          {count} {t('kdp.holes_unit')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xs shadow-xs cursor-pointer"
                  >
                    <span>{t('kdp.btn_to_bom')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xs cursor-pointer"
                  >
                    {t('kdp.edit_cables')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BOM & TECHNICAL SPECIFICATIONS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Dedicated Print Cover Header (Visible ONLY on print/PDF) */}
            <div className="hidden print:block mb-6 pb-4 border-b-2 border-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-black text-slate-900 uppercase tracking-tight">{t('kdp.company_name')}</div>
                  <div className="text-2xs text-slate-600">{t('kdp.company_sub')}</div>
                </div>
                <div className="text-right text-2xs text-slate-600 font-mono tabular-nums">
                  <div>{t('kdp.doc_title')}</div>
                  <div>Quy cách: {width} x {height} mm ({selectedMaterialMeta.name})</div>
                  <div>{t('kdp.export_date')} {new Date().toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-xs print:border-none print:p-0 print:shadow-none">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <span>{t('kdp.bom_title')}</span>
                    <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-xs font-bold">
                      {t('kdp.bom_badge')}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t('kdp.bom_desc')}
                  </p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => window.print()}
                    aria-label="In hồ sơ kỹ thuật tấm KDP A4"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-xs text-xs font-bold text-slate-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('kdp.btn_print')}</span>
                  </button>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xs border border-slate-200 mb-6 text-xs">
                <div>
                  <span className="text-2xs text-slate-600 uppercase font-mono block">{t('kdp.spec_dimensions')}</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">{width} x {height} x {thickness} mm</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-600 uppercase font-mono block">{t('kdp.spec_material')}</span>
                  <span className="font-bold text-slate-900">{selectedMaterialMeta.name}</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-600 uppercase font-mono block">{t('kdp.spec_ip')}</span>
                  <span className="font-mono font-bold text-blue-700">IP65 / IP69K (EN 60529)</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-600 uppercase font-mono block">{t('kdp.spec_total_membranes')}</span>
                  <span className="font-mono tabular-nums font-bold text-red-600">{placementResult.placedHoles.length} {t('kdp.membranes_unit')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xs text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('kdp.btn_back_drawing')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="tel:0961448833"
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xs cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-blue-600" />
                    <span>{t('kdp.hotline')}</span>
                  </a>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xs shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t('kdp.btn_add_to_cart')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-sm shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <div>
            <div className="text-xs font-bold">{t('kdp.toast_added_title')}</div>
            <div className="text-2xs text-slate-400">{t('kdp.toast_added_desc')}</div>
          </div>
          <button
            onClick={() => onNavigate('cart')}
            className="ml-2 text-2xs font-mono font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            {t('kdp.toast_view_cart')}
          </button>
        </div>
      )}
    </div>
  );
}
