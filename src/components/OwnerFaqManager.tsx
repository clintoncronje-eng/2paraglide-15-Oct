import React, { useState } from 'react';
import { FaqItem, FaqCategory } from '../types';
import { INITIAL_FAQS } from '../data/initialFaqs';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UploadCloud,
  Eye,
  EyeOff,
  X,
  Save,
  Search
} from 'lucide-react';

interface OwnerFaqManagerProps {
  faqs: FaqItem[];
  onUpdateFaqs: (newFaqs: FaqItem[]) => void;
  onPublishFaqs: (faqsToPublish: FaqItem[]) => Promise<void> | void;
  lastPublishedAt?: string | null;
}

export const OwnerFaqManager: React.FC<OwnerFaqManagerProps> = ({
  faqs,
  onUpdateFaqs,
  onPublishFaqs,
  lastPublishedAt
}) => {
  const [localFaqs, setLocalFaqs] = useState<FaqItem[]>(faqs);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form draft state for edit / new modal
  const [draftQuestion, setDraftQuestion] = useState('');
  const [draftAnswer, setDraftAnswer] = useState('');
  const [draftCategory, setDraftCategory] = useState<FaqCategory>('booking_escrow');
  const [draftPublished, setDraftPublished] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync when prop updates
  React.useEffect(() => {
    setLocalFaqs(faqs);
  }, [faqs]);

  const handleOpenEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    setIsCreatingNew(false);
    setDraftQuestion(faq.question);
    setDraftAnswer(faq.answer);
    setDraftCategory(faq.category);
    setDraftPublished(faq.published);
    setFormError(null);
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setIsCreatingNew(true);
    setDraftQuestion('');
    setDraftAnswer('');
    setDraftCategory('booking_escrow');
    setDraftPublished(true);
    setFormError(null);
  };

  const handleSaveModal = () => {
    if (!draftQuestion.trim()) {
      setFormError('Please enter a question title.');
      return;
    }
    if (!draftAnswer.trim()) {
      setFormError('Please enter an answer explanation.');
      return;
    }

    if (isCreatingNew) {
      const newFaq: FaqItem = {
        id: `faq-custom-${Date.now()}`,
        question: draftQuestion.trim(),
        answer: draftAnswer.trim(),
        category: draftCategory,
        order: localFaqs.length + 1,
        published: draftPublished,
        updatedAt: new Date().toISOString()
      };
      const updated = [...localFaqs, newFaq];
      setLocalFaqs(updated);
      onUpdateFaqs(updated);
    } else if (editingFaq) {
      const updated = localFaqs.map((f) =>
        f.id === editingFaq.id
          ? {
              ...f,
              question: draftQuestion.trim(),
              answer: draftAnswer.trim(),
              category: draftCategory,
              published: draftPublished,
              updatedAt: new Date().toISOString()
            }
          : f
      );
      setLocalFaqs(updated);
      onUpdateFaqs(updated);
    }

    setEditingFaq(null);
    setIsCreatingNew(false);
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ item?')) {
      const updated = localFaqs
        .filter((f) => f.id !== id)
        .map((f, idx) => ({ ...f, order: idx + 1 }));
      setLocalFaqs(updated);
      onUpdateFaqs(updated);
    }
  };

  const handleTogglePublished = (id: string) => {
    const updated = localFaqs.map((f) =>
      f.id === id ? { ...f, published: !f.published, updatedAt: new Date().toISOString() } : f
    );
    setLocalFaqs(updated);
    onUpdateFaqs(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localFaqs.length) return;

    const reordered = [...localFaqs];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // re-assign order numbers
    const updated = reordered.map((f, idx) => ({ ...f, order: idx + 1 }));
    setLocalFaqs(updated);
    onUpdateFaqs(updated);
  };

  const handleResetToStandards = () => {
    if (
      window.confirm(
        'Reset FAQ knowledge base to the official 10 Swiss Alps tandem paragliding standard questions?'
      )
    ) {
      setLocalFaqs(INITIAL_FAQS);
      onUpdateFaqs(INITIAL_FAQS);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishFeedback(null);
    try {
      await onPublishFaqs(localFaqs);
      setPublishFeedback(
        `Successfully published ${localFaqs.filter((f) => f.published).length} FAQs directly to the front-end marketplace!`
      );
      setTimeout(() => setPublishFeedback(null), 4000);
    } catch (err) {
      setPublishFeedback('Failed to publish FAQs. Please verify database permissions.');
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredFaqs = localFaqs.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  const publishedCount = localFaqs.filter((f) => f.published).length;
  const draftCount = localFaqs.length - publishedCount;

  return (
    <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Top Header & Publishing Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#8A8A8A]/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E62B1E] font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>KNOWLEDGE BASE GOVERNANCE · FRONT-END FAQ CMS</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#FFFFFF] tracking-tight">
            Frequently Asked Questions Management
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-2xl leading-relaxed">
            Edit, reorder, create, or disable FAQs. Click <strong>"Publish to Front End"</strong> to immediately push all modifications to the public marketplace FAQ section.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToStandards}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#111111] hover:bg-[#222222] border border-[#8A8A8A]/30 text-xs font-semibold text-[#8A8A8A] hover:text-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
            title="Restore original 10 Swiss verified FAQs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 10 Standards</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#111111] hover:bg-[#222222] border border-[#8A8A8A]/40 hover:border-[#E62B1E] text-xs font-bold text-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E62B1E]" />
            <span>Add Question</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E62B1E] hover:bg-[#c82317] disabled:opacity-50 text-xs font-bold text-[#FFFFFF] rounded-lg transition-all shadow-[0_0_15px_rgba(230,43,30,0.4)] cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isPublishing ? 'Publishing...' : 'Publish to Front End'}</span>
          </button>
        </div>
      </div>

      {/* Publishing Feedback Notification */}
      {publishFeedback && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/50 rounded-xl text-xs text-emerald-400 flex items-center justify-between gap-3 font-mono animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{publishFeedback}</span>
          </div>
          <button
            onClick={() => setPublishFeedback(null)}
            className="text-emerald-400/80 hover:text-emerald-400 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Overview Strip & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 bg-[#111111] border border-[#8A8A8A]/25 rounded-lg text-[#FFFFFF]">
            Total: <strong>{localFaqs.length}</strong> Questions
          </span>
          <span className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400">
            Published: <strong>{publishedCount}</strong>
          </span>
          {draftCount > 0 && (
            <span className="px-3 py-1.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-amber-400">
              Hidden/Draft: <strong>{draftCount}</strong>
            </span>
          )}
          {lastPublishedAt && (
            <span className="text-[#8A8A8A] hidden md:inline">
              Last Published: <span className="text-[#CCCCCC]">{lastPublishedAt}</span>
            </span>
          )}
        </div>

        {/* Quick Search */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#8A8A8A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-9 pr-3 py-2 bg-[#111111] border border-[#8A8A8A]/30 focus:border-[#E62B1E] focus:outline-hidden rounded-lg text-xs text-[#FFFFFF] placeholder:text-[#8A8A8A]"
          />
        </div>
      </div>

      {/* FAQ Items List Table */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`p-4 rounded-xl border transition-all ${
              faq.published
                ? 'bg-[#111111] border-[#8A8A8A]/25 hover:border-[#8A8A8A]/50'
                : 'bg-[#141414] border-dashed border-[#8A8A8A]/30 opacity-75'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Question & Category */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <span className="font-mono text-xs font-bold text-[#E62B1E] w-5 text-center">
                    {String(faq.order).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-[#8A8A8A] hover:text-[#FFFFFF] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === localFaqs.length - 1}
                      className="p-1 text-[#8A8A8A] hover:text-[#FFFFFF] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-[#181818] border border-[#8A8A8A]/30 text-[#8A8A8A]">
                      {faq.category.replace(/_/g, ' ')}
                    </span>
                    {faq.published ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Eye className="w-3 h-3" />
                        <span>LIVE ON FRONT END</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                        <EyeOff className="w-3 h-3" />
                        <span>HIDDEN (DRAFT)</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#FFFFFF] leading-snug">
                    {faq.question}
                  </h3>

                  <p className="text-xs text-[#8A8A8A] line-clamp-2 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleTogglePublished(faq.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    faq.published
                      ? 'bg-[#181818] text-[#CCCCCC] hover:text-[#FFFFFF] border border-[#8A8A8A]/30'
                      : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/50'
                  }`}
                  title={faq.published ? 'Hide from front end' : 'Set to published'}
                >
                  {faq.published ? 'Hide' : 'Publish'}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(faq)}
                  className="p-2 text-[#8A8A8A] hover:text-[#FFFFFF] hover:bg-[#181818] border border-[#8A8A8A]/20 hover:border-[#8A8A8A]/40 rounded-lg transition-colors cursor-pointer"
                  title="Edit FAQ Question & Answer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-2 text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/30 border border-rose-500/20 hover:border-rose-500/40 rounded-lg transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal Dialog */}
      {(editingFaq || isCreatingNew) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-[#8A8A8A]/40 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-[#8A8A8A]/25 pb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF]">
                <HelpCircle className="w-4 h-4 text-[#E62B1E]" />
                <span>{isCreatingNew ? 'Create New FAQ' : 'Edit FAQ Item'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingFaq(null);
                  setIsCreatingNew(false);
                }}
                className="p-1.5 text-[#8A8A8A] hover:text-[#FFFFFF] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#CCCCCC] font-bold mb-1.5">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={draftQuestion}
                  onChange={(e) => setDraftQuestion(e.target.value)}
                  placeholder="e.g. What footwear should I bring to launch?"
                  className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#8A8A8A]/35 focus:border-[#E62B1E] focus:outline-hidden rounded-lg text-sm text-[#FFFFFF] font-sans placeholder:text-[#8A8A8A]"
                />
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-bold mb-1.5">
                  Answer Explanation *
                </label>
                <textarea
                  value={draftAnswer}
                  onChange={(e) => setDraftAnswer(e.target.value)}
                  rows={5}
                  placeholder="Provide clear, authoritative details explaining procedures, safety standards, escrow protection, or guidelines..."
                  className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#8A8A8A]/35 focus:border-[#E62B1E] focus:outline-hidden rounded-lg text-xs sm:text-sm text-[#FFFFFF] font-sans leading-relaxed placeholder:text-[#8A8A8A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#CCCCCC] font-bold mb-1.5">
                    Category *
                  </label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value as FaqCategory)}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#8A8A8A]/35 focus:border-[#E62B1E] focus:outline-hidden rounded-lg text-xs text-[#FFFFFF]"
                  >
                    <option value="booking_escrow">Escrow &amp; Booking</option>
                    <option value="safety_pilots">Pilots &amp; Certification</option>
                    <option value="weather_cancellation">Weather &amp; Refunds</option>
                    <option value="equipment_passenger">Gear &amp; Passenger</option>
                    <option value="partners_operators">Hotel &amp; QR Partners</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="published-checkbox"
                    checked={draftPublished}
                    onChange={(e) => setDraftPublished(e.target.checked)}
                    className="w-4 h-4 accent-[#E62B1E] rounded cursor-pointer"
                  />
                  <label htmlFor="published-checkbox" className="text-xs text-[#FFFFFF] cursor-pointer">
                    Publish directly to front-end
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#8A8A8A]/25">
              <button
                type="button"
                onClick={() => {
                  setEditingFaq(null);
                  setIsCreatingNew(false);
                }}
                className="px-4 py-2 bg-[#111111] hover:bg-[#222222] border border-[#8A8A8A]/30 text-xs text-[#8A8A8A] hover:text-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#E62B1E] hover:bg-[#c82317] text-xs font-bold text-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Question</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
