import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GripVertical, Eye, EyeOff, Copy, Clipboard, RotateCcw, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface CanvasDashboardProps {
  kpis: {
    revenue: React.ReactNode;
    expenses: React.ReactNode;
    profitMargin: React.ReactNode;
    runway: React.ReactNode;
  };
  charts: {
    revenueForecast: React.ReactNode;
    expenseTrend: React.ReactNode;
  };
  widgets: {
    dataQuality: React.ReactNode;
    whatIfSliders: React.ReactNode;
  };
}

interface WidgetItem {
  id: string;
  name: string;
  category: 'KPI' | 'Chart' | 'Utility';
  visible: boolean;
  size: 'small' | 'medium' | 'large'; // small = 1 col, medium = 2 col, large = 3 col
}

const DEFAULT_LAYOUT: WidgetItem[] = [
  { id: 'kpi-revenue', name: 'Monthly Revenue KPI', category: 'KPI', visible: true, size: 'small' },
  { id: 'kpi-expenses', name: 'Monthly Expenses KPI', category: 'KPI', visible: true, size: 'small' },
  { id: 'kpi-profit', name: 'Net Profit Margin KPI', category: 'KPI', visible: true, size: 'small' },
  { id: 'kpi-runway', name: 'Cash Runway KPI', category: 'KPI', visible: true, size: 'small' },
  { id: 'chart-revenue', name: 'Revenue Forecast Chart', category: 'Chart', visible: true, size: 'large' },
  { id: 'widget-sliders', name: 'What-If Scenarios Panel', category: 'Utility', visible: true, size: 'large' },
  { id: 'widget-quality', name: 'Data Quality Gauge', category: 'Utility', visible: true, size: 'small' },
  { id: 'chart-expenses', name: 'Expense Trends Chart', category: 'Chart', visible: true, size: 'medium' },
];

