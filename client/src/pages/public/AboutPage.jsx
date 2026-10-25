import React from 'react';
import { PenLine, Compass, Sparkles, Feather, ShieldCheck } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';

export default function AboutPage() {
  const values = [
    {
      icon: Feather,
      title: 'Craft Over Clickbait',
      description:
        'We reject sensationalist headlines and algorithmic manipulation. Every essay is curated for intellectual rigor and thoughtful perspective.',
    },
    {
      icon: Compass,
      title: 'Respect for Reader Attention',
      description:
        'Reading should be a restorative analog experience. We design calm typography, zero invasive ads, and clean white space that lets ideas breathe.',
    },
    {
      icon: ShieldCheck,
      title: 'Open Editorial Integrity',
      description:
        'Authentic voices from architecture, software engineering, philosophy, and design share battle-tested lessons without corporate filters.',
    },
  ];

  const editors = [
    {
      name: 'Alex Morgan',
      role: 'Staff Systems Architect & Columnist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Writing at the intersection of modern edge runtimes, compiler design, and software craftsmanship.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Principal Design Strategist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      bio: 'Pioneering quiet UI systems, editorial typography, and human-first spatial design.',
    },
    {
      name: 'Elena Rostova',
      role: 'Editorial Director',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      bio: 'Investigating independent publishing, slow commerce, and essays on intentional living.',
    },
  ];

  return (
    <div className="py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. Hero */}
      <section>
        <Container size="narrow" className="text-center">
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-3">
            ABOUT INKSPACE
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#121212] font-semibold tracking-tight leading-[1.1] mb-6">
            The Craft of Deliberate Publishing.
          </h1>
          <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            InkSpace was conceived as an antidote to the frantic velocity of modern social web feeds.
            A calm sanctuary where independent thinkers, engineers, and designers publish ideas worth reading.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/explore" variant="primary" size="lg">
              Explore Stories
            </Button>
            <Button to="/contact" variant="secondary" size="lg">
              Get in Touch
            </Button>
          </div>
        </Container>
      </section>

      {/* 2. Visual Editorial Divider */}
      <section>
        <Container>
          <div className="rounded-2xl overflow-hidden border border-[#ECECE8] bg-[#F5F5F0] aspect-21/9 sm:aspect-3/1">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80"
              alt="Editorial workspace desk with typewriter and book"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Container>
      </section>

      {/* 3. Principles & Manifesto */}
      <section>
        <Container>
          <SectionHeading
            eyebrow="OUR PHILOSOPHY"
            title="Principles That Guide Every Story"
            description="We believe typography, negative space, and intellectual honesty can transform how knowledge is shared online."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 bg-white rounded-xl border border-[#ECECE8] shadow-2xs hover:shadow-xs transition-shadow space-y-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF9F5] flex items-center justify-center text-[#121212] border border-[#E8E8E4]">
                    <Icon className="w-5 h-5 stroke-[1.6]" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#121212]">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Editorial Masthead / Team */}
      <section>
        <Container>
          <SectionHeading
            eyebrow="THE MASTHEAD"
            title="Writers & Editors"
            description="Curated by an independent guild of designers, architects, and essayists."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {editors.map((ed, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#ECECE8] flex flex-col items-center text-center shadow-2xs"
              >
                <img
                  src={ed.avatar}
                  alt={ed.name}
                  className="w-20 h-20 rounded-full object-cover border border-[#ECECE8] mb-4"
                />
                <h4 className="font-serif text-lg font-medium text-[#121212]">
                  {ed.name}
                </h4>
                <p className="text-xs text-[#737373] font-medium mb-3">
                  {ed.role}
                </p>
                <p className="text-xs text-[#666666] leading-relaxed">
                  {ed.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Start Writing CTA */}
      <section>
        <Container>
          <div className="bg-[#121212] text-white rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-3" />
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-3">
              Write for InkSpace
            </h3>
            <p className="text-sm sm:text-base text-[#A3A3A3] max-w-lg mx-auto mb-6 leading-relaxed">
              Have an essay, technical dissection, or cultural critique? Our editorial doors are open to curious contributors.
            </p>
            <Button
              to="/dashboard/editor"
              variant="secondary"
              size="lg"
              icon={PenLine}
              className="bg-white text-[#121212] hover:bg-neutral-100"
            >
              Start Writing a Story
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
