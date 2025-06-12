//Icons
import { FaCheck, FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaFacebookF  } from "react-icons/fa";

export const Contact = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div id="contact" className="pt-40 lg:pt-50">
      <div className="flex flex-col items-start lg:flex-row gap-20">
        <div className="text-start">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-wider pb-8">
            Reach out
          </h1>
          <p className="text-gray-400 text-lg tracking-wider w-[350px] md:w-[500px] ">
            Have a question or need assistance ? Reach out our Dedicated team
            we're here to help with any inquiries you may have
          </p>

          <div className="pt-10">
            <div className="flex items-center gap-2 mb-4">
              <span className=" bg-primary-500 p-2 rounded-full ">
                <FaCheck className="text-xl text-white " />
              </span>
              <span className="text-lg lg:text-xl ">
                Personalized assistance
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className=" bg-primary-500 p-2 rounded-full ">
                <FaCheck className="text-xl text-white " />
              </span>
              <span className="text-lg lg:text-xl ">Timely response</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className=" bg-primary-500 p-2 rounded-full ">
                <FaCheck className="text-xl text-white " />
              </span>
              <span className="text-lg lg:text-xl ">Comprehensive support</span>
            </div>
          </div>

          <div className="pt-10 flex items-center gap-4">
            <span className="bg-primary-500 px-4 py-3 rounded-xl">
              <FaXTwitter className="text-3xl text-white" />
            </span>
            <span className="bg-primary-500 px-4 py-3 rounded-xl">
              <FaInstagram className="text-3xl text-white" />
            </span>
            <span className="bg-primary-500 px-4 py-3 rounded-xl">
              <FaFacebookF className="text-3xl text-white" />
            </span>
          </div>
        </div>
        <div className="w-full bg-white border border-gray-100 py-12 px-6 rounded-2xl shadow-md">
          <form className="flex flex-wrap gap-4">
            <input type="text" placeholder="Name" className="flex-1 p-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-primary-500"/>
            <input type="email" placeholder="Email" className="flex-1 p-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-primary-500"/>
            <textarea placeholder="Message" className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-primary-500 h-[200px]"></textarea>
            <button onClick={(e) => handleSubmit(e)} className="text-white border border-white p-3 w-full text-lg lg:text-2xl rounded-xl bg-primary-500 font-semibold cursor-pointer">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};
