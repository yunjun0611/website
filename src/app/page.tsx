"use client";

import { Sparkles, Send, Copy, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar, { HistoryItem } from "@/components/Sidebar";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("prompt_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleRefine = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data);

      // Update History
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        original: prompt,
        result: data,
        timestamp: Date.now(),
      };
      
      const updatedHistory = [newItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("prompt_history", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error refining prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("prompt_history");
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setPrompt(item.original);
    setResult(item.result);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar 
        history={history} 
        onSelect={selectHistoryItem} 
        onClear={clearHistory} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:ml-72 transition-all duration-300">
        <div className="w-full max-w-4xl space-y-8 py-12">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-blue-500" />
              Prompt Refiner
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Turn your basic ideas into high-quality AI prompts.
            </p>
          </div>

          {/* Main Dashboard Area */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
            <div className="p-6 space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Paste your rough prompt here..."
                  className="w-full min-h-[200px] p-4 text-lg bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-400 dark:text-slate-100"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2">
                  <button
                    onClick={() => { setPrompt(""); setResult(null); }}
                    className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    title="Clear"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={handleRefine}
                  disabled={isLoading || !prompt.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? "Refining..." : "Refine Prompt"}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
                <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Problem Analysis</h3>
                <p className="text-amber-900 dark:text-amber-200">{result.analysis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.refinements).map(([persona, text]: [string, any]) => (
                  <div key={persona} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold capitalize text-blue-600 dark:text-blue-400">{persona} Persona</h4>
                      <button 
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feature Highlights */}
          {!result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {[
                { title: "Contextual Awareness", desc: "Adds necessary background info" },
                { title: "Style Optimization", desc: "Refines tone and structure" },
                { title: "Constraint Check", desc: "Ensures clarity and precision" },
              ].map((feature, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
