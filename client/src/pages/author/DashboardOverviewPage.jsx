import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  ArrowUpRight,
  Eye,
  Heart,
  FileText,
  Clock,
  Sparkles,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import {
  getAuthorPosts,
  getAuthorStats,
  getMockAuthUser,
} from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function DashboardOverviewPage() {
  useDocumentTitle('Author Workspace');
  const currentUser = getMockAuthUser() || { name: 'Alex Morgan' };
  const authorPosts = getAuthorPosts();
  const stats = getAuthorStats();
  const recentPosts = authorPosts.slice(0, 5);

  const statCards = [
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      subtext: `${stats.publishedPosts} published · ${stats.draftsCount} drafts`,
      change: '+14%',
    },
    {
      label: 'Published Stories',
      value: stats.publishedPosts,
      icon: CheckCircle2,
      subtext: 'Active on public site',
      change: '+8%',
    },
    {
      label: 'Drafts in Progress',
      value: stats.draftsCount,
      icon: Clock,
      subtext: `${stats.scheduledCount} scheduled`,
      change: 'Active',
    },
    {
      label: 'Total Readers & Views',
      value: stats.totalViews,
      icon: Eye,
      subtext: `${stats.totalLikes} story appreciations`,
      change: '+28%',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ECECE8]">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-1">
            EDITORIAL WORKSPACE
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#121212] tracking-tight">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Here is your publication performance, publishing pipeline, and audience engagement overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            to="/dashboard/editor"
            variant="primary"
            size="md"
            icon={Plus}
            className="self-start sm:self-auto"
          >
            Create New Story
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-white rounded-xl border border-[#ECECE8] shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-[#737373] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#ECECE8] flex items-center justify-center text-[#121212]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="font-serif text-3xl font-semibold text-[#121212]">
                  {stat.value}
                </span>
                <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {stat.change}
                </span>
              </div>

              <p className="text-[11px] text-[#8A8A8A] mt-2 font-normal">
                {stat.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#ECECE8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#121212]">
              Recent Articles & Working Drafts
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Your latest writing and editorial revisions.
            </p>
          </div>

          <Link
            to="/dashboard/posts"
            className="text-xs font-semibold text-[#121212] hover:text-[#525252] transition-colors flex items-center gap-1"
          >
            <span>View all stories</span>
            <span>→</span>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Story Title
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Readers
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                  <td className="px-6 py-4 max-w-xs sm:max-w-md">
                    <Link
                      to={`/dashboard/editor/${post.id}`}
                      className="font-serif font-medium text-sm sm:text-base text-[#121212] hover:underline block truncate"
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <p className="text-xs text-[#737373] truncate mt-0.5">
                        {post.excerpt}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-[#525252] bg-[#F4F4F5] px-2.5 py-1 rounded-md">
                      {post.category || 'General'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.status === 'Published' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Published</span>
                      </span>
                    )}
                    {post.status === 'Draft' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Draft</span>
                      </span>
                    )}
                    {post.status === 'Scheduled' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                        <Calendar className="w-3 h-3 text-sky-600" />
                        <span>Scheduled</span>
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3 text-xs text-[#525252]">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        {post.views ? post.views.toLocaleString() : '—'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        {post.likes ? post.likes : '—'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#737373]">
                    {post.updatedAt || post.publishedAt || 'Recently'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dashboard/editor/${post.id}`}
                        className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-black/5 rounded-md transition-colors"
                        title="Edit post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      {post.status === 'Published' && (
                        <Link
                          to={`/blog/${post.slug}`}
                          className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-black/5 rounded-md transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editorial Writing Insights Box */}
      <div className="p-6 bg-[#FAF9F5] rounded-xl border border-[#ECECE8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-[#121212]">
              InkSpace Editorial Best Practice
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed max-w-2xl mt-0.5">
              Articles with structured heading levels, clear pullquotes, and 5-8 minute reading times receive 42% higher reader completion rates. Use the built-in live preview to review formatting before publishing.
            </p>
          </div>
        </div>

        <Button to="/dashboard/editor" variant="secondary" size="sm" className="shrink-0 bg-white">
          Draft a New Story
        </Button>
      </div>
    </div>
  );
}
