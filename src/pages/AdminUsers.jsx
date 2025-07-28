import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { flash } from "../utils/flash";
import AppContext from "../context/AppProvider";
import { BounceLoader } from "react-spinners";
import Lottie from "lottie-react";
import noData from "../animation/non-data-found.json";
import { IoMdFemale, IoMdMale } from "react-icons/io";

export const AdminUsers = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const { token } = useContext(AppContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/users`, {
        params: {
          search,
          page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.log(error.response.data.message);

      flash.show("Error fetching Users", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      flash.show("User deleted successfully", "success", 3000);
      fetchUsers();
    } catch (error) {
      flash.show("Error deleting User", "error", 3000);
    }
  };

  const handleDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-semibold text-zinc-800 mb-6 text-center sm:text-left">
        Manage Users
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

        <button
          onClick={() => {
            setPage(1);
            fetchUsers();
          }}
          className={`w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition-colors duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Search
        </button>
      </div>

      {/* Table */}

      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <BounceLoader color="#3802ff" size={50} />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded-xl shadow p-4 text-center">
          <p className="text-gray-400 text-lg">No users found.</p>
          <Lottie animationData={noData} loop style={{ height: 200 }} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-3 text-left text-indigo-700 font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-indigo-700 font-medium">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-indigo-700 font-medium">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-indigo-700 font-medium">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-indigo-700 font-medium">
                  Age Range
                </th>
                <th className="px-4 py-3 text-left text-indigo-700 font-medium">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-indigo-700 font-medium">
                  Joined
                </th>
                <th className="px-4 py-3 text-center text-indigo-700 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3 font-semibold">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{user.email || "-"}</td>
                  <td className="px-4 py-3">
                    {user.second_registration?.phone || "-"}
                  </td>
                  <td className="px-4 py-3 ">
                    <div className="flex justify-center items-center">
                      {user.second_registration?.gender === "Male" ? <IoMdMale className="w-6 h-6 text-primary-500"/> : <IoMdFemale className="w-6 h-6 text-pink-500"/>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.second_registration?.ageRange || "-"}
                  </td>
                  <td className="px-4 py-3 capitalize text-primary-500 font-semibold">{user.role}</td>
                  <td className="px-4 py-3">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.role === "admin" ? (
                      <span className="text-green-600 font-semibold">
                        Admin
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeleteModal(user.id)}
                        className="text-red-500 hover:text-red-700 transition duration-300 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {users.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-end gap-4 items-center mt-6 space-y-4 sm:space-y-0">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-5 py-2 rounded-md font-semibold transition ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} of {lastPage}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
            disabled={page === lastPage}
            className={`px-5 py-2 rounded-md font-semibold transition ${
              page === lastPage
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Are you sure you want to delete this user
            </h2>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer transition-colors duration-300"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition-colors duration-300"
                onClick={() => handleDelete(selectedUserId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
