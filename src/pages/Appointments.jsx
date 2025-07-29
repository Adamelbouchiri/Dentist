import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaCalendarPlus, FaRegTrashCan } from "react-icons/fa6";
import AppContext from "../context/AppProvider";
import { flash } from "../utils/flash";
import { Link } from "react-router-dom";
import { FaCalendar } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import Lottie from "lottie-react";
import noData from "../animation/non-data-found.json";

export const Appointments = () => {
  const { token } = useContext(AppContext);

  const [appointments, setAppointments] = useState(null);

  const StatusBadge = ({ status }) => {
    const base =
      "px-3 py-1 rounded-lg text-xs font-semibold text-white capitalize";
    const styles = {
      upcoming: "bg-black",
      completed: "bg-black",
      cancelled: "bg-red-500",
    };
    return <span className={`${base} ${styles[status]}`}>{status}</span>;
  };

  const PaymentBadge = ({ payment }) => {
    const base = "px-3 py-1 rounded-lg text-xs font-semibold";
    const styles = {
      pending: "bg-gray-200 text-gray-800",
      paid: "bg-black text-white",
      refunded: "bg-gray-200 text-gray-800",
    };
    return <span className={`${base} ${styles[payment]}`}>{payment}</span>;
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const updatedAppointments = appointments.filter((appt) => appt.id !== id);
      setAppointments(updatedAppointments);

      flash.show(response.data.message, "success", 3000);
    } catch (error) {
      console.log(error.response.data.message);
      flash.show(error.response.data.message, "error", 3000);
    }
  };

  const AppointmentCard = ({ appt }) => (
    <div className="p-4 border border-gray-300 rounded-xl shadow-lg bg-white w-full">
      <div className="flex justify-between items-start">
        <div className="">
          <h3 className="font-semibold text-lg">{appt.service}</h3>
          <p className="text-sm mb-2">
            {appt.doctor}
          </p>
        </div>

        <button onClick={() => handleDelete(appt.id)} className="">
          <FaRegTrashCan className="w-4 h-4 text-2xl text-red-500 transition duration-300 hover:scale-110 hover:text-red-600 cursor-pointer" />
        </button>
      </div>
      <div className="text-md space-y-1">
        <p>
          <span className="font-semibold">Date:</span> {appt.date}
        </p>
        <p>
          <span className="font-semibold">Time:</span> {appt.time}
        </p>
        <p>
          <span className="font-semibold">Price:</span> ${appt.price}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <StatusBadge status={appt.status} />
        </p>
        <p>
          <span className="font-semibold">Payment:</span>{" "}
          <PaymentBadge payment={appt.payment_status} />
        </p>
      </div>
    </div>
  );

  useEffect(() => {
    async function fetchUserAppointments() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments(response.data);
      } catch (error) {
        console.log(error.response.data.message);
        flash.show(error.response.data.message, "error", 3000);
      }
    }

    fetchUserAppointments();
  }, []);

  return !appointments ? (
    <div className="flex justify-center items-center h-screen">
      <BounceLoader color="#3802ff" size={50} />
    </div>
  ) : (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Your Appointments</h1>
        <Link
          to="/create-appointments"
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white font-semibold rounded-lg shadow"
        >
          <FaCalendarPlus /> Add Appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow">
          <p className="text-sm flex items-center justify-between">
            Total Appointments <FaCalendar />
          </p>
          <h2 className="text-3xl font-bold">{appointments.length}</h2>
          <p className="text-xs mt-1">
            All your scheduled and past appointments
          </p>
        </div>
        <div className="p-4 bg-white border border-gray-300 rounded-xl shadow">
          <p className="text-sm flex items-center justify-between">
            Upcoming <FaCalendar className="text-primary-500" />
          </p>
          <h2 className="text-3xl font-bold">
            {appointments.filter((appt) => appt.status === "upcoming").length}
          </h2>
          <p className="text-xs mt-1">Appointments in the near future</p>
        </div>
        <div className="p-4 bg-green-200 border border-green-300 rounded-xl shadow-green-200">
          <p className="text-sm flex items-center justify-between text-zinc-700">
            Completed <FaCalendar className="text-green-500" />
          </p>
          <h2 className="text-3xl font-bold">
            {appointments.filter((appt) => appt.status === "completed").length}
          </h2>
          <p className="text-xs mt-1">Successfully finished appointments</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.length === 0 ? (
            <div className="bg-white w-[99%] border border-gray-300 rounded-xl shadow p-4">
              <p className="text-gray-400 text-lg">
                No completed appointments yet
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
            appointments.map((appt, i) => (
              <AppointmentCard key={i} appt={appt} />
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Past & Completed</h2>
        <div className="flex flex-wrap gap-4">
          {appointments.filter((appt) => appt.status === "completed").length ===
          0 ? (
            <div className=" bg-white w-full lg:w-[49%] border border-gray-300 rounded-xl shadow p-4">
              <p className="text-gray-400 text-lg">
                No completed appointments yet
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
            appointments
              .filter((appt) => appt.status === "completed")
              .map((appt, i) => <AppointmentCard key={i} appt={appt} />)
          )}
        </div>
      </div>
    </div>
  );
};
