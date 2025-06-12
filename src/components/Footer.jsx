// Icons
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="pt-40 lg:pt-50">
      <div className="flex flex-col gap-20 items-center lg:items-start lg:gap-0 lg:flex-row justify-between flex-wrap  gradient bg-gradient-to-b from-primary-500 to-accent-500 rounded-tl-2xl rounded-tr-2xl p-16 pb-30 text-zinc-100">
        <div className="flex flex-col lg:block items-center ">
          <img src="/images/logo-2.png" alt="doctor-logo" />
          <p className="w-[300px] lg:w-[450px] pt-10 text-center lg:text-start">
            At Doctor Bennani, we're committed to providing gentle, expert
            dental care for patients of all ages.
          </p>
          <div className="flex gap-6 pt-20">
            <FaInstagram className="text-3xl" />
            <FaXTwitter className="text-3xl" />
            <FaLinkedin className="text-3xl" />
          </div>
        </div>

        <div className="">
          <h1 className="text-2xl font-bold">Quick Links</h1>
          <ul className="pt-10 ">
            <li className="pb-4 text-lg">
              <a href="#home">Home</a>
            </li>
            <li className="pb-4 text-lg">
              <a href="#services">Services</a>
            </li>
            <li className="pb-4 text-lg">
              <a href="#reviews">Reviews</a>
            </li>
            <li className="pb-4 text-lg">
              <a href="#about">About</a>
            </li>
            <li className="pb-4 text-lg">
              <a href="#doctors">Meet the dentists</a>
            </li>
            <li className="pb-4 text-lg">
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="lg:pe-20">
          <ul className="pb-4">
            <li className="pb-6 text-lg ">
              📍 Address: 123 Smile Street, <br/> Suite 100, Casablanca
            </li>
            <li className="pb-6 text-lg ">
              📞 Phone: (123) 456-7890
            </li>
            <li className="pb-6 text-lgd">
              📧 Email: contact@yourclinic.com
            </li>
            <li className="pb-6 text-lg ">
              🕓 Hours: Mon-Sat: 9AM - 6PM
            </li>
          </ul>
          <button className="font-bold py-2 px-6 rounded-3xl gradient bg-gradient-to-b from-primary-500 to-accent-500 border border-white cursor-pointer">
            Book an Appointment
          </button>
        </div>
      </div>
    </div>
  );
};
