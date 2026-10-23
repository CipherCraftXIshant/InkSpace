import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, Eye, Heart, MoreHorizontal, Edit3 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import { MOCK_DASHBOARD_STATS, MOCK_RECENT_POSTS } from '../../data/mockData.js';

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Welcome back, Alex. Here is your publication performance overview.
          </p>
        </div>

        <Button
          to="/dashboard/editor"
          variant="primary"
          size="sm"
          icon={Plus}
          className="self-start sm:self-auto"
        >
          New Post
        </Button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {MOCK_DASHBOARD_STATS.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-xl border border-[#ECECE8] shadow-2xs hover:shadow-xs transition-shadow"
          >
            <p className="text-xs font-medium text-[#737373] mb-1">{stat.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#121212]">
                {stat.value}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] text-[#A3A3A3] mt-2 font-normal">
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#ECECE8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#121212]">
              Recent Posts
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Manage and review your latest written articles
            </p>
          </div>

          <Link
            to="/dashboard/posts"
            className="text-xs font-semibold text-[#121212] hover:text-[#525252] transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Title
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Views
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Likes
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Date
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
              {MOCK_RECENT_POSTS.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#121212] whitespace-nowrap sm:whitespace-normal">
                    <Link
                      to="/dashboard/editor/post-1"
                      className="hover:underline flex items-center gap-2"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#525252]">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#A3A3A3]" />
                      <span>{post.views}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#525252]">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#A3A3A3]" />
                      <span>{post.likes}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#737373]">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/dashboard/editor/post-1"
                        className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded"
                        title="Edit Post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded cursor-pointer"
                        title="Options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
