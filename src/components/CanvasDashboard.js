import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { LayoutDashboard, GripVertical, Eye, EyeOff, Copy, Clipboard, RotateCcw, Check } from 'lucide-react';
import { cn } from '../utils/cn';
const DEFAULT_LAYOUT = [
    { id: 'kpi-revenue', name: 'Monthly Revenue KPI', category: 'KPI', visible: true, size: 'small' },
    { id: 'kpi-expenses', name: 'Monthly Expenses KPI', category: 'KPI', visible: true, size: 'small' },
    { id: 'kpi-profit', name: 'Net Profit Margin KPI', category: 'KPI', visible: true, size: 'small' },
    { id: 'kpi-runway', name: 'Cash Runway KPI', category: 'KPI', visible: true, size: 'small' },
    { id: 'chart-revenue', name: 'Revenue Forecast Chart', category: 'Chart', visible: true, size: 'large' },
    { id: 'widget-sliders', name: 'What-If Scenarios Panel', category: 'Utility', visible: true, size: 'large' },
    { id: 'widget-quality', name: 'Data Quality Gauge', category: 'Utility', visible: true, size: 'small' },
    { id: 'chart-expenses', name: 'Expense Trends Chart', category: 'Chart', visible: true, size: 'medium' },
];
export default function CanvasDashboard({ kpis, charts, widgets }) {
    const [layout, setLayout] = useState(DEFAULT_LAYOUT);
    const [draggedId, setDraggedId] = useState(null);
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
            }
            catch (e) {
                console.error('Failed to parse saved canvas layout, using default');
            }
        }
    }, []);
    // Save layout to localStorage
    const saveLayout = (newLayout) => {
        setLayout(newLayout);
        localStorage.setItem('ufo_canvas_layout_v1', JSON.stringify(newLayout));
    };
    const handleDragStart = (e, id) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
    };
    const handleDragOver = (e, targetId) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId)
            return;
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
    const toggleVisibility = (id) => {
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
    const handleImportLayout = (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const parsed = JSON.parse(importText);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
                saveLayout(parsed);
                setShowShareModal(false);
                setImportText('');
            }
            else {
                setErrorMsg('Invalid layout: Must be a non-empty array of widgets.');
            }
        }
        catch (e) {
            setErrorMsg('Invalid JSON layout format.');
        }
    };
    const getWidgetComponent = (id) => {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800/60 dark:backdrop-blur-md p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-md", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/25", children: _jsx(LayoutDashboard, { className: "w-5 h-5 text-indigo-500" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-800 dark:text-gray-100", children: "Customizable Workspace" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Drag to arrange or toggle visibility of widgets" })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [_jsxs("button", { onClick: () => setShowShareModal(!showShareModal), className: "text-xs font-bold px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5", children: [_jsx(Copy, { className: "w-3.5 h-3.5" }), "Share / Sync Layout"] }), _jsxs("button", { onClick: handleReset, className: "text-xs font-bold px-3 py-2 bg-gray-50 hover:bg-gray-150 dark:bg-gray-900/60 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors flex items-center gap-1.5", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5" }), "Reset Layout"] })] })] }), showShareModal && (_jsxs("div", { className: "bg-white dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700", children: [_jsx("h3", { className: "font-bold text-sm text-gray-800 dark:text-white flex items-center gap-1.5", children: _jsx("span", { children: "CEO / CFO Layout Synchronization Panel" }) }), _jsx("button", { onClick: () => { setShowShareModal(false); setErrorMsg(''); }, className: "text-xs text-gray-400 hover:text-white", children: "Close" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500", children: "Export Current View" }), _jsx("p", { className: "text-xs text-gray-500 leading-normal", children: "Copy this configuration block to share your exact dashboard positioning with other executives." }), _jsxs("div", { className: "relative", children: [_jsx("textarea", { readOnly: true, value: JSON.stringify(layout, null, 2), className: "w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-[10px] font-mono text-gray-500 dark:text-gray-400 focus:outline-none" }), _jsxs("button", { onClick: handleCopyLayoutJSON, className: "absolute bottom-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow transition-all flex items-center gap-1", children: [copySuccess ? _jsx(Check, { className: "w-3 h-3" }) : _jsx(Clipboard, { className: "w-3 h-3" }), copySuccess ? 'Copied!' : 'Copy Layout'] })] })] }), _jsxs("form", { onSubmit: handleImportLayout, className: "space-y-2", children: [_jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500", children: "Import Executive View" }), _jsx("p", { className: "text-xs text-gray-500 leading-normal", children: "Paste a shared layout configuration JSON below to synchronize your dashboard widgets." }), _jsx("textarea", { value: importText, onChange: (e) => setImportText(e.target.value), placeholder: "Paste JSON configuration here...", className: "w-full h-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-[10px] font-mono placeholder-gray-500 focus:outline-none" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-rose-500 text-[10px] font-bold", children: errorMsg }), _jsx("button", { type: "submit", className: "px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-colors", children: "Apply Config" })] })] })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6 items-start", children: [_jsxs("div", { className: "lg:col-span-1 bg-white dark:bg-gray-800/60 dark:backdrop-blur-md p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-md space-y-4", children: [_jsxs("h3", { className: "text-sm font-extrabold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-1.5", children: [_jsx(Eye, { className: "w-4 h-4 text-indigo-500" }), "Widget Inventory"] }), _jsx("div", { className: "space-y-2.5", children: layout.map((item) => (_jsxs("div", { onClick: () => toggleVisibility(item.id), className: cn("flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5", item.visible
                                        ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                                        : "bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-850 text-gray-400 dark:text-gray-500 hover:text-gray-600"), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[10px] uppercase px-1.5 py-0.5 rounded font-extrabold bg-gray-200/50 dark:bg-gray-800 text-gray-500 dark:text-gray-400", children: item.category }), _jsx("span", { className: "text-xs truncate max-w-[130px]", children: item.name })] }), _jsx("div", { children: item.visible ? (_jsx(Eye, { className: "w-4 h-4 text-indigo-500" })) : (_jsx(EyeOff, { className: "w-4 h-4 text-gray-400" })) })] }, item.id))) })] }), _jsxs("div", { className: "lg:col-span-3 grid grid-cols-1 md:grid-cols-6 gap-6", children: [layout
                                .filter((w) => w.visible)
                                .map((item) => {
                                const widgetComp = getWidgetComponent(item.id);
                                if (!widgetComp)
                                    return null;
                                // Map sizing categories to grid column span
                                let gridSpan = 'md:col-span-3'; // medium default (3 of 6)
                                if (item.size === 'small')
                                    gridSpan = 'md:col-span-2'; // 2 of 6 (3 in a row)
                                if (item.size === 'large')
                                    gridSpan = 'md:col-span-6'; // 6 of 6 (1 in a row)
                                // Make KPI cards small inside this layout automatically
                                if (item.category === 'KPI')
                                    gridSpan = 'md:col-span-3';
                                return (_jsxs("div", { draggable: true, onDragStart: (e) => handleDragStart(e, item.id), onDragOver: (e) => handleDragOver(e, item.id), onDragEnd: handleDragEnd, className: cn("relative transition-all duration-300 rounded-2xl group", gridSpan, draggedId === item.id
                                        ? "opacity-45 scale-95 border-2 border-dashed border-indigo-500"
                                        : "opacity-100 hover:shadow-lg"), children: [_jsxs("div", { className: "absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-35 flex gap-1 items-center bg-gray-900/90 text-white rounded-lg px-2 py-1 text-[10px] font-mono cursor-grab shadow", children: [_jsx(GripVertical, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Drag Widget" })] }), widgetComp] }, item.id));
                            }), layout.filter((w) => w.visible).length === 0 && (_jsxs("div", { className: "col-span-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-16 text-center space-y-4", children: [_jsx(EyeOff, { className: "w-12 h-12 text-gray-400 mx-auto animate-bounce" }), _jsx("p", { className: "font-bold text-gray-500", children: "All widgets are currently hidden." }), _jsx("p", { className: "text-xs text-gray-400", children: "Toggle items in the Widget Inventory on the left to add them to your canvas!" })] }))] })] })] }));
}
