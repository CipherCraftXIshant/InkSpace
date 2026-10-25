import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Trash2,
  Edit2,
  AlertTriangle,
  X,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
} from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function AdminUsersPage() {
  useDocumentTitle('User Management — Admin');
  const [users, setUsers] = useState(() => getAdminUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'Author' | 'Reader' | 'Admin'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Active' | 'Suspended'
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [newSelectedRole, setNewSelectedRole] = useState('');
  const [confirmModalData, setConfirmModalData] = useState(null); // { type: 'suspend' | 'delete', user: {...} }

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Open role modification modal
  const handleOpenRoleModal = (user) => {
    setRoleModalUser(user);
    setNewSelectedRole(user.role);
  };

  // Save role change
  const handleSaveRole = () => {
    if (!roleModalUser) return;
    const updated = updateAdminUser(roleModalUser.id, { role: newSelectedRole });
    setUsers(updated);
    setRoleModalUser(null);
    setToastMessage(`Updated ${roleModalUser.name}'s role to ${newSelectedRole}.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Open destructive confirm modal (suspend/activate or delete)
  const promptConfirmAction = (type, user) => {
    setConfirmModalData({ type, user });
  };

  // Execute confirmed destructive action
  const executeConfirmedAction = () => {
    if (!confirmModalData) return;
    const { type, user } = confirmModalData;

    if (type === 'suspend') {
      const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
      const updated = updateAdminUser(user.id, { status: newStatus });
      setUsers(updated);
      setToastMessage(
        newStatus === 'Suspended'
          ? `Account for ${user.name} has been suspended.`
          : `Account for ${user.name} has been reactivated.`
      );
    } else if (type === 'delete') {
      const updated = deleteAdminUser(user.id);
      setUsers(updated);
      setToastMessage(`Account for ${user.name} was permanently removed.`);
    }

    setConfirmModalData(null);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-1">
            ACCOUNT GOVERNANCE
          </p>
          <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Assign reader, author, or admin permissions, monitor accounts, and control platform access.
          </p>
        </div>

        <div className="text-xs text-[#737373] bg-white border border-[#ECECE8] px-3 py-1.5 rounded-lg">
          Total Members: <strong className="text-[#121212] font-semibold">{users.length}</strong>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user name or email..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF9F5] border border-[#E5E7EB] rounded-lg outline-hidden focus:bg-white focus:border-[#121212] transition-colors"
            />
          </div>

          {/* Role Filter & Status Filter Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <label htmlFor="role-filter" className="text-[#737373] font-medium hidden md:inline">
                Role:
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#FAF9F5] border border-[#E5E7EB] text-xs text-[#121212] rounded-lg px-2.5 py-1.5 outline-hidden focus:border-[#121212] cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="Author">Authors</option>
                <option value="Reader">Readers</option>
                <option value="Admin">Administrators</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <label htmlFor="status-filter" className="text-[#737373] font-medium hidden md:inline">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAF9F5] border border-[#E5E7EB] text-xs text-[#121212] rounded-lg px-2.5 py-1.5 outline-hidden focus:border-[#121212] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 text-[#737373] hover:text-[#121212] rounded-lg border border-[#E5E7EB] hover:bg-[#FAF9F5] cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">User</th>
                  <th scope="col" className="px-6 py-3.5">Email Address</th>
                  <th scope="col" className="px-6 py-3.5">System Role</th>
                  <th scope="col" className="px-6 py-3.5">Published Stories</th>
                  <th scope="col" className="px-6 py-3.5">Account Status</th>
                  <th scope="col" className="px-6 py-3.5">Member Since</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    {/* User Name & Avatar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#ECECE8]"
                        />
                        <span className="font-medium text-[#121212]">{u.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-[#525252] font-mono text-xs whitespace-nowrap">
                      {u.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
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

                    {/* Published Stories */}
                    <td className="px-6 py-4 text-[#525252] font-medium whitespace-nowrap">
                      {u.postsCount}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>

                    {/* Member Since */}
                    <td className="px-6 py-4 text-[#737373] text-xs whitespace-nowrap">
                      {u.joinedDate}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Change Role Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenRoleModal(u)}
                          className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-black/5 rounded-md transition-colors cursor-pointer"
                          title="Change User Role"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Suspend / Reactivate Button */}
                        <button
                          type="button"
                          onClick={() => promptConfirmAction('suspend', u)}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            u.status === 'Active'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
                        >
                          {u.status === 'Active' ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete User Button */}
                        <button
                          type="button"
                          onClick={() => promptConfirmAction('delete', u)}
                          className="p-1.5 text-[#8A8A8A] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete User Permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No users match the criteria"
          description={
            searchQuery
              ? `No members found matching "${searchQuery}". Check your spelling or reset filters.`
              : 'No users found under the selected filters.'
          }
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Role Assignment Modal */}
      {roleModalUser && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#ECECE8] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#ECECE8]">
              <h3 className="font-serif text-lg font-medium text-[#121212]">
                Assign User Role
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="text-[#8A8A8A] hover:text-[#121212] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#666666]">
              Modify platform permissions for{' '}
              <strong className="text-[#121212]">{roleModalUser.name}</strong>.
            </p>

            <div className="space-y-2">
              {['Reader', 'Author', 'Admin'].map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    newSelectedRole === r
                      ? 'border-[#121212] bg-[#FAF9F5]'
                      : 'border-[#ECECE8] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={newSelectedRole === r}
                      onChange={() => setNewSelectedRole(r)}
                      className="accent-[#121212]"
                    />
                    <span className="text-xs font-semibold text-[#121212]">{r}</span>
                  </div>
                  <span className="text-[11px] text-[#737373]">
                    {r === 'Admin'
                      ? 'Full Governance'
                      : r === 'Author'
                      ? 'Publish & Draft'
                      : 'Read & Comment'}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="px-3 py-1.5 text-xs text-[#525252] hover:text-[#121212] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-4 py-1.5 text-xs font-semibold bg-[#121212] text-white rounded-lg hover:bg-neutral-800 cursor-pointer shadow-2xs"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Destructive Actions (Suspend / Delete) */}
      {confirmModalData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ECECE8] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                confirmModalData.type === 'delete'
                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}
            >
              <AlertTriangle className="w-5 h-5 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-medium text-[#121212]">
                {confirmModalData.type === 'delete'
                  ? 'Permanently delete user account?'
                  : confirmModalData.user.status === 'Active'
                  ? 'Suspend user access?'
                  : 'Reactivate user access?'}
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mt-1.5">
                {confirmModalData.type === 'delete'
                  ? `Are you sure you want to permanently delete ${confirmModalData.user.name}'s account (${confirmModalData.user.email})? This action cannot be undone.`
                  : confirmModalData.user.status === 'Active'
                  ? `Suspending ${confirmModalData.user.name} will disable their ability to write stories and participate in community discussions.`
                  : `Reactivating ${confirmModalData.user.name} will restore their publishing permissions immediately.`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECECE8]">
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="px-3.5 py-1.5 text-xs text-[#525252] hover:text-[#121212] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className={`px-4 py-1.5 text-xs font-semibold text-white rounded-lg cursor-pointer shadow-2xs ${
                  confirmModalData.type === 'delete'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#121212] hover:bg-neutral-800'
                }`}
              >
                {confirmModalData.type === 'delete'
                  ? 'Delete Account'
                  : confirmModalData.user.status === 'Active'
                  ? 'Suspend Account'
                  : 'Reactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
