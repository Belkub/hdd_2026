import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Layers, 
  Trash2,
  PlusCircle,
  FileText,
  Activity,
  Award
} from 'lucide-react';

// Mock data for the project calculator based on the OCR analysis
const MOCK_DF = Array.from({ length: 18 }, (_, i) => ({
  num: i + 1,
  F: 1.5 + (i * 0.1), // Sample factor
  soda_min: 0.5, cv_min: 25, paa_min: 0.1, pac_min: 0.5, xc_min: 0.2, lub_min: 0.3,
  soda_c: 0.7, cv_c: 30, paa_c: 0.2, pac_c: 0.7, xc_c: 0.3, lub_c: 0.4,
  soda_max: 1.0, cv_max: 40, paa_max: 0.3, pac_max: 1.0, xc_max: 0.5, lub_max: 0.6,
  T: 45 + i, // Viscosity
  gel: 15 + i, // Gel strength
  yp: 20 + i, // Yield point
  pil_gm: 1.2, // Pilot factor for hydromonitor
  pil_vint: 1.5, // Pilot factor for motor
}));

const pullForceRates: Record<string, number> = {
  'Мини до 100 кН': 1,
  'Миди 100 - 400 кН': 2,
  'Макси 400 - 2500 кН': 3,
  'Мега > 2500 кН': 4
};

const motorTypes: Record<string, number> = {
  'гидромонитор': 1,
  'винтовой забойный двигатель': 2
};

const pipeMaterials: Record<string, number> = {
  'Стальной': 1,
  'Полиэтиленовые трубы': 2
};

const rockHardnessRates: Record<string, number> = {
  'мягкие породы': 1,
  'породы средней прочности': 2,
  'твердые и крепкие породы': 3
};

const rockDescriptions: Record<number, Record<string, number>> = {
  1: {
    'пески, супеси (без гальки), торф, растит слой': 1,
    'пластичные глины, ил': 2,
    'плотные супеси, суглинки': 3,
    'глины тугопластичные': 4,
    'песчано-глинистые породы с мелкой галькой (до 3 см)': 5,
    'глины с прослоями песчаника и мергеля': 6
  },
  2: {
    'водоносный песок и торф': 7,
    'песчаник глинистый, алевролиты': 8,
    'глины твердые': 9,
    'крупнозернистый песок, песчаные глины, доломиты': 10,
    'галечник песчаный или глинистый': 11,
    'галечно-щебнистые породы': 12
  },
  3: {
    'песчанистый известняк': 13,
    'ангидриты и плотные доломиты': 14,
    'плотные доломитовые глины': 15,
    'песчано-глинистые породы с галькой (до 50 %)': 16,
    'Кремнистые аргиллиты, базальты': 17,
    'Валунно-галечные отложения': 18
  }
};

const MV_NORMS: Record<number, Record<string, any>> = {
  3: {
    'песчанистый известняк': { bent: 22, xc: 0.6, lub: 0.8 },
    'ангидриты и плотные доломиты': { bent: 22, xc: 0.6, lub: 0.8 },
    'плотные доломитовые глины': { bent: 22, xc: 0.6, lub: 0.8 },
    'песчано-глинистые породы с галькой (до 50 %)': { bent: 24, xc: 0.6, pac: 0.6, lub: 1 },
    'Кремнистые аргиллиты, базальты': { bent: 20, xc: 0.6, lub: 0.8 },
    'Валунно-галечные отложения': { bent: 24, xc: 0.6, pac: 0.6, lub: 1 }
  },
  2: {
    'водоносный песок и торф': { bent: 25, xc: 0.6, pac: 0.6, lub: 1 },
    'песчаник глинистый, алевролиты': { bent: 25, xc: 0.6, lub: 0.8 },
    'глины твердые': { bent: 25, xc: 0.6, paa: 0.2, lub: 0.8 },
    'крупнозернистый песок, песчаные глины, доломиты': { bent: 25, xc: 0.8, lub: 0.8 },
    'галечник песчаный или глинистый': { bent: 30, xc: 0.6, lub: 1 },
    'галечно-щебнистые породы': { bent: 25, xc: 0.8, lub: 1 }
  },
  1: {
    'пески, супеси (без гальки), торф, растит слой': { bent: 18, xc: 0.4, lub: 0.5 },
    'пластичные глины, ил': { bent: 18, xc: 0.4, lub: 0.5, det: 0.5 },
    'плотные супеси, суглинки': { bent: 20, xc: 0.5, lub: 0.5 },
    'глины тугопластичные': { bent: 18, xc: 0.5, paa: 0.2, lub: 0.8, det: 0.5 },
    'песчано-глинистые породы с мелкой галькой (до 3 см)': { bent: 20, xc: 0.8, paa: 0.2, lub: 1 },
    'глины с прослоями песчаника и мергеля': { bent: 20, xc: 0.8, paa: 0.2, lub: 1 }
  }
};

