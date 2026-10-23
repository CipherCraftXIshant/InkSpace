import React, { useState } from 'react';
import { CheckCircle, Trash2, MessageSquare } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: 'Marcus Chen',
      article: 'The Future of Web Development',
      date: 'May 13, 2024',
      content: 'Remarkable breakdown of modern compilers. Really insightful perspective on edge compute!',
      status: 'Approved',
    },
    {
      id: 'c2',
      author: 'Unknown Guest',
      article: 'Building Scalable APIs',
      date: 'May 11, 2024',
      content: 'Check out this free tool at spam-link-example.com to boost ranking fast.',
      status: 'Flagged',
    },
    {
      id: 'c3',
      author: 'Elena Rostova',
      article: 'Minimalism in Life and Business',
      date: 'May 8, 2024',
      content: 'The section on silent mornings resonated deeply. Implementing this in our editorial team.',
      status: 'Approved',
    },
  ]);

  const handleDelete = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleApprove = (id) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, status: 'Approved' } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
          Comments Moderation
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Review comments, manage community feedback, and eliminate spam.
        </p>
      </div>

      {comments.length > 0 ? (
        <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs divide-y divide-[#ECECE8]">
          {comments.map((comment) => (
            <div key={comment.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#121212]">{comment.author}</span>
                  <span className="text-[#A3A3A3]">•</span>
                  <span className="text-[#737373]">on story:</span>
                  <span className="font-medium text-[#121212]">{comment.article}</span>
                  <span className="text-[#A3A3A3]">•</span>
                  <span className="text-[#8A8A8A]">{comment.date}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      comment.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                  "{comment.content}"
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {comment.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(comment.id)}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                    title="Approve Comment"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(comment.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                  title="Delete Comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No comments to review"
          description="All reader comments have been reviewed and moderated."
        />
      )}
    </div>
  );
}
