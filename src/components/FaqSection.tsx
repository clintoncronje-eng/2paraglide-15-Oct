import React, { useState, useMemo } from 'react';
import { FaqItem, FaqCategory } from '../types';
import {
  HelpCircle,
  ChevronDown,
  Search,
  ShieldCheck,
  CloudSun,
  Award,
  QrCode,
  Compass,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'all'>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Filter only published FAQs and sort by order
  const publishedFaqs = useMemo(() => {
    return faqs
      .filter((faq) => faq.published)
      .sort((a, b) => a.order - b.order);
  }, [faqs]);

  // Apply search query and category filters
  const filteredFaqs = useMemo(() => {
    return publishedFaqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [publishedFaqs, selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const categories: { id: FaqCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'booking_escrow', label: 'Escrow & Booking', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'safety_pilots', label: 'Pilots & Certification', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'weather_cancellation', label: 'Weather & Refunds', icon: <CloudSun className="w-3.5 h-3.5" /> },
    { id: 'equipment_passenger', label: 'Gear & Passenger', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'partners_operators', label: 'Hotel & QR Partners', icon: <QrCode className="w-3.5 h-3.5" /> }
  ];

  return (
    <section id="faq-section" className="max-w-[1280px] mx-auto px-6 pt-6 pb-12">
      <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-2xl p-6 sm:p-8 lg:p-10 space-y-8 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Accent Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E62B1E]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#8A8A8A]/20 pb-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E62B1E] font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>SWISS ALPS TANDEM KNOWLEDGE BASE · VERIFIED BY CH-SHV PILOTS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFFFFF] tracking-tight uppercase">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#8A8A8A] leading-relaxed">
              Everything you need to know about tandem paragliding in Switzerland and the European Alps: escrow payment protection, certified pilot safety standards, weather cancellation guarantees, and passenger guidelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] border border-[#8A8A8A]/30 rounded-lg text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{publishedFaqs.length} Answers Published</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E62B1E]/10 border border-[#E62B1E]/30 rounded-lg text-xs font-mono text-[#E62B1E] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% ESCROW PROTECTED</span>
            </span>
          </div>
        </div>

        {/* Search Input & Category Filters */}
        <div className="space-y-4 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions (e.g. weather, refund, weight, pilot licenses, TWINT, cameras)..."
              className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#8A8A8A]/35 focus:border-[#E62B1E] focus:outline-hidden rounded-xl text-sm text-[#FFFFFF] placeholder:text-[#8A8A8A] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8A8A8A] hover:text-[#FFFFFF] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => {
              const count =
                cat.id === 'all'
                  ? publishedFaqs.length
                  : publishedFaqs.filter((f) => f.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#E62B1E] text-[#FFFFFF] shadow-sm font-semibold'
                      : 'bg-[#111111] text-[#8A8A8A] hover:text-[#FFFFFF] border border-[#8A8A8A]/25 hover:border-[#8A8A8A]/50'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      selectedCategory === cat.id
                        ? 'bg-black/30 text-[#FFFFFF]'
                        : 'bg-[#181818] text-[#8A8A8A]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3 relative z-10">
          {filteredFaqs.length === 0 ? (
            <div className="bg-[#111111] border border-[#8A8A8A]/25 rounded-xl p-8 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-[#8A8A8A] mx-auto opacity-60" />
              <p className="text-sm font-semibold text-[#FFFFFF]">No questions match your search.</p>
              <p className="text-xs text-[#8A8A8A]">
                Try adjusting your search terms or select "All Questions" to view the complete knowledge base.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-[#181818] hover:bg-[#222222] border border-[#8A8A8A]/30 text-xs text-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-[#141414] border-[#E62B1E]/60 shadow-lg'
                      : 'bg-[#111111] border-[#8A8A8A]/25 hover:border-[#8A8A8A]/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="font-mono text-xs font-bold text-[#E62B1E] shrink-0 w-6">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <span className="font-display text-sm sm:text-base font-bold text-[#FFFFFF] tracking-tight">
                        {faq.question}
                      </span>
                    </div>

                    <div className="shrink-0 ml-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isExpanded
                            ? 'bg-[#E62B1E] text-[#FFFFFF] rotate-180'
                            : 'bg-[#181818] border border-[#8A8A8A]/30 text-[#8A8A8A]'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-[#8A8A8A]/15">
                      <div className="pl-9 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed font-sans space-y-2">
                        <p>{faq.answer}</p>
                        <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-[#8A8A8A]">
                          <span className="text-[#E62B1E] uppercase font-semibold">
                            {faq.category.replace(/_/g, ' ')}
                          </span>
                          <span>·</span>
                          <span className="text-emerald-400">FSVL / BAZL Guaranteed</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Support Callout */}
        <div className="p-4 sm:p-5 bg-[#111111] border border-[#8A8A8A]/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E62B1E]/15 border border-[#E62B1E]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#E62B1E]" />
            </div>
            <div>
              <span className="font-bold text-[#FFFFFF]">Still have questions about your flight?</span>
              <p className="text-[#8A8A8A] text-[11px]">
                Our certified Swiss pilot network is available for pre-flight weather consults, passenger accommodations, and group bookings.
              </p>
            </div>
          </div>

          <a
            href="#flight-slots-section"
            className="px-4 py-2 bg-[#181818] hover:bg-[#222222] border border-[#8A8A8A]/30 hover:border-[#E62B1E] text-[#FFFFFF] font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Browse Verified Pilot Slots →
          </a>
        </div>
      </div>
    </section>
  );
};
