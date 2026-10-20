import React from "react";
import { ShieldCheck, Mail, Globe } from "lucide-react";

export default function Footer({ onOpenExtension }) {
  return (
    <footer className="bg-white text-black py-12 px-6 border-t-2 border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#86efac] rounded-lg border-2 border-black flex items-center justify-center brutal-shadow-sm">
            <ShieldCheck className="w-5 h-5 stroke-[2] text-black" />
          </div>
          <span className="font-bold text-xl font-space">SecurIX</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 font-semibold text-sm font-space">
          <a href="#scanner" className="hover:text-zinc-600 transition-colors">
            Master Test
          </a>
          <a
            href="#techstack"
            className="hover:text-zinc-600 transition-colors"
          >
            Tech Stack
          </a>
          <a
            href="#seo-audit"
            className="hover:text-zinc-600 transition-colors"
          >
            SEO & Lighthouse
          </a>
          <a href="#features" className="hover:text-zinc-600 transition-colors">
            12 Channels
          </a>
          <a
            href="#extension"
            className="hover:text-zinc-600 transition-colors"
          >
            Chrome Extension
          </a>
          <button
            onClick={onOpenExtension}
            className="hover:text-zinc-600 cursor-pointer font-bold text-blue-900"
          >
            🧩 Load Extension
          </button>
        </div>

        <div className="text-zinc-500 text-sm font-medium font-space text-center md:text-right">
          © 2026 SecurIX. Free URL Security, Phishing & SEO Engine.
        </div>
      </div>

      {/* Bottom Section: Creator Credits, Social Links & Disclaimer */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-200 flex flex-col lg:flex-row justify-between items-center text-xs text-zinc-600 font-space gap-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span>
            Created by{" "}
            <strong className="text-black font-bold text-sm">Imeer.ai</strong>
          </span>

          {/* Social Links Row */}
          <div className="flex items-center gap-2">
            {/* Portfolio Link */}
            <a
              href="https://imeer.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-[#86efac] brutal-shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer"
              title="Portfolio Website"
            >
              <Globe className="w-4 h-4 stroke-[2.2]" />
            </a>

            {/* Email Link */}
            <a
              href="mailto:abbaszameer@gmail.com"
              className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-[#bfdbfe] brutal-shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer"
              title="Email ZaMeer Abbas"
            >
              <Mail className="w-4 h-4 stroke-[2.2]" />
            </a>

            {/* GitHub Link (SVG) */}
            <a
              href="https://github.com/imeerai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-[#fde047] brutal-shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer"
              title="GitHub Profile"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn Link (SVG) */}
            <a
              href="https://www.linkedin.com/in/imeerai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-black hover:bg-[#ff9ebb] brutal-shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer"
              title="LinkedIn Profile"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        <span>
          ⚠️ <strong>Disclaimer:</strong> This website is created for study and
          educational purposes only.
        </span>
      </div>
    </footer>
  );
}
