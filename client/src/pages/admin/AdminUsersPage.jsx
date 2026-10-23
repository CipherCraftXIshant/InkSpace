import React, { useState } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { MOCK_ADMIN_USERS } from '../../data/mockData.js';

export default function AdminUsersPage() {
  const [users] = useState(MOCK_ADMIN_USERS);
  const [query, setQuery] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Review accounts, assign author or editor permissions, and manage access.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-md outline-hidden focus:border-[#121212]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">Name</th>
                <th scope="col" className="px-6 py-3.5">Email</th>
                <th scope="col" className="px-6 py-3.5">Role</th>
                <th scope="col" className="px-6 py-3.5">Published Articles</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-[#525252]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-[#F4F4F5] px-2.5 py-0.5 rounded font-medium text-[#3F3F46]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#525252]">{user.posts}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="p-1.5 text-[#737373] hover:text-[#121212] hover:bg-black/5 rounded cursor-pointer"
                      title="User Actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
