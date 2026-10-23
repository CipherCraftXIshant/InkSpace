import React from 'react';
import { Users, FileText, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { MOCK_ADMIN_USERS } from '../../data/mockData.js';

export default function AdminOverviewPage() {
  const stats = [
    { label: 'Total Members', value: '1,420', change: '+8.2%', icon: Users },
    { label: 'Active Stories', value: '348', change: '+14.1%', icon: FileText },
    { label: 'Pending Moderation', value: '3', change: '-2', icon: AlertTriangle },
    { label: 'Platform Health', value: '99.9%', change: 'Optimal', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
          Admin Overview
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          System administration and content moderation center.
        </p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-white rounded-xl border border-[#ECECE8] shadow-2xs"
            >
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-medium">{stat.label}</span>
                <Icon className="w-4 h-4 text-[#A3A3A3]" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-serif text-2xl font-semibold text-[#121212]">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Management Quickview */}
      <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#ECECE8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#121212]">
              Registered Writers
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Recent accounts registered on the platform
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">Name</th>
                <th scope="col" className="px-6 py-3.5">Email</th>
                <th scope="col" className="px-6 py-3.5">Role</th>
                <th scope="col" className="px-6 py-3.5">Articles</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
              {MOCK_ADMIN_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAF9F5]/60">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-[#525252]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-[#F4F4F5] px-2 py-0.5 rounded font-medium text-[#3F3F46]">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
