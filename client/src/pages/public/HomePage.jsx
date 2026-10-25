import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import CategoryCard from '../../components/blog/CategoryCard.jsx';
import { MOCK_CATEGORIES, MOCK_ARTICLES } from '../../data/mockData.js';
import { useAuth } from '../../context/AuthContext.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function HomePage() {
  useDocumentTitle('Ideas Worth Reading');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const prefersReducedMotion = useReducedMotion();
  const { isAuthenticated } = useAuth();

  const featuredMain = MOCK_ARTICLES[0];
  const featuredSide = MOCK_ARTICLES.slice(1, 4);
  const popularArticles = MOCK_ARTICLES.filter((a) => a.popular || a.views > 2000).slice(0, 4);

  // Require user to register/login before writing blogs
  const writeDestination = isAuthenticated
    ? '/dashboard/editor'
    : '/signup?redirect=/dashboard/editor&notice=register_required';

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmailError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim()) {
      setEmailError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(newsletterEmail.trim())) {
      setEmailError('Please provide a valid email format (e.g. name@domain.com).');
      return;
    }

    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4500);
  };

  const animProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
      };

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* 1. Hero Section */}
      <section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <motion.div
              {...animProps}
              className="lg:col-span-6 space-y-6"
            >
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#525252] dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-[#ECECE8] dark:border-[#27272A] px-3 py-1 rounded-full shadow-2xs">
                MODERN EDITORIAL PUBLISHING
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#121212] dark:text-[#F4F4F6] font-semibold leading-[1.08] tracking-tight">
                Ideas Worth <br className="hidden sm:inline" /> Reading.
              </h1>

              <p className="text-base sm:text-lg text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-lg font-normal">
                InkSpace is an open editorial platform for curious minds. Explore
                long-form essays on software architecture, design systems, quiet productivity,
                and modern culture from practitioners worldwide.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button to="/explore" variant="primary" size="lg" rounded="md">
                  Explore Articles
                </Button>
                <Button to={writeDestination} variant="secondary" size="lg" rounded="md">
                  Start Writing
                </Button>
              </div>
            </motion.div>

            {/* Hero Right Visual */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#ECECE8] dark:border-[#27272A] bg-[#F5F5F0] dark:bg-[#18181B] shadow-sm group">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                  alt="Minimalist editorial workspace with desk lamp, laptop and notebook"
                  className="w-full aspect-4/3 sm:aspect-16/10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 2. Category Ribbon */}
      <section>
        <Container>
          <motion.div {...animProps} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {MOCK_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </motion.div>
        </Container>
      </section>

      {/* 3. Featured Articles Section */}
      <section>
        <Container>
          <SectionHeading
            title="Featured Articles"
            actionText="View all"
            actionHref="/explore"
          />

          <motion.div
            {...animProps}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          >
            {/* Left Main Featured Article */}
            <div className="lg:col-span-7">
              <BlogCard article={featuredMain} variant="featured" />
            </div>

            {/* Right Stack of Secondary Articles */}
            <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-[#ECECE8] dark:divide-[#27272A]">
              {featuredSide.map((art) => (
                <BlogCard key={art.id} article={art} variant="compact" />
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 4. Newsletter Section (Stay Inspired) */}
      <section>
        <Container>
          <motion.div
            {...animProps}
            className="bg-[#121212] dark:bg-[#18181B] text-white rounded-2xl px-6 py-10 sm:p-12 lg:p-16 relative overflow-hidden shadow-md border border-transparent dark:border-[#27272A]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3]">
                  WEEKLY DISPATCH
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
                  Stay inspired.
                </h3>
                <p className="text-sm sm:text-base text-[#A3A3A3] font-normal leading-relaxed">
                  Get fresh stories, design perspectives, and architectural insights delivered straight to your inbox every Sunday morning. No spam, ever.
                </p>
              </div>

              <div className="lg:col-span-6">
                {subscribed ? (
                  <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl text-sm text-[#E5E7EB] border border-white/20">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Thank you for subscribing! Your first dispatch arrives this Sunday.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} noValidate className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 text-sm text-[#121212] bg-[#FAFAF8] rounded-md border-0 focus:ring-2 focus:ring-white outline-hidden placeholder:text-[#8A8A8A]"
                        aria-label="Email for newsletter"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 text-sm font-semibold text-[#121212] bg-white hover:bg-[#F3F4F6] active:bg-[#E5E7EB] rounded-md transition-colors cursor-pointer select-none shrink-0"
                      >
                        Subscribe
                      </button>
                    </div>
                    {emailError && (
                      <p className="text-xs text-rose-300 flex items-center gap-1.5 pt-1" role="alert">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{emailError}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 5. Popular Articles Grid */}
      <section>
        <Container>
          <SectionHeading
            title="Popular Articles"
            actionText="View all"
            actionHref="/explore"
          />

          <motion.div
            {...animProps}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {popularArticles.map((art) => (
              <BlogCard key={art.id} article={art} variant="vertical" />
            ))}
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