export default function CanvasDashboard({ kpis, charts, widgets }: CanvasDashboardProps) {
  const [layout, setLayout] = useState<WidgetItem[]>(DEFAULT_LAYOUT);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('ufo_canvas_layout_v1');
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLayout(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved canvas layout, using default');
      }
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = (newLayout: WidgetItem[]) => {
    setLayout(newLayout);
    localStorage.setItem('ufo_canvas_layout_v1', JSON.stringify(newLayout));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const dragIndex = layout.findIndex((w) => w.id === draggedId);
    const targetIndex = layout.findIndex((w) => w.id === targetId);

    if (dragIndex !== -1 && targetIndex !== -1) {
      const updated = [...layout];
      // Swap positions
      const temp = updated[dragIndex];
      updated[dragIndex] = updated[targetIndex];
      updated[targetIndex] = temp;
      setLayout(updated);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    saveLayout(layout);
  };

  const toggleVisibility = (id: string) => {
    const updated = layout.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
    saveLayout(updated);
  };

  const handleReset = () => {
    saveLayout(DEFAULT_LAYOUT);
    setErrorMsg('');
  };

  const handleCopyLayoutJSON = () => {
    const layoutStr = JSON.stringify(layout, null, 2);
    navigator.clipboard.writeText(layoutStr).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleImportLayout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
        saveLayout(parsed);
        setShowShareModal(false);
        setImportText('');
      } else {
        setErrorMsg('Invalid layout: Must be a non-empty array of widgets.');
      }
    } catch (e) {
      setErrorMsg('Invalid JSON layout format.');
    }
  };

  const getWidgetComponent = (id: string): React.ReactNode => {
    switch (id) {
      case 'kpi-revenue': return kpis.revenue;
      case 'kpi-expenses': return kpis.expenses;
      case 'kpi-profit': return kpis.profitMargin;
      case 'kpi-runway': return kpis.runway;
      case 'chart-revenue': return charts.revenueForecast;
      case 'chart-expenses': return charts.expenseTrend;
      case 'widget-quality': return widgets.dataQuality;
      case 'widget-sliders': return widgets.whatIfSliders;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800/60 dark:backdrop-blur-md p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/25">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Customizable Workspace</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Drag to arrange or toggle visibility of widgets</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setShowShareModal(!showShareModal)}
            className="text-xs font-bold px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            Share / Sync Layout
          </button>
          <button
            onClick={handleReset}
            className="text-xs font-bold px-3 py-2 bg-gray-50 hover:bg-gray-150 dark:bg-gray-900/60 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Layout
          </button>
        </div>
      </div>

      {/* Share / Sync Modal */}
      {showShareModal && (
        <div className="bg-white dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-1.5">
              <span>CEO / CFO Layout Synchronization Panel</span>
            </h3>
            <button 
              onClick={() => { setShowShareModal(false); setErrorMsg(''); }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Export Current View</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Copy this configuration block to share your exact dashboard positioning with other executives.
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={JSON.stringify(layout, null, 2)}
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-[10px] font-mono text-gray-500 dark:text-gray-400 focus:outline-none"
                />
                <button
                  onClick={handleCopyLayoutJSON}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow transition-all flex items-center gap-1"
                >
                  {copySuccess ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                  {copySuccess ? 'Copied!' : 'Copy Layout'}
                </button>
              </div>
            </div>

            {/* Import */}
            <form onSubmit={handleImportLayout} className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Import Executive View</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Paste a shared layout configuration JSON below to synchronize your dashboard widgets.
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON configuration here..."
                className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-[10px] font-mono placeholder-gray-500 focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-rose-500 text-[10px] font-bold">{errorMsg}</span>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-colors"
                >
                  Apply Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Toggle Widgets Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800/60 dark:backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-md space-y-4">
          <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-indigo-500" />
            Widget Inventory
          </h3>
          <div className="space-y-2.5">
            {layout.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleVisibility(item.id)}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
                  item.visible 
                    ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold" 
                    : "bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-850 text-gray-400 dark:text-gray-500 hover:text-gray-600"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded font-extrabold bg-gray-200/50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {item.category}
                  </span>
                  <span className="text-xs truncate max-w-[130px]">{item.name}</span>
                </div>
                <div>
                  {item.visible ? (
                    <Eye className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drag Grid Workspace */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-6 gap-6">
          {layout
            .filter((w) => w.visible)
            .map((item) => {
              const widgetComp = getWidgetComponent(item.id);
              if (!widgetComp) return null;

              // Map sizing categories to grid column span
              let gridSpan = 'md:col-span-3'; // medium default (3 of 6)
              if (item.size === 'small') gridSpan = 'md:col-span-2'; // 2 of 6 (3 in a row)
              if (item.size === 'large') gridSpan = 'md:col-span-6'; // 6 of 6 (1 in a row)

              // Make KPI cards small inside this layout automatically
              if (item.category === 'KPI') gridSpan = 'md:col-span-3'; 

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "relative transition-all duration-300 rounded-2xl group",
                    gridSpan,
                    draggedId === item.id 
                      ? "opacity-45 scale-95 border-2 border-dashed border-indigo-500" 
                      : "opacity-100 hover:shadow-lg"
                  )}
                >
                  {/* Drag Handle Overlay */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-35 flex gap-1 items-center bg-gray-900/90 text-white rounded-lg px-2 py-1 text-[10px] font-mono cursor-grab shadow">
                    <GripVertical className="w-3.5 h-3.5" />
                    <span>Drag Widget</span>
                  </div>

                  {/* Render Widget */}
                  {widgetComp}
                </div>
              );
            })}
          
          {layout.filter((w) => w.visible).length === 0 && (
            <div className="col-span-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-16 text-center space-y-4">
              <EyeOff className="w-12 h-12 text-gray-400 mx-auto animate-bounce" />
              <p className="font-bold text-gray-500">All widgets are currently hidden.</p>
              <p className="text-xs text-gray-400">Toggle items in the Widget Inventory on the left to add them to your canvas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

