import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";

export const DateTimePicker = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("9:30");

  // Calculate the start of the current week (Monday)
  const getCurrentWeekStart = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday (0) as last day of week
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    return monday;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(
    getCurrentWeekStart()
  );
  // const [isBooking, setIsBooking] = useState(false);
  // const [bookingStatus, setBookingStatus] = useState(null); // 'success', 'error', or null

  const timeSlots = ["9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekStart);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const isSameDate = (date1, date2) => {
    if (!date1) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0); // Reset time to start of day
    return checkDate < today;
  };

  const canNavigateToPreviousWeek = () => {
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);
    const previousWeekEnd = new Date(previousWeekStart);
    previousWeekEnd.setDate(previousWeekStart.getDate() + 6);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Allow navigation if the previous week contains today or future dates
    return previousWeekEnd >= today;
  };

  const navigateWeek = (direction) => {
    if (direction === "prev" && !canNavigateToPreviousWeek()) {
      return; // Don't navigate if it would go to a completely past week
    }

    const newStart = new Date(currentWeekStart);
    newStart.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    setCurrentWeekStart(newStart);
  };

  const handleDateSelect = (date) => {
    if (isPastDate(date)) {
      return; // Don't allow selection of past dates
    }
    setSelectedDate(date);
  };

  // const handleBooking = async () => {
  //   if (!selectedDate || !selectedTime) return;

  //   setIsBooking(true);
  //   setBookingStatus(null);

  //   try {
  //     const bookingData = {
  //       date: selectedDate.toISOString().split("T")[0],
  //       time: selectedTime,
  //       timestamp: new Date().toISOString(),
  //       service: "appointment",
  //     };

  //     const response = await fetch("/api/bookings", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(bookingData),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     console.log("Booking successful:", result);

  //     setBookingStatus("success");

  //     setTimeout(() => {
  //       setBookingStatus(null);
  //     }, 3000);
  //   } catch (error) {
  //     console.error("Booking failed:", error);
  //     setBookingStatus("error");

  //     setTimeout(() => {
  //       setBookingStatus(null);
  //     }, 3000);
  //   } finally {
  //     setIsBooking(false);
  //   }
  // };

  const getBookingButtonText = () => {
    if (isBooking) return "Booking...";
    if (bookingStatus === "success") return "Booked!";
    if (bookingStatus === "error") return "Try Again";
    return "Book";
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-600">
            Choose date and time
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateWeek("prev")}
              disabled={!canNavigateToPreviousWeek()}
              className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
                canNavigateToPreviousWeek()
                  ? "hover:bg-gray-100 text-gray-700 cursor-pointer"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <IoIosArrowBack className="h-4 w-4 cursor-inherit"/>
            </button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {formatMonth(weekDates[3])}
            </span>
            <button
              onClick={() => navigateWeek("next")}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-700"
            >
              <IoIosArrowForward className="h-4 w-4 cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const isDatePast = isPastDate(date);
            const isDateToday = isToday(date);
            const isDateSelected = isSameDate(selectedDate, date);

            return (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {dayNames[index]}
                </div>
                <button
                  className={`h-8 w-8 text-sm rounded-md transition-colors relative cursor-pointer ${
                    isDateSelected
                      ? "bg-primary-500 text-white hover:bg-blue-700"
                      : isDateToday
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold"
                      : isDatePast
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleDateSelect(date)}
                  disabled={isDatePast}
                >
                  {date.getDate()}
                  {isDateToday && !isDateSelected && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`px-3 py-2 text-sm rounded-md border transition-colors cursor-pointer ${
                selectedTime === time
                  ? "bg-primary-500 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              {formatDate(selectedDate)} | {selectedTime}
            </span>
            {/* <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
                bookingStatus === "success"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : bookingStatus === "error"
                  ? "bg-red-600 hover:bg-red-700 text-white "
                  : "bg-primary-500 hover:bg-blue-700 text-white"
              } ${
                isBooking || bookingStatus === "success"
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleBooking}
              disabled={isBooking || bookingStatus === "success"}
            >
              {isBooking && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {getBookingButtonText()}
            </button> */}
          </div>
        )}

        {/* Status Messages
        {bookingStatus === "success" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Booking confirmed successfully!
            </p>
          </div>
        )}

        {bookingStatus === "error" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Booking failed. Please try again.
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};
