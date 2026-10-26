import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  PenLine,
  Menu,
  X,
  ChevronDown,
  Laptop,
  Palette,
  Coffee,
  Briefcase,
  Compass,
  BookOpen,
} from 'lucide-react';
import Container from '../common/Container.jsx';
import Button from '../common/Button.jsx';
import IconButton from '../common/IconButton.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';
import { MOCK_CATEGORIES, MOCK_ARTICLES } from '../../data/mockData.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CATEGORY_ICONS = {
  technology: Laptop,
  design: Palette,
  lifestyle: Coffee,
  business: Briefcase,
  travel: Compass,
  culture: BookOpen,
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const categoriesRef = useRef(null);
  const pagesRef = useRef(null);
  const categoriesTimeoutRef = useRef(null);
  const pagesTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser, isAuthenticated, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setCategoriesOpen(false);
    setPagesOpen(false);
  }

  // Hover handlers for Categories
  const handleCategoriesEnter = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    if (pagesTimeoutRef.current) clearTimeout(pagesTimeoutRef.current);
    setPagesOpen(false);
    setCategoriesOpen(true);
  };

  const handleCategoriesLeave = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    categoriesTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 180);
  };

  // Hover handlers for Pages
  const handlePagesEnter = () => {
    if (pagesTimeoutRef.current) clearTimeout(pagesTimeoutRef.current);
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    setCategoriesOpen(false);
    setPagesOpen(true);
  };

  const handlePagesLeave = () => {
    if (pagesTimeoutRef.current) clearTimeout(pagesTimeoutRef.current);
    pagesTimeoutRef.current = setTimeout(() => {
      setPagesOpen(false);
    }, 180);
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
      if (pagesTimeoutRef.current) clearTimeout(pagesTimeoutRef.current);
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (pagesRef.current && !pagesRef.current.contains(event.target)) {
        setPagesOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setCategoriesOpen(false);
        setPagesOpen(false);
        setSearchModalOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchModalOpen]);

  const searchResults = searchQuery.trim()
    ? MOCK_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchResultClick = (slug) => {
    setSearchModalOpen(false);
    setSearchQuery('');
    navigate(`/blog/${slug}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Write button destination: directly to editor if registered/authenticated, or to registration if guest
  const writeDestination = isAuthenticated
    ? '/dashboard/editor'
    : '/signup?redirect=/dashboard/editor&notice=register_required';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 dark:bg-[#0C0C0E]/95 backdrop-blur-md border-b border-[#ECECE8] dark:border-[#27272A] transition-colors">
        <Container>
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Wordmark Logo */}
            <Link
              to="/"
              className="font-serif font-bold text-2xl sm:text-2xl tracking-tight text-[#121212] dark:text-[#F4F4F6] hover:opacity-80 transition-opacity select-none"
            >
              InkSpace
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A4A4A] dark:text-[#A1A1AA]">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors hover:text-[#121212] dark:hover:text-white ${
                    isActive ? 'text-[#121212] dark:text-white font-semibold' : ''
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `transition-colors hover:text-[#121212] dark:hover:text-white ${
                    isActive ? 'text-[#121212] dark:text-white font-semibold' : ''
                  }`
                }
              >
                About
              </NavLink>

              {/* Categories Dropdown */}
              <div
                className="relative py-2"
                ref={categoriesRef}
                onMouseEnter={handleCategoriesEnter}
                onMouseLeave={handleCategoriesLeave}
              >
                <button
                  type="button"
                  onClick={() => {
                    setCategoriesOpen((prev) => !prev);
                    setPagesOpen(false);
                  }}
                  aria-expanded={categoriesOpen}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 transition-colors hover:text-[#121212] dark:hover:text-white cursor-pointer ${
                    categoriesOpen ? 'text-[#121212] dark:text-white' : ''
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      categoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {categoriesOpen && (
                  <div
                    onMouseEnter={handleCategoriesEnter}
                    onMouseLeave={handleCategoriesLeave}
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                  >
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#A3A3A3] dark:text-[#71717A] px-3 py-1.5 border-b border-[#F0F0EC] dark:border-[#27272A] mb-1">
                      Topics
                    </div>
                    {MOCK_CATEGORIES.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat.slug] || Laptop;
                      return (
                        <Link
                          key={cat.id}
                          to={`/categories/${cat.slug}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-3.5 h-3.5 text-[#737373] dark:text-[#A1A1AA]" />
                            <span>{cat.name}</span>
                          </div>
                          <span className="text-[10px] text-[#A3A3A3] dark:text-[#71717A]">
                            {cat.count}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pages Dropdown */}
              <div
                className="relative py-2"
                ref={pagesRef}
                onMouseEnter={handlePagesEnter}
                onMouseLeave={handlePagesLeave}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPagesOpen((prev) => !prev);
                    setCategoriesOpen(false);
                  }}
                  aria-expanded={pagesOpen}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 transition-colors hover:text-[#121212] dark:hover:text-white cursor-pointer ${
                    pagesOpen ? 'text-[#121212] dark:text-white' : ''
                  }`}
                >
                  <span>Pages</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      pagesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {pagesOpen && (
                  <div
                    onMouseEnter={handlePagesEnter}
                    onMouseLeave={handlePagesLeave}
                    className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                  >
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#A3A3A3] dark:text-[#71717A] px-3 py-1.5 border-b border-[#F0F0EC] dark:border-[#27272A] mb-1">
                      Public & Portal
                    </div>
                    <Link
                      to="/explore"
                      onClick={() => setPagesOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]"
                    >
                      Explore Articles
                    </Link>
                    <Link
                      to="/blog/the-future-of-web-development"
                      onClick={() => setPagesOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]"
                    >
                      Featured Story
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setPagesOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]"
                    >
                      About Platform
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setPagesOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]"
                    >
                      Contact & Submissions
                    </Link>
                    <div className="my-1 border-t border-[#F0F0EC] dark:border-[#27272A]" />
                    <Link
                      to="/dashboard"
                      onClick={() => setPagesOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]"
                    >
                      Author Workspace
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setPagesOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]"
                    >
                      Admin Console
                    </Link>
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `transition-colors hover:text-[#121212] dark:hover:text-white ${
                    isActive ? 'text-[#121212] dark:text-white font-semibold' : ''
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              <IconButton
                icon={Search}
                label="Search articles"
                onClick={() => setSearchModalOpen(true)}
                variant="ghost"
                size="md"
              />

              {/* Theme Toggle Button */}
              <ThemeToggle size="md" />

              <Button
                to={writeDestination}
                variant="primary"
                size="sm"
                rounded="full"
                icon={PenLine}
                className="px-4 py-1.5 ml-1"
              >
                Write
              </Button>

              {currentUser ? (
                <div className="flex items-center gap-1.5 pl-2 border-l border-[#ECECE8] dark:border-[#27272A]">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                    title={`${currentUser.name} (${currentUser.role})`}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#ECECE8] dark:border-[#27272A]"
                    />
                    <span className="text-xs font-medium text-[#121212] dark:text-[#F4F4F6] hidden md:inline truncate max-w-[90px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-xs text-[#737373] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Sign out of current account"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 pl-1">
                  <Link
                    to="/login"
                    className="text-xs font-medium text-[#4A4A4A] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white px-2.5 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xs font-semibold text-[#121212] dark:text-white px-2.5 py-1.5 rounded-md border border-[#ECECE8] dark:border-[#27272A] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions: Search, ThemeToggle, Menu */}
            <div className="flex sm:hidden items-center gap-1.5">
              <ThemeToggle size="sm" />
              <IconButton
                icon={Search}
                label="Search"
                onClick={() => setSearchModalOpen(true)}
                variant="ghost"
                size="sm"
              />
              <IconButton
                icon={mobileMenuOpen ? X : Menu}
                label="Toggle navigation menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="sm"
              />
            </div>
          </div>

          {/* Mobile Menu Dropdown Drawer */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-[#ECECE8] dark:border-[#27272A] py-4 space-y-4 bg-[#FAFAF8] dark:bg-[#0C0C0E] animate-in fade-in duration-150">
              <div className="flex flex-col space-y-1">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-black/5 dark:bg-white/10 text-[#121212] dark:text-white font-semibold'
                        : 'text-[#4A4A4A] dark:text-[#A1A1AA]'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-black/5 dark:bg-white/10 text-[#121212] dark:text-white font-semibold'
                        : 'text-[#4A4A4A] dark:text-[#A1A1AA]'
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-black/5 dark:bg-white/10 text-[#121212] dark:text-white font-semibold'
                        : 'text-[#4A4A4A] dark:text-[#A1A1AA]'
                    }`
                  }
                >
                  Explore Articles
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-black/5 dark:bg-white/10 text-[#121212] dark:text-white font-semibold'
                        : 'text-[#4A4A4A] dark:text-[#A1A1AA]'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>

              {/* Mobile Categories Grid */}
              <div className="pt-2 border-t border-[#ECECE8] dark:border-[#27272A]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] dark:text-[#71717A] px-3 mb-2">
                  Browse by Topic
                </p>
                <div className="grid grid-cols-2 gap-1.5 px-3">
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-[#18181B] border border-[#ECECE8] dark:border-[#27272A] text-[#4A4A4A] dark:text-[#D4D4D8] truncate"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#ECECE8] dark:border-[#27272A] flex flex-col gap-2 px-3">
                <Button
                  to={writeDestination}
                  variant="primary"
                  size="md"
                  rounded="full"
                  icon={PenLine}
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Write an Article
                </Button>

                {currentUser ? (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-medium text-[#121212] dark:text-white">{currentUser.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-[#737373] dark:text-[#A1A1AA] hover:text-red-500 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-medium text-[#4A4A4A] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-semibold text-[#121212] dark:text-white"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Interactive Quick Search Dialog Modal */}
      {searchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick search modal"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#18181B] rounded-2xl shadow-2xl border border-[#ECECE8] dark:border-[#27272A] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative border-b border-[#ECECE8] dark:border-[#27272A]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#71717A]" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, topic, or keyword..."
                className="w-full pl-12 pr-12 py-4 text-base sm:text-lg text-[#121212] dark:text-[#F4F4F6] placeholder:text-[#9CA3AF] dark:placeholder:text-[#71717A] bg-transparent outline-hidden"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white p-1 rounded"
              >
                ESC
              </button>
            </form>

            {/* Results or Suggestions */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] dark:text-[#71717A] px-2 mb-1">
                    Matching Stories
                  </p>
                  {searchResults.map((art) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => handleSearchResultClick(art.slug)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF9F5] dark:hover:bg-[#27272A] text-left transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 pr-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#737373] dark:text-[#A1A1AA]">
                          {art.category}
                        </span>
                        <h4 className="font-serif text-sm sm:text-base font-medium text-[#121212] dark:text-[#F4F4F6] truncate group-hover:text-black dark:group-hover:text-white">
                          {art.title}
                        </h4>
                      </div>
                      <span className="text-xs text-[#8A8A8A] dark:text-[#71717A] shrink-0">
                        {art.readingTime}
                      </span>
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-8 text-center text-sm text-[#737373] dark:text-[#A1A1AA]">
                  No stories found for "{searchQuery}". Press Enter to search on Explore page.
                </div>
              ) : (
                <div className="space-y-3 p-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] dark:text-[#71717A]">
                    Popular Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSearchModalOpen(false);
                          navigate(`/categories/${c.slug}`);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F5] dark:bg-[#27272A] border border-[#ECECE8] dark:border-[#3F3F46] text-[#4A4A4A] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-white transition-colors cursor-pointer"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
