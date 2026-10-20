import React, { useState } from "react";
import {
  X,
  Puzzle,
  ShieldCheck,
  Check,
  Sparkles,
  Download,
  Layers,
} from "lucide-react";
import { downloadExtension } from "../utils/extensionDownload";

export default function ExtensionPromoModal({ isOpen, onClose }) {
  const [downloadState, setDownloadState] = useState("idle");

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloadState("downloading");
    try {
      downloadExtension();
      setDownloadState("done");
    } catch (error) {
      console.error("Extension download failed:", error);
      setDownloadState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#fffdf7] border-4 border-black rounded-2xl max-w-3xl w-full brutal-shadow-lg overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="bg-[#bfdbfe] border-b-2 border-black p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#bfdbfe] rounded-lg flex items-center justify-center border-2 border-black">
              <Puzzle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-space text-xl font-bold text-black">
                  SecurIX QuickScan — Chrome Extension
                </h3>
                <span className="bg-[#10b981] text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-black">
                  MANIFEST V3
                </span>
              </div>
              <p className="text-xs text-black/70 font-space font-medium">
                1-Click Live Tab Security Scoring for Chrome, Edge, and Brave
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white border-2 border-black rounded-lg flex items-center justify-center brutal-shadow-sm brutal-hover text-black"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm font-space">
          {/* Extension Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border-2 border-black rounded-xl p-3 brutal-shadow-sm">
              <div className="text-lg mb-1">⚡</div>
              <div className="font-bold text-xs text-black">
                Active Tab Audit
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                Evaluates whatever tab you are currently viewing in under 500ms.
              </p>
            </div>
            <div className="bg-white border-2 border-black rounded-xl p-3 brutal-shadow-sm">
              <div className="text-lg mb-1">🎯</div>
              <div className="font-bold text-xs text-black">
                Radial Score & Badges
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                Live animated score gauge with SSL, Headers, DNS, and Leaks
                breakdown.
              </p>
            </div>
            <div className="bg-white border-2 border-black rounded-xl p-3 brutal-shadow-sm">
              <div className="text-lg mb-1">🔄</div>
              <div className="font-bold text-xs text-black">
                Offline Heuristic Fallback
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                Instantly analyzes URL patterns & SSL even if backend is
                offline.
              </p>
            </div>
          </div>

          {/* Installation Steps */}
          <div className="bg-[#fff3c4] border-2 border-black rounded-xl p-5 brutal-shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-black flex items-center gap-2">
              <Download className="w-4 h-4 text-black" /> How to Load & Test the
              Extension (For Judges)
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-800 font-medium">
              <li>
                Open{" "}
                <code className="bg-white px-1.5 py-0.5 rounded border border-black font-mono font-bold">
                  chrome://extensions
                </code>{" "}
                in Chrome / Edge / Brave.
              </li>
              <li>
                Enable <strong>"Developer mode"</strong> via the toggle in the
                top-right corner.
              </li>
              <li>
                Click the <strong>"Load unpacked"</strong> button in the top
                toolbar.
              </li>
              <li>
                Extract the downloaded ZIP, then select its{" "}
                <code className="bg-white px-1.5 py-0.5 rounded border border-black font-mono font-bold">
                  extension
                </code>{" "}
                folder.
              </li>
              <li>
                Click the <strong>SecurIX shield icon</strong> in your browser
                extension bar on any website to see the live score!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t-2 border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-space">
          <div className="text-xs text-zinc-500 font-mono">
            Download ZIP, extract it, then load the folder
          </div>
          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloadState === "downloading"}
              className="w-full sm:w-auto bg-[#10b981] text-black px-5 py-2 text-xs font-bold rounded-lg border-2 border-black brutal-shadow-sm brutal-hover flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {downloadState === "downloading"
                ? "Preparing ZIP..."
                : downloadState === "done"
                  ? "Download Started"
                  : "Download Extension"}
            </button>
            {downloadState === "error" && (
              <p className="text-xs text-red-600 font-bold sm:absolute sm:bottom-1 sm:right-4">
                Download failed. Please try again.
              </p>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-black text-white px-5 py-2 text-xs font-bold rounded-lg border-2 border-black brutal-shadow-sm brutal-hover"
            >
              Got it, Let's Test!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