const MATERIAL_LABELS: Record<string, string> = {
  soda: 'Сода',
  bentonite: 'Бентонит',
  paa: 'Полиакриламид',
  pac: 'ПАЦ',
  xc: 'Ксантан',
  lub: 'Смазка',
  det: 'Детергент'
};

const bentoniteTypes: Record<string, number> = {
  'базовый Альбрехта-CV': 1,
  'низковязкий Альбрехта-LV': 2,
  'средневязкий Альбрехта-MV': 3,
  'высоковязкий Альбрехта-HV': 4
};

const consumptionCategories: Record<string, number> = {
  'Минимальный расход реагентов': 1,
  'средний расход реагентов': 2,
  'максимальный расход реагентов': 3
};

export const ProjectCalculator: React.FC = () => {
  // Inputs matching page 1-2 of React code PDF
  const [pullForce, setPullForce] = useState('Мини до 100 кН');
  const [motorType, setMotorType] = useState('гидромонитор');
  
  const [pipeMaterial, setPipeMaterial] = useState('Стальной');
  
  const [rockHardness, setRockHardness] = useState('мягкие породы');
  const [rockDescription, setRockDescription] = useState('пески, супеси (без гальки), торф, растит слой');

  const [expanders, setExpanders] = useState<{ diameter: number | string; speed: number | string }[]>([
    { diameter: 100, speed: 0.5 }
  ]);
  const [wellLength, setWellLength] = useState<number | string>(100);

  const [calcMaterials, setCalcMaterials] = useState(false);
  const [bentoniteType, setBentoniteType] = useState('базовый Альбрехта-CV');
  const [consumptionCat, setConsumptionCat] = useState('средний расход реагентов');
  const [showRecipe, setShowRecipe] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [mixerVolume, setMixerVolume] = useState<number | string>(2);
  const [splitVolume, setSplitVolume] = useState(false);

  const [results, setResults] = useState<any>(null);

  // Sync rock description if hardness type changes
  const handleHardnessChange = (newHardness: string) => {
    setRockHardness(newHardness);
    const code = rockHardnessRates[newHardness] || 1;
    const descriptionsObj = rockDescriptions[code];
    if (descriptionsObj) {
      const firstDesc = Object.keys(descriptionsObj)[0];
      setRockDescription(firstDesc);
    }
  };

  // Run calculation reactively on mount & parameter updates
  React.useEffect(() => {
    handleCalculate();
  }, [
    pullForce,
    motorType,
    pipeMaterial,
    rockHardness,
    rockDescription,
    JSON.stringify(expanders),
    wellLength,
    calcMaterials,
    bentoniteType,
    consumptionCat,
    mixerVolume,
    splitVolume
  ]);

  // Perform Calculations precisely as in PDF 2 code
  const handleCalculate = () => {
    const F = pullForceRates[pullForce] || 1;
    const z = motorTypes[motorType] || 1;
    const sig = pipeMaterial === 'Полиэтиленовые трубы' ? 0.05 : 0.1;
    
    const tv = rockHardnessRates[rockHardness] || 1;
    const tvv = rockDescriptions[tv][rockDescription] || 1;
    
    const ww = bentoniteTypes[bentoniteType];
    const mm = consumptionCategories[consumptionCat];
    const L = Number(wellLength) || 100;
    const Vn = Number(mixerVolume) || 2;
    
    const row = MOCK_DF[tvv - 1] || MOCK_DF[0];
    let totalVolume = 0;
    let details: any = {};

    if (F === 1 || F === 2) {
      const D_pilot = F === 1 ? 80 : 100; // 80 mm for mini (F=1), 100 mm for midi (F=2)
      const u = z === 1 ? row.pil_gm : row.pil_vint;
      const Vp = 0.785 * 0.001 * 0.001 * D_pilot * D_pilot * (L + sig) * u;
      
      let sumVr = 0;
      const expanderDetails = expanders.map(e => {
        const d = Number(e.diameter) || 0;
        const Vr = 3 * 0.785 * 0.001 * 0.001 * d * d * (L + sig) * row.F;
        sumVr += Vr;
        return { diameter: d, volume: Vr };
      });
      
      const lastExpander = expanders[expanders.length - 1];
      const dLast = lastExpander ? (Number(lastExpander.diameter) || 0) : 0;
      const lastVt = 1 * 0.785 * 0.001 * 0.001 * dLast * dLast * (L + sig) * row.F;
      totalVolume = Vn + Vp + sumVr + lastVt;
      details = { Vp, expanderDetails, lastVt };
    } else {
      // F == 3 or 4
      const u = z === 1 ? row.pil_gm : row.pil_vint;
      let Q = 1;
      
      if (z === 1) {
        if (L <= 300) Q = 0.2;
        else if (L <= 500) Q = 0.3;
        else if (L <= 1000) Q = 0.5;
        else if (L <= 1500) Q = 0.7;
        else Q = 1;
      } else {
        if (L <= 300) Q = 0.7;
        else if (L <= 500) Q = 0.8;
        else if (L <= 1000) Q = 1;
        else if (L <= 1500) Q = 1.5;
        else Q = 2;
      }

      const Vp = (Q / u) * 60 * (L + sig) * 1.2;
      let sumVr = 0;
      let sumVk = 0;
      let lastVt = 0;

      const expanderDetails = expanders.map(e => {
        const d = Number(e.diameter) || 0;
        const s = Number(e.speed) || 0.5;
        const tr = (L + sig) / (60 * s);
        const Vr = 60 * tr * d * 0.001 * 1.2;
        const Vk = (d * 0.001 / (3 * s * 60)) * 60 * (L + sig) * 1.2;
        const Vt = (d * 0.001 / (3 * 60)) * 60 * (L + sig) * 1.2;

        sumVr += Vr;
        sumVk += Vk;
        lastVt = Vt;
        return { diameter: d, volume: Vr + Vk };
      });

      totalVolume = Vn + Vp + sumVr + sumVk + lastVt;
      details = { Vp, expanderDetails, lastVt };
    }

    // Materials
    let materials: any = {};
    if (calcMaterials) {
      if (bentoniteType === 'средневязкий Альбрехта-MV') {
        const mvNorms = MV_NORMS[tv][rockDescription] || { bent: 20, xc: 0.5, lub: 0.5 };
        const multiplier = consumptionCat === 'Минимальный расход реагентов' ? 0.9 : 
          consumptionCat === 'максимальный расход реагентов' ? 1.1 : 1.0;

        const mats: any = {
          soda: totalVolume * 0.7 * multiplier,
          bentonite: totalVolume * (mvNorms.bent || 0) * multiplier,
          paa: totalVolume * (mvNorms.paa || 0) * multiplier,
          pac: totalVolume * (mvNorms.pac || 0) * multiplier,
          xc: totalVolume * (mvNorms.xc || 0) * multiplier,
          lub: totalVolume * (mvNorms.lub || 0) * multiplier,
        };
        if (mvNorms.det) mats.det = totalVolume * mvNorms.det * multiplier;
        materials = mats;
      } else {
        const getBase = (m: number) => {
          if (m === 1) return { soda: row.soda_min, bent: row.cv_min, paa: row.paa_min, pac: row.pac_min, xc: row.xc_min, lub: row.lub_min };
          if (m === 2) return { soda: row.soda_c, bent: row.cv_c, paa: row.paa_c, pac: row.pac_c, xc: row.xc_c, lub: row.lub_c };
          return { soda: row.soda_max, bent: row.cv_max, paa: row.paa_max, pac: row.pac_max, xc: row.xc_max, lub: row.lub_max };
        };
        const base = getBase(mm);
        let factors = { bent: 1, pac: 1, xc: 1 };

        if (ww === 2) { factors = { bent: 0.7, pac: 0.8, xc: 0.9 }; }
        else if (ww === 3) { factors = { bent: 0.5, pac: 0.6, xc: 0.8 }; }
        else if (ww === 4) { factors = { bent: 0.4, pac: 0.5, xc: 0.7 }; }

        materials = {
          soda: totalVolume * base.soda,
          bentonite: totalVolume * base.bent * factors.bent,
          paa: totalVolume * base.paa,
          pac: totalVolume * base.pac * factors.pac,
          xc: totalVolume * base.xc * factors.xc,
          lub: totalVolume * base.lub
        };
      }
    }

    setResults({
      totalVolume,
      materials,
      details,
      properties: { T: row.T, gel: row.gel, yp: row.yp }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Description Hero Header */}
      <div className="bg-gradient-to-r from-cyan-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calculator size={180} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Технологический Расчет ГНБ
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 mb-4">
            HDD Project Calculator
          </h2>
          <p className="text-cyan-100 text-sm md:text-base leading-relaxed">
            Профессиональный калькулятор для оценки полного объема приготовленного бурового раствора 
            и точного расхода полимерных реагентов. Поддерживает разбивку объемов по технологическим этапам 
            бурения и автоматический подбор рецептур в зависимости от литологического разреза.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section: Installation & Equip */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                1. Установка и Оборудование
              </h3>
              <Settings size={16} className="text-slate-400" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Максимальная тяговая сила установки
                </span>
                <select 
                  value={pullForce} 
                  onChange={e => setPullForce(e.target.value)} 
                  className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {Object.keys(pullForceRates).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Тип забойного двигателя
                </label>
                <select 
                  value={motorType} 
                  onChange={e => setMotorType(e.target.value)} 
                  className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {Object.keys(motorTypes).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Section: Material & Ground */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                2. Траектория и Инженерная геология
              </h3>
              <Layers size={16} className="text-slate-400" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Материал трубопровода</span>
                <select 
                  value={pipeMaterial} 
                  onChange={e => setPipeMaterial(e.target.value)} 
                  className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {Object.keys(pipeMaterials).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Категория пород по твердости</span>
                  <select 
                    value={rockHardness} 
                    onChange={e => handleHardnessChange(e.target.value)} 
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-xs sm:text-sm font-medium text-slate-800"
                  >
                    {Object.keys(rockHardnessRates).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Литологическое описание пород</span>
                  <select 
                    value={rockDescription} 
                    onChange={e => setRockDescription(e.target.value)} 
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-xs sm:text-sm font-medium text-slate-800"
                  >
                    {Object.keys(rockDescriptions[rockHardnessRates[rockHardness] || 1]).map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Backreamers (expanders) */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                3. Расширители (Калибровка ствола)
              </h3>
              <Layers size={16} className="text-slate-400" />
            </div>

            <div className="space-y-4">
              {expanders.map((exp, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-cyan-800">Расширение #{idx + 1}</span>
                    {expanders.length > 1 && (
                      <button 
                        onClick={() => setExpanders(expanders.filter((_, i) => i !== idx))} 
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 size={13} /> Удалить
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Диаметр расширителя (мм)</label>
                      <input 
                        type="number" 
                        value={exp.diameter} 
                        onChange={e => {
                          const newExp = [...expanders];
                          newExp[idx].diameter = e.target.value;
                          setExpanders(newExp);
                        }} 
                        onFocus={e => e.target.select()} 
                        className="w-full p-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Скорость протяжки (м/мин)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={exp.speed} 
                        onChange={e => {
                          const newExp = [...expanders];
                          newExp[idx].speed = e.target.value;
                          setExpanders(newExp);
                        }} 
                        onFocus={e => e.target.select()} 
                        className="w-full p-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {expanders.length < 7 && (
                <button 
                  onClick={() => setExpanders([...expanders, { diameter: 100, speed: 0.5 }])} 
                  className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 text-xs font-bold rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle size={14} /> Добавить расширитель
                </button>
              )}
            </div>
          </section>

          {/* Section: Well Parameters */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-50 pb-3">
              4. Параметры скважины и Смесительного узла
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  Расчетная длина скважины (м)
                </label>
                <input 
                  type="number" 
                  value={wellLength} 
                  onChange={e => setWellLength(e.target.value)} 
                  onFocus={e => e.target.select()} 
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cyan-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  Объем смесителя (м³)
                </label>
                <input 
                  type="number" 
                  value={mixerVolume} 
                  onChange={e => setMixerVolume(e.target.value)} 
                  onFocus={e => e.target.select()} 
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cyan-500 text-slate-800"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-1">
                  <input 
                    type="checkbox" 
                    checked={calcMaterials} 
                    onChange={e => setCalcMaterials(e.target.checked)} 
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" 
                  />
                  <span className="text-sm font-bold text-slate-700">Добавить расчет расхода материалов</span>
                </label>
              </div>

              {calcMaterials && (
                <div className="bg-slate-50 p-4 rounded-3xl space-y-4 mt-2">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Марка бентонита</span>
                    <select 
                      value={bentoniteType} 
                      onChange={e => setBentoniteType(e.target.value)} 
                      className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-800"
                    >
                      {Object.keys(bentoniteTypes).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Интенсивность расхода</span>
                    <select 
                      value={consumptionCat} 
                      onChange={e => setConsumptionCat(e.target.value)} 
                      className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-800"
                    >
                      {Object.keys(consumptionCategories).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                      <input 
                        type="checkbox" 
                        checked={showRecipe} 
                        onChange={e => setShowRecipe(e.target.checked)} 
                        className="w-4 h-4 text-cyan-600 rounded" 
                      />
                      Показывать рецептуру
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                      <input 
                        type="checkbox" 
                        checked={showProperties} 
                        onChange={e => setShowProperties(e.target.checked)} 
                        className="w-4 h-4 text-cyan-600 rounded" 
                      />
                      Показывать свойства
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-1">
                  <input 
                    type="checkbox" 
                    checked={splitVolume} 
                    onChange={e => setSplitVolume(e.target.checked)} 
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" 
                  />
                  <span className="text-sm font-medium text-slate-700">Разбить объем раствора по расширителям</span>
                </label>
              </div>
            </div>
          </section>

          <button 
            onClick={handleCalculate} 
            className="w-full py-4 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            <Calculator size={18} /> РАССЧИТАТЬ ОБЪЕМЫ ГНБ
          </button>

        </div>

        {/* Right Column: Calculations Outputs (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {!results ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-slate-50/50">
              <Info size={40} className="text-slate-300 mb-3" />
              <h3 className="text-md font-bold text-slate-400">Введите технологические параметры</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-2">
                Заполните все разделы ГНБ-проекта слева и нажмите кнопку &laquo;Рассчитать&raquo; для проведения высокоточного расчета реологии и буровых объемов.
              </p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="space-y-6"
            >
              
              {/* Card: Total Volume Success */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CheckCircle size={100} />
                </div>
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-100">
                    <CheckCircle size={18} />
                    Общий объем раствора
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight mt-1">
                    {results.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 1 })} м³
                  </div>
                  <span className="text-[11px] text-teal-100 mt-1 block">
                    Включает пилотный ствол, расширители, затяжку и зазор смесителя.
                  </span>
                </div>
              </div>

              {/* Volume Breakdown chart / stages conditionally */}
              {splitVolume && results.details?.expanderDetails && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Разбивка объемов по этапам бурения
                  </h3>
                  <div className="space-y-3 font-semibold">
                    
                    <div className="flex justify-between items-center text-sm py-2.5 border-b border-slate-50">
                      <span className="text-slate-500">Пилотный ствол (Vp)</span>
                      <span className="font-mono font-bold text-cyan-700">
                        {results.details.Vp.toFixed(1)} м³
                      </span>
                    </div>

                    {results.details.expanderDetails.map((exp: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm py-2.5 border-b border-slate-50">
                        <span className="text-slate-500">Расширение {exp.diameter} мм</span>
                        <span className="font-mono font-bold text-cyan-700">
                          {exp.volume.toFixed(1)} м³
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center text-sm py-2.5 text-slate-800">
                      <span className="text-slate-500">Конечная затяжка (Vt)</span>
                      <span className="font-mono font-bold text-cyan-700">
                        {results.details.lastVt.toFixed(1)} м³
                      </span>
                    </div>

                  </div>
                </div>
              )}

              {/* Total consumable Materials Grid */}
              {calcMaterials && results.materials && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Layers size={18} className="text-cyan-600" />
                    Расход реагентов состава (кг)
                  </h3>

                  <div className="grid grid-cols-2 gap-3.5">
                    {Object.entries(results.materials).map(([key, val]: [string, any]) => (
                      <div key={key} className="bg-cyan-50/50 p-3.5 rounded-2xl border border-cyan-100/50 hover:bg-cyan-50 transition-colors">
                        <div className="text-[10px] text-cyan-800 uppercase font-bold mb-1 tracking-wider">
                          {MATERIAL_LABELS[key] || key}
                        </div>
                        <div className="text-xl font-extrabold text-cyan-950">
                          {val.toLocaleString(undefined, { maximumFractionDigits: 1 })} кг
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Recipe content (kg/m3) */}
              {showRecipe && results.materials && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-cyan-600" />
                    Рецептура раствора (кг/м³)
                  </h3>

                  <div className="space-y-2">
                    {Object.entries(results.materials).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center text-xs p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                        <span className="font-bold capitalize">{MATERIAL_LABELS[key] || key}</span>
                        <span className="font-mono font-extrabold text-sm">
                          {(val / results.totalVolume).toFixed(2)} кг/м³
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drill fluid qualities from rock matrix */}
              {showProperties && results.properties && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-cyan-600" />
                    Физико-химические свойства смеси
                  </h3>

                  <div className="grid grid-cols-3 gap-2.5 font-semibold text-center mt-2">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider mb-1">Условная вязкость</span>
                      <span className="text-sm font-black text-slate-700">{results.properties.T} сек</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider mb-1">СНС 1 min</span>
                      <span className="text-sm font-black text-slate-700">{results.properties.gel}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider mb-1">ДНС раствора</span>
                      <span className="text-sm font-black text-slate-700">{results.properties.yp}</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
export default ProjectCalculator;
