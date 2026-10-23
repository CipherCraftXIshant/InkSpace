import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_ARTICLES } from '../../data/mockData.js';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState(
    MOCK_ARTICLES.map((a, i) => ({
      ...a,
      moderationStatus: i === 0 ? 'Approved' : i === 1 ? 'Pending Review' : 'Approved',
    }))
  );

  const handleStatusChange = (id, newStatus) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, moderationStatus: newStatus } : p))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
          Post Moderation
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Review community publications against editorial and copyright standards.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">Title</th>
                <th scope="col" className="px-6 py-3.5">Author</th>
                <th scope="col" className="px-6 py-3.5">Category</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#121212]">
                    <Link to={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-[#525252]">{post.author?.name}</td>
                  <td className="px-6 py-4 text-[#525252]">{post.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.moderationStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {post.moderationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(post.id, 'Approved')}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(post.id, 'Rejected')}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
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
