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
  Maximize2,
  X,
  Search,
  Plus,
  Minus,
  Play,
  FileText,
  Sliders,
  Shield,
  Layers,
  Cpu,
  Box,
  Printer,
  PhoneCall,
  ExternalLink,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  KdlSystemKey,
  GrommetSize,
  KdlSystemInfo,
  KdlFrameItem,
  KdlGrommetItem,
  KDL_SYSTEMS,
  KDL_FRAMES,
  KDL_GROMMETS,
  KDL_LAYOUT_COORDINATES,
  DEFAULT_BLANK_GROMMETS
} from '../data/kdlData';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface KdlConfiguratorProps {
  onNavigate: (tab: string, filter?: string, search?: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

interface CableItem {
  id: string;
  name: string;
  diameter: number;
  count: number;
  grommetMatnr?: string;
  size: GrommetSize;
}

export default function KdlConfigurator({ onNavigate, onAddToCart }: KdlConfiguratorProps) {
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

  // Wizard Steps: 1 = System & Filters, 2 = Cable Specification, 3 = Interactive CAD Assembly, 4 = BOM & Export
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Filters
  const [selectedSystem, setSelectedSystem] = useState<KdlSystemKey>('e-plus');
  const [selectedCutout, setSelectedCutout] = useState<string>('all');
  const [selectedIp, setSelectedIp] = useState<string>('all');
  const [selectedFire, setSelectedFire] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [fdaOnly, setFdaOnly] = useState<boolean>(false);
  const [frameSearch, setFrameSearch] = useState<string>('');

  // Selected Frame
  const [selectedFrameMatnr, setSelectedFrameMatnr] = useState<string>('87121110'); // KDL/E+ 24/4 default

  // Step 2: Cable Requirements
  const [cables, setCables] = useState<CableItem[]>([
    { id: 'c1', name: t('kdl.sample_cable_1'), diameter: 14, count: 2, size: 'small', grommetMatnr: '87121232' },
    { id: 'c2', name: t('kdl.sample_cable_2'), diameter: 8, count: 2, size: 'small', grommetMatnr: '87121220' },
    { id: 'c3', name: t('kdl.sample_cable_3'), diameter: 6, count: 2, size: 'small', grommetMatnr: '87121216' }
  ]);

  // Cable quick-add input state
  const [newCableName, setNewCableName] = useState<string>('Cáp tín hiệu cảm biến');
  const [newCableDia, setNewCableDia] = useState<number>(6);
  const [newCableCount, setNewCableCount] = useState<number>(1);

  // Step 3: Slot assignments (slotId -> grommet item)
  const [manualSlotAssignments, setManualSlotAssignments] = useState<Record<string, KdlGrommetItem>>({});
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  // Success toast / notice
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Video guide modal state
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoModal) {
        setShowVideoModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showVideoModal]);

  // Current Frame Object
  const currentFrame = useMemo(() => {
    return KDL_FRAMES.find(f => f.matnr === selectedFrameMatnr) || KDL_FRAMES[0];
  }, [selectedFrameMatnr]);

  // Filtered frames
  const filteredFrames = useMemo(() => {
    return KDL_FRAMES.filter(f => {
      if (f.system !== selectedSystem) return false;
      if (selectedCutout !== 'all' && f.cutoutSize !== selectedCutout) return false;
      if (selectedIp !== 'all' && !f.tightness.some(ip => ip.toLowerCase().includes(selectedIp.toLowerCase()))) return false;
      if (selectedFire !== 'all' && !f.fireClass.some(fc => fc.toLowerCase().includes(selectedFire.toLowerCase()))) return false;
      if (selectedMaterial !== 'all' && f.material !== selectedMaterial) return false;
      if (fdaOnly && !f.fda) return false;
      if (frameSearch.trim()) {
        const q = frameSearch.toLowerCase();
        if (!f.name.toLowerCase().includes(q) && !f.matnr.includes(q) && !f.cutoutSize.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [selectedSystem, selectedCutout, selectedIp, selectedFire, selectedMaterial, fdaOnly, frameSearch]);

  // Unique cutouts for selected system
  const availableCutouts = useMemo(() => {
    const set = new Set<string>();
    KDL_FRAMES.filter(f => f.system === selectedSystem).forEach(f => set.add(f.cutoutSize));
    return Array.from(set);
  }, [selectedSystem]);

  // Calculate required openings based on cables
  const requiredOpenings = useMemo(() => {
    let small = 0;
    let medium = 0;
    let big = 0;

    cables.forEach(c => {
      if (c.size === 'small') small += c.count;
      else if (c.size === 'medium') medium += c.count;
      else if (c.size === 'big') big += c.count;
    });

    return { small, medium, big, total: small + medium + big };
  }, [cables]);

  const totalDeclaredCables = useMemo(() => {
    return cables.reduce((sum, c) => sum + c.count, 0);
  }, [cables]);

  const isCapacityExceeded = totalDeclaredCables > currentFrame.totalOpenings;

  // Slot coordinates for current frame layout
  const layoutData = useMemo(() => {
    const key = currentFrame.layoutKey;
    return KDL_LAYOUT_COORDINATES[key] || KDL_LAYOUT_COORDINATES['e-plus-24-4'] || {};
  }, [currentFrame]);

  // Flattened slot list with coordinates
  const frameSlots = useMemo(() => {
    const list: Array<{ id: string; size: GrommetSize; index: number; x: number; y: number }> = [];

    if (layoutData.small) {
      Object.entries(layoutData.small).forEach(([idx, coords]) => {
        list.push({ id: `small-${idx}`, size: 'small', index: parseInt(idx, 10), x: coords[0], y: coords[1] });
      });
    }
    if (layoutData.medium) {
      Object.entries(layoutData.medium).forEach(([idx, coords]) => {
        list.push({ id: `medium-${idx}`, size: 'medium', index: parseInt(idx, 10), x: coords[0], y: coords[1] });
      });
    }
    if (layoutData.big) {
      Object.entries(layoutData.big).forEach(([idx, coords]) => {
        list.push({ id: `big-${idx}`, size: 'big', index: parseInt(idx, 10), x: coords[0], y: coords[1] });
      });
    }
    return list;
  }, [layoutData]);

  // Auto-assigned slots mapping
  const effectiveSlots = useMemo(() => {
    const map: Record<string, { grommet: KdlGrommetItem; isBlank: boolean; cableName?: string }> = {};

    // Group available cable items
    const expandedCables: Array<{ name: string; size: GrommetSize; grommet: KdlGrommetItem }> = [];
    cables.forEach(c => {
      const g = KDL_GROMMETS.find(item => item.matnr === c.grommetMatnr) 
        || KDL_GROMMETS.find(item => item.size === c.size && item.diameter === c.diameter)
        || DEFAULT_BLANK_GROMMETS[c.size];
      for (let i = 0; i < c.count; i++) {
        expandedCables.push({ name: c.name, size: c.size, grommet: g });
      }
    });

    // Fill slots by size match
    const smallSlots = frameSlots.filter(s => s.size === 'small');
    const mediumSlots = frameSlots.filter(s => s.size === 'medium');
    const bigSlots = frameSlots.filter(s => s.size === 'big');

    const smallCables = expandedCables.filter(c => c.size === 'small');
    const mediumCables = expandedCables.filter(c => c.size === 'medium');
    const bigCables = expandedCables.filter(c => c.size === 'big');

    // Small slots
    smallSlots.forEach((slot, i) => {
      if (manualSlotAssignments[slot.id]) {
        map[slot.id] = { grommet: manualSlotAssignments[slot.id], isBlank: manualSlotAssignments[slot.id].type === 'Blindtülle' };
      } else if (i < smallCables.length) {
        map[slot.id] = { grommet: smallCables[i].grommet, isBlank: false, cableName: smallCables[i].name };
      } else {
        map[slot.id] = { grommet: DEFAULT_BLANK_GROMMETS.small, isBlank: true };
      }
    });

    // Medium slots
    mediumSlots.forEach((slot, i) => {
      if (manualSlotAssignments[slot.id]) {
        map[slot.id] = { grommet: manualSlotAssignments[slot.id], isBlank: manualSlotAssignments[slot.id].type === 'Blindtülle' };
      } else if (i < mediumCables.length) {
        map[slot.id] = { grommet: mediumCables[i].grommet, isBlank: false, cableName: mediumCables[i].name };
      } else {
        map[slot.id] = { grommet: DEFAULT_BLANK_GROMMETS.medium, isBlank: true };
      }
    });

    // Big slots
    bigSlots.forEach((slot, i) => {
      if (manualSlotAssignments[slot.id]) {
        map[slot.id] = { grommet: manualSlotAssignments[slot.id], isBlank: manualSlotAssignments[slot.id].type === 'Blindtülle' };
      } else if (i < bigCables.length) {
        map[slot.id] = { grommet: bigCables[i].grommet, isBlank: false, cableName: bigCables[i].name };
      } else {
        map[slot.id] = { grommet: DEFAULT_BLANK_GROMMETS.big, isBlank: true };
      }
    });

    return map;
  }, [frameSlots, cables, manualSlotAssignments]);

  // Dynamic CAD Geometry for 100% Centered Visualization (both Rectangular & Round frames)
  const cadGeometry = useMemo(() => {
    if (frameSlots.length === 0) {
      return {
        viewBox: '0 0 240 100',
        shiftX: 0,
        shiftY: 0,
        isRound: false,
        outerRect: { x: 6, y: 6, w: 228, h: 88, rx: 6 },
        cutoutRect: { x: 22, y: 18, w: 196, h: 64, rx: 4 },
        screws: [
          { cx: 13, cy: 13 },
          { cx: 227, cy: 13 },
          { cx: 13, cy: 87 },
          { cx: 227, cy: 87 }
        ],
        outerCircle: null,
        innerCircle: null,
      };
    }

    const getRadius = (size: GrommetSize) => size === 'big' ? 14 : size === 'medium' ? 11 : 8;

    const minX = Math.min(...frameSlots.map(s => s.x - getRadius(s.size)));
    const maxX = Math.max(...frameSlots.map(s => s.x + getRadius(s.size)));
    const minY = Math.min(...frameSlots.map(s => s.y - getRadius(s.size)));
    const maxY = Math.max(...frameSlots.map(s => s.y + getRadius(s.size)));

    const slotsW = maxX - minX;
    const slotsH = maxY - minY;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const isRound = currentFrame.system === 'mono' || currentFrame.id.includes('mono') || currentFrame.id.includes('m50') || currentFrame.id.includes('er-plus');

    if (isRound) {
      const rInner = Math.max(slotsW, slotsH) / 2 + 10;
      const rOuter = rInner + 14;
      const margin = 8;
      const vbSize = Math.ceil((rOuter + margin) * 2);
      const center = vbSize / 2;
      const shiftX = center - cx;
      const shiftY = center - cy;

      return {
        viewBox: `0 0 ${vbSize} ${vbSize}`,
        shiftX,
        shiftY,
        isRound: true,
        outerRect: null,
        cutoutRect: null,
        screws: [
          { cx: center, cy: center - rOuter + 6 },
          { cx: center, cy: center + rOuter - 6 },
          { cx: center - rOuter + 6, cy: center },
          { cx: center + rOuter - 6, cy: center }
        ],
        outerCircle: { cx: center, cy: center, r: rOuter },
        innerCircle: { cx: center, cy: center, r: rInner },
      };
    }

    // Rectangular frame geometry
    const padX = 16;
    const padY = 14;
    const cutoutW = Math.max(Math.ceil(slotsW + 2 * padX), 90);
    const cutoutH = Math.max(Math.ceil(slotsH + 2 * padY), 56);

    const flange = 16;
    const outerW = cutoutW + 2 * flange;
    const outerH = cutoutH + 2 * flange;

    const margin = 6;
    const vbW = outerW + 2 * margin;
    const vbH = outerH + 2 * margin;

    const shiftX = (vbW / 2) - cx;
    const shiftY = (vbH / 2) - cy;

    const outerX = margin;
    const outerY = margin;

    const cutoutX = margin + flange;
    const cutoutY = margin + flange;

    const screws = [
      { cx: outerX + 7, cy: outerY + 7 },
      { cx: outerX + outerW - 7, cy: outerY + 7 },
      { cx: outerX + 7, cy: outerY + outerH - 7 },
      { cx: outerX + outerW - 7, cy: outerY + outerH - 7 },
    ];

    return {
      viewBox: `0 0 ${vbW} ${vbH}`,
      shiftX,
      shiftY,
      isRound: false,
      outerRect: { x: outerX, y: outerY, w: outerW, h: outerH, rx: 6 },
      cutoutRect: { x: cutoutX, y: cutoutY, w: cutoutW, h: cutoutH, rx: 4 },
      screws,
      outerCircle: null,
      innerCircle: null,
    };
  }, [frameSlots, currentFrame]);

  // BOM calculation
  const bomItems = useMemo(() => {
    const list: Array<{
      mpn: string;
      name: string;
      vnName: string;
      type: string;
      spec: string;
      qty: number;
      unit: string;
      isFrame?: boolean;
      isBlank?: boolean;
    }> = [];

    // Frame
    list.push({
      mpn: currentFrame.matnr,
      name: currentFrame.name,
      vnName: `Khung luồn cáp ${currentFrame.name} (IP: ${currentFrame.tightness.join('/')})`,
      type: 'Khung chính (Frame)',
      spec: `Lỗ khoét: ${currentFrame.cutoutSize} | ${currentFrame.totalOpenings} vị trí đệm | ${currentFrame.material === 'metal' ? 'Inox/Kim loại' : 'Nhựa PA6'}`,
      qty: 1,
      unit: 'cái'
    });

    // Grommets tally
    const tally: Record<string, { grommet: KdlGrommetItem; qty: number }> = {};
    Object.values(effectiveSlots).forEach(({ grommet }) => {
      if (!tally[grommet.matnr]) {
        tally[grommet.matnr] = { grommet, qty: 0 };
      }
      tally[grommet.matnr].qty += 1;
    });

    Object.values(tally).forEach(({ grommet, qty }) => {
      const isBlank = grommet.type === 'Blindtülle';
      list.push({
        mpn: grommet.matnr,
        name: grommet.name,
        vnName: grommet.vnName,
        type: isBlank ? 'Đệm bít kín (Blank plug)' : 'Đệm luồn cáp (Cable grommet)',
        spec: isBlank 
          ? `Bít kín slot ${grommet.size.toUpperCase()} chưa dùng (Chống bụi nước IP65)`
          : `Đệm cỡ ${grommet.size.toUpperCase()}${grommet.diameter ? ` cho cáp Ø${grommet.diameter}mm` : ''}`,
        qty,
        unit: 'cái',
        isFrame: false,
        isBlank
      });
    });

    return list;
  }, [currentFrame, effectiveSlots]);

  // Handle adding new cable to list
  const handleAddCable = () => {
    const dia = Number(newCableDia) || 6;
    let size: GrommetSize = 'small';
    if (dia > 22) size = 'big';
    else if (dia > 16) size = 'medium';

    // Find best match grommet
    const matched = KDL_GROMMETS.find(g => g.size === size && g.diameter === dia) 
      || KDL_GROMMETS.find(g => g.size === size);

    const newItem: CableItem = {
      id: `cable-${Date.now()}`,
      name: newCableName || `Cáp Ø${dia}mm`,
      diameter: dia,
      count: Number(newCableCount) || 1,
      size,
      grommetMatnr: matched?.matnr
    };

    setCables(prev => [...prev, newItem]);
    setNewCableName('Cáp tín hiệu cảm biến');
    setNewCableDia(6);
    setNewCableCount(1);
  };

  const handleRemoveCable = (id: string) => {
    setCables(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateCableCount = (id: string, delta: number) => {
    setCables(prev => prev.map(c => {
      if (c.id === id) {
        const next = Math.max(1, c.count + delta);
        return { ...c, count: next };
      }
      return c;
    }));
  };

  const handleResetConfig = () => {
    if (window.confirm(t('kdl.confirm_reset'))) {
      setCables([
        { id: 'c1', name: t('kdl.sample_cable_1'), diameter: 14, count: 2, size: 'small', grommetMatnr: '87121232' },
        { id: 'c2', name: t('kdl.sample_cable_2'), diameter: 8, count: 2, size: 'small', grommetMatnr: '87121220' },
        { id: 'c3', name: t('kdl.sample_cable_3'), diameter: 6, count: 2, size: 'small', grommetMatnr: '87121216' }
      ]);
      setManualSlotAssignments({});
      setActiveSlotId(null);
    }
  };

  // Add BOM items to quote cart
  const handleAddToCart = () => {
    bomItems.forEach(item => {
      const prod: Product = {
        id: `mp-kdl-${item.mpn}`,
        name: item.name,
        sku: item.mpn,
        brand: 'Murrplastik',
        category: 'Tấm / Khung & Đệm luồn cáp (KDP/KDL)',
        categorySlug: 'murrplastik',
        origin: 'CHLB Đức (Made in Germany)',
        image: '/images/products/murr/kdl_overview.webp',
        images: ['/images/products/murr/kdl_overview.webp'],
        stock: 50,
        stockStatus: 'In Stock',
        stockLocation: 'Kho Hà Nội / Hưng Yên sẵn hàng',
        price: 'Liên hệ báo giá dự án',
        unit: item.unit,
        shortDesc: item.vnName,
        specs: {
          'Mã sản phẩm (Order No.)': item.mpn,
          'Phân loại': item.type,
          'Quy cách kỹ thuật': item.spec,
          'Hệ thống': currentFrame.system.toUpperCase(),
          'Cấp bảo vệ IP': currentFrame.tightness.join(', ')
        }
      };
      onAddToCart(prod, item.qty);
    });

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
                <span className="text-red-600 font-bold">KDL Configurator</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{t('kdl.title')}</span>
                <span className="text-xs bg-red-100 text-red-700 font-mono px-2 py-0.5 rounded-xs font-bold uppercase">
                  {t('kdl.badge')}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                {t('kdl.subtitle')}
              </p>
            </div>

            {/* Switch Tool Button */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => onNavigate('kdp-configurator')}
                aria-label={t('kdl.switch_to_kdp')}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-300 hover:border-red-300 rounded-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-red-500"
              >
                <span>{t('kdl.switch_to_kdp')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Wizard Bar (Responsive 2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-100 print:hidden">
            {[
              { step: 1, title: t('kdl.step1_title'), desc: t('kdl.step1_desc') },
              { step: 2, title: t('kdl.step2_title'), desc: t('kdl.step2_desc') },
              { step: 3, title: t('kdl.step3_title'), desc: t('kdl.step3_desc') },
              { step: 4, title: t('kdl.step4_title'), desc: t('kdl.step4_desc') }
            ].map(s => {
              const isActive = currentStep === s.step;
              const isPast = currentStep > s.step;
              const stepTitleClean = s.title.includes('. ') ? s.title.split('. ')[1] : s.title;
              return (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${t('kdl.step_prefix')} ${s.step}: ${s.title}`}
                  className={`text-left p-2.5 rounded-xs border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-red-500 ${
                    isActive
                      ? 'bg-red-50 border-red-500 shadow-xs'
                      : isPast
                      ? 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      : 'bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-mono tabular-nums ${isActive ? 'text-[#C8102E]' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                      {t('kdl.step_prefix')} {s.step}
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

      {/* 2. MAIN WIZARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* MURRPLASTIK OFFICIAL VIDEO TUTORIAL BANNER (Single language based on active locale) */}
        <div className="bg-[#0B2535] border border-[#16445E] rounded-xs px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-5.5 bg-[#FF0000] rounded-xs flex items-center justify-center text-white shrink-0 shadow-xs">
              <Play className="w-3 h-3 fill-white" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {t('kdl.video_banner')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVideoModal(true)}
              aria-label={t('kdl.video_banner')}
              className="bg-white hover:bg-slate-100 text-[#C8102E] font-bold text-xs px-4 py-1.5 rounded-xs transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-white whitespace-nowrap active:scale-95"
            >
              {t('kdl.watch_video')}
            </button>
          </div>
        </div>

        {/* STEP 1: SYSTEM & FRAME FILTERS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* 4 System Families Cards */}
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                {t('kdl.select_family')}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {KDL_SYSTEMS.map(sys => {
                  const isSelected = selectedSystem === sys.id;
                  const systemBadge = t(`kdl.sys_${sys.id}_badge`, sys.badge);
                  const systemDesc = t(`kdl.sys_${sys.id}_desc`, sys.description);
                  return (
                    <div
                      key={sys.id}
                      onClick={() => {
                        setSelectedSystem(sys.id);
                        setSelectedCutout('all');
                      }}
                      className={`p-4 rounded-sm border cursor-pointer transition-all relative ${
                        isSelected
                          ? 'bg-white border-red-600 ring-2 ring-red-600/10 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-xs">
                          {systemBadge}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-red-600" />}
                      </div>
                      <h2 className="text-base font-black text-slate-900">{sys.code}</h2>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{systemDesc}</p>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                        {sys.ipRatings.map(ip => (
                          <span key={ip} className="text-2xs font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-xs">
                            {ip}
                          </span>
                        ))}
                        <span className="text-2xs font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-xs">
                          {sys.defaultMaterial === 'metal' ? t('kdl.filter_material_metal') : t('kdl.filter_material_plastic')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Filters & Frame Selection Grid */}
            <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    {t('kdl.filter_frames')} ({filteredFrames.length})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t('kdl.search_placeholder')}
                      value={frameSearch}
                      onChange={e => setFrameSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 w-44"
                    />
                  </div>

                  {/* Cutout Filter */}
                  <select
                    value={selectedCutout}
                    onChange={e => setSelectedCutout(e.target.value)}
                    className="text-xs border border-slate-300 rounded-xs px-2.5 py-1.5 bg-white text-slate-700 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="all">{t('kdl.filter_all_cutouts')}</option>
                    {availableCutouts.map(c => (
                      <option key={c} value={c}>{t('kdl.cutout')} {c}</option>
                    ))}
                  </select>

                  {/* IP Rating Filter */}
                  <select
                    value={selectedIp}
                    onChange={e => setSelectedIp(e.target.value)}
                    className="text-xs border border-slate-300 rounded-xs px-2.5 py-1.5 bg-white text-slate-700 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="all">{t('kdl.filter_all_ip')}</option>
                    <option value="ip54">IP54</option>
                    <option value="ip65">IP65</option>
                    <option value="ip66">IP66/67</option>
                    <option value="ip69k">IP69K</option>
                  </select>

                  {/* Material Filter */}
                  <select
                    value={selectedMaterial}
                    onChange={e => setSelectedMaterial(e.target.value)}
                    className="text-xs border border-slate-300 rounded-xs px-2.5 py-1.5 bg-white text-slate-700 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="all">{t('kdl.filter_all_materials')}</option>
                    <option value="plastic">{t('kdl.filter_material_plastic')}</option>
                    <option value="metal">{t('kdl.filter_material_metal')}</option>
                  </select>

                  {/* FDA Toggle */}
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fdaOnly}
                      onChange={e => setFdaOnly(e.target.checked)}
                      className="rounded-xs text-red-600 focus:ring-red-500"
                    />
                    <span>{t('kdl.filter_fda')}</span>
                  </label>
                </div>
              </div>

              {/* Frames Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {filteredFrames.map(f => {
                  const isSelected = selectedFrameMatnr === f.matnr;
                  return (
                    <div
                      key={f.matnr}
                      onClick={() => setSelectedFrameMatnr(f.matnr)}
                      className={`p-3.5 rounded-xs border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-red-50/50 border-red-500 ring-1 ring-red-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900">{f.matnr}</span>
                        <div className="flex items-center gap-1">
                          {f.fda && (
                            <span className="text-2xs font-mono font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded-xs">
                              FDA
                            </span>
                          )}
                          <span className="text-2xs font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-xs">
                            {f.tightness.join('/')}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{f.name}</div>

                      <div className="mt-2 text-2xs text-slate-500 space-y-0.5">
                        <div>{t('kdl.cutout')} <span className="font-mono font-bold text-slate-700">{f.cutoutSize}</span></div>
                        <div>{t('kdl.total_slots')} <span className="font-bold text-red-600">{f.totalOpenings} slots</span> ({t('kdl.slot_small')}: {f.numberSmall}, {t('kdl.slot_medium')}: {f.numberMedium}, {t('kdl.slot_big')}: {f.numberBig})</div>
                        <div>{t('kdl.material')} <span className="text-slate-700">{f.material === 'metal' ? t('kdl.filter_material_metal') : t('kdl.filter_material_plastic')}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  {t('kdl.selected')} <span className="font-bold font-mono text-slate-900">{currentFrame.name}</span> ({t('kdl.order_no')} <span className="font-mono text-red-600 font-bold">{currentFrame.matnr}</span>)
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-red-700 text-white font-bold text-xs rounded-xs shadow-xs transition-all cursor-pointer"
                >
                  <span>{t('kdl.btn_continue_cables')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CABLE SPECIFICATION & GROMMET MATCHING */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Cable Table & Quick Add */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {tt('kdl.cable_list_title', { count: cables.length, total: totalDeclaredCables })}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t('kdl.cable_list_desc')}
                    </p>
                  </div>

                  <button
                    onClick={handleResetConfig}
                    aria-label={t('kdl.btn_reset')}
                    className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer focus-visible:outline-1 focus-visible:outline-red-500 p-1 rounded-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('kdl.btn_reset')}</span>
                  </button>
                </div>

                {/* Capacity Overflow Warning Banner (Senior BA Rule) */}
                {isCapacityExceeded && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xs flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      {tt('kdl.capacity_warning', { total: totalDeclaredCables, frame: currentFrame.name, slots: currentFrame.totalOpenings })}
                    </div>
                  </div>
                )}

                {/* Cable List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600 font-mono text-2xs uppercase">
                        <th className="py-2 px-2 font-bold">{t('kdl.col_cable_name')}</th>
                        <th className="py-2 px-2 font-bold text-center">{t('kdl.col_od')}</th>
                        <th className="py-2 px-2 font-bold text-center">{t('kdl.col_slot_size')}</th>
                        <th className="py-2 px-2 font-bold">{t('kdl.col_recommended_grommet')}</th>
                        <th className="py-2 px-2 font-bold text-center">{t('kdl.col_qty')}</th>
                        <th className="py-2 px-2 text-right">{t('kdl.col_action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cables.map(c => {
                        const matchedGrommet = KDL_GROMMETS.find(g => g.matnr === c.grommetMatnr) 
                          || KDL_GROMMETS.find(g => g.size === c.size && g.diameter === c.diameter);
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-2 font-bold text-slate-900">
                              {c.name}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono tabular-nums font-bold text-slate-800">
                              Ø{c.diameter} mm
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <span className={`text-2xs font-mono font-bold px-2 py-0.5 rounded-xs ${
                                c.size === 'small' ? 'bg-blue-50 text-blue-700' : c.size === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                              }`}>
                                {c.size.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2.5 px-2">
                              <div className="font-mono tabular-nums text-2xs font-bold text-red-600">
                                {matchedGrommet?.matnr}
                              </div>
                              <div className="text-2xs text-slate-600 truncate max-w-[200px]">
                                {matchedGrommet?.name}
                              </div>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <div className="inline-flex items-center border border-slate-200 rounded-xs">
                                <button
                                  onClick={() => handleUpdateCableCount(c.id, -1)}
                                  aria-label={`Giảm số lượng cáp ${c.name}`}
                                  className="min-w-[28px] min-h-[28px] flex items-center justify-center p-1 hover:bg-slate-100 cursor-pointer text-slate-600 focus-visible:outline-1 focus-visible:outline-red-500"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 font-mono tabular-nums font-bold text-xs">{c.count}</span>
                                <button
                                  onClick={() => handleUpdateCableCount(c.id, 1)}
                                  aria-label={`Tăng số lượng cáp ${c.name}`}
                                  className="min-w-[28px] min-h-[28px] flex items-center justify-center p-1 hover:bg-slate-100 cursor-pointer text-slate-600 focus-visible:outline-1 focus-visible:outline-red-500"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-2 text-right">
                              <button
                                onClick={() => handleRemoveCable(c.id)}
                                aria-label={`Xóa sợi cáp ${c.name}`}
                                className="text-slate-500 hover:text-red-600 cursor-pointer p-1.5 rounded-xs hover:bg-red-50 min-w-[28px] min-h-[28px] flex items-center justify-center focus-visible:outline-1 focus-visible:outline-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {cables.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-xs text-slate-400 italic">
                            {t('kdl.no_cables')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Quick Add Form */}
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xs">
                  <div className="text-xs font-mono font-bold text-slate-700 mb-2">{t('kdl.quick_add_title')}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                    <div className="sm:col-span-2">
                      <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdl.cable_name_label')}</label>
                      <input
                        type="text"
                        value={newCableName}
                        onChange={e => setNewCableName(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white"
                        placeholder={t('kdl.cable_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-slate-500 mb-1">{t('kdl.cable_dia_label')}</label>
                      <input
                        type="number"
                        min={1}
                        max={35}
                        value={newCableDia}
                        onChange={e => setNewCableDia(Number(e.target.value))}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <button
                        onClick={handleAddCable}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('kdl.btn_add_cable')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Frame Capacity & Validation Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                  {t('kdl.matching_summary')}
                </h3>

                <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 mb-4">
                  <div className="text-xs font-bold text-slate-900">{currentFrame.name}</div>
                  <div className="text-2xs font-mono text-red-600 font-bold mt-0.5">MPN: {currentFrame.matnr}</div>
                  <div className="text-2xs text-slate-500 mt-1">{t('kdl.cutout')} {currentFrame.cutoutSize} | IP: {currentFrame.tightness.join('/')}</div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Small openings */}
                  <div>
                    <div className="flex justify-between text-2xs mb-1">
                      <span className="font-bold text-slate-700">Slots {t('kdl.slot_small')} (Small: 1.5 - 16mm):</span>
                      <span className="font-mono font-bold">
                        {requiredOpenings.small} / {currentFrame.numberSmall}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          requiredOpenings.small > currentFrame.numberSmall ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, (requiredOpenings.small / (currentFrame.numberSmall || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Medium openings */}
                  <div>
                    <div className="flex justify-between text-2xs mb-1">
                      <span className="font-bold text-slate-700">Slots {t('kdl.slot_medium')} (Medium: 16 - 22mm):</span>
                      <span className="font-mono font-bold">
                        {requiredOpenings.medium} / {currentFrame.numberMedium}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          requiredOpenings.medium > currentFrame.numberMedium ? 'bg-red-600' : 'bg-amber-600'
                        }`}
                        style={{ width: `${Math.min(100, (requiredOpenings.medium / (currentFrame.numberMedium || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Big openings */}
                  <div>
                    <div className="flex justify-between text-2xs mb-1">
                      <span className="font-bold text-slate-700">Slots {t('kdl.slot_big')} (Big: 22 - 35mm):</span>
                      <span className="font-mono font-bold">
                        {requiredOpenings.big} / {currentFrame.numberBig}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          requiredOpenings.big > currentFrame.numberBig ? 'bg-red-600' : 'bg-purple-600'
                        }`}
                        style={{ width: `${Math.min(100, (requiredOpenings.big / (currentFrame.numberBig || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Validation Status Notice */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {requiredOpenings.small <= currentFrame.numberSmall &&
                   requiredOpenings.medium <= currentFrame.numberMedium &&
                   requiredOpenings.big <= currentFrame.numberBig ? (
                    <div className="p-2.5 bg-green-50 border border-green-200 rounded-xs flex items-center gap-2 text-xs text-green-800">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span>{tt('kdl.capacity_ok', { remaining: currentFrame.totalOpenings - requiredOpenings.total })}</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xs flex items-center gap-2 text-xs text-red-800">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{t('kdl.capacity_exceeded')}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8102E] hover:bg-red-700 text-white font-bold text-xs rounded-xs shadow-xs cursor-pointer"
                  >
                    <span>{t('kdl.btn_continue_cad')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xs cursor-pointer"
                  >
                    {t('kdl.change_frame')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE 2D CAD ASSEMBLY */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Live CAD Visualizer */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <span>{tt('kdl.cad_title', { name: currentFrame.name })}</span>
                      <span className="text-2xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xs">
                        Layout: {currentFrame.layoutKey}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t('kdl.cad_desc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-2xs font-medium text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-xs shadow-blue-500/50" /> {t('kdl.legend_active')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block border border-dashed border-slate-300" /> {t('kdl.legend_blind')}
                    </span>
                  </div>
                </div>

                {/* Vector CAD SVG Canvas */}
                <div className="bg-slate-900 p-8 rounded-sm flex items-center justify-center overflow-x-auto min-h-[380px]">
                  <svg
                    viewBox={cadGeometry.viewBox}
                    className="w-full max-w-[560px] h-auto drop-shadow-2xl select-none"
                  >
                    {/* CAD Grid Background pattern for industrial precision */}
                    <defs>
                      <pattern id="cadGridKdl" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#162032" strokeWidth="0.5" />
                      </pattern>
                    </defs>

                    {/* Frame Body Outer */}
                    {cadGeometry.isRound ? (
                      <circle
                        cx={cadGeometry.outerCircle?.cx}
                        cy={cadGeometry.outerCircle?.cy}
                        r={cadGeometry.outerCircle?.r}
                        fill="#1e293b"
                        stroke="#475569"
                        strokeWidth="2"
                      />
                    ) : (
                      <rect
                        x={cadGeometry.outerRect?.x}
                        y={cadGeometry.outerRect?.y}
                        width={cadGeometry.outerRect?.w}
                        height={cadGeometry.outerRect?.h}
                        rx={cadGeometry.outerRect?.rx}
                        fill="#1e293b"
                        stroke="#475569"
                        strokeWidth="2"
                      />
                    )}

                    {/* Frame Cutout Opening Inner */}
                    {cadGeometry.isRound ? (
                      <>
                        <circle
                          cx={cadGeometry.innerCircle?.cx}
                          cy={cadGeometry.innerCircle?.cy}
                          r={cadGeometry.innerCircle?.r}
                          fill="#0f172a"
                          stroke="#334155"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={cadGeometry.innerCircle?.cx}
                          cy={cadGeometry.innerCircle?.cy}
                          r={cadGeometry.innerCircle?.r}
                          fill="url(#cadGridKdl)"
                        />
                      </>
                    ) : (
                      <>
                        <rect
                          x={cadGeometry.cutoutRect?.x}
                          y={cadGeometry.cutoutRect?.y}
                          width={cadGeometry.cutoutRect?.w}
                          height={cadGeometry.cutoutRect?.h}
                          rx={cadGeometry.cutoutRect?.rx}
                          fill="#0f172a"
                          stroke="#334155"
                          strokeWidth="1.5"
                        />
                        <rect
                          x={cadGeometry.cutoutRect?.x}
                          y={cadGeometry.cutoutRect?.y}
                          width={cadGeometry.cutoutRect?.w}
                          height={cadGeometry.cutoutRect?.h}
                          rx={cadGeometry.cutoutRect?.rx}
                          fill="url(#cadGridKdl)"
                        />
                      </>
                    )}

                    {/* Mounting Screw Holes */}
                    {cadGeometry.screws.map((s, idx) => (
                      <circle
                        key={idx}
                        cx={s.cx}
                        cy={s.cy}
                        r="3.2"
                        fill="#0f172a"
                        stroke="#64748b"
                        strokeWidth="1.2"
                      />
                    ))}

                    {/* Render Slot Openings (100% Concentrically Centered & Jitter-Free) */}
                    {frameSlots.map(slot => {
                      const assigned = effectiveSlots[slot.id];
                      const isSelected = activeSlotId === slot.id;
                      const isBlank = assigned?.isBlank;
                      const radius = slot.size === 'big' ? 14 : slot.size === 'medium' ? 11 : 8;
                      const posX = slot.x + cadGeometry.shiftX;
                      const posY = slot.y + cadGeometry.shiftY;

                      return (
                        <g
                          key={slot.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`Vị trí slot ${slot.id}: ${isBlank ? 'Đệm bít kín (Blind plug)' : `Cáp ${assigned?.cableName || ''} Ø${assigned?.grommet.diameter}mm`}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveSlotId(slot.id);
                            }
                          }}
                          className="group cursor-pointer select-none focus:outline-hidden focus-visible:outline-2 focus-visible:outline-sky-400"
                          onClick={() => setActiveSlotId(slot.id)}
                        >
                          {/* Expanded Transparent Hit Area (Prevents edge flicker/jitter when hovering border) */}
                          <circle
                            cx={posX}
                            cy={posY}
                            r={radius + 3.5}
                            fill="transparent"
                            className="pointer-events-auto"
                          />

                          {/* Slot Border / Ring (Stable vector without geometric jump) */}
                          <circle
                            cx={posX}
                            cy={posY}
                            r={radius}
                            fill={isSelected ? '#38bdf8' : isBlank ? '#1e293b' : '#0284c7'}
                            stroke={isSelected ? '#ffffff' : isBlank ? '#64748b' : '#38bdf8'}
                            strokeWidth={isSelected ? '2.5' : '1.8'}
                            strokeDasharray={isBlank ? '3 2' : 'none'}
                            className="transition-colors duration-150 group-hover:stroke-cyan-300 group-hover:brightness-110 pointer-events-none"
                          />

                          {/* Inner cable hole representation */}
                          {!isBlank && (
                            <circle
                              cx={posX}
                              cy={posY}
                              r={radius * 0.58}
                              fill="#0f172a"
                              stroke={isSelected ? '#ffffff' : '#7dd3fc'}
                              strokeWidth="1"
                              className="transition-colors duration-150 group-hover:stroke-white pointer-events-none"
                            />
                          )}

                          {/* Text Label */}
                          <text
                            x={posX}
                            y={posY + 2.5}
                            textAnchor="middle"
                            fill={isSelected ? '#0f172a' : isBlank ? '#94a3b8' : '#ffffff'}
                            fontSize={slot.size === 'big' ? '7' : slot.size === 'medium' ? '6.5' : '5.8'}
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight="bold"
                            pointerEvents="none"
                            className="select-none pointer-events-none transition-colors duration-150"
                          >
                            {isBlank ? 'BTK' : `Ø${assigned?.grommet.diameter || '?'}`}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="mt-3 flex items-center justify-between text-2xs text-slate-500 font-sans">
                  <span>{t('kdl.scale_note')}</span>
                  <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xs">
                    {tt('kdl.arranged_slots', { count: Object.keys(effectiveSlots).length })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Slot Detail Inspector & Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-xs">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                  {t('kdl.inspector_title')}
                </h3>

                {activeSlotId && effectiveSlots[activeSlotId] ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xs border border-slate-200">
                      <div className="text-2xs font-mono font-bold text-red-600">{t('kdl.slot_id')} {activeSlotId}</div>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {effectiveSlots[activeSlotId].grommet.name}
                      </div>
                      <div className="text-2xs text-slate-500 mt-0.5">
                        {t('kdl.grommet_code')} <span className="font-mono font-bold text-slate-700">{effectiveSlots[activeSlotId].grommet.matnr}</span>
                      </div>
                      <div className="text-2xs text-slate-500">
                        {t('kdl.grommet_type')} <span className="text-slate-700">{effectiveSlots[activeSlotId].grommet.vnName}</span>
                      </div>
                      {effectiveSlots[activeSlotId].cableName && (
                        <div className="text-2xs text-blue-700 font-bold mt-1">
                          {t('kdl.assigned_to')} {effectiveSlots[activeSlotId].cableName}
                        </div>
                      )}
                    </div>

                    <div className="text-2xs text-slate-600">
                      {t('kdl.slot_protection_note')}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xs text-center text-xs text-slate-500">
                    {t('kdl.inspector_empty')}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8102E] hover:bg-red-700 text-white font-bold text-xs rounded-xs shadow-xs cursor-pointer"
                  >
                    <span>{t('kdl.btn_to_bom')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xs cursor-pointer"
                  >
                    {t('kdl.btn_back_cables')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BOM & B2B QUOTATION ACTIONS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Dedicated Print Cover Header (Visible ONLY on print/PDF) */}
            <div className="hidden print:block mb-6 pb-4 border-b-2 border-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-black text-slate-900 uppercase tracking-tight">{t('kdl.company_name')}</div>
                  <div className="text-2xs text-slate-600">{t('kdl.company_sub')}</div>
                </div>
                <div className="text-right text-2xs text-slate-600 font-mono tabular-nums">
                  <div>{t('kdl.doc_title')}</div>
                  <div>Khung: {currentFrame.name} (IP: {currentFrame.tightness.join('/')})</div>
                  <div>{t('kdl.export_date')} {new Date().toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-xs print:border-none print:p-0 print:shadow-none">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-4 mb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <span>{t('kdl.bom_title')}</span>
                    <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-0.5 rounded-xs font-bold">
                      {t('kdl.bom_badge')}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t('kdl.bom_desc')}
                  </p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => window.print()}
                    aria-label="In bản vẽ và bảng kê BOM hồ sơ kỹ thuật"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-xs text-xs font-bold text-slate-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-red-500"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('kdl.btn_print')}</span>
                  </button>
                </div>
              </div>

              {/* BOM Table - Technical Solution List (Hidden Price Policy) */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-mono text-2xs uppercase bg-slate-50">
                      <th className="py-2.5 px-3 font-bold text-center w-12">{t('kdl.col_stt')}</th>
                      <th className="py-2.5 px-3 font-bold w-32">{t('kdl.col_mpn')}</th>
                      <th className="py-2.5 px-3 font-bold">{t('kdl.col_part_name')}</th>
                      <th className="py-2.5 px-3 font-bold">{t('kdl.col_system')}</th>
                      <th className="py-2.5 px-3 font-bold">{t('kdl.col_spec')}</th>
                      <th className="py-2.5 px-3 font-bold text-center w-24">{t('kdl.col_qty')}</th>
                      <th className="py-2.5 px-3 font-bold text-center w-20">{t('kdl.col_unit')}</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">{t('kdl.col_status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bomItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-500 font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-mono tabular-nums font-bold text-red-600">
                          {item.mpn}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-2xs text-slate-600">{locale === 'vi' ? item.vnName : item.name}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-2xs font-mono font-bold px-2 py-0.5 rounded-xs ${
                            item.isFrame ? 'bg-red-50 text-red-700' : item.isBlank ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {item.isFrame ? t('kdl.bom_type_frame') : item.isBlank ? t('kdl.bom_type_blind') : t('kdl.bom_type_grommet')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-2xs text-slate-700">
                          {item.spec}
                        </td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums font-bold text-sm text-slate-900">
                          {item.qty}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">
                          {t('kdl.unit_pcs')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-2xs font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-xs">
                            {t('kdl.status_in_stock')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                      <td colSpan={5} className="py-3 px-3 text-right font-bold text-xs text-slate-700">
                        {t('kdl.total_bom')}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums font-bold text-sm text-red-600">
                        {bomItems.reduce((sum, item) => sum + item.qty, 0)}
                      </td>
                      <td colSpan={2} className="py-3 px-3 text-left font-mono text-xs text-slate-600">
                        {t('kdl.bom_vpe_note')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Technical Notice Banner */}
              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xs flex items-center justify-between text-xs text-blue-900 mt-2 print:hidden">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>{t('kdl.price_notice_title')}</strong> {t('kdl.price_notice_desc')}
                  </span>
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
                    <span>{t('kdl.btn_back_drawing')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="tel:0961448833"
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xs cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-red-600" />
                    <span>Hotline: 0961.448.833</span>
                  </a>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#C8102E] hover:bg-red-700 text-white font-bold text-xs rounded-xs shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t('kdl.btn_add_to_cart')}</span>
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
            <div className="text-xs font-bold">{t('kdl.toast_added_title')}</div>
            <div className="text-2xs text-slate-400">{tt('kdl.toast_added_desc', { count: bomItems.length })}</div>
          </div>
          <button
            onClick={() => onNavigate('cart')}
            className="ml-2 text-2xs font-mono font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
          >
            {t('kdl.toast_view_cart')}
          </button>
        </div>
      )}

      {/* 4. VIDEO MODAL POPUP (YouTube Embed) */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-sm w-full max-w-4xl overflow-hidden shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-4.5 bg-[#FF0000] rounded-xs flex items-center justify-center text-white shrink-0">
                  <Play className="w-2.5 h-2.5 fill-white" />
                </div>
                <h3 id="video-modal-title" className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {t('kdl.modal_title')}
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                aria-label="Đóng cửa sổ video"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xs cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 16:9 Video Container */}
            <div className="relative aspect-video bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/uyH7Bd3pnx0?autoplay=1&rel=0"
                title="Hướng dẫn cấu hình KDL Murrplastik"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-2xs text-slate-400">
              <span>{t('kdl.modal_copyright')}</span>
              <a
                href="https://youtu.be/uyH7Bd3pnx0?si=LbyxOCmJGMo5qyYL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 hover:underline"
              >
                <span>{t('kdl.open_youtube')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
