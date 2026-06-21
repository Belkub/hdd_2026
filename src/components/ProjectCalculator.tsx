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

// Authentic Russian standard SP 341.1325800.2017 specifications
interface SoilProperty {
  num: number;
  cat: string;
  group: string;
  test: string;
  F: number;
  soda_min: number;
  soda_max: number;
  soda_c: number;
  cv_min: number;
  cv_max: number;
  cv_c: number;
  paa_min: number;
  paa_max: number;
  paa_c: number;
  pac_min: number;
  pac_max: number;
  pac_c: number;
  xc_min: number;
  xc_max: number;
  xc_c: number;
  lub_min: number;
  lub_max: number;
  lub_c: number;
  T: string;
  gel: string;
  yp: string;
  disc: string;
  pil_gm: number;
  pil_vint: number;
}

const df: SoilProperty[] = [
  {
    num: 1,
    cat: 'Мягкие грунты',
    group: 'I',
    test: 'Пески (не плывуны), супеси без гальки и щебня; суглинки лёссовидные; мел слабый; торф; растительный слой без древесных корней; лёсс',
    F: 3,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 15,
    cv_max: 60,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0.7,
    pac_min: 0.3,
    pac_max: 1.5,
    xc_c: 0.5,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '5 - 8',
    yp: '10 - 15',
    disc: 'пески, супеси (без гальки), торф, растит слой',
    pil_gm: 60,
    pil_vint: 50
  },
  {
    num: 2,
    cat: 'Мягкие грунты',
    group: 'II',
    test: 'Илы, глины текучие и пластичные',
    F: 5,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 15,
    cv_min: 0,
    cv_max: 20,
    paa_c: 0.5,
    paa_min: 0.1,
    paa_max: 1.5,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.2,
    xc_min: 0.1,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '30 - 80',
    gel: '3 - 8',
    yp: '10 - 25',
    disc: 'пластичные глины, ил',
    pil_gm: 50,
    pil_vint: 50
  },
  {
    num: 3,
    cat: 'Мягкие грунты',
    group: 'II',
    test: 'Супеси плотные; суглинок твердый; мергель рыхлый; суглинок плотный; мел',
    F: 4,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 20,
    cv_max: 50,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0.5,
    pac_min: 0.1,
    pac_max: 1,
    xc_c: 0.5,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 60',
    gel: '5 - 8',
    yp: '10 - 15',
    disc: 'плотные супеси, суглинки',
    pil_gm: 50,
    pil_vint: 50
  },
  {
    num: 4,
    cat: 'Мягкие грунты',
    group: 'II',
    test: 'Глины тугопластичные; плывун',
    F: 5,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 15,
    cv_min: 0,
    cv_max: 20,
    paa_c: 0.5,
    paa_min: 0.1,
    paa_max: 1.5,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.2,
    xc_min: 0.1,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '30 - 80',
    gel: '3 - 8',
    yp: '10 - 25',
    disc: 'глины тугопластичные, плывуны',
    pil_gm: 50,
    pil_vint: 50
  },
  {
    num: 5,
    cat: 'Мягкие грунты',
    group: 'III',
    test: 'Песчано-глинистые породы с примесью до 20% мелкой (до 3 см) гальки или щебня; лёсс плотный; пески плотные; алевролиты глинистые слабосцементированные; песчаники, сцементированные глинистым и известковым цементом; мергель; мел плотный',
    F: 5,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 25,
    cv_min: 15,
    cv_max: 30,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0.5,
    pac_min: 0.1,
    pac_max: 1,
    xc_c: 0.5,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 60',
    gel: '5 - 8',
    yp: '10 - 15',
    disc: 'песчано-глинистые породы с мелкой галькой (до 3 см)',
    pil_gm: 35,
    pil_vint: 45
  },
  {
    num: 6,
    cat: 'Мягкие грунты',
    group: 'III',
    test: 'Глины с прослоями (до 5 см) слабосцементированных песчаников и мергелей, полутвердые, мергелистые, загипсованные, песчанистые; глины плотные; дресва; магнезит; плывун напорный; гипс тонкокристаллический, выветрелый',
    F: 6,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 25,
    cv_min: 15,
    cv_max: 30,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0.5,
    pac_min: 0.1,
    pac_max: 1,
    xc_c: 0.5,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '30 - 80',
    gel: '3 - 8',
    yp: '10 - 25',
    disc: 'глины с прослоями песчаника и мергеля',
    pil_gm: 35,
    pil_vint: 45
  },
  {
    num: 7,
    cat: 'Грунт средней прочности',
    group: 'IV',
    test: 'Мерзлые водоносные пески / ил / торф',
    F: 5,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 20,
    cv_max: 60,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0.3,
    pac_min: 0.7,
    pac_max: 1.5,
    xc_c: 0.5,
    xc_min: 0.2,
    xc_max: 1.5,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '8 - 20',
    yp: '15 - 25',
    disc: 'водоносный песок и торф',
    pil_gm: 20,
    pil_vint: 35
  },
  {
    num: 8,
    cat: 'Грунт средней прочности',
    group: 'IV',
    test: 'Песчаники глинистые; гипс кристаллический; мергель плотный; алевролиты плотные, глинистые; неплотные известняки и доломиты; магнезит плотный',
    F: 6,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 20,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.4,
    xc_min: 0.1,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '8 - 20',
    yp: '15 - 25',
    disc: 'песчаник глинистый, алевролиты',
    pil_gm: 20,
    pil_vint: 35
  },
  {
    num: 9,
    cat: 'Грунт средней прочности',
    group: 'IV',
    test: 'Глины твердые, моренные отложения без валунов',
    F: 7,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 20,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.4,
    xc_min: 0.1,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 60',
    gel: '8 - 20',
    yp: '15 - 25',
    disc: 'глины твердые',
    pil_gm: 20,
    pil_vint: 35
  },
  {
    num: 10,
    cat: 'Грунт средней прочности',
    group: 'V',
    test: 'Мерзлые породы: песок крупнозернистый, дресва, ил плотный, глины песчаные; песчаники на известковистом и железистом цементе; алевролиты; аргиллиты; доломиты мергелистые; известняки; конгломерат осадочных пород на песчано-глинистом цементе',
    F: 6,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 20,
    cv_max: 60,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0.7,
    pac_min: 0.3,
    pac_max: 1.5,
    xc_c: 0.5,
    xc_min: 0.2,
    xc_max: 1.5,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '8 - 20',
    yp: '15 - 25',
    disc: 'крупнозернистый песок, песчаные глины, доломиты',
    pil_gm: 15,
    pil_vint: 25
  },
  {
    num: 11,
    cat: 'Грунт средней прочности',
    group: 'V',
    test: 'Галечник мерзлый, связанный глинистым или песчано глинистым материалом с ледяными прослойками; ангидрит весьма плотный; мрамор',
    F: 7,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 40,
    cv_min: 30,
    cv_max: 60,
    paa_c: 0.1,
    paa_min: 0,
    paa_max: 1,
    pac_c: 0.5,
    pac_min: 0.2,
    pac_max: 1,
    xc_c: 0.7,
    xc_min: 0.4,
    xc_max: 2,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '>80',
    gel: '15 - 40',
    yp: '20 - 40',
    disc: 'галечник песчаный или глинистый',
    pil_gm: 15,
    pil_vint: 25
  },
  {
    num: 12,
    cat: 'Грунт средней прочности',
    group: 'V',
    test: 'Галечник мелкий из осадочных пород, галечно-щебенистые и дресвяные породы; глины аргиллитоподобные, твердые; фосфориты желваковые; цементный камень',
    F: 8,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'галечно-щебенистые породы',
    pil_gm: 15,
    pil_vint: 25
  },
  {
    num: 13,
    cat: 'Твердые грунты',
    group: 'VI',
    test: 'Конгломерат осадочных пород на известковистом цементе; песчаники полевошпатовые кварцево известковистые; алевролиты с включением кварца; известняки плотные доломитизированные',
    F: 7,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'песчанистый известняк',
    pil_gm: 10,
    pil_vint: 15
  },
  {
    num: 14,
    cat: 'Твердые грунты',
    group: 'VI',
    test: 'Ангидрит плотный; доломиты плотные; опоки; аргиллиты, слабоокремненные; моренные отложения с валунами',
    F: 8,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'ангидриты и плотные доломиты',
    pil_gm: 10,
    pil_vint: 15
  },
  {
    num: 15,
    cat: 'Твердые грунты',
    group: 'VI',
    test: 'Глины твердые мерзлые; глины плотные с прослоями доломита и сидеритов; апатиты, скарны эпидото кальцитовые; колчедан сыпучий; siдериты',
    F: 9,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'плотные доломитовые глины',
    pil_gm: 10,
    pil_vint: 15
  },
  {
    num: 16,
    cat: 'Твердые грунты',
    group: 'VII',
    test: 'Конгломераты с галькой (до 50 %) изверженных пород на песчано-глинистом цементе',
    F: 9,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'песчано-глинистые породы с галькой (до 50 %)',
    pil_gm: 8,
    pil_vint: 8
  },
  {
    num: 17,
    cat: 'Твердые грунты',
    group: 'VII',
    test: 'Конгломераты осадочных пород на кремнистом цементе; песчаники кварцевые; известняки окварцованные; аргиллиты окремненные; фосфоритовая плита; кимберлиты базальтовидные',
    F: 10,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'Кремнистые аргиллиты, базальты',
    pil_gm: 8,
    pil_vint: 8
  },
  {
    num: 18,
    cat: 'Крепкие породы',
    group: 'VIII',
    test: 'Аргиллиты кремнистые; конгломераты изверженных пород на известковистом цементе; доломиты окварцованные; окремненные известняки и доломиты; фосфориты плотные пластовые',
    F: 10,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'Валунно-галечные отложения',
    pil_gm: 5,
    pil_vint: 5
  },
  {
    num: 19,
    cat: 'Крепкие породы',
    group: 'IX',
    test: 'Базальты, не затронутые выветриванием; конгломераты изверженных пород на кремнистом цементе; известняки карстовые; кремнистые песчаники, известняки',
    F: 10,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'базальты, не затронутые выветриванием',
    pil_gm: 5,
    pil_vint: 5
  },
  {
    num: 20,
    cat: 'Крепкие породы',
    group: 'X',
    test: 'Валунно-галечные отложения изверженных и метаморфизованных пород; песчаники кварцевые сливные; джеспилиты; затронутые выветриванием, фосфатно-кремнистые породы',
    F: 10,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'Валунно-галечные отложения',
    pil_gm: 5,
    pil_vint: 5
  },
  {
    num: 21,
    cat: 'Крепкие породы',
    group: 'XI',
    test: 'Альбитофиры тонкозернистые, ороговикованные; джеспилиты, не затронутые выветриванием; сланцы яшмовидные кремнистые',
    F: 10,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 30,
    cv_min: 25,
    cv_max: 40,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'Альбитофиры тонкозернистые',
    pil_gm: 5,
    pil_vint: 5
  },
  {
    num: 22,
    cat: 'Крепкие породы',
    group: 'XII',
    test: 'Совершенно не затронутые выветриванием монолито-сливные джеспилиты, кремень, яшмы, роговики, кварциты, эгириновые и корундовые породы',
    F: 10,
    soda_min: 0.2,
    soda_max: 1.5,
    soda_c: 1,
    cv_c: 15,
    cv_min: 20,
    cv_max: 30,
    paa_c: 0,
    paa_min: 0,
    paa_max: 0,
    pac_c: 0,
    pac_min: 0,
    pac_max: 0,
    xc_c: 0.6,
    xc_min: 0.3,
    xc_max: 1,
    lub_c: 0.2,
    lub_min: 0,
    lub_max: 0.5,
    T: '40 - 80',
    gel: '7 - 12',
    yp: '12 - 20',
    disc: 'Совершенно не затронутые выветриванием породы',
    pil_gm: 5,
    pil_vint: 5
  }
];

