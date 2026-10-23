import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Link as LinkIcon,
  Quote,
  Code,
  List,
  ListOrdered,
  Image as ImageIcon,
  Check,
  ChevronLeft,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import { MOCK_CATEGORIES } from '../../data/mockData.js';

export default function EditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState(
    isEditing ? 'The Future of Web Development' : ''
  );
  const [slug, setSlug] = useState(
    isEditing ? 'the-future-of-web-development' : ''
  );
  const [content, setContent] = useState(
    isEditing
      ? `Web development is constantly evolving, with new technologies and frameworks emerging every year. In this post, we explore the key trends and tools that are shaping the future of the web.`
      : ''
  );
  const [status, setStatus] = useState(isEditing ? 'Published' : 'Draft');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState(['Web Development', 'JavaScript', 'React']);
  const [newTag, setNewTag] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAction = (type) => {
    setFeedbackMessage(
      type === 'publish'
        ? 'Story published successfully!'
        : 'Draft saved successfully.'
    );
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Editor Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECECE8]">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/posts"
            className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded-md"
            title="Back to Posts"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-medium text-[#121212]">
              {isEditing ? 'Edit Story' : 'Create New Post'}
            </h1>
            <p className="text-xs text-[#737373]">
              Drafting in InkSpace Editorial Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feedbackMessage && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              {feedbackMessage}
            </span>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleAction('draft')}
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleAction('publish')}
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Editor Workspace: Left Writing Canvas + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Left Editor Form */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-[#ECECE8] shadow-2xs space-y-6">
          {/* Post Title */}
          <div>
            <label htmlFor="post-title" className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-2">
              Title
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter your article headline..."
              className="w-full font-serif text-2xl sm:text-3xl text-[#121212] font-medium placeholder:text-[#A3A3A3] border-b border-[#ECECE8] pb-3 focus:border-[#121212] outline-hidden transition-colors"
            />
          </div>

          {/* Post Slug */}
          <div>
            <label htmlFor="post-slug" className="block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
              URL Slug
            </label>
            <div className="flex items-center text-xs text-[#737373] bg-[#FAF9F5] px-3 py-2 rounded-md border border-[#ECECE8]">
              <span className="text-[#A3A3A3] select-none">inkspace.dev/blog/</span>
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-url-slug"
                className="flex-1 bg-transparent border-0 text-[#121212] font-medium outline-hidden ml-0.5"
              />
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-[#FAF9F5] border border-[#ECECE8] rounded-lg">
            {[
              { icon: Bold, label: 'Bold' },
              { icon: Italic, label: 'Italic' },
              { icon: Underline, label: 'Underline' },
              { icon: Heading2, label: 'Heading' },
              { icon: LinkIcon, label: 'Insert Link' },
              { icon: Quote, label: 'Blockquote' },
              { icon: Code, label: 'Code' },
              { icon: List, label: 'Bullet List' },
              { icon: ListOrdered, label: 'Numbered List' },
              { icon: ImageIcon, label: 'Embed Image' },
            ].map((btn, idx) => {
              const Icon = btn.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  title={btn.label}
                  aria-label={btn.label}
                  className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-white rounded transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Article Writing Area */}
          <div>
            <label htmlFor="post-content" className="sr-only">Article Content</label>
            <textarea
              id="post-content"
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story here... Markdown and clean typography supported."
              className="w-full text-base text-[#262626] leading-relaxed placeholder:text-[#A3A3A3] border-0 outline-hidden resize-y min-h-[350px] font-sans"
            />
          </div>
        </div>

        {/* Right Document Settings Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#ECECE8] shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#ECECE8] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#121212]">
              Document Settings
            </span>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="post-status" className="block text-xs font-semibold text-[#525252] mb-1.5">
              Status
            </label>
            <select
              id="post-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-xs bg-[#FAF9F5] border border-[#ECECE8] rounded-md px-3 py-2 text-[#121212] outline-hidden focus:border-[#121212]"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="post-category" className="block text-xs font-semibold text-[#525252] mb-1.5">
              Category
            </label>
            <select
              id="post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs bg-[#FAF9F5] border border-[#ECECE8] rounded-md px-3 py-2 text-[#121212] outline-hidden focus:border-[#121212]"
            >
              {MOCK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#525252] mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#F4F4F5] text-[#3F3F46] px-2.5 py-1 rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="+ Add tag"
                className="flex-1 text-xs px-2.5 py-1.5 border border-[#ECECE8] rounded-md outline-hidden focus:border-[#121212]"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 text-xs font-medium bg-[#FAF9F5] border border-[#ECECE8] hover:bg-[#F0F0ED] rounded-md cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-xs font-semibold text-[#525252] mb-2">
              Featured Image
            </label>
            <div className="rounded-lg overflow-hidden border border-[#ECECE8] bg-[#FAF9F5] mb-2">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80"
                alt="Post Preview"
                className="w-full aspect-16/10 object-cover"
              />
            </div>
            <button
              type="button"
              className="w-full py-1.5 text-xs font-medium border border-[#ECECE8] rounded-md hover:bg-[#FAF9F5] text-[#4A4A4A] cursor-pointer"
            >
              Change Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
