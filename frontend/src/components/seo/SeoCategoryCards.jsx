import React from 'react';
import { Server, FileText, Smartphone, Share2, Image as ImageIcon, Gauge } from 'lucide-react';

export default function SeoCategoryCards({ categories }) {
  const cards = [
    {
      key: 'technical',
      title: 'Technical & Indexing',
      icon: Server,
      color: 'bg-[#bfdbfe]',
      data: categories.technical,
      desc: 'HTTPS, robots.txt, sitemap.xml, canonical, and indexability rules.',
    },
    {
      key: 'onPage',
      title: 'On-Page SEO & Content',
      icon: FileText,
      color: 'bg-[#86efac]',
      data: categories.onPage,
      desc: 'Title tags, meta descriptions, H1-H3 structure, and content depth.',
    },
    {
      key: 'mobile',
      title: 'Mobile & User Experience',
      icon: Smartphone,
      color: 'bg-[#fde047]',
      data: categories.mobile,
      desc: 'Responsive viewport, HTML language declaration, and brand favicon.',
    },
    {
      key: 'socialSchema',
      title: 'Social & Structured Data',
      icon: Share2,
      color: 'bg-[#ff9ebb]',
      data: categories.socialSchema,
      desc: 'OpenGraph tags, Twitter cards, and Schema.org JSON-LD.',
    },
    {
      key: 'mediaLinks',
      title: 'Links & Media Assets',
      icon: ImageIcon,
      color: 'bg-[#fed7aa]',
      data: categories.mediaLinks,
      desc: 'Image alt attributes, internal/external links, and broken link checks.',
    },
    {
      key: 'lighthouse',
      title: 'Lighthouse Performance',
      icon: Gauge,
      color: 'bg-[#e9d5ff]',
      data: categories.lighthouse,
      desc: 'Server latency (TTFB), payload weight, and web best practices.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        const score = card.data?.score ?? 0;
        const max = card.data?.max ?? 20;
        const percentage = card.data?.percentage ?? Math.round((score / max) * 100);

        return (
          <div
            key={card.key}
            className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className={`p-2.5 rounded-lg border-2 border-black ${card.color} brutal-shadow-sm`}>
                  <Icon className="w-5 h-5 text-black stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-space text-black">
                    {score}
                    <span className="text-xs text-zinc-400 font-normal">/{max} pts</span>
                  </span>
                  <span className="block text-[11px] font-bold font-mono text-zinc-500">
                    {percentage}% Health
                  </span>
                </div>
              </div>

              <h4 className="text-base font-bold font-space text-black mb-1">{card.title}</h4>
              <p className="text-xs font-medium text-zinc-600 mb-4 leading-relaxed">{card.desc}</p>
            </div>

            <div>
              {/* Progress bar */}
              <div className="w-full h-3 bg-zinc-100 border border-black rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full border border-black transition-all duration-500 ${
                    percentage >= 80 ? 'bg-[#86efac]' : percentage >= 50 ? 'bg-[#fde047]' : 'bg-[#ff9ebb]'
                  }`}
                  style={{ width: `${Math.max(5, percentage)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
