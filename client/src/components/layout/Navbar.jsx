import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, PenLine, Menu, X } from 'lucide-react';
import Container from '../common/Container.jsx';
import Button from '../common/Button.jsx';
import IconButton from '../common/IconButton.jsx';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Categories', path: '/categories/technology' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#ECECE8] transition-colors">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif font-bold text-2xl sm:text-2xl tracking-tight text-[#121212] hover:opacity-80 transition-opacity"
          >
            InkSpace
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A4A4A]">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors hover:text-[#121212] ${
                    isActive ? 'text-[#121212] font-semibold' : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <IconButton
              icon={Search}
              label="Search articles"
              to="/explore"
              variant="ghost"
              size="md"
            />

            <Button
              to="/dashboard/editor"
              variant="primary"
              size="sm"
              rounded="full"
              icon={PenLine}
              className="px-4 py-1.5"
            >
              Write
            </Button>

            <Link
              to="/login"
              className="text-xs font-semibold text-[#4A4A4A] hover:text-[#121212] ml-1 px-2.5 py-1.5 rounded-md hover:bg-black/5 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <IconButton
              icon={Search}
              label="Search"
              to="/explore"
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

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#ECECE8] py-4 space-y-3 bg-[#FAFAF8]">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-black/5 text-[#121212] font-semibold'
                        : 'text-[#4A4A4A] hover:text-[#121212] hover:bg-black/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="pt-3 border-t border-[#ECECE8] flex flex-col gap-2">
              <Button
                to="/dashboard/editor"
                variant="primary"
                size="md"
                rounded="full"
                icon={PenLine}
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Write an Article
              </Button>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#4A4A4A] hover:text-[#121212] px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#737373] hover:text-[#121212] px-2 py-1"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
