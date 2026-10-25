import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function ContactPage() {
  useDocumentTitle('Contact & Editorial Submissions');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Editorial Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-10 sm:py-16">
      <Container size="default">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] dark:text-[#A1A1AA] mb-2">
            CONTACT & SUBMISSIONS
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#121212] dark:text-[#F4F4F6] font-semibold tracking-tight mb-4">
            Get in Touch with InkSpace.
          </h1>
          <p className="text-base text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
            Have a question about our publication, interested in submitting a story, or looking to partner? Send our editorial desk a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#18181B] p-6 sm:p-8 rounded-2xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#121212] dark:text-[#F4F4F6]">
                  Message Dispatched
                </h3>
                <p className="text-sm text-[#666666] dark:text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#121212] dark:text-white">{name}</strong>. Our editorial desk has received your note and will review it shortly.
                </p>
                <div className="pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                  >
                    Send Another Note
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Your Name"
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FormInput
                    label="Email Address"
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] mb-1.5">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-md px-3 py-2.5 text-[#121212] dark:text-[#F4F4F6] outline-hidden focus:border-[#121212] dark:focus:border-white focus:ring-1 focus:ring-[#121212] dark:focus:ring-white"
                  >
                    <option value="Editorial Inquiry">Editorial & Pitching</option>
                    <option value="Feedback">Feedback on an Article</option>
                    <option value="Partnership">Partnership & Syndication</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, article proposal, or comments here..."
                    className="w-full text-xs sm:text-sm bg-white dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-md p-3 text-[#121212] dark:text-[#F4F4F6] placeholder:text-[#9CA3AF] dark:placeholder:text-[#71717A] outline-hidden focus:border-[#121212] dark:focus:border-white focus:ring-1 focus:ring-[#121212] dark:focus:ring-white resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Send}
                  isLoading={isLoading}
                  className="w-full sm:w-auto"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF9F5] dark:bg-[#18181B] p-6 sm:p-8 rounded-2xl border border-[#ECECE8] dark:border-[#27272A] space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#121212] dark:text-[#F4F4F6]">
                Editorial Desk
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
                We review writer pitches on a rolling weekly basis. Please include a brief outline and a link to prior published writing.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#525252] dark:text-[#A1A1AA]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#121212] dark:text-[#F4F4F6] shrink-0" />
                  <span>editor@inkspace.dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#121212] dark:text-[#F4F4F6] shrink-0" />
                  <span>San Francisco, CA & London, UK</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-[#121212] dark:text-[#F4F4F6] shrink-0" />
                  <span>Response time: ~2 business days</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-[#18181B] rounded-2xl border border-[#ECECE8] dark:border-[#27272A]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121212] dark:text-[#F4F4F6] mb-2">
                Submissions Guidelines
              </h4>
              <ul className="text-xs text-[#737373] dark:text-[#A1A1AA] space-y-1.5 list-disc list-inside">
                <li>Essays typically range between 1,000 to 2,500 words.</li>
                <li>Original perspective grounded in real practice.</li>
                <li>Clear citations and respect for copyright.</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
