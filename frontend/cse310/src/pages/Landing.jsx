import React from "react";

export default function Landing() {
  return (
    <div className="font-montserrat flex flex-col items-center bg-[#EEF2F7] pt-[92px]">
      <div className="mx-auto max-w-7xl w-full px-18">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center pt-26 pb-6 text-center">
          <h1 className="text-4xl md:text-[43px] font-semibold mb-8 text-black">
            Join the ultimate material hub
            <br className="hidden md:block" />
            for students
          </h1>
          <div className="w-full flex flex-col gap-4 mb-8">
            <div className="w-full flex flex-col items-center mb-8">
              <div className="w-[530px] flex flex-col gap-4">
                {/* Top row */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative bg-white flex items-center rounded-lg px-4 py-[5px] shadow-sm w-[200px] text-sm">
                    <input
                      type="text"
                      placeholder="Enter Course"
                      className="outline-none flex-grow placeholder:font-semibold placeholder:text-black"
                    />
                    <i className="absolute right-[10px] fa-solid fa-angle-down"></i>
                  </div>
                  <div className="relative bg-white flex items-center rounded-lg px-4 py-[5px] shadow-sm w-[200px] text-sm">
                    <input
                      type="text"
                      placeholder="Enter School"
                      className="outline-none flex-grow placeholder:font-semibold placeholder:text-black"
                    />
                    <i className="absolute right-[10px] fa-solid fa-angle-down"></i>
                  </div>
                </div>
                {/* Search bar */}
                <div
                  className="box-border relative bg-white flex items-center rounded-full px-10 py-4 shadow-lg w-full mx-auto 
             border-2 border-transparent 
             hover:border-[#b6d6ff] focus-within:border-[#b6d6ff]"
                >
                  <input
                    type="text"
                    placeholder=""
                    className="outline-none flex-grow"
                  />
                  <i className="absolute right-[20px] fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image section */}
        <section className="w-full flex flex-col items-center pt-17 text-center">
          <div className="relative w-full">
            <img
              src="src\assets\lap.png"
              alt="Laptop"
              className="w-full rounded-3xl"
            />
            <div className="absolute w-full top-[29px] left-1/2 transform -translate-x-1/2 text-white text-lg md:text-xl font-normal leading-relaxed px-4">
              <p className="text-sm font-medium">Shared Documents</p>
              <p className="text-3xl font-bold mt-9 mx-auto leading-snug">
                Prep like a pro with thousands
                <br className="hidden md:block" /> of study resources. Real
                student <br className="hidden md:block" />
                notes, past exams & more!
              </p>
            </div>
          </div>
        </section>

        {/* Premium Section */}
        <section>
          <div className="w-full flex flex-col">
            <h2 className="text-3xl md:text-[40px] font-semibold my-[90px] text-center">
              Unlock Logo’s full potential with{" "}
              <br className="hidden md:block" /> Premium
            </h2>
            <div className="grid grid-cols-2 mt-0">
              <div className="bg-[#5A58C0] shadow-md rounded-4xl p-16 md:h-[439px] md:w-[520px] col-span-1">
                <p className="text-white text-[15px]">No ads</p>
                <h1 className="font-bold mt-5 text-white text-3xl leading-9">
                  Study distraction-free:
                  <br className="hidden md:block" /> Enjoy a no-ads
                  <br className="hidden md:block" /> experience!
                </h1>
                <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] mt-[73px] w-[238px] h-[87px] bg-white text-[#9864E5] font-bold rounded-full pb-2">
                  <b className="text-[27px]">Study Now</b>
                </button>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#5448acdc] shadow-md rounded-4xl p-16 md:h-[439px] md:w-[520px] col-span-1">
                  <p className="text-white text-[15px]">No ads</p>
                  <h1 className="font-bold mt-3 text-white text-[29px] leading-9">
                    No Wi-Fi? No problem!
                    <br className="hidden md:block" /> Download study
                    <br className="hidden md:block" /> materials to learn
                    offline.
                  </h1>
                  <div className="flex gap-5 mt-[43px] ml-[40px]">
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[238px] h-[54px] bg-white text-[#9864E5] rounded-full pb-2">
                      <i className="fa-solid fa-arrow-down"></i>{" "}
                      <b>Download doc</b>
                    </button>
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[86px] h-[54px] bg-white rounded-full pb-2">
                      <i className="fa-solid fa-star text-[#F7CF30]"></i>{" "}
                      <span className="text-black font-bold">5.0</span>
                    </button>
                  </div>
                  <div className="flex gap-5 mt-[19px]">
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[238px] h-[54px] bg-white text-[#9864E5] rounded-full pb-2">
                      <i className="fa-solid fa-arrow-down"></i>{" "}
                      <b>Download doc</b>
                    </button>
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[86px] h-[54px] bg-white font-bold rounded-full pb-2">
                      <i className="fa-solid fa-star text-[#F7CF30]"></i>{" "}
                      <span className="text-black font-bold">4.9</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center my-14">
            <button className="px-8 py-3 bg-[#4D93E9] text-[#F1F3FB] rounded-full hover:bg-blue-600 transition font-medium text-[16px] cursor-pointer">
              Go Premium
            </button>
          </div>
        </section>
      </div>

      {/* Final CTA Section */}
      <section className="max-w-7xl flex flex-col items-center pt-15">
        <div className="relative w-full">
          <img
            src="src/assets/yellow-bg.png"
            alt="Mobile App"
            className="min-h-[850px] h-auto w-full"
          />

          {/* LEFT TEXT BLOCK */}
          <div className="absolute w-[650px] top-1/2 left-[10%] transform -translate-y-1/2 text-black text-lg md:text-xl font-normal leading-relaxed">
            <div className="flex items-end">
              <img
                src="src/assets/logo.png"
                alt="Logo"
                className="max-w-[100px]"
              />
              <span className="ml-2">
                <b>Get our App</b>
              </span>
            </div>
            <h2 className="text-3xl md:text-[40px] font-bold mb-4 mt-10 leading-14">
              Study anywhere.
              <br className="hidden md:block" /> Study everywhere.
              <br className="hidden md:block" /> On any device.
            </h2>
            <p className="mb-12 text-[20px]">
              Elevate your study routine and unlock a world of knowledge at your
              fingertips! With our app, available on both iOS and Android, you
              can seamlessly access tools designed to improve your learning
              experience. Download now and start learning smarter, not harder!
            </p>
            <div className="flex gap-12 justify-center md:justify-start">
              <a href="#">
                <img
                  src="src/assets/appStore.png"
                  alt="App Store"
                  className="h-[50px] rounded-xl cursor-pointer"
                />
              </a>
              <a href="#">
                <img
                  src="src/assets/chPlay.png"
                  alt="Play Store"
                  className="h-[50px] rounded-xl cursor-pointer"
                />
              </a>
            </div>
          </div>

          {/* RIGHT PHONE IMAGE */}
          <div className="absolute w-[270px] top-1/2 right-[10%] transform -translate-y-1/2">
            <img src="src/assets/phone.png" alt="Phone" />
          </div>
        </div>
      </section>
    </div>
  );
}
