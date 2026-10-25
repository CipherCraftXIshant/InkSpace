import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Public Pages
import HomePage from '../pages/public/HomePage.jsx';
import ExplorePage from '../pages/public/ExplorePage.jsx';
import CategoryPage from '../pages/public/CategoryPage.jsx';
import BlogDetailPage from '../pages/public/BlogDetailPage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import ContactPage from '../pages/public/ContactPage.jsx';
import SignInPage from '../pages/public/SignInPage.jsx';
import SignUpPage from '../pages/public/SignUpPage.jsx';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage.jsx';

// Author Dashboard Pages
import DashboardOverviewPage from '../pages/author/DashboardOverviewPage.jsx';
import DashboardPostsPage from '../pages/author/DashboardPostsPage.jsx';
import EditorPage from '../pages/author/EditorPage.jsx';
import BookmarksPage from '../pages/author/BookmarksPage.jsx';
import SettingsPage from '../pages/author/SettingsPage.jsx';

// Admin Pages
import AdminOverviewPage from '../pages/admin/AdminOverviewPage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import AdminPostsPage from '../pages/admin/AdminPostsPage.jsx';
import AdminCommentsPage from '../pages/admin/AdminCommentsPage.jsx';

import ProtectedRoute from '../components/common/ProtectedRoute.jsx';

// Not Found
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 2. Author Dashboard Routes (Protected: must register/login first to write or view dashboard) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="posts" element={<DashboardPostsPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 3. Admin Routes (Protected: requires admin credentials) */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
