import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Users,
  UserCircle,
  Mail,
  X,
  Search,
  UserRound,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

import { getAdminUsers, updateAdminUser } from "../../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const loadUsers = async () => {
    try {
      const response = await getAdminUsers();

      // Display newest users first.
      setUsers([...response.data].reverse());
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const isBlocked = user.status === "blocked";
    const nextStatus = isBlocked ? "active" : "blocked";
    const action = isBlocked ? "unblock" : "block";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name || "this user"}?`
    );
    if (!confirmed) return;

    setUpdatingUserId(user.id);
    try {
      const response = await updateAdminUser(user.id, { status: nextStatus });
      const updatedUser = response.data;

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id ? { ...item, ...updatedUser, status: nextStatus } : item
        )
      );
      setSelectedUser((currentUser) =>
        currentUser?.id === user.id
          ? { ...currentUser, ...updatedUser, status: nextStatus }
          : currentUser
      );
      toast.success(`User ${nextStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
    } catch (requestError) {
      console.error(requestError);
      toast.error(`Failed to ${action} user. Please try again.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadUsers();
    };

    load();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      String(user.id).toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ef] p-4">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e8ddd2] border-t-[#744b4b]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3eee6]">
            <Users size={24} className="text-[#744b4b]" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#744b4b]">
            Users
          </h1>

          <p className="mt-2 text-sm text-red-600">
            Unable to load users.
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Check whether JSON Server is running on port 3001.
          </p>

          <button
            onClick={() => {
              setLoading(true);
              loadUsers();
            }}
            className="mt-5 w-full rounded-lg bg-[#744b4b] px-5 py-3 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:bg-[#9a7b24] hover:shadow-luxury sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 bg-[#f8f5ef] p-3 sm:p-5 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#744b4b] to-[#5f3c3c] text-white shadow-soft sm:h-12 sm:w-12">
            <Users size={22} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[4px] text-[#9a7b24]">
              Customers
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold text-[#744b4b] sm:text-3xl">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage registered users
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#e4dccf]/30 bg-white px-4 py-3 shadow-soft sm:min-w-40 sm:px-5">
          <div>
            <p className="text-xs text-gray-500">
              Total Users
            </p>

            <p className="mt-1 text-2xl font-bold text-[#744b4b]">
              {users.length}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3eee6]">
            <UserRound size={20} className="text-[#744b4b]" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e4dccf]/30 bg-white shadow-soft">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <div>
            <h2 className="font-semibold text-[#744b4b]">
              Registered Users
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              View and manage registered customer details.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              placeholder="Search name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#e4dccf]/60 bg-white/90 py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-[#9a7b24]/40 focus:border-[#9a7b24] focus:ring-2 focus:ring-[#9a7b24]/20"
            />
          </div>
        </div>

        {users.length === 0 ? (
          <div className="px-4 py-12 text-center sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee6]">
              <Users size={28} className="text-[#744b4b]" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#744b4b]">
              No users yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Registered users will appear here.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-4 py-12 text-center sm:px-8">
            <Search
              size={32}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-3 font-semibold text-[#744b4b]">
              No users found
            </h3>

            <p className="mt-2 break-words text-sm text-gray-500">
              No users match "{search}".
            </p>

            <button
              onClick={() => setSearch("")}
              className="mt-4 rounded-lg bg-[#744b4b] px-4 py-2 text-sm text-white shadow-soft transition-all duration-300 hover:bg-[#9a7b24] hover:shadow-luxury"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:hidden">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 text-left transition hover:border-[#e8ddd2] hover:bg-[#fffdf8] focus:outline-none focus:ring-2 focus:ring-[#744b4b]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3eee6]">
                      <UserCircle
                        size={26}
                        className="text-[#744b4b]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold text-[#744b4b]">
                        {user.name || "Unnamed User"}
                      </h3>

                      <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === "blocked"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {user.status === "blocked" ? "Blocked" : "Active"}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-lg bg-[#f8f5ef] px-2.5 py-1.5 text-xs font-medium text-[#744b4b]">
                      #{user.id}
                    </span>
                  </div>

                  <div className="mt-4 flex min-w-0 items-start gap-2 border-t border-gray-100 pt-3">
                    <Mail
                      size={16}
                      className="mt-0.5 shrink-0 text-[#9a7b24]"
                    />

                    <span className="min-w-0 break-all text-sm text-gray-600">
                      {user.email || "No email available"}
                    </span>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-xs font-medium text-[#744b4b]">
                      View Details →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="bg-[#f8f5ef] text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                      Email Address
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                      User ID
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedUser(user);
                        }
                      }}
                      className="cursor-pointer border-b border-gray-100 transition last:border-b-0 hover:bg-[#fffdf8] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#744b4b]"
                    >
                      <td className="px-5 py-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3eee6]">
                            <UserCircle
                              size={22}
                              className="text-[#744b4b]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="break-words font-semibold text-[#744b4b]">
                              {user.name || "Unnamed User"}
                            </p>

                          
                          </div>
                        </div>
                      </td>

                      <td className="max-w-xs px-5 py-5">
                        <div className="flex min-w-0 items-start gap-2 text-sm text-gray-600">
                          <Mail
                            size={16}
                            className="mt-0.5 shrink-0 text-[#9a7b24]"
                          />

                          <span className="break-all">
                            {user.email || "No email available"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span className="inline-block rounded-lg bg-[#f8f5ef] px-3 py-1.5 text-sm font-medium text-[#744b4b]">
                          #{user.id}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                          user.status === "blocked"
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {user.status === "blocked" ? "Blocked" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-4 py-3 sm:px-5">
              <p className="text-xs text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>
          </>
        )}
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
          onClick={() => setSelectedUser(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-details-title"
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-[#e4dccf]/40 bg-white shadow-luxury"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  User Details
                </p>

                <h2
                  id="user-details-title"
                  className="mt-1 break-words text-xl font-bold text-[#744b4b]"
                >
                  {selectedUser.name || "Unnamed User"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                aria-label="Close user details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              <div className="flex min-w-0 items-center gap-4 rounded-xl bg-[#f8f5ef] p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#744b4b] text-white">
                  <UserCircle size={30} />
                </div>

                <div className="min-w-0">
                  <p className="break-words font-semibold text-[#744b4b]">
                    {selectedUser.name || "Unnamed User"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Registered Customer
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  User ID
                </p>

                <p className="mt-2 break-all font-semibold text-[#744b4b]">
                  #{selectedUser.id}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <Mail
                    size={16}
                    className="shrink-0 text-[#9a7b24]"
                  />

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Email Address
                  </p>
                </div>

                <p className="mt-2 break-all text-sm font-medium text-gray-700 sm:text-base">
                  {selectedUser.email || "No email available"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Account Status
                </p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${
                  selectedUser.status === "blocked"
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {selectedUser.status === "blocked" ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            <div className="sticky bottom-0 space-y-3 border-t border-gray-100 bg-white p-4 sm:p-6">
              <button
                type="button"
                disabled={updatingUserId === selectedUser.id}
                onClick={() => handleToggleUserStatus(selectedUser)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  selectedUser.status === "blocked"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {selectedUser.status === "blocked" ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
                {updatingUserId === selectedUser.id
                  ? "Updating..."
                  : selectedUser.status === "blocked"
                    ? "Unblock User"
                    : "Block User"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;