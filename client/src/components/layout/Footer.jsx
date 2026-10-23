import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {

  return (
    <footer className="bg-[#FAFAF8] border-t border-[#ECECE8] pt-16 pb-12 text-[#4A4A4A]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#ECECE8]">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              className="font-serif font-bold text-2xl tracking-tight text-[#121212] inline-block"
            >
              InkSpace
            </Link>
            <p className="text-sm text-[#737373] max-w-sm leading-relaxed">
              An open editorial publishing platform dedicated to authentic voices,
              craftsmanship, and ideas worth reading. Built for thoughtful writers
              and curious minds.
            </p>
            <div className="pt-2 text-xs text-[#8A8A8A]">
              Designed with timeless typography & modern web standards.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121212]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#121212] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-[#121212] transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/categories/technology" className="hover:text-[#121212] transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/categories/design" className="hover:text-[#121212] transition-colors">
                  Design
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121212]">
              Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-[#121212] transition-colors">
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/editor" className="hover:text-[#121212] transition-colors">
                  Write a Story
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#121212] transition-colors">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#121212] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121212]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#737373]">
              <li>BEE College Capstone Project</li>
              <li>Phase 1: Frontend Foundation</li>
              <li>React 19 & Tailwind CSS v4</li>
              <li>Vite & React Router DOM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8A8A]">
          <p>© {CURRENT_YEAR} InkSpace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/explore" className="hover:text-[#121212] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/explore" className="hover:text-[#121212] transition-colors">
              Terms of Service
            </Link>
            <Link to="/explore" className="hover:text-[#121212] transition-colors">
              Editorial Guidelines
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
