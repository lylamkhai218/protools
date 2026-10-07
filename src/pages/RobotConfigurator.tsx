import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Download, 
  ShoppingCart, 
  Mail, 
  ChevronUp, 
  Maximize2, 
  X, 
  Search, 
  Plus, 
  Minus, 
  FileText, 
  Activity,
  Layers,
  Cpu,
  ChevronRight,
  Info,
  ExternalLink,
  Box,
  Printer,
  PhoneCall
} from 'lucide-react';
import { 
  ROBOT_BRANDS, 
  ROBOT_MODELS, 
  STANDARD_CABLES, 
  CABLE_PRESETS,
  ABB_IRB6700_PACKAGE,
  ABB_IRB6700_HEAVY_PACKAGE,
  FANUC_M710_PACKAGE,
  COMAU_NJ370_PACKAGE,
  COMAU_NJ650_PACKAGE,
  TECHMAN_TM_PACKAGE,
  DOOSAN_PACKAGE,
  DELTA_PACKAGE,
  KUKA_KR210_PACKAGE,
  YASKAWA_GP50_PACKAGE,
  UNIVERSAL_ROBOTS_UR_PACKAGE,
  KAWASAKI_RS_PACKAGE,
  RobotBrand, 
  RobotModel, 
  DresspackPackage, 
  DresspackPartItem 
} from '../data/dresspackData';
import ConduitCadCrossSection, { CableItemForCad } from '../components/ConduitCadCrossSection';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface RobotConfiguratorProps {
  onNavigate: (tab: string, filter?: string, search?: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  initialBrandId?: string;
  initialModelId?: string;
}

export default function RobotConfigurator({ 
  onNavigate, 
  onAddToCart,
  initialBrandId,
  initialModelId
}: RobotConfiguratorProps) {
  const { t, locale } = useTranslation();
  // Wizard Steps: 1 = Brand, 2 = Model, 3 = Package, 4 = Detail & 3D/CAD/BOM
  const [currentStep, setCurrentStep] = useState<number>(initialBrandId ? 2 : 1);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(initialBrandId || 'fanuc');
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId || 'fanuc-crx');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-fanuc-m710-m50');
  
  // Angle & 3D Studio state
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isCadModalOpen, setIsCadModalOpen] = useState<boolean>(false);

  // Search filters
  const [brandSearch, setBrandSearch] = useState<string>('');
  const [modelSearch, setModelSearch] = useState<string>('');

  // Hover spotlight focus states
  const [hoveredBrandId, setHoveredBrandId] = useState<string | null>(null);
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);
  const [hoveredPackageId, setHoveredPackageId] = useState<string | null>(null);

  // Custom cable input state
  const [customDiaInput, setCustomDiaInput] = useState<number>(14);

  // Selections
  const selectedBrand = useMemo(() => {
    return ROBOT_BRANDS.find(b => b.id === selectedBrandId) || ROBOT_BRANDS[0];
  }, [selectedBrandId]);

  const brandModels = useMemo(() => {
    return ROBOT_MODELS.filter(m => m.brandId === selectedBrandId);
  }, [selectedBrandId]);

  const selectedModel = useMemo(() => {
    const found = brandModels.find(m => m.id === selectedModelId);
    return found || brandModels[0] || ROBOT_MODELS[0];
  }, [brandModels, selectedModelId]);

  // Packages available for current model (with safe fallbacks and model-adaptive naming)
  const availablePackages = useMemo(() => {
    if (!selectedModel) return [ABB_IRB6700_PACKAGE];
    const basePkgs = (selectedModel.packages && selectedModel.packages.length > 0)
      ? selectedModel.packages
      : (selectedBrandId === 'fanuc' 
          ? [FANUC_M710_PACKAGE] 
          : selectedBrandId === 'comau'
          ? [COMAU_NJ370_PACKAGE, COMAU_NJ650_PACKAGE]
          : selectedBrandId === 'techman-robot'
          ? [TECHMAN_TM_PACKAGE]
          : selectedBrandId === 'doosan'
          ? [DOOSAN_PACKAGE]
          : selectedBrandId === 'delta'
          ? [DELTA_PACKAGE]
          : selectedBrandId === 'kuka'
          ? [KUKA_KR210_PACKAGE]
          : selectedBrandId === 'yaskawa'
          ? [YASKAWA_GP50_PACKAGE]
          : selectedBrandId === 'universal-robots'
          ? [UNIVERSAL_ROBOTS_UR_PACKAGE]
          : selectedBrandId === 'kawasaki'
          ? [KAWASAKI_RS_PACKAGE]
          : [ABB_IRB6700_PACKAGE, ABB_IRB6700_HEAVY_PACKAGE]);

    return basePkgs.map(pkg => {
      const isExactModel = pkg.robotModelId === selectedModel.id;

      // Brand & Model name normalization regex
      const brandPatterns = /KUKA Robotics|KUKA|ABB Robotics|ABB|FANUC Corporation|FANUC|Yaskawa Motoman|Yaskawa|Universal Robots \(UR\)|Universal Robots|Kawasaki Robotics|Kawasaki|Comau Robotics|Comau|Techman Robot \(TM\)|Techman Robot|Doosan Robotics|Doosan|Delta Electronics|Delta/gi;
      const modelPatterns = /GP50|GP180|IRB 6700|KR 210|UR20|UR30|UR10e|UR16e|UR5e|UR10|M-710iC|NJ370-3\.0|NJ650-2\.7|TM5|TM12|TM20|TM14|TM16X|RS080N/gi;

      let name = pkg.name;
      let desc = pkg.description;

      if (!isExactModel) {
        name = name
          .replace(brandPatterns, selectedBrand.name)
          .replace(modelPatterns, selectedModel.name);
        desc = desc
          .replace(brandPatterns, selectedBrand.name)
          .replace(modelPatterns, selectedModel.name);
      }

      // Hero 3D model render image: always prefer selectedModel.imageUrl so Comau shows Comau, Techman shows Techman, etc.
      const resolvedHeroImg = isExactModel ? pkg.main3dImage : (selectedModel.imageUrl || pkg.main3dImage);

      // Perspective images: if adapted, show the model's actual 3D render
      const resolvedPerspectives = isExactModel 
        ? pkg.perspectiveImages 
        : [
            { id: `${pkg.id}-ang-1`, label: 'Tổng quan hệ thống (Overview)', angle: 'Isometric View', url: resolvedHeroImg },
            { id: `${pkg.id}-ang-2`, label: 'Góc nhìn nghiêng (Angle View)', angle: 'Perspective View', url: resolvedHeroImg },
            { id: `${pkg.id}-ang-3`, label: 'Mặt bên cánh tay (Side View)', angle: 'Lateral View', url: resolvedHeroImg },
            { id: `${pkg.id}-ang-4`, label: 'Cận cảnh cổ tay (Wrist Detail)', angle: 'Axis 6 Flange', url: resolvedHeroImg }
          ];

      // Parts adaptation: ensure brand name on custom mounts matches selectedBrand
      const cleanedParts = (pkg.parts || []).map(part => {
        if (isExactModel) return part;
        return {
          ...part,
          name: part.name.replace(brandPatterns, selectedBrand.name),
          vnName: part.vnName.replace(brandPatterns, selectedBrand.name),
          role: part.role.replace(brandPatterns, selectedBrand.name),
          spec: part.spec.replace(brandPatterns, selectedBrand.name)
        };
      });

      return {
        ...pkg,
        robotModelId: selectedModel.id,
        robotModelName: isExactModel ? pkg.robotModelName : `${selectedBrand.name} ${selectedModel.name}`,
        name,
        description: desc,
        main3dImage: resolvedHeroImg,
        perspectiveImages: resolvedPerspectives,
        parts: cleanedParts
      };
    });
  }, [selectedModel, selectedBrand, selectedBrandId]);

  const currentPackage = useMemo(() => {
    const match = availablePackages.find(p => p.id === selectedPackageId);
    return match || availablePackages[0] || ABB_IRB6700_PACKAGE;
  }, [availablePackages, selectedPackageId]);

  // BOM Part Quantities
  const [partQuantities, setPartQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (currentPackage && currentPackage.parts) {
      const initialQtys: Record<string, number> = {};
      currentPackage.parts.forEach(p => {
        initialQtys[p.id] = p.defaultQty;
      });
      setPartQuantities(initialQtys);
      setActiveAngleIndex(0);
    }
  }, [currentPackage]);

  const handleUpdatePartQty = (partId: string, delta: number) => {
    setPartQuantities(prev => {
      const current = prev[partId] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [partId]: next };
    });
  };

  // CABLE COUNTS FOR 2D CAD & FILL FACTOR
  // Khởi tạo mặc định khớp đúng bản vẽ CAD người dùng: 1 dây 14mm + 2 dây 6mm
  const [cableCounts, setCableCounts] = useState<Record<string, number>>({
    'servo-14mm': 1,
    'air-6mm': 2
  });

  const handleUpdateCableCount = (cableId: string, delta: number) => {
    setCableCounts(prev => {
      const current = prev[cableId] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [cableId]: next };
    });
  };

  const handleAddCustomCable = () => {
    if (customDiaInput > 0) {
      const customId = `custom-${customDiaInput}mm`;
      setCableCounts(prev => ({
        ...prev,
        [customId]: (prev[customId] || 0) + 1
      }));
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = CABLE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setCableCounts(preset.cableCounts);
    }
  };

  const conduitInnerDiameter = currentPackage ? currentPackage.innerDiameterMm : 28.5;
  const conduitArea = Math.PI * Math.pow(conduitInnerDiameter / 2, 2);

  // Data map for 2D CAD component
  const cadCablesList: CableItemForCad[] = useMemo(() => {
    const list: CableItemForCad[] = [];
    STANDARD_CABLES.forEach(c => {
      const cnt = cableCounts[c.id] || 0;
      if (cnt > 0) {
        list.push({
          id: c.id,
          name: c.name,
          diameterMm: c.diameterMm,
          count: cnt,
          color: c.color
        });
      }
    });
    // Check custom cables
    Object.keys(cableCounts).forEach(key => {
      if (key.startsWith('custom-')) {
        const dia = parseFloat(key.replace('custom-', '').replace('mm', ''));
        const cnt = cableCounts[key] || 0;
        if (cnt > 0 && !isNaN(dia)) {
          list.push({
            id: key,
            name: `Dây tùy chỉnh Ø${dia}mm`,
            diameterMm: dia,
            count: cnt,
            color: '#7C3AED'
          });
        }
      }
    });
    return list;
  }, [cableCounts]);

  // Total Cable Area Calculation
  const { totalCableArea, fillFactorPercent, totalCablesCount } = useMemo(() => {
    let area = 0;
    let count = 0;
    cadCablesList.forEach(c => {
      count += c.count;
      area += c.count * (Math.PI * Math.pow(c.diameterMm / 2, 2));
    });
    const ff = conduitArea > 0 ? (area / conduitArea) * 100 : 0;
    return {
      totalCableArea: area,
      fillFactorPercent: Math.round(ff * 10) / 10,
      totalCablesCount: count
    };
  }, [cadCablesList, conduitArea]);

  const isOptimal = fillFactorPercent <= 50;
  const isPass = fillFactorPercent > 50 && fillFactorPercent <= 60;
  const isOverload = fillFactorPercent > 60;

  // 1-Click Sync RFQ
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const handleSyncToRFQ = () => {
    if (!currentPackage || !currentPackage.parts) return;
    currentPackage.parts.forEach(part => {
      const qty = partQuantities[part.id] || part.defaultQty || 1;
      const productObj: Product = {
        id: `mp-dresspack-${part.mpn}`,
        name: `${part.name} - ${part.vnName}`,
        sku: part.mpn,
        brand: 'Murrplastik',
        category: 'Xích Cáp Robot Murrplastik',
        categorySlug: 'murrplastik',
        origin: 'CHLB Đức (Made in Germany)',
        image: part.imageUrl,
        stock: 50,
        stockStatus: 'In Stock',
        stockLocation: 'Kho Hà Nội / Hưng Yên sẵn hàng',
        price: 'Liên hệ báo giá dự án',
        unit: part.unit,
        shortDesc: `Linh kiện Dresspack ${selectedModel.name}: ${part.role}. ${part.spec}`,
        specs: {
          'Mã linh kiện': part.mpn,
          'Vị trí': part.position,
          'Chức năng': part.role,
          'Quy cách': part.spec,
          'Gói Dresspack': currentPackage.packageCode,
          'Robot tương thích': selectedModel.name,
          'Xuất xứ': 'Murrplastik Germany'
        }
      };
      onAddToCart(productObj, qty);
    });
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3500);
  };

  const handleSelectBrand = (brand: RobotBrand) => {
    setSelectedBrandId(brand.id);
    const firstModel = ROBOT_MODELS.find(m => m.brandId === brand.id);
    if (firstModel) {
      setSelectedModelId(firstModel.id);
      if (firstModel.packages?.length > 0) {
        setSelectedPackageId(firstModel.packages[0].id);
      }
    }
    setCurrentStep(2);
  };

  const handleSelectModel = (model: RobotModel) => {
    setSelectedModelId(model.id);
    const targetPkg = (model.packages && model.packages.length > 0) 
      ? model.packages[0] 
      : (selectedBrandId === 'fanuc' 
          ? FANUC_M710_PACKAGE 
          : selectedBrandId === 'comau' 
          ? COMAU_NJ370_PACKAGE 
          : selectedBrandId === 'techman-robot'
          ? TECHMAN_TM_PACKAGE
          : selectedBrandId === 'doosan'
          ? DOOSAN_PACKAGE
          : selectedBrandId === 'delta'
          ? DELTA_PACKAGE
          : selectedBrandId === 'kuka'
          ? KUKA_KR210_PACKAGE
          : selectedBrandId === 'yaskawa'
          ? YASKAWA_GP50_PACKAGE
          : selectedBrandId === 'universal-robots'
          ? UNIVERSAL_ROBOTS_UR_PACKAGE
          : selectedBrandId === 'kawasaki'
          ? KAWASAKI_RS_PACKAGE
          : ABB_IRB6700_PACKAGE);
    setSelectedPackageId(targetPkg.id);
    setCurrentStep(3); // Chuyển thẳng sang Bước 3 (Gói)
  };

  const handleSelectPackage = (pkg: DresspackPackage) => {
    setSelectedPackageId(pkg.id);
    setCurrentStep(4); // Chuyển sang Bước 4 (BOM & 3D)
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* 1. COMPACT TOP TOOLBAR (Swiss Engineering Minimalist Header) */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Breadcrumb Path & Brand Indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-slate-400 uppercase tracking-wider">ROBOT DRESSPACK:</span>
              <button 
                onClick={() => setCurrentStep(1)} 
                className={`font-semibold hover:text-white transition-colors cursor-pointer ${currentStep === 1 ? 'text-sky-400 font-bold' : 'text-slate-300'}`}
              >
                {selectedBrand.name}
              </button>
              <span className="text-slate-600">/</span>
              <button 
                onClick={() => setCurrentStep(2)} 
                className={`font-semibold hover:text-white transition-colors cursor-pointer ${currentStep === 2 ? 'text-sky-400 font-bold' : 'text-slate-300'}`}
              >
                {selectedModel.name}
              </button>
              <span className="text-slate-600">/</span>
              <button 
                onClick={() => setCurrentStep(3)} 
                className={`font-mono text-sky-300 font-bold bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${currentStep === 3 ? 'ring-1 ring-sky-400' : ''}`}
              >
                {currentPackage.packageCode}
              </button>
            </div>

            {/* Step Navigation Tabs & Quick Action */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xs border border-slate-700/80 text-[11px] font-mono">
                {[
                  { n: 1, label: '1. Brand' },
                  { n: 2, label: '2. Model' },
                  { n: 3, label: '3. Gói' },
                  { n: 4, label: '4. Chi Tiết' }
                ].map(s => (
                  <button
                    key={s.n}
                    onClick={() => setCurrentStep(s.n)}
                    className={`px-2.5 py-1 rounded-xs transition-all cursor-pointer ${
                      currentStep === s.n 
                        ? 'bg-[#00478D] text-white font-bold shadow-xs' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('cart')}
                className="px-3 py-1 rounded-xs bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Giỏ RFQ</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">

        {/* STEP 1: BRAND SELECTION GRID */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  1. Chọn Hãng Robot Công Nghiệp
                </h2>
                <p className="text-xs text-slate-500">
                  Hỗ trợ 13 thương hiệu robot công nghiệp toàn cầu (83 dòng model)
                </p>
              </div>
              <div className="relative w-64">
                <input
                  type="text"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  placeholder="Lọc thương hiệu..."
                  className="w-full h-8 pl-8 pr-2.5 rounded-xs border border-slate-300 bg-white text-xs focus:outline-none focus:border-[#00478D]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
              onMouseLeave={() => setHoveredBrandId(null)}
            >
              {ROBOT_BRANDS
                .filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
                .map((brand) => {
                  const isHovered = hoveredBrandId === brand.id;
                  const isDimmed = hoveredBrandId !== null && !isHovered;
                  const isSelected = selectedBrandId === brand.id;

                  return (
                    <div
                      key={brand.id}
                      onClick={() => handleSelectBrand(brand)}
                      onMouseEnter={() => setHoveredBrandId(brand.id)}
                      className={`bg-white rounded-xs border p-3 cursor-pointer transition-all duration-300 group flex flex-col justify-between relative ${
                        isHovered
                          ? 'scale-105 -translate-y-1.5 shadow-xl border-[#00478D] ring-2 ring-[#00478D]/30 z-20 opacity-100'
                          : isDimmed
                          ? 'opacity-30 scale-[0.97] border-slate-200 shadow-none'
                          : isSelected
                          ? 'border-[#00478D] ring-2 ring-[#00478D]/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-mono transition-colors ${isHovered ? 'text-[#00478D] font-bold' : 'text-slate-400'}`}>
                            {brand.country}
                          </span>
                          {brand.hasActiveConfig && (
                            <span 
                              className={`w-2 h-2 rounded-full transition-transform ${isHovered ? 'bg-emerald-500 scale-125 ring-2 ring-emerald-200' : 'bg-emerald-500'}`} 
                              title="Sẵn sàng 3D" 
                            />
                          )}
                        </div>
                        <div className={`h-24 flex items-center justify-center p-1 rounded-xs mb-2 transition-colors ${isHovered ? 'bg-blue-50/60' : 'bg-slate-50'}`}>
                          <img 
                            src={brand.representativeRobotImg} 
                            alt={brand.name} 
                            className={`max-h-full max-w-full object-contain transition-transform duration-300 ${isHovered ? 'scale-110' : 'group-hover:scale-105'}`} 
                          />
                        </div>
                        <h3 className={`font-bold text-xs truncate transition-colors ${isHovered ? 'text-[#00478D]' : 'text-slate-900 group-hover:text-[#00478D]'}`}>
                          {brand.name}
                        </h3>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span className={isHovered ? 'text-slate-700 font-semibold' : ''}>{brand.modelsCount} models</span>
                        <ChevronRight className={`w-3 h-3 transition-all ${isHovered ? 'text-[#00478D] translate-x-1' : 'text-slate-300 group-hover:text-[#00478D]'}`} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* STEP 2: MODEL SELECTION GRID */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  2. Chọn Dòng Máy Robot ({selectedBrand.name})
                </h2>
                <p className="text-xs text-slate-500">
                  Chọn model cánh tay để tải danh mục gói giải pháp Dresspack
                </p>
              </div>
              <div className="relative w-64">
                <input
                  type="text"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Lọc model..."
                  className="w-full h-8 pl-8 pr-2.5 rounded-xs border border-slate-300 bg-white text-xs focus:outline-none focus:border-[#00478D]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              onMouseLeave={() => setHoveredModelId(null)}
            >
              {brandModels
                .filter(m => m.name.toLowerCase().includes(modelSearch.toLowerCase()))
                .map((model) => {
                  const isHovered = hoveredModelId === model.id;
                  const isDimmed = hoveredModelId !== null && !isHovered;
                  const isSelected = selectedModelId === model.id;

                  return (
                    <div
                      key={model.id}
                      onClick={() => handleSelectModel(model)}
                      onMouseEnter={() => setHoveredModelId(model.id)}
                      className={`bg-white rounded-xs border p-4 cursor-pointer transition-all duration-300 group flex flex-col justify-between relative ${
                        isHovered
                          ? 'scale-[1.03] -translate-y-1.5 shadow-xl border-[#00478D] ring-2 ring-[#00478D]/30 z-20 opacity-100'
                          : isDimmed
                          ? 'opacity-35 scale-[0.98] border-slate-200 shadow-none'
                          : isSelected
                          ? 'border-[#00478D] ring-2 ring-[#00478D]/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                          <span className={isHovered ? 'text-[#00478D] font-bold' : ''}>{model.series}</span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-xs">3D READY</span>
                        </div>
                        <div className={`h-36 flex items-center justify-center p-2 rounded-xs mb-3 transition-colors ${isHovered ? 'bg-blue-50/60' : 'bg-slate-50'}`}>
                          <img src={model.imageUrl} alt={model.name} className={`max-h-full max-w-full object-contain transition-transform duration-300 ${isHovered ? 'scale-110' : 'group-hover:scale-105'}`} />
                        </div>
                        <h3 className={`font-bold text-sm transition-colors ${isHovered ? 'text-[#00478D]' : 'text-slate-900 group-hover:text-[#00478D]'}`}>
                          {model.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs bg-slate-50 p-2 rounded-xs border border-slate-100 font-mono">
                          <div>Tải: <strong>{model.payloadKg} kg</strong></div>
                          <div>Vươn: <strong>{model.reachM} m</strong></div>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00478D]">
                        <span>Xem Gói Cấu Hình &rarr;</span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* STEP 3: PACKAGE SELECTION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  3. Chọn Gói Dresspack Cho {selectedModel.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Chọn cấu hình bảo vệ cáp theo cỡ ống luồn và tải trọng ứng dụng
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-[#00478D] hover:underline font-mono flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Đổi Model</span>
              </button>
            </div>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onMouseLeave={() => setHoveredPackageId(null)}
            >
              {availablePackages.map((pkg) => {
                const isHovered = hoveredPackageId === pkg.id;
                const isDimmed = hoveredPackageId !== null && !isHovered;
                const isSelected = selectedPackageId === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    onMouseEnter={() => setHoveredPackageId(pkg.id)}
                    className={`bg-white rounded-xs border p-5 cursor-pointer transition-all duration-300 group flex flex-col justify-between relative ${
                      isHovered
                        ? 'scale-[1.02] -translate-y-1.5 shadow-xl border-[#00478D] ring-2 ring-[#00478D]/30 z-20 opacity-100'
                        : isDimmed
                        ? 'opacity-35 scale-[0.98] border-slate-200 shadow-none'
                        : isSelected
                        ? 'border-[#00478D] ring-2 ring-[#00478D]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-[#00478D] bg-blue-50 px-2 py-0.5 rounded-xs">{pkg.packageCode}</span>
                      <span className="text-slate-400">Config ID: {pkg.configId}</span>
                    </div>
                    <div className="h-44 bg-slate-50 rounded-xs flex items-center justify-center p-2">
                      <img src={pkg.main3dImage} alt={pkg.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#00478D]">{pkg.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{pkg.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xs font-mono">
                      <div>Hành trình: <strong>{pkg.travelRange}</strong></div>
                      <div>Ống luồn: <strong>{pkg.conduitType}</strong></div>
                      <div>Lòng ống ID: <strong>{pkg.innerDiameterMm} mm</strong></div>
                      <div>Đường kính OD: <strong>{pkg.outerDiameterMm} mm</strong></div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00478D]">
                    <span>Chọn Gói Này ({pkg.parts.length} linh kiện)</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* STEP 4: MASTER ENGINEERING DETAIL:
            - BÊN TRÁI: HIỂN THỊ LUÔN LIST SẢN PHẨM (BOM) & ACTION RFQ
            - BÊN PHẢI: CHIA LÀM 2 PHẦN:
                1. 3D THỰC TẾ TRÊN ROBOT
                2. BẢN VẼ BÓ DÂY 2D CAD & CẤU HÌNH DÂY
        */}
        {currentStep === 4 && currentPackage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* BÊN TRÁI (LEFT - 6 COLS): HIỂN THỊ LUÔN LIST SẢN PHẨM / BOM THEO CHUẨN MURRPLASTIK */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Tiêu đề cấu hình Dresspack theo Murrplastik */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Dresspack {selectedModel.name}
                  </h1>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-[#00478D] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t('configurator.change_pkg', 'Đổi Gói')}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-400 flex items-center gap-2.5">
                  <span className="font-semibold text-slate-600">{currentPackage.packageCode}</span>
                  <span>{currentPackage.configId}</span>
                  <span className="text-slate-300">•</span>
                  <span>Ống: {currentPackage.conduitType} (ID {conduitInnerDiameter}mm)</span>
                </div>
              </div>

              {/* HỘP DANH SÁCH LINH KIỆN PARTS LIST CHUẨN MURRPLASTIK */}
              <div className="bg-white rounded-xs border border-slate-300 shadow-2xs overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-sm text-slate-900">
                      {locale === 'vi' ? 'Danh mục linh kiện' : t('configurator.parts_list', 'Parts list')}
                    </span>
                    <sup className="text-xs font-bold text-slate-500 font-mono">{currentPackage.parts.length}</sup>
                  </div>
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                </div>

                {/* Header 3 cột: Image | Part | Qty */}
                <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-slate-50/80 border-b border-slate-200 text-slate-400 text-[11px] font-semibold">
                  <div className="col-span-3 sm:col-span-2 text-center">{t('configurator.col_image', 'Hình ảnh')}</div>
                  <div className="col-span-6 sm:col-span-7">{t('configurator.col_part', 'Linh kiện')}</div>
                  <div className="col-span-3 text-center">{t('configurator.col_qty', 'Số lượng')}</div>
                </div>

                {/* Nội dung danh sách linh kiện */}
                <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
                  {currentPackage.parts.map((part) => {
                    const isConduit = part.unit === 'm' || part.name.startsWith('EW') || part.name.includes('Jumbo') || part.role.includes('Ruột gà');
                    const qty = partQuantities[part.id] ?? part.defaultQty;

                    return (
                      <div key={part.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-slate-50/70 transition-colors">
                        {/* Cột 1: Image - Ảnh to rõ ràng (w-14 h-14), click phóng to Lightbox */}
                        <div className="col-span-3 sm:col-span-2 flex justify-center">
                          <div 
                            onClick={() => setLightboxImage(part.imageUrl)}
                            className="w-14 h-14 bg-white border border-slate-200 rounded-xs p-1 flex items-center justify-center cursor-zoom-in hover:border-[#00478D] hover:shadow-xs transition-all"
                            title="Click để phóng to ảnh"
                          >
                            <img 
                              src={part.imageUrl} 
                              alt={part.name} 
                              className="max-h-full max-w-full object-contain" 
                            />
                          </div>
                        </div>

                        {/* Cột 2: Part - Mã MPN màu xám nhỏ ở trên, Tên hàng in đậm ở dưới, thêm tiếng Việt phụ đề */}
                        <div className="col-span-6 sm:col-span-7 pr-2">
                          <span className="text-[11px] font-mono text-slate-400 block leading-tight">
                            {part.mpn}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug mt-0.5">
                            {part.name}
                          </span>
                          {part.vnName && (
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                              {part.vnName}
                            </span>
                          )}
                        </div>

                        {/* Cột 3: Qty - Hiển thị 4 m hoặc bộ đếm [-] [qty] [+] */}
                        <div className="col-span-3 flex justify-center">
                          {isConduit ? (
                            <div className="w-full max-w-[84px] py-1.5 px-2 bg-slate-100 border border-slate-200 rounded-xs text-xs font-semibold text-slate-700 text-center font-mono">
                              {qty} m
                            </div>
                          ) : (
                            <div className="flex items-center border border-slate-200 rounded-xs bg-slate-50 overflow-hidden font-mono">
                              <button
                                onClick={() => handleUpdatePartQty(part.id, -1)}
                                disabled={qty <= 1}
                                className="w-6 sm:w-7 h-7 bg-white hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer border-r border-slate-200"
                              >
                                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </button>
                              <span className="w-6 sm:w-8 text-center font-bold text-slate-900 text-xs">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleUpdatePartQty(part.id, 1)}
                                className="w-6 sm:w-7 h-7 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer border-l border-slate-200"
                              >
                                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Master Actions chuẩn Murrplastik: Download files & Request a quote */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between gap-3">
                  {/* Nút Download files & Bản vẽ 2D / 3D CAD */}
                  <button
                    onClick={() => setIsCadModalOpen(true)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 py-2.5 px-4 rounded-xs border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#00478D]" />
                    <span>{t('configurator.download_files', 'Tài liệu CAD & Bản vẽ 2D/3D')}</span>
                  </button>


                  {/* Nút Request a quote bên phải (màu xanh navy đậm đặc trưng) */}
                  <button
                    onClick={handleSyncToRFQ}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white py-2.5 px-5 rounded-xs bg-[#002244] hover:bg-[#001830] transition-colors shadow-xs cursor-pointer"
                  >
                    <span>{t('configurator.request_quote', 'Yêu cầu báo giá')}</span>
                    <Mail className="w-4 h-4" />
                  </button>
                </div>

                {/* Thông báo xác nhận khi đồng bộ giỏ báo giá */}
                {isAddedToCart && (
                  <div className="p-2.5 rounded-xs bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center justify-between font-mono animate-in fade-in">
                    <span className="flex items-center gap-1.5 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('configurator.synced_rfq', `Đã đồng bộ ${currentPackage.parts.length} mã linh kiện vào Giỏ Báo Giá!`).replace('{count}', String(currentPackage.parts.length))}
                    </span>
                    <button
                      onClick={() => onNavigate('cart')}
                      className="text-[11px] font-bold text-[#00478D] underline cursor-pointer"
                    >
                      {t('configurator.open_cart', 'Mở Giỏ Hàng')} &rarr;
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* BÊN PHẢI (RIGHT - 6 COLS): CHIA LÀM 2 PHẦN XẾP DỌC
                1. PHẦN TRÊN: 3D THỰC TẾ TRÊN ROBOT (GỌN GÀNG, KHÔNG TIÊU ĐỀ THỪA)
                2. PHẦN DƯỚI: BẢN VẼ BÓ DÂY 2D CAD & CẤU HÌNH DÂY
            */}
            <div className="lg:col-span-6 space-y-4">

              {/* PHẦN 1 (TRÊN): 3D THỰC TẾ TRÊN ROBOT */}
              <div className="bg-white rounded-xs border border-slate-200 p-4 shadow-2xs space-y-2.5">
                <div className="relative h-60 sm:h-64 bg-linear-to-b from-slate-50 to-white rounded-xs flex items-center justify-center p-2 group">
                  <img 
                    src={currentPackage.perspectiveImages[activeAngleIndex]?.url || currentPackage.main3dImage}
                    alt="Góc chụp robot"
                    className="max-h-full max-w-full object-contain cursor-zoom-in group-hover:scale-102 transition-transform duration-300"
                    onClick={() => setLightboxImage(currentPackage.perspectiveImages[activeAngleIndex]?.url || currentPackage.main3dImage)}
                  />
                  {/* Badge góc nhìn tinh tế, không có tiêu đề dài thừa thãi */}
                  <span className="absolute top-2 right-2 text-[10px] font-mono bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-slate-200 text-slate-600 shadow-2xs">
                    {currentPackage.perspectiveImages[activeAngleIndex]?.angle || 'Isometric'}
                  </span>
                  <button
                    onClick={() => setLightboxImage(currentPackage.perspectiveImages[activeAngleIndex]?.url || currentPackage.main3dImage)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-xs bg-slate-900/80 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                    title="Phóng to ảnh"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Thumbnails Đổi Góc Chụp */}
                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100">
                  {currentPackage.perspectiveImages.map((view, idx) => (
                    <button
                      key={view.id}
                      onClick={() => setActiveAngleIndex(idx)}
                      className={`p-1 rounded-xs border text-center transition-all cursor-pointer ${
                        activeAngleIndex === idx ? 'border-[#00478D] ring-1 ring-[#00478D] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="h-11 flex items-center justify-center">
                        <img src={view.url} alt={view.label} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-600 block truncate mt-0.5">
                        {view.angle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PHẦN 2 (DƯỚI): BẢN VẼ BÓ DÂY 2D CAD & CẤU HÌNH DÂY */}
              <div className="space-y-3">
                <ConduitCadCrossSection
                  conduitInnerDiameterMm={conduitInnerDiameter}
                  cables={cadCablesList}
                />

                {/* THANH ĐO TIẾN TRÌNH FILL FACTOR (SLIM GAUGE) */}
                <div className="bg-white p-3 rounded-xs border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Tiết diện chiếm dụng (Max 60% DIN EN 60204-1):</span>
                    <strong className={isOverload ? 'text-red-600' : 'text-emerald-700'}>
                      {fillFactorPercent}% / 60% Max
                    </strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10" style={{ left: '60%' }} title="Ngưỡng 60%" />
                    <div 
                      className={`h-full transition-all duration-200 ${
                        isOverload ? 'bg-red-600' : isPass ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, fillFactorPercent)}%` }}
                    />
                  </div>
                  {isOverload && (
                    <div className="text-[11px] text-red-600 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Cảnh báo: Bó cáp quá chặt gây mỏi xoắn ruột gà. Khuyến nghị nâng size ống M50!</span>
                    </div>
                  )}
                </div>

                {/* BỘ CÔNG CỤ CẤU HÌNH BÓ DÂY (KHÔNG GHI TÊN END USER) */}
                <div className="bg-white rounded-xs border border-slate-200 p-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs uppercase font-mono text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#00478D]" />
                      <span>CẤU HÌNH BÓ CÁP / ỐNG KHÍ (CHUẨN ISO / IEC)</span>
                    </span>

                    {/* Presets Button Row - PURE APPLICATION NAMES ONLY */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {CABLE_PRESETS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleApplyPreset(p.id)}
                          className="px-2 py-0.5 rounded-xs border border-slate-200 bg-slate-50 hover:bg-blue-50 text-[10px] font-mono text-slate-700 hover:text-[#00478D] transition-colors cursor-pointer"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Standard Cable Interactive Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {STANDARD_CABLES.map(cable => {
                      const count = cableCounts[cable.id] || 0;
                      return (
                        <div 
                          key={cable.id}
                          className={`p-2 rounded-xs border transition-colors flex items-center justify-between gap-1.5 ${
                            count > 0 ? 'border-[#00478D]/40 bg-blue-50/20' : 'border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <div className="font-bold text-slate-800 text-[11px] truncate">{cable.name}</div>
                            <div className="text-[9px] font-mono text-slate-400 truncate">{cable.standard}</div>
                          </div>

                          <div className="flex items-center gap-1 font-mono text-xs shrink-0">
                            <button
                              onClick={() => handleUpdateCableCount(cable.id, -1)}
                              disabled={count === 0}
                              className="w-5 h-5 rounded-xs border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center font-bold cursor-pointer"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-4 text-center font-bold text-slate-900 text-[11px]">{count}</span>
                            <button
                              onClick={() => handleUpdateCableCount(cable.id, 1)}
                              className="w-5 h-5 rounded-xs border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center font-bold cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Cable Diameter Quick Input */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-slate-600">Thêm đường kính tự do:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-slate-400">Ø</span>
                        <input
                          type="number"
                          min="2"
                          max="35"
                          step="0.5"
                          value={customDiaInput}
                          onChange={(e) => setCustomDiaInput(parseFloat(e.target.value) || 0)}
                          className="w-14 h-6 px-1.5 rounded-xs border border-slate-300 text-xs font-mono text-center focus:outline-none focus:border-[#00478D]"
                        />
                        <span className="font-mono text-slate-400">mm</span>
                      </div>
                      <button
                        onClick={handleAddCustomCable}
                        className="h-6 px-2.5 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        + Thêm Dây
                      </button>
                    </div>

                    <button
                      onClick={() => setCableCounts({})}
                      className="text-[10px] text-slate-500 hover:text-red-600 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Xóa hết</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* 3. CAD & TECHNICAL DRAWINGS MODAL */}
      {isCadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-xs shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xs bg-[#00478D] flex items-center justify-center text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">
                    Hồ Sơ Kỹ Thuật CAD 2D/3D & Spec-Sheet
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                    <span className="text-amber-400 font-bold">{currentPackage.packageCode}</span>
                    <span>•</span>
                    <span>{selectedModel.name}</span>
                    <span>•</span>
                    <span>{currentPackage.conduitType}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsCadModalOpen(false)}
                className="w-7 h-7 rounded-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Card 1: Bản vẽ kỹ thuật 2D PDF */}
              <div className="p-4 rounded-xs border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#00478D]/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00478D]" />
                      <h4 className="font-bold text-slate-900 text-sm">Bản Vẽ Kỹ Thuật 2D (Vector PDF)</h4>
                      {currentPackage.cadPdfUrl ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xs">
                          XÁC THỰC CHÍNH HÃNG
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200 rounded-xs">
                          THEO YÊU CẦU DỰ ÁN
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {currentPackage.cadPdfUrl 
                        ? 'Bản vẽ kích thước hình học 2D Murrplastik chính thức: tọa độ tâm trục, bán kính uốn tối thiểu R, hành trình hồi vị của hộp R-Tec Box.'
                        : 'Bản vẽ 2D được cấp theo yêu cầu cấu hình dự án của khách hàng. Bộ phận kỹ thuật T&T Vina sẽ gửi bản vẽ trong 15-30 phút.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {currentPackage.cadPdfUrl ? (
                      <>
                        <a
                          href={currentPackage.cadPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xs border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mở Xem</span>
                        </a>
                        <a
                          href={currentPackage.cadPdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải PDF</span>
                        </a>
                      </>
                    ) : (
                      <a
                        href="tel:0983794782"
                        className="px-3.5 py-2 rounded-xs bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Yêu Cầu Kỹ Thuật</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Mô hình 3D STEP */}
              <div className="p-4 rounded-xs border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#00478D]/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-[#00478D]" />
                      <h4 className="font-bold text-slate-900 text-sm">Mô Hình Cơ Khí 3D STEP (.STP)</h4>
                      {currentPackage.cadStepUrl ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-blue-50 text-[#00478D] border border-blue-200 rounded-xs">
                          SOLIDWORKS / INVENTOR READY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-slate-100 text-slate-600 rounded-xs">
                          ON-DEMAND CAD
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      File 3D STEP tiêu chuẩn công nghiệp (ISO 10303), sẵn sàng nạp trực tiếp vào phần mềm mô phỏng cánh tay robot (RobotStudio, RoboDK, SolidWorks, CATIA).
                    </p>
                  </div>

                  <div className="shrink-0">
                    {currentPackage.cadStepUrl ? (
                      <a
                        href={currentPackage.cadStepUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xs bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải 3D STEP</span>
                      </a>
                    ) : (
                      <a
                        href={`mailto:t2t.vina@gmail.com?subject=${encodeURIComponent(`[CAD STEP Request] Xin file 3D cho ${currentPackage.packageCode} - ${selectedModel.name}`)}&body=${encodeURIComponent(`Kính gửi Bộ phận Kỹ thuật T&T Vina,\n\nTôi cần tải file mô hình 3D STEP cho gói Dresspack sau:\n- Mã gói: ${currentPackage.packageCode}\n- Model Robot: ${selectedModel.name}\n- Ống luồn: ${currentPackage.conduitType}\n\nVui lòng hỗ trợ gửi file giúp tôi.\nXin cảm ơn!`)}`}
                        className="px-3.5 py-2 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Yêu Cầu File STEP</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Tiết diện 2D & Tỷ lệ điền đầy hiện tại */}
              <div className="p-4 rounded-xs border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00478D]" />
                    <h4 className="font-bold text-slate-900 text-sm">Bản Vẽ 2D Tiết Diện Bó Cáp & Tiêu Chuẩn Điền Đầy</h4>
                  </div>
                  <div className="font-mono text-xs">
                    Tỷ lệ điền đầy: <strong className={fillFactorPercent > 60 ? 'text-red-600' : 'text-emerald-700'}>{fillFactorPercent.toFixed(1)}%</strong>
                    <span className="text-slate-400 text-[10px] ml-1">(Chuẩn Murr: &le;60%)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xs border border-slate-200">
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="w-36 h-36">
                      <ConduitCadCrossSection
                        conduitInnerDiameterMm={currentPackage.innerDiameterMm}
                        cables={cadCablesList}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1.5 font-mono text-[11px] justify-center flex flex-col">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Quy cách ống luồn:</span>
                      <span className="font-bold text-slate-900">{currentPackage.conduitType}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Đường kính lòng (ID):</span>
                      <span className="font-bold text-slate-900">{currentPackage.innerDiameterMm} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Tổng số sợi cáp/ống:</span>
                      <span className="font-bold text-slate-900">{totalCablesCount} sợi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Đánh giá kỹ thuật:</span>
                      <span className={`font-bold ${fillFactorPercent <= 60 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {fillFactorPercent <= 60 ? 'ĐẠT CHUẨN AN TOÀN' : 'VƯỢT NGƯỠNG ĐỀ XUẤT (>60%)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xs border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Phiếu Kỹ Thuật (A4)</span>
                  </button>
                </div>
              </div>

              {/* Card 4: Hotline Hỗ Trợ Kỹ Thuật Trực Tiếp */}
              <div className="p-3.5 rounded-xs bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-bold text-xs text-amber-400">Hỗ trợ kỹ thuật & Kiểm tra bản vẽ trực tiếp</div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Mr. Phong: 0983.794.782 • Mr. Hai: 0981.919.590 • Email: t2t.vina@gmail.com
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:0983794782"
                    className="px-3 py-1.5 rounded-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>0983.794.782</span>
                  </a>
                  <a
                    href={`mailto:t2t.vina@gmail.com?subject=${encodeURIComponent(`[Yêu Cầu CAD] Mã gói ${currentPackage.packageCode} - ${selectedModel.name}`)}`}
                    className="px-3 py-1.5 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Gửi Email</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 4. LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-xs cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xs p-3">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#00478D] text-white flex items-center justify-center shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={lightboxImage} alt="Zoom" className="max-h-[82vh] max-w-full object-contain mx-auto" />
          </div>
        </div>
      )}

    </div>
  );
}
