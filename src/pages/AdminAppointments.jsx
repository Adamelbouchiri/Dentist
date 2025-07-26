import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { flash } from "../utils/flash";
import AppContext from "../context/AppProvider";
import { BounceLoader } from "react-spinners";
import Lottie from "lottie-react";
import noData from "../animation/non-data-found.json";

export const AdminAppointments = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const { token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [newStatus, setNewStatus] = useState(""); // For the dropdown inside modal

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/appointments`, {
        params: {
          filter: selectedFilter,
          status,
          search,
          page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data.data);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.log(error.response.data.message);

      flash.show("Error fetching appointments", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      flash.show("Appointment deleted successfully", "success", 3000);
      fetchAppointments();
    } catch (error) {
      flash.show("Error deleting appointment", "error", 3000);
    }
  };

  const handleEditStatus = async () => {
    try {
      if (!newStatus) {
        flash.show("Please select a status", "error", 3000);
        return;
      }

      await axios.put(
        `${BASE_URL}/api/admin/appointments/${selectedAppointmentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      flash.show("Appointment updated", "success", 3000);
      setShowModal(false);
      setNewStatus("");
      fetchAppointments();
    } catch (error) {
      console.log(error.response.data.message);
      flash.show("Error updating status", "error", 3000);
    }
  };

  const handleEditModal = (id) => {
    setSelectedAppointmentId(id);
    setShowModal(true);
  };

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Admin Appointments
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="appearance-none bg-white border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="appearance-none bg-white border border-gray-300 text-gray-700 px-4 py-2 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone"
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

        <button
          onClick={() => {
            setPage(1);
            fetchAppointments();
          }}
          className={`w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md ${
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
      ) : appointments.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded-xl shadow p-4">
          <p className="text-gray-400 text-lg">
            No available appointments, try another filters
          </p>

          <div className="">
            <Lottie
              animationData={noData}
              loop={true}
              style={{ height: 200 }}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow border border-gray-300 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  Service
                </th>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  Time
                </th>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  Payment
                </th>
                <th className="px-4 py-3 text-left font-medium text-indigo-700">
                  Price
                </th>
                <th className="px-4 py-3 text-center font-medium text-indigo-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{appt.user?.name}</div>
                    <div className="text-gray-500 text-xs">
                      {appt.user?.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">{appt.doctor}</td>
                  <td className="px-4 py-3">{appt.service}</td>
                  <td className="px-4 py-3">{appt.date}</td>
                  <td className="px-4 py-3">{appt.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        appt.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : appt.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {appt.payment_status}
                  </td>
                  <td className="px-4 py-3">${appt.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3 text-indigo-600">
                      <button
                        onClick={() => handleEditModal(appt.id)}
                        className="hover:text-yellow-600 transition duration-300 cursor-pointer"
                        title="Edit status"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="hover:text-red-600 transition duration-300 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {appointments.length > 0 && (
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
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-100">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Edit Status for Appointment {selectedAppointmentId}
            </h2>

            <select
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">-- Select Status --</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="scheduled">Scheduled</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setNewStatus("");
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={handleEditStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
