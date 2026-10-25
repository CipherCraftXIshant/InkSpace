import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import {
  getAdminUsers,
  getAdminComments,
  getAdminOverviewStats,
  approveAdminComment,
  deleteAdminComment,
} from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function AdminOverviewPage() {
  useDocumentTitle('Admin Overview');
  const [stats, setStats] = useState(() => getAdminOverviewStats());
  const [users] = useState(() => getAdminUsers().slice(0, 5));
  const [comments, setComments] = useState(() => getAdminComments());
  const [toastMessage, setToastMessage] = useState('');

  // Pending moderation queue: flagged and pending items
  const pendingItems = comments.filter(
    (c) => c.status === 'Flagged' || c.status === 'Pending'
  );

  const handleQuickApproveComment = (id) => {
    const updated = approveAdminComment(id);
    setComments(updated);
    setStats(getAdminOverviewStats());
    setToastMessage('Comment approved and restored to active state.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleQuickDeleteComment = (id) => {
    const updated = deleteAdminComment(id);
    setComments(updated);
    setStats(getAdminOverviewStats());
    setToastMessage('Flagged comment removed.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const statCards = [
    {
      label: 'Registered Members',
      value: stats.totalUsers,
      subtext: `${stats.authorsCount} Authors · ${stats.readersCount} Readers · ${stats.adminsCount} Admins`,
      icon: Users,
      change: '+12%',
      link: '/admin/users',
    },
    {
      label: 'Editorial Stories',
      value: stats.totalPosts,
      subtext: `${stats.featuredPosts} Curated Featured Stories`,
      icon: FileText,
      change: '+6%',
      link: '/admin/posts',
    },
    {
      label: 'Community Discussions',
      value: stats.totalComments,
      subtext: 'Across all active essays',
      icon: MessageSquare,
      change: '+24%',
      link: '/admin/comments',
    },
    {
      label: 'Flagged / Moderation Queue',
      value: stats.pendingReports,
      subtext: stats.pendingReports > 0 ? 'Requires administrator review' : 'Queue is clear',
      icon: AlertTriangle,
      change: stats.pendingReports > 0 ? 'Action Needed' : 'Clean',
      isWarning: stats.pendingReports > 0,
      link: '/admin/comments',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-20 right-6 z-50 bg-[#121212] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ECECE8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              ADMINISTRATION
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#121212] tracking-tight">
            Governance & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Platform health, member permissions, content curations, and community oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/posts"
            className="px-3.5 py-2 text-xs font-medium border border-[#ECECE8] bg-white rounded-lg hover:border-[#121212] text-[#121212] transition-colors"
          >
            Manage Stories
          </Link>
          <Link
            to="/admin/users"
            className="px-3.5 py-2 text-xs font-semibold bg-[#121212] text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            Review Users
          </Link>
        </div>
      </div>

      {/* Mock Security Notice Banner */}
      <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#ECECE8] flex items-start gap-3 text-xs text-[#737373]">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#121212]">Mock Administration Environment:</strong>{' '}
          In accordance with Phase 5 guidelines, this console demonstrates administrative governance and user moderation using local browser storage. No real server access controls or network authentication tokens are executed.
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="p-5 bg-white rounded-xl border border-[#ECECE8] shadow-2xs hover:shadow-xs hover:border-[#121212] transition-all group block"
            >
              <div className="flex items-center justify-between text-[#737373] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider group-hover:text-[#121212] transition-colors">
                  {stat.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                    stat.isWarning
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-[#FAF9F5] border-[#ECECE8] text-[#121212]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="font-serif text-3xl font-semibold text-[#121212]">
                  {stat.value}
                </span>
                <span
                  className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    stat.isWarning
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}
                >
                  {!stat.isWarning && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
              </div>

              <p className="text-[11px] text-[#8A8A8A] mt-2 font-normal">
                {stat.subtext}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Pending Moderation Queue Section */}
      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#ECECE8] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-medium text-[#121212]">
                Moderation Action Queue
              </h2>
              {pendingItems.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                  {pendingItems.length} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-[#737373] mt-0.5">
              Community comments flagged by readers or automated spam heuristics.
            </p>
          </div>

          <Link
            to="/admin/comments"
            className="text-xs font-semibold text-[#121212] hover:text-[#525252] transition-colors"
          >
            View all comments →
          </Link>
        </div>

        {pendingItems.length > 0 ? (
          <div className="divide-y divide-[#ECECE8]">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF9F5]/60 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-semibold text-[#121212]">{item.author}</span>
                    <span className="text-[#A3A3A3]">({item.authorEmail})</span>
                    <span className="text-[#A3A3A3]">•</span>
                    <span className="text-[#737373]">on story:</span>
                    <span className="font-medium text-[#121212]">{item.articleTitle}</span>
                    <span className="text-[#A3A3A3]">•</span>
                    <span className="text-[#8A8A8A]">{item.submittedAt}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {item.status}: {item.flagReason || 'Requires Review'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#333333] leading-relaxed italic bg-[#FAF9F5] p-2.5 rounded-lg border border-[#ECECE8]">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => handleQuickApproveComment(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-colors"
                    title="Approve Comment"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDeleteComment(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-colors"
                    title="Remove Comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#737373] space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-[#121212]">Moderation queue is clean!</p>
            <p>All comments and community essays currently comply with editorial policies.</p>
          </div>
        )}
      </div>

      {/* Registered Members Quick Table */}
      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#ECECE8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#121212]">
              Registered Writers & Readers
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Recent accounts registered across all platform tiers.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="text-xs font-semibold text-[#121212] hover:text-[#525252] transition-colors"
          >
            Manage users →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">Member</th>
                <th scope="col" className="px-6 py-3.5">Email</th>
                <th scope="col" className="px-6 py-3.5">Tier / Role</th>
                <th scope="col" className="px-6 py-3.5">Stories</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#ECECE8]"
                      />
                      <span className="font-medium text-[#121212]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#525252]">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        u.role === 'Admin'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : u.role === 'Author'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#525252] font-medium">{u.postsCount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#737373] text-xs">{u.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