const ALL_SOILS = df;

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
  const [n11, setN11] = useState(false); // Задать максимальную тяговую силу установки
  const [pullForce, setPullForce] = useState('Мини до 100 кН');
  const [motorType, setMotorType] = useState('гидромонитор');
  
  const [n12, setN12] = useState(false); // Задать материал трубопровода
  const [pipeMaterial, setPipeMaterial] = useState('Стальной');
  
  const [n13, setN13] = useState(false); // Выбрать твердость горных пород
  const [rockHardness, setRockHardness] = useState('Мягкие грунты');
  const [rockDescription, setRockDescription] = useState('Пески (не плывуны), супеси без гальки и щебня; суглинки лёссовидные; мел слабый; торф; растительный слой без древесных корней; лёсс');

  const [n2, setN2] = useState(false); // Задать расширители
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

  // Derived lists for dynamic selection
  const hardnessCategories = useMemo(() => {
    return Array.from(new Set(df.map(row => row.cat)));
  }, []);

  const availableDescriptions = useMemo(() => {
    return df.filter(row => row.cat === rockHardness).map(row => row.test);
  }, [rockHardness]);

  // Sync rock description if hardness type changes
  const handleHardnessChange = (newHardness: string) => {
    setRockHardness(newHardness);
    const matched = df.filter(row => row.cat === newHardness);
    if (matched.length > 0) {
      setRockDescription(matched[0].test);
    }
  };

  // Sync mixer default volume based on selected pull force class
  React.useEffect(() => {
    const F = n11 ? (pullForceRates[pullForce] || 1) : 1;
    if (F === 1 || F === 2) {
      if (Number(mixerVolume) > 10 || Number(mixerVolume) < 2) {
        setMixerVolume(2);
      }
    } else {
      if (Number(mixerVolume) < 10 || Number(mixerVolume) > 60) {
        setMixerVolume(10);
      }
    }
  }, [n11, pullForce]);

  // Run calculation reactively on mount & parameter updates
  React.useEffect(() => {
    handleCalculate();
  }, [
    n11,
    pullForce,
    motorType,
    n12,
    pipeMaterial,
    n13,
    rockHardness,
    rockDescription,
    n2,
    JSON.stringify(expanders),
    wellLength,
    calcMaterials,
    bentoniteType,
    consumptionCat,
    mixerVolume,
    splitVolume
  ]);

  // Perform Calculations precisely matching the streamlit python program
  const handleCalculate = () => {
    const F = n11 ? (pullForceRates[pullForce] || 1) : 1;
    const z = (F === 3 || F === 4) ? (motorTypes[motorType] || 1) : 1;
    
    const L = Number(wellLength) || 100;
    const Vn = Number(mixerVolume) || (F === 1 || F === 2 ? 2 : 10);
    const ww = bentoniteTypes[bentoniteType] || 1;
    const mm = consumptionCategories[consumptionCat] || 2; // 1 = min, 2 = c, 3 = max

    const tvv = n13 ? (ALL_SOILS.find(s => s.test === rockDescription || s.disc === rockDescription)?.num || 1) : 1;
    const spec = ALL_SOILS.find(s => s.num === tvv) || ALL_SOILS[0];
    
    const sig = n12 ? (pipeMaterial === 'Полиэтиленовые трубы' ? 0.05 : 0.10) : 0.10;
    
    let totalVolume = 0;
    let details: any = {};

    if (F === 1 || F === 2) {
      // Classes Mini and Midi installations: V_br = 0.785 * dp^2 * (L + sig) * F_rock (formula Л.2)
      const maxD = n2 ? Math.max(...expanders.map(e => Number(e.diameter) || 100), 100) : 100;
      const dp = maxD * 0.001; // largest expander diameter in meters
      const F_rock = spec.F;
      const V_br = 0.785 * dp * dp * (L + sig) * F_rock;
      totalVolume = Vn + V_br;
      
      // Breakdown matching expanders if n2 check is active
      const D_pilot = F === 1 ? 80 : 100; // pilot hole diameter in mm
      const Vp_pilot = 0.785 * 0.001 * 0.001 * D_pilot * D_pilot * (L + sig) * F_rock;
      const expanderDetails = n2 ? expanders.map((e, index) => {
        const d = Number(e.diameter) || 100;
        const prev_d = index === 0 ? D_pilot : (Number(expanders[index - 1].diameter) || D_pilot);
        const Vr = 0.785 * 0.001 * 0.001 * (d * d - prev_d * prev_d) * (L + sig) * F_rock;
        return { diameter: d, volume: Vr };
      }) : [];

      details = { Vp: Vp_pilot, expanderDetails, lastVt: 0 };
    } else {
      // Classes Maxi and Mega installations: Vobsh = V_pil + sum(V_exp) + sum(V_kal) + V_zat
      const u = z === 1 ? spec.pil_gm : spec.pil_vint; // mechanical pilot drilling speed (v_pil) in m/hour
      let Q = 1; // pilot slurry flow rate (m³/min)
      
      if (z === 1) {
        if (L <= 300) Q = 0.2;
        else if (L <= 500) Q = 0.3;
        else if (L <= 1000) Q = 0.5;
        else if (L <= 1500) Q = 0.7;
        else Q = 1.0;
      } else {
        if (L <= 300) Q = 0.7;
        else if (L <= 500) Q = 0.8;
        else if (L <= 1000) Q = 1.0;
        else if (L <= 1500) Q = 1.5;
        else Q = 2.0;
      }

      // Pilot Volume (V_pil)
      const Vp = (Q / u) * 60 * (L + sig) * 1.2;
      
      const Vr: number[] = [];
      const Vk: number[] = [];
      const Vt: number[] = [];
      
      const expanderDetails = expanders.map((e) => {
        const d = Number(e.diameter) || 100;
        const s = Number(e.speed) || 0.5;
        const tr = (L + sig) / (60 * s);
        
        const vr_val = 60 * tr * d * 0.001 * 1.2;
        const vk_val = ((d * 0.001) / (3 * s * 60)) * 60 * (L + sig) * 1.2;
        const vt_val = ((d * 0.001) / (3 * 60)) * 60 * (L + sig) * 1.2;
        
        Vr.push(vr_val);
        Vk.push(vk_val);
        Vt.push(vt_val);
        
        return { 
          diameter: d, 
          volume: vr_val + vk_val 
        };
      });

      const sumVr = Vr.reduce((a, b) => a + b, 0);
      const sumVk = Vk.reduce((a, b) => a + b, 0);
      const lastVt = Vt[Vt.length - 1] || 0;

      const V_obsh = Vp + sumVr + sumVk + lastVt;
      totalVolume = Vn + V_obsh;
      details = { Vp, expanderDetails, lastVt };
    }

    // Materials Calculation dynamically from SoilProperty columns
    let materials: any = null;
    if (calcMaterials) {
      // select concentrations based on intensity selection
      const selectConcentration = (minVal: number, maxVal: number, defaultVal: number, mode: number): number => {
        if (mode === 1) return minVal; // min
        if (mode === 3) return maxVal; // max
        return defaultVal; // standard/middle (mode === 2)
      };

      const rawSoda = selectConcentration(spec.soda_min, spec.soda_max, spec.soda_c, mm);
      const rawBent = selectConcentration(spec.cv_min, spec.cv_max, spec.cv_c, mm);
      const rawPaa = selectConcentration(spec.paa_min, spec.paa_max, spec.paa_c, mm);
      const rawPac = selectConcentration(spec.pac_min, spec.pac_max, spec.pac_c, mm);
      const rawXc = selectConcentration(spec.xc_min, spec.xc_max, spec.xc_c, mm);
      const rawLub = selectConcentration(spec.lub_min, spec.lub_max, spec.lub_c, mm);

      // Apply Albrekhta high-yield scaling factors precisely
      let bentFactor = 1;
      let pacFactor = 1;
      let xcFactor = 1;
      
      if (ww === 2) {
        bentFactor = 0.7;
        pacFactor = 0.8;
        xcFactor = 0.9;
      } else if (ww === 3) {
        bentFactor = 0.5;
        pacFactor = 0.6;
        xcFactor = 0.8;
      } else if (ww === 4) {
        bentFactor = 0.4;
        pacFactor = 0.5;
        xcFactor = 0.7;
      }

      materials = {
        soda: totalVolume * rawSoda,
        bentonite: totalVolume * rawBent * bentFactor,
        paa: totalVolume * rawPaa,
        pac: totalVolume * rawPac * pacFactor,
        xc: totalVolume * rawXc * xcFactor,
        lub: totalVolume * rawLub
      };
    }

    setResults({
      totalVolume,
      details,
      materials,
      properties: {
        T: spec.T,
        gel: spec.gel,
        yp: spec.yp
      }
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
              <label className="flex items-center gap-3 cursor-pointer p-1">
                <input 
                  type="checkbox" 
                  checked={n11} 
                  onChange={e => setN11(e.target.checked)} 
                  className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" 
                />
                <span className="text-sm font-bold text-slate-700">Задать максимальную тяговую силу установки</span>
              </label>

              {n11 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-1"
                >
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

                  {(pullForceRates[pullForce] === 3 || pullForceRates[pullForce] === 4) && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
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
                    </motion.div>
                  )}
                </motion.div>
              )}
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
              <label className="flex items-center gap-3 cursor-pointer p-1">
                <input 
                  type="checkbox" 
                  checked={n12} 
                  onChange={e => setN12(e.target.checked)} 
                  className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" 
                />
                <span className="text-sm font-bold text-slate-700">Задать материал трубопровода</span>
              </label>

              {n12 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Материал трубопровода</span>
                  <select 
                    value={pipeMaterial} 
                    onChange={e => setPipeMaterial(e.target.value)} 
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {Object.keys(pipeMaterials).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </motion.div>
              )}

              <div className="border-t border-slate-100 pt-3 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-1">
                  <input 
                    type="checkbox" 
                    checked={n13} 
                    onChange={e => setN13(e.target.checked)} 
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" 
                  />
                  <span className="text-sm font-bold text-slate-700">Выбрать твердость горных пород</span>
                </label>

                {n13 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Категория пород по твердости</span>
                      <select 
                        value={rockHardness} 
                        onChange={e => handleHardnessChange(e.target.value)} 
                        className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-xs sm:text-sm font-medium text-slate-800"
                      >
                        {hardnessCategories.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Литологическое описание пород</span>
                      <select 
                        value={rockDescription} 
                        onChange={e => setRockDescription(e.target.value)} 
                        className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-xs sm:text-sm font-medium text-slate-800"
                      >
                        {availableDescriptions.map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
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
              {!(n11 && (pullForceRates[pullForce] === 3 || pullForceRates[pullForce] === 4)) && (
                <label className="flex items-center gap-3 cursor-pointer p-1 border-b border-slate-50 pb-2">
                  <input 
                    type="checkbox" 
                    checked={n2} 
                    onChange={e => setN2(e.target.checked)} 
                    className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" 
                  />
                  <span className="text-sm font-bold text-slate-700">Задать технологические расширители</span>
                </label>
              )}

              {((n11 && (pullForceRates[pullForce] === 3 || pullForceRates[pullForce] === 4)) || n2) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
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
                </motion.div>
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

                    {results.details.lastVt > 0 && (
                      <div className="flex justify-between items-center text-sm py-2.5 text-slate-800">
                        <span className="text-slate-500">Конечная затяжка (Vt)</span>
                        <span className="font-mono font-bold text-cyan-700">
                          {results.details.lastVt.toFixed(1)} м³
                        </span>
                      </div>
                    )}

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

                  <div className="grid grid-cols-3 gap-2 font-semibold text-center mt-2">
                    <div className="p-3 bg-slate-50 rounded-2xl flex flex-col justify-between">
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider mb-1">Условная вязкость</span>
                      <span className="text-xs font-black text-slate-700 block my-1">{results.properties.T}</span>
                      <span className="text-[8px] text-slate-400 block uppercase tracking-wider">сек</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl flex flex-col justify-between">
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider mb-1">СНС 1 мин</span>
                      <span className="text-xs font-black text-slate-700 block my-1">{results.properties.gel}</span>
                      <span className="text-[8px] text-slate-400 block uppercase tracking-wider">фунт/100Фут²</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl flex flex-col justify-between">
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider mb-1">ДНС раствора</span>
                      <span className="text-xs font-black text-slate-700 block my-1">{results.properties.yp}</span>
                      <span className="text-[8px] text-slate-400 block uppercase tracking-wider">фунт/100Фут²</span>
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
