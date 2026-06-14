import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MudTester } from './components/MudTester';
import { ProjectCalculator } from './components/ProjectCalculator';
import { Droplet, Calculator, ShieldAlert, Cpu, ClipboardCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tester' | 'calculator'>('tester');

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* Premium Professional Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex flex-col sm:flex-row items-center justify-between gap-4 py-3 sm:py-0">
          
          {/* Brand Identity without AI-slop status lights */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-600 to-cyan-700 text-white p-2 rounded-xl shadow-md">
              <Cpu size={20} className="animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-none uppercase">
                ГНБ-ИНЖИНИРИНГ
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mt-0.5">
                Профессиональные Калькуляторы Бурения
              </span>
            </div>
          </div>

          {/* Large touch-friendly responsive switcher navigation */}
          <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto self-stretch sm:self-center h-12 max-w-md sm:max-w-none">
            <button
              onClick={() => setActiveTab('tester')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap min-h-[44px] ${
                activeTab === 'tester'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              <Droplet size={14} className={activeTab === 'tester' ? 'text-emerald-600' : ''} />
              🔬 Тестер Раствора
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap min-h-[44px] ${
                activeTab === 'calculator'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              <Calculator size={14} className={activeTab === 'calculator' ? 'text-cyan-700' : ''} />
              🧮 Калькулятор ГНБ
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'tester' ? (
            <motion.div
              key="tester-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <MudTester />
            </motion.div>
          ) : (
            <motion.div
              key="calculator-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ProjectCalculator />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fully styled bottom footer containing technical specifications summary */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
            <div>
              <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Ключевые стандарты</h4>
              <p className="leading-relaxed text-slate-400">
                Все формулы, пределы реологических сдвигов, пластической вязкости и коэффициенты тиксотропии полностью соответствуют 
                отраслевым нормам ГНБ пилотного прокола, горизонтально-направленного бурения и методическим стандартам контроля глинистых растворов.
              </p>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Реология ГНБ</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <ClipboardCheck size={14} className="text-emerald-500" />
                  Параметры FANN вискозиметра (600, 300, 3)
                </li>
                <li className="flex items-center gap-1.5">
                  <ClipboardCheck size={14} className="text-emerald-500" />
                  Модель Оствальда-де-Вааля (индексы n, K)
                </li>
                <li className="flex items-center gap-1.5">
                  <ClipboardCheck size={14} className="text-emerald-500" />
                  Конструкция расширителей и объемы утилизации
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Безопасность работ</h4>
              <p className="leading-relaxed text-slate-400">
                Предостерегающие предупреждения и сообщения об ошибках информируют операторов буровых установок о рисках недостаточной 
                стабилизации бентонита, опасности гидроразрыва пласта при завышенной пластической вязкости или выпадении бурового шлама.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} ГНБ-Инжиниринг. Все права защищены. Разработано в соответствии с технологическими регламентами ГНБ.
            </p>
            <div className="flex gap-4">
              <span className="hover:text-slate-400 transition-colors cursor-help">Помощь</span>
              <span>&bull;</span>
              <span className="hover:text-slate-400 transition-colors cursor-help">Регламенты</span>
              <span>&bull;</span>
              <span className="hover:text-slate-400 transition-colors cursor-help">Спецификация API</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
