import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Users,
  UserCircle,
  Mail,
  X,
  Search,
} from "lucide-react";

import { getAdminUsers } from "../../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getAdminUsers();
       
        setUsers([...response.data].reverse());
      } catch (error) {
        console.error(error);
        setError(true);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      String(user.id).includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ef]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#e8ddd2] border-t-[#744b4b]" />

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
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 text-red-600">
            Unable to load users.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Make sure JSON Server is running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#744b4b] text-white">
            <Users size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage registered users
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Total Users
          </p>

          <p className="text-xl font-bold text-[#744b4b]">
            {users.length}
          </p>
        </div>
      </div>

      {/* Users */}
      {users.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee6]">
            <Users
              size={26}
              className="text-[#744b4b]"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[#744b4b]">
            No users yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Registered users will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-[#744b4b]">
                Registered Users
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Click a user to view their details
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#744b4b] focus:ring-1 focus:ring-[#744b4b]"
              />
            </div>
          </div>

          {/* Table */}
          {filteredUsers.length === 0 ? (
            <div className="p-10 text-center">
              <Search
                size={28}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm text-gray-500">
                No users found for "{search}"
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="bg-[#f8f5ef] text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                      Email
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#744b4b]">
                      User ID
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="cursor-pointer border-b border-gray-100 transition last:border-b-0 hover:bg-[#fffdf8]"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3eee6]">
                            <UserCircle
                              size={22}
                              className="text-[#744b4b]"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-[#744b4b]">
                              {user.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              Customer
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail
                            size={16}
                            className="text-[#9a7b24]"
                          />

                          {user.email}
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span className="rounded-lg bg-[#f8f5ef] px-3 py-1.5 text-sm font-medium text-[#744b4b]">
                          #{user.id}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  User Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#744b4b]">
                  {selectedUser.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-4 rounded-xl bg-[#f8f5ef] p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#744b4b] text-white">
                  <UserCircle size={30} />
                </div>

                <div>
                  <p className="font-semibold text-[#744b4b]">
                    {selectedUser.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Customer
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400">
                  User ID
                </p>

                <p className="mt-1 font-semibold text-[#744b4b]">
                  #{selectedUser.id}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 break-all font-medium text-gray-700">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            {/* Close */}
            <div className="border-t border-gray-100 p-5 sm:p-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full rounded-lg bg-[#744b4b] py-3 font-medium text-white transition hover:bg-[#5f3c3c]"
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