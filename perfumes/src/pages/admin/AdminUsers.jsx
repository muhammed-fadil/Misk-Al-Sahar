import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAdminUsers } from "../../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getAdminUsers();

        setUsers(response.data);
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h1 className="mb-2 text-2xl font-bold text-[#744b4b] sm:text-3xl">
            Users
          </h1>

          <p className="text-red-600">Unable to load users.</p>

          <p className="mt-2 text-sm text-gray-500">
            Make sure JSON Server is running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
          Users
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage registered users
        </p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#744b4b] text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-medium">
                    Name
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-medium">
                    Email
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-medium">
                    User ID
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-b-0 hover:bg-[#fffdf8]"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-[#744b4b]">
                      {user.name}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {user.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;