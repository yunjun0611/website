"use client";

import { Clock, Trash2, History, ChevronRight } from "lucide-react";

export type HistoryItem = {
  id: string;
  original: string;
  result: any;
  timestamp: number;
};

interface SidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ history, onSelect, onClear, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-transform duration-300 z-50 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <History className="w-5 h-5 text-blue-500" />
              History
            </h2>
            <button 
              onClick={onClear}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 opacity-20" />
                <p className="text-sm">No history yet.</p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.original}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 text-[10px] text-center text-slate-400 border-t border-slate-100 dark:border-slate-800">
            Storage limit: 10 items
          </div>
        </div>
      </aside>

      {/* Toggle Button for Mobile/Collapsed Desktop */}
      <button
        onClick={onToggle}
        className={`
          fixed bottom-6 left-6 p-3 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl 
          z-50 transition-all hover:scale-110 lg:hidden
        `}
      >
        <History className="w-6 h-6" />
      </button>
    </>
  );
}
