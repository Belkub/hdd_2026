import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Sliders, 
  Settings, 
  Flame, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  PieChart, 
  Droplet,
  ChevronRight,
  RefreshCw,
  ClipboardList
} from 'lucide-react';

interface MudTesterProps {}

export const MudTester: React.FC<MudTesterProps> = () => {
  // Input states matching the Streamlit app
  const [bent, setBent] = useState<boolean>(true);
  const [vis, setVis] = useState<boolean>(false);
  
  // Available concentrations based on bent or vis selection
  // if bent or vis: rates = {'3':3} else: rates = {'2':2, '3':3}
  const rates = useMemo(() => {
    if (bent || vis) {
      return [3];
    }
    return [2, 3];
  }, [bent, vis]);

  const [conc, setConc] = useState<number>(3);

  // Sync concentration when rates list changes
  React.useEffect(() => {
    if (!rates.includes(conc)) {
      setConc(rates[0]);
    }
  }, [rates, conc]);

  // Sliders with defaults from Streamlit OCR
  const [f600, setF600] = useState<number>(75);     // default 75, range 10-85
  const [f300, setF300] = useState<number>(60);     // default 60, range 5-65
  const [f3, setF3] = useState<number>(24);         // default 24, range 1-25
  const [gel1, setGel1] = useState<number>(43);       // default 43, range 2-45
  const [gel10, setGel10] = useState<number>(67);     // default 67, range 3-70

  const [tested, setTested] = useState<boolean>(true);

  // Mathematical calculations
  const calculations = useMemo(() => {
    // Avoid division by zero
    const safeGel1 = gel1 === 0 ? 1 : gel1;
    const safeF300 = f300 === 0 ? 1 : f300;
    const safeF600 = f600 === 0 ? 1 : f600;

    const tics = gel10 / safeGel1;
    const pv = f600 - f300;
    const yp = f300 - pv;
    
    // n = math.log10(f600/f300)/math.log10(2)
    const ratio = safeF600 / safeF300;
    const n = Math.log10(ratio > 0 ? ratio : 1.001) / Math.log10(2);
    
    // K = f300/(300**n)
    const K = safeF300 / Math.pow(300, n);
    
    // LSRV = 1000*n*K*0.0511**(n-1)
    const LSRV = 1000 * n * K * Math.pow(0.0511, n - 1);

    return { tics, pv, yp, n, K, LSRV };
  }, [f600, f300, f3, gel1, gel10]);

  // Render check helper
  const getStatus = (
    type: 'f600' | 'f3' | 'tics' | 'pv' | 'gel_10' | 'yp' | 'n' | 'K' | 'LSRV',
    value: number
  ): { status: 'success' | 'warning' | 'error'; text: string; details?: string } => {
    const { tics, pv, yp, n, K, LSRV } = calculations;

    // Case 1: bent and vis == False
    if (bent && !vis) {
      switch (type) {
        case 'f600':
          if (value < 17) return { status: 'error', text: `FANN_600: ${value.toFixed(1)}` };
          if (value >= 17 && value <= 21) return { status: 'warning', text: `FANN_600: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_600: ${value.toFixed(1)}` };
        case 'f3':
          if (value < 6) return { status: 'error', text: `FANN_3: ${value.toFixed(1)}` };
          if (value >= 6 && value <= 14) return { status: 'warning', text: `FANN_3: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_3: ${value.toFixed(1)}` };
        case 'tics':
          if (value <= 1.5) return { status: 'error', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          if (value > 1.5 && value <= 1.8) return { status: 'warning', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          return { status: 'success', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
        case 'pv':
          if (value >= 6) return { status: 'error', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          if (value > 3 && value < 6) return { status: 'warning', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          return { status: 'success', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
        case 'gel_10':
          if (value <= 34) return { status: 'error', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value > 34 && value <= 42) return { status: 'warning', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'success', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'yp':
          if (value >= 15) return { status: 'success', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value >= 10 && value < 15) return { status: 'warning', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'error', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'n':
          if (value > 0.5) return { status: 'error', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          if (value <= 0.5 && value > 0.3) return { status: 'warning', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          return { status: 'success', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
        case 'K':
          if (value >= 4) return { status: 'success', text: `Коэф консистенции K: ${value.toFixed(1)}` };
          if (value >= 1.5 && value < 4) return { status: 'warning', text: `Коэф консистенции K: ${value.toFixed(1)}` };
          return { status: 'error', text: `Коэф консистенции K: ${value.toFixed(1)}` };
        case 'LSRV':
          if (value > 10000) return { status: 'success', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          if (value >= 4000 && value <= 10000) return { status: 'warning', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          return { status: 'error', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
      }
    }

    // Case 2: vis or (vis and bent)
    if (vis) {
      switch (type) {
        case 'f600':
          if (value <= 34) return { status: 'error', text: `FANN_600: ${value.toFixed(1)}` };
          if (value > 34 && value <= 42) return { status: 'warning', text: `FANN_600: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_600: ${value.toFixed(1)}` };
        case 'f3':
          if (value < 9) return { status: 'error', text: `FANN_3: ${value.toFixed(1)}` };
          if (value >= 9 && value < 14) return { status: 'warning', text: `FANN_3: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_3: ${value.toFixed(1)}` };
        case 'tics':
          if (value <= 1.25) return { status: 'error', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          if (value > 1.25 && value <= 1.4) return { status: 'warning', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          return { status: 'success', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
        case 'pv':
          if (value >= 14) return { status: 'error', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          if (value >= 9 && value < 14) return { status: 'warning', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          return { status: 'success', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
        case 'gel_10':
          if (value <= 22) return { status: 'error', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value > 22 && value <= 28) return { status: 'warning', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value > 28 && value <= 38) return { status: 'success', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'error', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'yp':
          if (value > 25) return { status: 'success', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value >= 18 && value <= 25) return { status: 'warning', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'error', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'n':
          if (value > 0.6) return { status: 'error', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          if (value <= 0.6 && value > 0.45) return { status: 'warning', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          return { status: 'success', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
        case 'K':
          if (value >= 3) return { status: 'success', text: `Коэф консистенции K: ${value.toFixed(2)}` };
          if (value >= 1.5 && value < 3) return { status: 'warning', text: `Коэф консистенции K: ${value.toFixed(2)}` };
          return { status: 'error', text: `Коэф консистенции K: ${value.toFixed(2)}` };
        case 'LSRV':
          if (value > 6000) return { status: 'success', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          if (value >= 3500 && value <= 6000) return { status: 'warning', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          return { status: 'error', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
      }
    }

    // Case 3: bent == false and vis == false
    if (conc === 2) {
      switch (type) {
        case 'f600':
          if (value <= 26) return { status: 'error', text: `FANN_600: ${value.toFixed(1)}` };
          if (value > 26 && value <= 30) return { status: 'warning', text: `FANN_600: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_600: ${value.toFixed(1)}` };
        case 'f3':
          if (value < 3) return { status: 'error', text: `FANN_3: ${value.toFixed(1)}` };
          if (value >= 3 && value <= 4) return { status: 'warning', text: `FANN_3: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_3: ${value.toFixed(1)}` };
        case 'tics':
          if (value <= 1.3) return { status: 'error', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          if (value > 1.3 && value <= 1.6) return { status: 'warning', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          return { status: 'success', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
        case 'pv':
          if (value > 13) return { status: 'error', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          if (value >= 10 && value <= 13) return { status: 'warning', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          return { status: 'success', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
        case 'gel_10':
          if (value < 13) return { status: 'error', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value >= 13 && value <= 16) return { status: 'warning', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value > 16 && value <= 23) return { status: 'success', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'error', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'yp':
          if (value >= 13) return { status: 'success', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value >= 8 && value < 13) return { status: 'warning', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'error', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'n':
          if (value > 0.7) return { status: 'error', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          if (value <= 0.7 && value > 0.5) return { status: 'warning', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          return { status: 'success', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
        case 'K':
          if (value >= 1.5) return { status: 'success', text: `Коэф консистенции K: ${value.toFixed(2)}` };
          if (value >= 0.5 && value < 1.5) return { status: 'warning', text: `Коэф консистенции K: ${value.toFixed(2)}` };
          return { status: 'error', text: `Коэф консистенции K: ${value.toFixed(2)}` };
        case 'LSRV':
          if (value > 3000) return { status: 'success', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          if (value >= 800 && value <= 3000) return { status: 'warning', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          return { status: 'error', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
      }
    } else {
      // conc == 3
      switch (type) {
        case 'f600':
          if (value <= 45) return { status: 'error', text: `FANN_600: ${value.toFixed(1)}` };
          if (value > 45 && value <= 49) return { status: 'warning', text: `FANN_600: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_600: ${value.toFixed(1)}` };
        case 'f3':
          if (value < 9) return { status: 'error', text: `FANN_3: ${value.toFixed(1)}` };
          if (value >= 9 && value < 15) return { status: 'warning', text: `FANN_3: ${value.toFixed(1)}` };
          return { status: 'success', text: `FANN_3: ${value.toFixed(1)}` };
        case 'tics':
          if (value <= 1.3) return { status: 'error', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          if (value > 1.3 && value <= 1.6) return { status: 'warning', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
          return { status: 'success', text: `Коэф тиксотропии TS: ${value.toFixed(1)}` };
        case 'pv':
          if (value >= 18) return { status: 'error', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          if (value >= 14 && value < 18) return { status: 'warning', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
          return { status: 'success', text: `Пластическая вязкость PV: ${value.toFixed(1)} мПа*с` };
        case 'gel_10':
          if (value < 32) return { status: 'error', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value >= 32 && value <= 38) return { status: 'warning', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value > 38 && value <= 46) return { status: 'success', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'error', text: `Статическое напряжение сдвига GEL_10min: ${value.toFixed(1)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'yp':
          if (value > 25) return { status: 'success', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          if (value >= 18 && value <= 25) return { status: 'warning', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
          return { status: 'error', text: `Динамическое напряжение сдвига YP: ${value.toFixed(2)} psf (${(value * 4.8).toFixed(1)} дПа)` };
        case 'n':
          if (value > 0.6) return { status: 'error', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          if (value <= 0.6 && value > 0.45) return { status: 'warning', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
          return { status: 'success', text: `Коэф псевдопластичности n: ${value.toFixed(2)}` };
        case 'K':
          if (value >= 3) return { status: 'success', text: `Коэф консистенции K: ${value.toFixed(2)}` };
          if (value >= 1.5 && value < 3) return { status: 'warning', text: `Коэф консистенции K: ${value.toFixed(2)}` };
          return { status: 'error', text: `Коэф консистенции K: ${value.toFixed(2)}` };
        case 'LSRV':
          if (value > 6000) return { status: 'success', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          if (value >= 3500 && value <= 6000) return { status: 'warning', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
          return { status: 'error', text: `Вязкость при низкой скорости сдвига LSRV: ${value.toFixed(1)} мПа*с` };
      }
    }

    return { status: 'success', text: '' };
  };

  // Verbal text conclusions
  const getConclusions = (): { status: 'success' | 'warning' | 'error'; label: string; text: string }[] => {
    const list: { status: 'success' | 'warning' | 'error'; label: string; text: string }[] = [];
    const { tics, pv, yp, n, LSRV } = calculations;

    if (bent && !vis) {
      // f600
      if (f600 < 17) {
        list.push({ status: 'error', label: 'FANN_600', text: 'Бентопорошок имеет слишком низкую эффективную вязкость - требуется массивная обработка полимерными загустителями' });
      } else if (f600 >= 17 && f600 <= 21) {
        list.push({ status: 'warning', label: 'FANN_600', text: 'Эффективная вязкость бентопорошка приемлемая, требуется умеренное полимерное загущение' });
      } else {
        list.push({ status: 'success', label: 'FANN_600', text: 'Бентопорошок имеет отличную эффективную вязкость и требует минимального полимерного загущения' });
      }
      
      // f3
      if (f3 < 6) {
        list.push({ status: 'error', label: 'FANN_3', text: 'Бентопорошок непригоден для бурения, так как суспензия практически не выносит мелкий шлам при низкой скорости сдвига' });
      } else if (f3 >= 6 && f3 <= 14) {
        list.push({ status: 'warning', label: 'FANN_3', text: 'Суспензия достаточно хорошо выносит мелкий глинистый и песчаный шлам при низкой скорости сдвига' });
      } else {
        list.push({ status: 'success', label: 'FANN_3', text: 'Суспензия обладает отличной выносящей способностью для мелких частиц глин, сланцев, песка и галечника при низкой скорости сдвига' });
      }

      // tics
      if (tics <= 1.5) {
        list.push({ status: 'error', label: 'Тиксотропия TS', text: 'Суспензия непригодна из-за отсутствия восстановления структуры, вероятны коагуляция и синерезис' });
      } else if (tics > 1.5 && tics <= 1.8) {
        list.push({ status: 'warning', label: 'Тиксотропия TS', text: 'Суспензия вполне адекватно восстанавливает структуру, опасность водоотделения минимальна' });
      } else {
        list.push({ status: 'success', label: 'Тиксотропия TS', text: 'Суспензия отлично восстанавливает структуру и может использоваться для бурения в любых породах и с использованием морской воды' });
      }

      // pv
      if (pv >= 6) {
        list.push({ status: 'error', label: 'Пластика PV', text: 'Слишком высокая пластическая вязкость, возможны избыточные гидравлические потери, рост давления и грифоны' });
      } else if (pv > 3 && pv < 6) {
        list.push({ status: 'warning', label: 'Пластика PV', text: 'Пластическая вязкость приемлемая, обеспечивает комфортный гидравлический режим' });
      } else {
        list.push({ status: 'success', label: 'Пластика PV', text: 'Пластика низкая - гидравлические потери минимальны, опасность осложнений, связанных с избыточным давлением, сведены к минимуму' });
      }

      // gel_10
      if (gel10 <= 34) {
        list.push({ status: 'error', label: 'Структура GEL_10', text: 'Суспензия имеет весьма слабые структуру и удерживающую способность, поэтому малопригодна для бурения в сланцах и песчаниках' });
      } else if (gel10 > 34 && gel10 <= 42) {
        list.push({ status: 'warning', label: 'Структура GEL_10', text: 'Суспензия имеет хорошие структуру и удерживающую способность, поэтому способна использоваться для бурения в глинистых сланцах и крупном песчанике' });
      } else {
        list.push({ status: 'success', label: 'Структура GEL_10', text: 'Суспензия имеет отличные структуру и удерживающие свойства для бурения в породах любого типа' });
      }

      // yp
      if (yp >= 15) {
        list.push({ status: 'success', label: 'Предел сдвига YP', text: 'Суспензия отлично выносит шлам любого типа при высокой скорости потока раствора' });
      } else if (yp >= 10 && yp < 15) {
        list.push({ status: 'warning', label: 'Предел сдвига YP', text: 'Вынос шлама при высокой скорости сдвига достаточно эффективен' });
      } else {
        list.push({ status: 'error', label: 'Предел сдвига YP', text: 'Суспензия не обеспечивает требуемый уровень транспорта шлама при высокой скорости сдвига' });
      }

      // n
      if (n > 0.5) {
        list.push({ status: 'error', label: 'Псевдопластичность n', text: 'Суспензия не обладает достаточными псевдопластическими свойствами' });
      } else if (n <= 0.5 && n > 0.3) {
        list.push({ status: 'warning', label: 'Псевдопластичность n', text: 'Псевдопластические свойства суспензии достаточно хорошо выражены' });
      } else {
        list.push({ status: 'success', label: 'Псевдопластичность n', text: 'Отличный псевдопластик' });
      }

      // LSRV
      if (LSRV > 10000) {
        list.push({ status: 'success', label: 'Вынос LSRV', text: 'Отличная выносящая способность в крупном песке и галечнике' });
      } else if (LSRV >= 4000 && LSRV <= 10000) {
        list.push({ status: 'warning', label: 'Вынос LSRV', text: 'Выносящая способность достаточно хорошая для крупного песка и гравия' });
      } else {
        list.push({ status: 'error', label: 'Вынос LSRV', text: 'Выносящая способность в крупном песке неудовлетворительна' });
      }
    }

    if (vis) {
      // f600
      if (f600 <= 34) {
        list.push({ status: 'error', label: 'FANN_600', text: 'Бентопорошок имеет слишком низкую эффективную вязкость - требуется массивная обработка полимерными загустителями' });
      } else if (f600 > 34 && f600 <= 42) {
        list.push({ status: 'warning', label: 'FANN_600', text: 'Эффективная вязкость бентопорошка приемлемая, требуется умеренное полимерное загущение' });
      } else {
        list.push({ status: 'success', label: 'FANN_600', text: 'Бентопорошок имеет отличную эффективную вязкость и требует минимального полимерного загущения' });
      }

      // f3
      if (f3 < 9) {
        list.push({ status: 'error', label: 'FANN_3', text: 'Бентопорошок непригоден для бурения, так как суспензия практически не выносит мелкий шлам при низкой скорости сдвига' });
      } else if (f3 >= 9 && f3 < 14) {
        list.push({ status: 'warning', label: 'FANN_3', text: 'Суспензия достаточно хорошо выносит мелкий глинистый и песчаный шлам при низкой скорости сдвига' });
      } else {
        list.push({ status: 'success', label: 'FANN_3', text: 'Суспензия обладает отличной выносящей способностью для мелких частиц глин, сланцев, песка и галечника при низкой скорости сдвига' });
      }

      // tics
      if (tics <= 1.25) {
        list.push({ status: 'error', label: 'Тиксотропия TS', text: 'Суспензия непригодна из-за отсутствия восстановления структуры, вероятны коагуляция и синерезис' });
      } else if (tics > 1.25 && tics <= 1.4) {
        list.push({ status: 'warning', label: 'Тиксотропия TS', text: 'Суспензия вполне адекватно восстанавливает структуру, опасность водоотделения минимальна' });
      } else {
        list.push({ status: 'success', label: 'Тиксотропия TS', text: 'Суспензия отлично восстанавливает структуру и может использоваться для бурения в любых породах и с использованием морской воды' });
      }

      // pv
      if (pv >= 14) {
        list.push({ status: 'error', label: 'Пластика PV', text: 'Слишком высокая пластическая вязкость, возможны избыточные гидравлические потери, рост давления и грифоны' });
      } else if (pv >= 9 && pv < 14) {
        list.push({ status: 'warning', label: 'Пластика PV', text: 'Пластическая вязкость приемлемая, обеспечивает комфортный гидравлический режим' });
      } else {
        list.push({ status: 'success', label: 'Пластика PV', text: 'Пластика низкая - гидравлические потери минимальны, опасность осложнений, связанных с избыточным давлением, сведены к минимуму' });
      }

      // gel_10
      if (gel10 <= 22) {
        list.push({ status: 'error', label: 'Структура GEL_10', text: 'Суспензия имеет весьма слабые структуру и удерживающую способность, поэтому малопригодна для бурения в сланцах и песчаниках' });
      } else if (gel10 > 22 && gel10 <= 28) {
        list.push({ status: 'warning', label: 'Структура GEL_10', text: 'Суспензия имеет хорошие структуру и удерживающую способность, поэтому способна использоваться для бурения в глинистых сланцах и крупном песчанике' });
      } else if (gel10 > 28 && gel10 <= 38) {
        list.push({ status: 'success', label: 'Структура GEL_10', text: 'Суспензия имеет отличные структуру и удерживающие свойства для бурения в породах любого типа' });
      } else {
        list.push({ status: 'error', label: 'Структура GEL_10', text: 'Суспензия имеет слишком высокую структуру, что может служить причиной избыточного страгивающего давления и гидроразрыва' });
      }

      // yp
      if (yp > 25) {
        list.push({ status: 'success', label: 'Предел сдвига YP', text: 'Суспензия отлично выносит шлам любого типа при высокой скорости потока раствора' });
      } else if (yp >= 18 && yp <= 25) {
        list.push({ status: 'warning', label: 'Предел сдвига YP', text: 'Вынос шлама при высокой скорости сдвига достаточно эффективен' });
      } else {
        list.push({ status: 'error', label: 'Предел сдвига YP', text: 'Суспензия не обеспечивает требуемый уровень транспорта шлама при высокой скорости сдвига' });
      }

      // n
      if (n > 0.6) {
        list.push({ status: 'error', label: 'Псевдопластичность n', text: 'Суспензия не обладает достаточными псевдопластическими свойствами' });
      } else if (n <= 0.6 && n > 0.45) {
        list.push({ status: 'warning', label: 'Псевдопластичность n', text: 'Псевдопластические свойства суспензии достаточно хорошо выражены' });
      } else {
        list.push({ status: 'success', label: 'Псевдопластичность n', text: 'Отличный псевдопластик' });
      }

      // LSRV
      if (LSRV > 6000) {
        list.push({ status: 'success', label: 'Вынос LSRV', text: 'Отличная выносящая способность в крупном песке и галечнике' });
      } else if (LSRV >= 3500 && LSRV <= 6000) {
        list.push({ status: 'warning', label: 'Вынос LSRV', text: 'Выносящая способность достаточно хорошая для крупного песка и гравия' });
      } else {
        list.push({ status: 'error', label: 'Вынос LSRV', text: 'Выносящая способность в крупном песке неудовлетворительна' });
      }
    }

    if (!bent && !vis) {
      if (conc === 2) {
        // f600
        if (f600 <= 26) {
          list.push({ status: 'error', label: 'FANN_600', text: 'Бентопорошок имеет слишком низкую эффективную вязкость - требуется массивная обработка полимерными загустителями' });
        } else if (f600 > 26 && f600 <= 30) {
          list.push({ status: 'warning', label: 'FANN_600', text: 'Эффективная вязкость бентопорошка приемлемая, требуется умеренное полимерное загущение' });
        } else {
          list.push({ status: 'success', label: 'FANN_600', text: 'Бентопорошок имеет отличную эффективную вязкость и требует минимального полимерного загущения' });
        }

        // f3
        if (f3 < 3) {
          list.push({ status: 'error', label: 'FANN_3', text: 'Бентопорошок непригоден для бурения, так как суспензия практически не выносит мелкий шлам при низкой скорости сдвига' });
        } else if (f3 >= 3 && f3 <= 4) {
          list.push({ status: 'warning', label: 'FANN_3', text: 'Суспензия достаточно хорошо выносит мелкий глинистый и песчаный шлам при низкой скорости сдвига' });
        } else {
          list.push({ status: 'success', label: 'FANN_3', text: 'Суспензия обладает отличной выносящей способностью для мелких частиц глин, сланцев, песка и галечника при низкой скорости сдвига' });
        }

        // tics
        if (tics <= 1.3) {
          list.push({ status: 'error', label: 'Тиксотропия TS', text: 'Суспензия непригодна из-за отсутствия восстановления структуры, вероятны коагуляция и синерезис' });
        } else if (tics > 1.3 && tics <= 1.6) {
          list.push({ status: 'warning', label: 'Тиксотропия TS', text: 'Суспензия вполне адекватно восстанавливает структуру, опасность водоотделения минимальна' });
        } else {
          list.push({ status: 'success', label: 'Тиксотропия TS', text: 'Суспензия отлично восстанавливает структуру и может использоваться для бурения в любых породах и с использованием морской воды' });
        }

        // pv
        if (pv > 13) {
          list.push({ status: 'error', label: 'Пластика PV', text: 'Слишком высокая пластическая вязкость, возможны избыточные гидравлические потери, рост давления и грифоны' });
        } else if (pv >= 10 && pv <= 13) {
          list.push({ status: 'warning', label: 'Пластика PV', text: 'Пластическая вязкость приемлемая, обеспечивает комфортный гидравлический режим' });
        } else {
          list.push({ status: 'success', label: 'Пластика PV', text: 'Пластика низкая - гидравлические потери минимальны, опасность осложнений, связанных с избыточным давлением, сведены к минимуму' });
        }

        // gel_10
        if (gel10 < 13) {
          list.push({ status: 'error', label: 'Структура GEL_10', text: 'Суспензия имеет весьма слабые структуру и удерживающую способность, поэтому малопригодна для бурения в сланцах и песчаниках' });
        } else if (gel10 >= 13 && gel10 <= 16) {
          list.push({ status: 'warning', label: 'Структура GEL_10', text: 'Суспензия имеет хорошие структуру и удерживующую способность, поэтому способна использоваться для бурения в глинистых сланцах и песчанике' });
        } else if (gel10 > 16 && gel10 <= 23) {
          list.push({ status: 'success', label: 'Структура GEL_10', text: 'Суспензия имеет отличные структуру и удерживающие свойства для бурения в породах любого типа' });
        } else {
          list.push({ status: 'error', label: 'Структура GEL_10', text: 'Суспензия имеет слишком высокую структуру, что может служить причиной избыточного страгивающего давления и гидроразрыва' });
        }

        // yp
        if (yp >= 13) {
          list.push({ status: 'success', label: 'Предел сдвига YP', text: 'Суспензия отлично выносит шлам любого типа при высокой скорости потока раствора' });
        } else if (yp >= 8 && yp < 13) {
          list.push({ status: 'warning', label: 'Предел сдвига YP', text: 'Вынос шлама при высокой скорости сдвига достаточно эффективен' });
        } else {
          list.push({ status: 'error', label: 'Предел сдвига YP', text: 'Суспензия не обеспечивает требуемый уровень транспорта шлама при высокой скорости сдвига' });
        }

        // n
        if (n > 0.7) {
          list.push({ status: 'error', label: 'Псевдопластичность n', text: 'Суспензия не обладает достаточными псевдопластическими свойствами' });
        } else if (n <= 0.7 && n > 0.5) {
          list.push({ status: 'warning', label: 'Псевдопластичность n', text: 'Псевдопластические свойства суспензии достаточно хорошо выражены' });
        } else {
          list.push({ status: 'success', label: 'Псевдопластичность n', text: 'Отличный псевдопластик' });
        }

        // LSRV
        if (LSRV > 3000) {
          list.push({ status: 'success', label: 'Вынос LSRV', text: 'Отличная выносящая способность в крупном песке и галечнике' });
        } else if (LSRV >= 800 && LSRV <= 3000) {
          list.push({ status: 'warning', label: 'Вынос LSRV', text: 'Выносящая способность достаточно хорошая для крупного песка и гравия' });
        } else {
          list.push({ status: 'error', label: 'Вынос LSRV', text: 'Выносящая способность в крупном песке неудовлетворительна' });
        }
      } else {
        // conc == 3
        // f600
        if (f600 <= 45) {
          list.push({ status: 'error', label: 'FANN_600', text: 'Бентопорошок имеет слишком низкую эффективную вязкость - требуется массивная обработка полимерными загустителями' });
        } else if (f600 > 45 && f600 <= 49) {
          list.push({ status: 'warning', label: 'FANN_600', text: 'Эффективная вязкость бентопорошка приемлемая, требуется умеренное полимерное загущение' });
        } else {
          list.push({ status: 'success', label: 'FANN_600', text: 'Бентопорошок имеет отличную эффективную вязкость и требует минимального полимерного загущения' });
        }

        // f3
        if (f3 < 9) {
          list.push({ status: 'error', label: 'FANN_3', text: 'Бентопорошок непригоден для бурения, так как суспензия практически не выносит мелкий шлам при низкой скорости сдвига' });
        } else if (f3 >= 9 && f3 < 15) {
          list.push({ status: 'warning', label: 'FANN_3', text: 'Суспензия достаточно хорошо выносит мелкий глинистый и песчаный шлам при низкой скорости сдвига' });
        } else {
          list.push({ status: 'success', label: 'FANN_3', text: 'Суспензия обладает отличной выносящей способностью для мелких частиц глин, сланцев, песка и галечника при низкой скорости сдвига' });
        }

        // tics
        if (tics <= 1.3) {
          list.push({ status: 'error', label: 'Тиксотропия TS', text: 'Суспензия непригодна из-за отсутствия восстановления структуры, вероятны коагуляция и синерезис' });
        } else if (tics > 1.3 && tics <= 1.6) {
          list.push({ status: 'warning', label: 'Тиксотропия TS', text: 'Суспензия вполне адекватно восстанавливает структуру, опасность водоотделения минимальна' });
        } else {
          list.push({ status: 'success', label: 'Тиксотропия TS', text: 'Суспензия отлично восстанавливает структуру и может использоваться для бурения в любых породах и с использованием морской воды' });
        }

        // pv
        if (pv >= 18) {
          list.push({ status: 'error', label: 'Пластика PV', text: 'Слишком высокая пластическая вязкость, возможны избыточные гидравлические потери, рост давления и грифоны' });
        } else if (pv >= 14 && pv < 18) {
          list.push({ status: 'warning', label: 'Пластика PV', text: 'Пластическая вязкость приемлемая, обеспечивает комфортный гидравлический режим' });
        } else {
          list.push({ status: 'success', label: 'Пластика PV', text: 'Пластика низкая - гидравлические потери минимальны, опасность осложнений, связанных с избыточным давлением, сведены к минимуму' });
        }

        // gel_10
        if (gel10 < 32) {
          list.push({ status: 'error', label: 'Структура GEL_10', text: 'Суспензия имеет весьма слабые структуру и удерживающую способность, поэтому малопригодна для бурения в сланцах и песчаниках' });
        } else if (gel10 >= 32 && gel10 <= 38) {
          list.push({ status: 'warning', label: 'Структура GEL_10', text: 'Суспензия имеет хорошие структуру и удерживающую способность, поэтому способна использоваться для бурения в глинистых сланцах и песчанике' });
        } else if (gel10 > 38 && gel10 <= 46) {
          list.push({ status: 'success', label: 'Структура GEL_10', text: 'Суспензия имеет отличные структуру и удерживающие свойства для бурения в породах любого типа' });
        } else {
          list.push({ status: 'error', label: 'Структура GEL_10', text: 'Суспензия имеет слишком высокую структуру, что может служить причиной избыточного страгивающего давления и гидроразрыва' });
        }

        // yp
        if (yp > 25) {
          list.push({ status: 'success', label: 'Предел сдвига YP', text: 'Суспензия отлично выносит шлам любого типа при высокой скорости потока раствора' });
        } else if (yp >= 18 && yp <= 25) {
          list.push({ status: 'warning', label: 'Предел сдвига YP', text: 'Вынос шлама при высокой скорости сдвига достаточно эффективен' });
        } else {
          list.push({ status: 'error', label: 'Предел сдвига YP', text: 'Суспензия не обеспечивает требуемый уровень транспорта шлама при высокой скорости сдвига' });
        }

        // n
        if (n > 0.6) {
          list.push({ status: 'error', label: 'Псевдопластичность n', text: 'Суспензия не обладает достаточными псевдопластическими свойствами' });
        } else if (n <= 0.6 && n > 0.45) {
          list.push({ status: 'warning', label: 'Псевдопластичность n', text: 'Псевдопластические свойства суспензии достаточно хорошо выражены' });
        } else {
          list.push({ status: 'success', label: 'Псевдопластичность n', text: 'Отличный псевдопластик' });
        }

        // LSRV
        if (LSRV > 6000) {
          list.push({ status: 'success', label: 'Вынос LSRV', text: 'Отличная выносящая способность в крупном песке и галечнике' });
        } else if (LSRV >= 3500 && LSRV <= 6000) {
          list.push({ status: 'warning', label: 'Вынос LSRV', text: 'Выносящая способность достаточно хорошая для крупного песка и гравия' });
        } else {
          list.push({ status: 'error', label: 'Вынос LSRV', text: 'Выносящая способность в крупном песке неудовлетворительна' });
        }
      }
    }

    return list;
  };

  const statusList = [
    { key: 'f600', label: 'Параметр FANN_600', val: f600, desc: 'Показание вискозиметра при 600 об/мин.' },
    { key: 'f3', label: 'Параметр FANN_3', val: f3, desc: 'Показание вискозиметра при 3 об/мин для оценки статического напряжения.' },
    { key: 'tics', label: 'Коэф. тиксотропии TS', val: calculations.tics, desc: 'Отношение GEL_10min / GEL_1min. Оптимально в пределах 1.3 - 1.8.' },
    { key: 'pv', label: 'Пластическая вязкость PV', val: calculations.pv, desc: 'Разность FANN_600 - FANN_300. Характеризует сопротивление течению из-за трения частиц.' },
    { key: 'gel_10', label: 'GEL_10min (psf)', val: gel10, desc: 'Статическое напряжение сдвига через 10 минут.' },
    { key: 'yp', label: 'Предел сдвига YP', val: calculations.yp, desc: 'Динамическое напряжение сдвига (f300 - PV). Способность выносить шлам.' },
    { key: 'n', label: 'Индекс поведения n', val: calculations.n, desc: 'Коэффициент псевдопластичности. Чем меньше, тем лучше раствор разжижается при сдвиге.' },
    { key: 'K', label: 'Индекс консистенции K', val: calculations.K, desc: 'Мера вязкости раствора при малых скоростях сдвига.' },
    { key: 'LSRV', label: 'Вязкость LSRV', val: calculations.LSRV, desc: 'Вязкость при сверхнизких скоростях сдвига (Low Shear Rate Viscosity).' },
  ] as const;

  const conclusions = useMemo(() => getConclusions(), [bent, vis, conc, calculations, f600, f3, gel1, gel10]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Droplet size={180} className="text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Лабораторный Анализ ГНБ
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 mb-4">
            HDD BENTONITE MUD-TESTER
          </h2>
          <p className="text-teal-100 text-sm md:text-base leading-relaxed">
            Инженерно-аналитический прибор для оценки реологических свойств бентонитового бурового раствора. 
            Позволяет рассчитать тиксотропию, индексы сдвига и консистенции белизной и выносит детальные вердикты 
            для безопасной траектории пилотного ствола и расширения.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sliders and Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sliders size={20} className="text-emerald-600" />
              Входные параметры раствора
            </h3>

            {/* Checkboxes for Bentonite Category */}
            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Тип бентонита / Добавки
              </span>
              
              <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-200/50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={bent} 
                  onChange={(e) => {
                    setBent(e.target.checked);
                    if (e.target.checked) setVis(false);
                  }}
                  className="w-5 h-5 rounded text-emerald-600 border-slate-300 mt-0.5 focus:ring-emerald-500" 
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">base bentonite</span>
                  <span className="text-xs text-slate-500">Базовый бентонит (FANN_600 &lt; 26)</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-200/50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={vis} 
                  onChange={(e) => {
                    setVis(e.target.checked);
                    if (e.target.checked) setBent(false);
                  }}
                  className="w-5 h-5 rounded text-emerald-600 border-slate-300 mt-0.5 focus:ring-emerald-500" 
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">low viscosity</span>
                  <span className="text-xs text-slate-500">Пониженная вязкость (26 &lt; FANN_600 &lt; 44)</span>
                </div>
              </label>
            </div>

            {/* Suspenion Concentration Selector */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Концентрация суспензии (%)
              </label>
              <div className="flex gap-2">
                {rates.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setConc(rate)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                      conc === rate 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {rate}% суспензия
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                *Доступные концентрации зависят от выбранного типа бентонитового порошка.
              </p>
            </div>

            {/* Sliders Separator */}
            <hr className="border-slate-100 my-6" />

            <div className="space-y-5">
              {/* Slider 1: FANN_600 */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-semibold text-slate-700">FANN_600 (индекс 600)</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-700">
                    {f600}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="85" 
                  value={f600} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setF600(val);
                    // Constraint f300 must be less than f600
                    if (f300 >= val) setF300(Math.max(5, val - 5));
                  }}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 2: FANN_300 */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-semibold text-slate-700">FANN_300 (индекс 300)</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-700">
                    {f300}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="65" 
                  value={f300} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    // Constraint f300 must be less than f600
                    if (val >= f600) {
                      setF300(f600 - 1);
                    } else {
                      setF300(val);
                    }
                  }}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 3: FANN_3 */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-semibold text-slate-700">FANN_3 (индекс 3)</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-700">
                    {f3}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="25" 
                  value={f3} 
                  onChange={(e) => setF3(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 4: GEL_1min */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-semibold text-slate-700">GEL_1min, psf (СНС 1 мин)</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-700">
                    {gel1}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="45" 
                  value={gel1} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setGel1(val);
                    // Constraint gel_10 must be >= gel_1 usually
                    if (gel10 < val) setGel10(val);
                  }}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 5: GEL_10min */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-semibold text-slate-700">GEL_10min, psf (СНС 10 мин)</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-700">
                    {gel10}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="70" 
                  value={gel10} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < gel1) {
                      setGel10(gel1);
                    } else {
                      setGel10(val);
                    }
                  }}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setTested(true);
              }}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mt-8 text-sm uppercase tracking-wider"
            >
              <RefreshCw size={16} className="animate-spin-slow" />
              ПРОТЕСТИРОВАТЬ РАСТВОР
            </button>
          </div>
        </div>

        {/* Right Column: Outcomes & Detailed Engineering Report */}
        <div className="lg:col-span-7 space-y-6">
          
          {tested && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              {/* Calculated Rheological Parameters Grid */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PieChart size={20} className="text-emerald-600" />
                  Реологические показатели раствора
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Коэф. Тиксотропии TS</span>
                    <span className="text-2xl font-black text-slate-800">{calculations.tics.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block">gel_10 / gel_1</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Пластическая PV</span>
                    <span className="text-2xl font-black text-slate-800">{calculations.pv.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400 block">мПа*с</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Предел Сдвига YP</span>
                    <span className="text-2xl font-black text-slate-800">{calculations.yp.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400 block">psf ({(calculations.yp * 4.8).toFixed(1)} дПа)</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Коэф.поведения n</span>
                    <span className="text-2xl font-black text-slate-800">{calculations.n.toFixed(3)}</span>
                    <span className="text-[10px] text-slate-400 block">степень</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Консистенция K</span>
                    <span className="text-2xl font-black text-slate-800">{calculations.K.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block">Па*с^n</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">Вязкость LSRV</span>
                    <span className="text-2xl font-black text-slate-800">
                      {calculations.LSRV > 100000 ? calculations.LSRV.toExponential(2) : calculations.LSRV.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </span>
                    <span className="text-[10px] text-slate-400 block">мПа*с</span>
                  </div>

                </div>
              </div>

              {/* Compliance / Performance indicators list */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ClipboardList size={20} className="text-emerald-600" />
                  Состояние реологических индексов
                </h3>

                <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-2 space-y-3">
                  {statusList.map((item) => {
                    let actualVal = item.val;
                    const evalRes = getStatus(item.key, actualVal);
                    
                    return (
                      <div key={item.key} className="pt-3 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{item.label}</span>
                          <span className="text-sm font-medium text-slate-700">{item.desc}</span>
                        </div>
                        <div className="text-right flex flex-col items-end shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                            evalRes.status === 'success' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : evalRes.status === 'warning'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {evalRes.status === 'success' && <CheckCircle size={12} />}
                            {evalRes.status === 'warning' && <AlertTriangle size={12} />}
                            {evalRes.status === 'error' && <XCircle size={12} />}
                            {evalRes.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed engineering verbal conclusions */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ClipboardList size={20} className="text-emerald-600" />
                  Инженерные Выводы (Conclusions)
                </h3>

                <div className="space-y-4">
                  {conclusions.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-2xl flex items-start gap-3 border ${
                        item.status === 'success' 
                          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' 
                          : item.status === 'warning'
                          ? 'bg-amber-50/50 border-amber-100 text-amber-900'
                          : 'bg-rose-50/50 border-rose-100 text-rose-900'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.status === 'success' && <CheckCircle className="text-emerald-600" size={18} />}
                        {item.status === 'warning' && <AlertTriangle className="text-amber-600" size={18} />}
                        {item.status === 'error' && <XCircle className="text-rose-600" size={18} />}
                      </div>
                      <div>
                        <span className="font-bold text-xs uppercase tracking-wider block opacity-70 mb-0.5">
                          {item.label}
                        </span>
                        <p className="text-sm font-medium leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
