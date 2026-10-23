import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import CategoryCard from '../../components/blog/CategoryCard.jsx';
import { MOCK_CATEGORIES, MOCK_ARTICLES } from '../../data/mockData.js';

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featuredMain = MOCK_ARTICLES[0];
  const featuredSide = MOCK_ARTICLES.slice(1, 4);
  const popularArticles = MOCK_ARTICLES.slice(4, 8);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* 1. Hero Section */}
      <section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#525252]">
                MODERN PUBLISHING
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#121212] font-semibold leading-[1.08] tracking-tight">
                Ideas Worth <br className="hidden sm:inline" /> Reading.
              </h1>

              <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-lg">
                InkSpace is a modern blog platform for curious minds. Explore
                stories on tech, design, life and more from writers around the
                world.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button to="/explore" variant="primary" size="lg" rounded="md">
                  Explore Articles
                </Button>
                <Button to="/dashboard/editor" variant="secondary" size="lg" rounded="md">
                  Start Writing
                </Button>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#ECECE8] bg-[#F5F5F0] shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                  alt="Minimalist workspace with lamp, laptop and notebook"
                  className="w-full aspect-4/3 sm:aspect-16/10 object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Category Ribbon */}
      <section>
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {MOCK_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Main Featured Article */}
            <div className="lg:col-span-7">
              <BlogCard article={featuredMain} variant="featured" />
            </div>

            {/* Right Stack of 3 Compact Articles */}
            <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-[#ECECE8]">
              {featuredSide.map((art) => (
                <BlogCard key={art.id} article={art} variant="compact" />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Newsletter Banner (Stay Inspired) */}
      <section>
        <Container>
          <div className="bg-[#121212] text-white rounded-2xl px-6 py-10 sm:p-12 lg:p-16 relative overflow-hidden shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-2">
                <h3 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
                  Stay inspired.
                </h3>
                <p className="text-sm sm:text-base text-[#A3A3A3] font-normal leading-relaxed">
                  Get fresh stories and insights delivered straight to your inbox.
                </p>
              </div>

              <div className="lg:col-span-6">
                {subscribed ? (
                  <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg text-sm text-[#E5E7EB]">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Thank you for subscribing! Check your inbox soon.</span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-2.5 sm:gap-2"
                  >
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 text-sm text-[#121212] bg-[#FAFAF8] rounded-md border-0 focus:ring-2 focus:ring-white outline-hidden placeholder:text-[#8A8A8A]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 text-sm font-semibold text-[#121212] bg-white hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer select-none shrink-0"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {popularArticles.map((art) => (
              <BlogCard key={art.id} article={art} variant="vertical" />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
