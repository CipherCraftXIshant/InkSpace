import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  Link as LinkIcon,
  ChevronLeft,
  Eye,
  Edit3,
  Columns,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import { MOCK_CATEGORIES } from '../../data/mockData.js';
import {
  getAuthorPostById,
  saveAuthorPost,
} from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

// Curated high-res editorial cover presets
const COVER_PRESETS = [
  {
    label: 'Minimalist Desk',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Tech Architecture',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Slow Reading',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Typography Grid',
    url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Urban Modern',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
];

function EditorContent({ id }) {
  useDocumentTitle(id ? 'Edit Story' : 'New Story');
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // Check if editing an existing post
  const existingPost = useMemo(() => (id ? getAuthorPostById(id) : null), [id]);

  // Form Fields
  const [title, setTitle] = useState(existingPost?.title || '');
  const [slug, setSlug] = useState(existingPost?.slug || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [content, setContent] = useState(
    existingPost?.content ||
      `## Introduction\n\nWrite your thoughts here. In InkSpace's editorial studio, you have full markdown formatting support.\n\n> "Simplicity is about subtracting the obvious and adding the meaningful."\n\n### Key Takeaways\n\n- Write with clarity and restraint.\n- Focus on enduring ideas rather than transient buzzwords.\n- Use negative space to let your writing breathe.`
  );
  const [category, setCategory] = useState(existingPost?.category || 'Technology');
  const [coverImage, setCoverImage] = useState(
    existingPost?.coverImage || COVER_PRESETS[0].url
  );
  const [tags, setTags] = useState(
    existingPost?.tags || ['Editorial', 'Design', 'Technology']
  );
  const [newTagInput, setNewTagInput] = useState('');

  // UI View Mode: 'write' | 'preview' | 'split'
  const [viewMode, setViewMode] = useState('write');
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Unsaved changes listener for browser reload/exit
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Reading time and word count computation
  const { wordCount, readingTime } = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return {
      wordCount: words,
      readingTime: `${minutes} min read`,
    };
  }, [content]);

  // Auto-slugify
  const handleTitleChange = (val) => {
    setTitle(val);
    setIsDirty(true);
    if (!id) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Add tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = newTagInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setNewTagInput('');
        setIsDirty(true);
      }
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsDirty(true);
  };

  // Markdown Toolbar Inserter
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
    setIsDirty(true);

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  // Client-side validation
  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required (at least 5 characters).';
    } else if (title.trim().length < 5) {
      errs.title = 'Title is too short (minimum 5 characters).';
    }

    if (!slug.trim()) {
      errs.slug = 'Slug is required.';
    }

    if (!excerpt.trim()) {
      errs.excerpt = 'Excerpt summary is required (minimum 10 characters).';
    } else if (excerpt.trim().length < 10) {
      errs.excerpt = 'Excerpt is too short (minimum 10 characters).';
    }

    if (!content.trim()) {
      errs.content = 'Article body content cannot be empty.';
    } else if (content.trim().length < 20) {
      errs.content = 'Article body must be at least 20 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save handler (Draft / Published / Scheduled)
  const handleSave = (targetStatus) => {
    if (targetStatus === 'Published' && !validate()) {
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const categoryObj = MOCK_CATEGORIES.find(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );

      const postPayload = {
        id: id || existingPost?.id,
        title: title.trim(),
        slug: slug.trim() || 'story-' + Date.now(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        categorySlug: categoryObj ? categoryObj.slug : 'technology',
        coverImage: coverImage.trim() || COVER_PRESETS[0].url,
        tags,
        status: targetStatus,
        readingTime,
        scheduledDate: targetStatus === 'Scheduled' ? 'Nov 12, 2026' : undefined,
      };

      const saved = saveAuthorPost(postPayload);
      setIsDirty(false);
      setIsSaving(false);

      setToastMessage(
        targetStatus === 'Published'
          ? 'Story published successfully!'
          : targetStatus === 'Scheduled'
          ? 'Story scheduled for publication.'
          : 'Draft saved to your workspace.'
      );

      // If newly created, replace URL to edit mode
      if (!id && saved.id) {
        navigate(`/dashboard/editor/${saved.id}`, { replace: true });
      }

      setTimeout(() => setToastMessage(''), 4000);
    }, 400);
  };

  // Safe Editorial Markdown Renderer (Zero unsafe scripts)
  const renderMarkdownPreview = () => {
    const lines = content.split('\n');
    const elements = [];
    let listItems = [];
    let inCodeBlock = false;
    let codeBlockLines = [];

    const flushList = (key) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 my-3 space-y-1.5 text-sm sm:text-base text-[#2D2D2D]">
            {listItems.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushCode = (key) => {
      if (codeBlockLines.length > 0) {
        elements.push(
          <pre
            key={`code-${key}`}
            className="p-4 bg-[#1C1C1E] text-zinc-100 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto my-4 border border-zinc-800"
          >
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      }
    };

    // Parse bold, italic, inline code, and links
    const parseInline = (text) => {
      // Split on bold, italic, code
      const parts = [];
      let remaining = text;
      let partKey = 0;

      while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Italic: *text*
        const italicMatch = remaining.match(/\*([^*]+?)\*/);
        // Code: `code`
        const codeMatch = remaining.match(/`([^`]+?)`/);
        // Link: [text](url)
        const linkMatch = remaining.match(/\[([^\]]+?)\]\(([^)]+?)\)/);

        const matches = [
          boldMatch && { type: 'bold', index: boldMatch.index, match: boldMatch },
          italicMatch && { type: 'italic', index: italicMatch.index, match: italicMatch },
          codeMatch && { type: 'code', index: codeMatch.index, match: codeMatch },
          linkMatch && { type: 'link', index: linkMatch.index, match: linkMatch },
        ].filter(Boolean);

        if (matches.length === 0) {
          parts.push(<span key={partKey++}>{remaining}</span>);
          break;
        }

        // Pick earliest match
        matches.sort((a, b) => a.index - b.index);
        const earliest = matches[0];

        if (earliest.index > 0) {
          parts.push(<span key={partKey++}>{remaining.substring(0, earliest.index)}</span>);
        }

        if (earliest.type === 'bold') {
          parts.push(
            <strong key={partKey++} className="font-semibold text-[#121212]">
              {earliest.match[1]}
            </strong>
          );
          remaining = remaining.substring(earliest.index + earliest.match[0].length);
        } else if (earliest.type === 'italic') {
          parts.push(
            <em key={partKey++} className="italic">
              {earliest.match[1]}
            </em>
          );
          remaining = remaining.substring(earliest.index + earliest.match[0].length);
        } else if (earliest.type === 'code') {
          parts.push(
            <code
              key={partKey++}
              className="bg-[#F4F4F5] text-[#121212] px-1.5 py-0.5 rounded text-xs font-mono"
            >
              {earliest.match[1]}
            </code>
          );
          remaining = remaining.substring(earliest.index + earliest.match[0].length);
        } else if (earliest.type === 'link') {
          parts.push(
            <a
              key={partKey++}
              href={earliest.match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#121212] underline font-medium hover:text-[#525252]"
            >
              {earliest.match[1]}
            </a>
          );
          remaining = remaining.substring(earliest.index + earliest.match[0].length);
        }
      }

      return parts;
    };

    lines.forEach((line, idx) => {
      // Code fence toggles
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCode(idx);
        } else {
          flushList(idx);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Headings
      if (line.startsWith('### ')) {
        flushList(idx);
        elements.push(
          <h3
            key={idx}
            className="font-serif text-xl sm:text-2xl font-medium text-[#121212] mt-6 mb-2 tracking-tight"
          >
            {parseInline(line.replace('### ', ''))}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        flushList(idx);
        elements.push(
          <h2
            key={idx}
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#121212] mt-8 mb-3 tracking-tight"
          >
            {parseInline(line.replace('## ', ''))}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        flushList(idx);
        elements.push(
          <h1
            key={idx}
            className="font-serif text-3xl sm:text-4xl font-semibold text-[#121212] mt-8 mb-4 tracking-tight"
          >
            {parseInline(line.replace('# ', ''))}
          </h1>
        );
      } else if (line.startsWith('> ')) {
        // Blockquote
        flushList(idx);
        elements.push(
          <blockquote
            key={idx}
            className="border-l-2 border-[#121212] pl-4 italic my-4 text-[#4A4A4A] text-base leading-relaxed bg-[#FAF9F5] py-2 pr-3 rounded-r"
          >
            {parseInline(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        // List item
        listItems.push(line.substring(2));
      } else if (line.trim().length === 0) {
        flushList(idx);
      } else {
        flushList(idx);
        elements.push(
          <p key={idx} className="text-sm sm:text-base text-[#2D2D2D] leading-relaxed my-3 font-normal">
            {parseInline(line)}
          </p>
        );
      }
    });

    flushList('end');
    flushCode('end');

    return elements;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-20 right-6 z-50 bg-[#121212] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-2"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editor Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECECE8]">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/posts"
            className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded-md transition-colors"
            title="Back to Posts"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#121212]">
                {id ? 'Edit Story' : 'New Story'}
              </h1>
              {isDirty && (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Unsaved Edits
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-[#737373] mt-0.5">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>{readingTime}</span>
              {existingPost?.status && (
                <>
                  <span>·</span>
                  <span className="font-medium text-[#121212]">{existingPost.status}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleSave('Draft')}
            isLoading={isSaving}
            disabled={isSaving}
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave('Published')}
            isLoading={isSaving}
            disabled={isSaving}
          >
            Publish Story
          </Button>
        </div>
      </div>

      {/* General Form Error Alert */}
      {Object.keys(errors).length > 0 && (
        <div
          className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>
            Please complete the required story fields below before publishing.
          </span>
        </div>
      )}

      {/* Story Metadata Configuration Grid */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#ECECE8] shadow-2xs space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="post-title" className="block text-xs font-semibold text-[#525252] mb-1">
            Story Title <span className="text-red-500">*</span>
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="An elegant headline for your essay..."
            className={`w-full font-serif text-xl sm:text-2xl font-medium px-3.5 py-2.5 rounded-lg border bg-white outline-hidden focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-colors ${
              errors.title ? 'border-red-400' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600" role="alert">{errors.title}</p>
          )}
        </div>

        {/* Slug & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-slug" className="block text-xs font-semibold text-[#525252] mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-lg border border-[#E5E7EB] bg-[#FAF9F5] px-3 py-2 text-xs text-[#737373]">
              <span className="shrink-0 text-[#9CA3AF]">/blog/</span>
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full bg-transparent text-[#121212] font-mono outline-hidden pl-1"
                placeholder="custom-url-slug"
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-xs text-red-600" role="alert">{errors.slug}</p>
            )}
          </div>

          <div>
            <label htmlFor="post-category" className="block text-xs font-semibold text-[#525252] mb-1">
              Topic / Category <span className="text-red-500">*</span>
            </label>
            <select
              id="post-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setIsDirty(true);
              }}
              className="w-full text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#121212] outline-hidden focus:border-[#121212] cursor-pointer"
            >
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="post-excerpt" className="block text-xs font-semibold text-[#525252] mb-1">
            Story Excerpt / Teaser <span className="text-red-500">*</span>
          </label>
          <textarea
            id="post-excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              setIsDirty(true);
            }}
            placeholder="A compelling 1-2 sentence synopsis featured on story cards and search engines..."
            className={`w-full text-xs sm:text-sm p-3 rounded-lg border bg-white outline-hidden focus:border-[#121212] focus:ring-1 focus:ring-[#121212] ${
              errors.excerpt ? 'border-red-400' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.excerpt && (
            <p className="mt-1 text-xs text-red-600" role="alert">{errors.excerpt}</p>
          )}
        </div>

        {/* Tags Row */}
        <div>
          <label htmlFor="post-tags" className="block text-xs font-semibold text-[#525252] mb-1">
            Story Tags (Press Enter or comma to add)
          </label>
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-[#E5E7EB] bg-white">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF9F5] border border-[#ECECE8] text-[#121212]"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-[#8A8A8A] hover:text-red-600 cursor-pointer"
                  title="Remove tag"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="post-tags"
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="text-xs bg-transparent outline-hidden py-1 px-1 min-w-[120px] text-[#121212]"
            />
          </div>
        </div>

        {/* Cover Image URL & Preview */}
        <div>
          <label htmlFor="post-cover" className="block text-xs font-semibold text-[#525252] mb-1">
            Cover Photography URL
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              id="post-cover"
              type="url"
              value={coverImage}
              onChange={(e) => {
                setCoverImage(e.target.value);
                setIsDirty(true);
              }}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 text-xs bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#121212] outline-hidden focus:border-[#121212]"
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-[10px] text-[#737373] uppercase font-bold shrink-0">
                Presets:
              </span>
              {COVER_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCoverImage(preset.url);
                    setIsDirty(true);
                  }}
                  className="px-2 py-1 text-[11px] font-medium rounded border border-[#ECECE8] bg-[#FAF9F5] hover:bg-[#F0F0ED] text-[#4A4A4A] hover:text-[#121212] whitespace-nowrap cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image Thumbnail Preview */}
          {coverImage && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-[#ECECE8] bg-[#F5F5F0] aspect-21/9 max-h-48">
              <img
                src={coverImage}
                alt="Story cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = COVER_PRESETS[0].url;
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Editor Main Canvas & Toolbar */}
      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        {/* Editor Toolbar */}
        <div className="p-3 border-b border-[#ECECE8] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F5]">
          {/* Markdown Formatting Controls */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Bold (**text**)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Italic (*text*)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-[#E5E7EB] mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown('## ')}
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Heading 2 (## Heading)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('### ')}
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Heading 3 (### Subheading)"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-[#E5E7EB] mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown('> ')}
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Blockquote (> Quote)"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('- ')}
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Bullet list (- Item)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('`', '`')}
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Inline Code (`code`)"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('[Link Title](', ')') }
              className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
              title="Link ([title](url))"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Switcher: Write / Preview / Split */}
          <div className="flex items-center border border-[#ECECE8] rounded-lg bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                viewMode === 'write'
                  ? 'bg-[#121212] text-white shadow-2xs'
                  : 'text-[#525252] hover:text-[#121212]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                viewMode === 'preview'
                  ? 'bg-[#121212] text-white shadow-2xs'
                  : 'text-[#525252] hover:text-[#121212]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                viewMode === 'split'
                  ? 'bg-[#121212] text-white shadow-2xs'
                  : 'text-[#525252] hover:text-[#121212]'
              }`}
              title="Split View (Side by Side)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div
          className={`grid min-h-[480px] ${
            viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#ECECE8]' : 'grid-cols-1'
          }`}
        >
          {/* Write Textarea Mode */}
          {(viewMode === 'write' || viewMode === 'split') && (
            <div className="p-4 sm:p-6 flex flex-col h-full">
              <label htmlFor="markdown-editor" className="sr-only">Markdown Body Content</label>
              <textarea
                ref={textareaRef}
                id="markdown-editor"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Compose your article in Markdown..."
                className="w-full flex-1 font-mono text-xs sm:text-sm text-[#121212] outline-hidden resize-none leading-relaxed min-h-[420px]"
              />
              {errors.content && (
                <p className="mt-2 text-xs text-red-600" role="alert">{errors.content}</p>
              )}
            </div>
          )}

          {/* Live Preview Mode */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="p-6 sm:p-8 overflow-y-auto bg-white max-h-[700px]">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="border-b border-[#ECECE8] pb-4 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#737373]">
                    {category}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#121212] mt-1">
                    {title || 'Untitled Essay'}
                  </h1>
                  {excerpt && (
                    <p className="text-sm text-[#666666] italic mt-2">
                      {excerpt}
                    </p>
                  )}
                </div>

                {/* Rendered Markdown Elements */}
                <div className="prose prose-neutral max-w-none">
                  {renderMarkdownPreview()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const { id } = useParams();
  return <EditorContent key={id || 'new'} id={id} />;
}
