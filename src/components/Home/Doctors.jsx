//Icons
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";


export const Doctors = () => {
  return (
    <div id="dentists" className="pt-40">
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-wider">
          Meet Our Dedicated Experts
        </h1>
        <p className="text-xl tracking-wider py-4 text-gray-500">
          Our skilled and caring dental team is here to make every visit <br />
          comfortable and stress-free.
        </p>
      </div>

      <div className="flex flex-col items-center md:flex-row justify-center flex-wrap lg:flex-nowrap gap-4 xl:gap-16 pt-10">
        <div className="w-[350px] lg:w-[450px] rounded-xl overflow-hidden relative">
          <img src="/images/doctor-2.jpg" alt="doctor" className="w-full" />

          <div className="absolute bottom-5 right-4 left-4 bg-white px-4 py-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <h1 className="text-lg md:text-2xl font-bold">Dr. Tayler Smith</h1>
              <a href="tel:+212767759400" className="py-0.5 px-6 gradient-primary rounded-full text-white text-sm block">Call Now</a>
            </div>
            <span className="text-sm text-gray-500">Dentist Doctor</span>

            <div className="flex gap-3 pt-6 pb-2">
              <FaInstagram className="text-xl" />
              <FaXTwitter className="text-xl" />
              <FaFacebook className="text-xl" />
              <FaLinkedin className="text-xl" />
            </div>
          </div>
        </div>

        <div className="w-[350px] lg:w-[450px] rounded-xl overflow-hidden relative">
          <img src="/images/doctor-1.jpg" alt="doctor" className="w-full" />

          <div className="absolute bottom-5 right-4 left-4 bg-white px-4 py-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <h1 className="text-lg md:text-2xl font-bold">Dr. Cris waxon</h1>
              <a href="tel:+212767759400" className="py-0.5 px-6 gradient-primary rounded-full text-white text-sm block">Call Now</a>
            </div>
            <span className="text-sm text-gray-500">Dentist Doctor</span>

            <div className="flex gap-3 pt-6 pb-2">
              <FaInstagram className="text-xl" />
              <FaXTwitter className="text-xl" />
              <FaFacebook className="text-xl" />
              <FaLinkedin className="text-xl" />
            </div>
          </div>
        </div>

        <div className="w-[350px] lg:w-[450px] rounded-xl overflow-hidden relative">
          <img src="/images/doctor-3.jpg" alt="doctor" className="w-full" />

          <div className="absolute bottom-5 right-4 left-4 bg-white px-4 py-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <h1 className="text-lg md:text-2xl font-bold">Dr. John Doe</h1>
              <a href="tel:+212767759400" className="py-0.5 px-6 gradient-primary rounded-full text-white text-sm block">Call Now</a>
            </div>
            <span className="text-sm text-gray-500">Dentist Doctor</span>

            <div className="flex gap-3 pt-6 pb-2">
              <FaInstagram className="text-xl" />
              <FaXTwitter className="text-xl" />
              <FaFacebook className="text-xl" />
              <FaLinkedin className="text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
