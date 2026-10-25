import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  Share2,
  Clock,
  Eye,
  ChevronRight,
  Check,
  MessageCircle,
  Send,
  User,
} from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import Button from '../../components/common/Button.jsx';
import CategoryBadge from '../../components/common/CategoryBadge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import { MOCK_ARTICLES } from '../../data/mockData.js';
import {
  toggleLike,
  isLiked,
  toggleBookmark,
  isBookmarked,
  getArticleComments,
  addArticleComment,
} from '../../utils/storage.js';
import { useAuth } from '../../context/AuthContext.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

function BlogDetailContent({ slug }) {
  const { currentUser } = useAuth();
  const article = MOCK_ARTICLES.find(
    (a) => a.slug.toLowerCase() === slug?.toLowerCase()
  );

  useDocumentTitle(article ? article.title : 'Story Not Found');

  // Reading progress state (0% to 100%)
  const [readingProgress, setReadingProgress] = useState(0);

  // Local interactive state initialized directly from article & storage
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState('');
  const [liked, setLiked] = useState(() => (article ? isLiked(article.id) : false));
  const [likeCount, setLikeCount] = useState(() => (article ? (article.likes || 0) : 0));
  const [bookmarked, setBookmarked] = useState(() => (article ? isBookmarked(article.id) : false));

  // Comments state
  const [comments, setComments] = useState(() =>
    article ? getArticleComments(article.slug, article.comments || []) : []
  );
  const [commentName, setCommentName] = useState(() => currentUser?.name || '');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Share action: Web Share API with clipboard fallback
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: article.title,
      text: article.subtitle || article.excerpt,
      url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          // fallback to clipboard
        }
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShareToast('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setShareToast('');
      }, 2500);
    } catch {
      setShareToast('Could not copy link automatically.');
      setTimeout(() => setShareToast(''), 2500);
    }
  };

  // Like button handler
  const handleToggleLike = () => {
    if (!article) return;
    const res = toggleLike(article.id, article.likes || 0);
    setLiked(res.liked);
    setLikeCount(res.count);
  };

  // Bookmark button handler
  const handleToggleBookmark = () => {
    if (!article) return;
    const res = toggleBookmark(article.id);
    setBookmarked(res.bookmarked);
  };

  // Smooth scroll to table of contents anchor
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Handle comment submit
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentError('');

    if (!commentName.trim()) {
      setCommentError('Please enter your name.');
      return;
    }
    if (!commentText.trim()) {
      setCommentError('Please write a comment message.');
      return;
    }

    const newComment = {
      id: `c-${Date.now()}`,
      author: commentName.trim(),
      content: commentText.trim(),
      date: 'Just now',
      avatar: currentUser?.avatar || undefined,
    };

    const updated = addArticleComment(article.slug, newComment);
    setComments(updated);
    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  // Scroll listener for reading progress bar
  useEffect(() => {
    const calculateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, scrolled)));
      }
    };

    window.addEventListener('scroll', calculateProgress, { passive: true });
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  if (!article) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Story Not Found"
          description={`The article "${slug}" could not be located in our publication library. It may have been relocated.`}
          actionText="Back to Explore"
          actionTo="/explore"
        />
      </Container>
    );
  }

  // Related articles: same category or other featured
  const fallbackRelated = MOCK_ARTICLES.filter(
    (a) => a.id !== article.id && a.categorySlug === article.categorySlug
  ).slice(0, 3);

  return (
    <>
      {/* Sticky Reading Progress Indicator */}
      {readingProgress > 0 && (
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-black/5 dark:bg-white/10 pointer-events-none">
          <div
            className="h-full bg-[#121212] dark:bg-white transition-all duration-75"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Toast Notification */}
      {shareToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121212] dark:bg-white text-white dark:text-[#121212] text-xs font-medium px-4 py-2.5 rounded-full shadow-lg border border-white/20 dark:border-black/20 animate-in fade-in duration-200"
        >
          {shareToast}
        </div>
      )}

      <article className="py-8 sm:py-12">
        <Container size="default">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#737373] dark:text-[#A1A1AA] mb-6 overflow-x-auto whitespace-nowrap"
          >
            <Link to="/" className="hover:text-[#121212] dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#A3A3A3] dark:text-[#71717A]" />
            <Link
              to={`/categories/${article.categorySlug}`}
              className="hover:text-[#121212] dark:hover:text-white transition-colors"
            >
              {article.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#A3A3A3] dark:text-[#71717A]" />
            <span className="text-[#121212] dark:text-[#F4F4F6] font-medium truncate max-w-xs sm:max-w-md">
              {article.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="max-w-4xl mb-10">
            <div className="mb-3">
              <CategoryBadge slug={article.categorySlug} variant="outline">
                {article.category}
              </CategoryBadge>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121212] dark:text-[#F4F4F6] font-semibold tracking-tight leading-[1.12] mb-4">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-base sm:text-xl text-[#666666] dark:text-[#A1A1AA] leading-relaxed mb-6 font-normal">
                {article.subtitle}
              </p>
            )}

            {/* Author Details & Interactive Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#ECECE8] dark:border-[#27272A]">
              <div className="flex items-center gap-3">
                <img
                  src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={article.author?.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#ECECE8] dark:border-[#27272A]"
                />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#121212] dark:text-[#F4F4F6]">
                    By {article.author?.name}
                  </p>
                  <p className="text-xs text-[#8A8A8A] dark:text-[#71717A] flex items-center gap-2">
                    <span>{article.publishedAt || article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readingTime || article.readTime}
                    </span>
                    {article.views && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views.toLocaleString()} views
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Like, Bookmark, Share */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer select-none ${
                    liked
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#525252] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]'
                  }`}
                  aria-label={liked ? 'Unlike story' : 'Like story'}
                  title="Like story"
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-rose-600 dark:text-rose-400' : ''}`} />
                  <span>{likeCount}</span>
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-full border transition-colors cursor-pointer select-none ${
                    bookmarked
                      ? 'bg-[#121212] dark:bg-white text-white dark:text-[#121212] border-black dark:border-white'
                      : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#525252] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]'
                  }`}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark story'}
                  title={bookmarked ? 'Saved in Bookmarks' : 'Bookmark story'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-medium text-[#525252] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A] transition-colors cursor-pointer"
                  aria-label="Share story"
                  title="Share story"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                  <span>Share</span>
                </button>
              </div>
            </div>
          </header>

          {/* 3-Column Layout: Social Bar, Main Content, TOC/Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Sticky Share Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-28 flex flex-col items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3] dark:text-[#71717A] mb-1">
                  Share
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-full border border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:border-[#121212] dark:hover:border-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A] text-[#525252] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Share story link"
                  title="Share story"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                    liked
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#525252] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-white'
                  }`}
                  aria-label="Like story"
                  title="Like story"
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-rose-600 dark:text-rose-400' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                    bookmarked
                      ? 'bg-[#121212] dark:bg-white text-white dark:text-[#121212] border-black dark:border-white'
                      : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#525252] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-white'
                  }`}
                  aria-label="Bookmark story"
                  title="Bookmark story"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Center Main Article Content */}
            <div className="lg:col-span-7">
              {/* Large Cover Image with Fallback */}
              <div className="rounded-xl overflow-hidden mb-8 border border-[#ECECE8] dark:border-[#27272A] bg-[#F5F5F0] dark:bg-[#18181B] aspect-16/10">
                <img
                  src={article.heroImage || article.coverImage || FALLBACK_HERO}
                  alt={article.title}
                  onError={(e) => {
                    e.target.src = FALLBACK_HERO;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Semantic, Safe Structured Article Content */}
              <div className="space-y-6 text-[#262626] dark:text-[#D4D4D8] text-base sm:text-lg leading-relaxed font-normal">
                {article.sections && article.sections.length > 0 ? (
                  article.sections.map((section, idx) => {
                    if (section.type === 'heading') {
                      return (
                        <h2
                          key={idx}
                          id={section.id}
                          className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] dark:text-[#F4F4F6] pt-6 scroll-mt-24"
                        >
                          {section.text}
                        </h2>
                      );
                    }

                    if (section.type === 'quote') {
                      return (
                        <blockquote
                          key={idx}
                          className="my-8 border-l-2 border-[#121212] dark:border-white pl-6 py-2 italic font-serif text-xl sm:text-2xl text-[#121212] dark:text-[#F4F4F6] bg-[#F9F9F7] dark:bg-[#18181B] rounded-r-lg"
                        >
                          "{section.text}"
                          {section.author && (
                            <cite className="block text-xs font-sans not-italic font-semibold text-[#737373] dark:text-[#A1A1AA] mt-2 uppercase tracking-wider">
                              — {section.author}
                            </cite>
                          )}
                        </blockquote>
                      );
                    }

                    if (section.type === 'list') {
                      return (
                        <ul key={idx} className="space-y-2 pl-6 list-disc list-outside text-sm sm:text-base text-[#404040] dark:text-[#D4D4D8]">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      );
                    }

                    return <p key={idx}>{section.text}</p>;
                  })
                ) : (
                  <p>{article.excerpt}</p>
                )}
              </div>

              {/* Tags Cloud */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-8 mt-10 border-t border-[#ECECE8] dark:border-[#27272A] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3] dark:text-[#71717A] mr-1">
                    Tags:
                  </span>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/explore?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-white dark:bg-[#18181B] border border-[#ECECE8] dark:border-[#27272A] rounded-full text-xs font-medium text-[#525252] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-white hover:text-[#121212] dark:hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Author Bio Box */}
              {article.author && (
                <div className="mt-10 p-6 bg-[#FAF9F5] dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#ECECE8] dark:border-[#27272A] shrink-0"
                  />
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#121212] dark:text-[#F4F4F6]">
                      Written by {article.author.name}
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A1A1AA] font-medium mb-2">
                      {article.author.role}
                    </p>
                    <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed font-normal">
                      {article.author.bio || 'Contributing essayist and reviewer at InkSpace.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Functional Client-Side Comments Section */}
              <section className="mt-14 pt-10 border-t border-[#ECECE8] dark:border-[#27272A]" aria-labelledby="comments-heading">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#121212] dark:text-white" />
                    <h3 id="comments-heading" className="font-serif text-2xl font-medium text-[#121212] dark:text-[#F4F4F6]">
                      Comments ({comments.length})
                    </h3>
                  </div>
                </div>

                {/* Add Comment Form */}
                <form
                  onSubmit={handleCommentSubmit}
                  className="bg-white dark:bg-[#18181B] p-5 sm:p-6 rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs mb-8 space-y-4"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-[#F4F4F6]">
                    Join the Discussion
                  </h4>

                  {commentSuccess && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Your comment has been published to this discussion!</span>
                    </div>
                  )}

                  {commentError && (
                    <p className="text-xs text-rose-600 dark:text-rose-400" role="alert">
                      {commentError}
                    </p>
                  )}

                  <div>
                    <label htmlFor="commenter-name" className="sr-only">
                      Your Name
                    </label>
                    <input
                      id="commenter-name"
                      type="text"
                      required
                      placeholder="Your name or handle..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-[#FAF9F5] dark:bg-[#121214] border border-[#ECECE8] dark:border-[#27272A] rounded-md px-3.5 py-2 text-[#121212] dark:text-[#F4F4F6] outline-hidden focus:bg-white dark:focus:bg-[#18181B] focus:border-[#121212] dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="commenter-text" className="sr-only">
                      Your Comment
                    </label>
                    <textarea
                      id="commenter-text"
                      rows={3}
                      required
                      placeholder="Share your thoughts respectfully..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-[#FAF9F5] dark:bg-[#121214] border border-[#ECECE8] dark:border-[#27272A] rounded-md p-3.5 text-[#121212] dark:text-[#F4F4F6] outline-hidden focus:bg-white dark:focus:bg-[#18181B] focus:border-[#121212] dark:focus:border-white resize-y"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm" icon={Send}>
                      Post Comment
                    </Button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 sm:p-5 bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            {c.avatar ? (
                              <img
                                src={c.avatar}
                                alt={c.author}
                                className="w-6 h-6 rounded-full object-cover border border-[#ECECE8] dark:border-[#27272A]"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#FAF9F5] dark:bg-[#27272A] border border-[#ECECE8] dark:border-[#3F3F46] flex items-center justify-center text-[#737373] dark:text-[#A1A1AA]">
                                <User className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <span className="font-semibold text-[#121212] dark:text-[#F4F4F6]">
                              {c.author}
                            </span>
                          </div>
                          <span className="text-[#8A8A8A] dark:text-[#71717A]">{c.date}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D4D4D8] leading-relaxed pl-8">
                          {c.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#8A8A8A] dark:text-[#71717A] text-center py-6">
                      No comments yet. Be the first to share an insight!
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Sticky Sidebar: TOC & Related Articles */}
            <div className="lg:col-span-4 space-y-10">
              {/* Table of Contents */}
              {article.tableOfContents && article.tableOfContents.length > 0 && (
                <div className="p-6 bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs sticky top-28">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#121212] dark:text-[#F4F4F6] mb-4">
                    Table of Contents
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#525252] dark:text-[#A1A1AA]">
                    {article.tableOfContents.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => handleScrollToSection(e, item.id)}
                          className="hover:text-[#121212] dark:hover:text-white transition-colors block leading-snug py-0.5 hover:underline"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Articles */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#121212] dark:text-[#F4F4F6] mb-4">
                  Related Stories
                </h3>
                <div className="space-y-4">
                  {fallbackRelated.map((rel) => (
                    <BlogCard key={rel.id} article={rel} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  return <BlogDetailContent key={slug} slug={slug} />;
}
