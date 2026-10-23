import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, ExternalLink } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import { MOCK_RECENT_POSTS } from '../../data/mockData.js';

export default function DashboardPostsPage() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filteredPosts = MOCK_RECENT_POSTS.filter((post) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && post.status === 'Published') ||
      (filter === 'drafts' && post.status === 'Draft');

    const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
            My Posts
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Manage your published articles and working drafts.
          </p>
        </div>

        <Button to="/dashboard/editor" variant="primary" size="sm" icon={Plus}>
          Create New Post
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#ECECE8]">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {['all', 'published', 'drafts'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-[#121212] text-white'
                  : 'text-[#525252] hover:text-[#121212] hover:bg-black/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F5] border border-[#E5E7EB] rounded-md focus:bg-white focus:border-[#121212] outline-hidden"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
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
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#121212]">
                    <Link
                      to={`/dashboard/editor/${post.id}`}
                      className="hover:underline"
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
                    {post.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#525252]">
                    {post.likes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#737373]">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/blog/the-future-of-web-development"
                        className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded"
                        title="View Live Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/dashboard/editor/${post.id}`}
                        className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
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
