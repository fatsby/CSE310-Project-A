export default function Landing() {
  return (
    <div className="font-montserrat flex flex-col items-center bg-[#EEF2F7]">
      <div className="mx-auto max-w-7xl w-full px-18">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center pt-26 pb-6 text-center">
          <h1 className="text-4xl md:text-[43px] font-bold mb-4">
            Join the ultimate material hub
            <br className="hidden md:block" />
            for students
          </h1>
          <div className="w-full flex flex-col gap-4 mb-8">
            <div className="w-full flex flex-col items-center mb-8">
              <div className="w-[530px] flex flex-col gap-4">
                {/* Top row left-aligned within same width */}
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

                {/* Bottom search bar centered in same block */}
                <div className="relative bg-white flex items-center rounded-full px-10 py-4 shadow-lg w-full mx-auto">
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
        <section className="w-full flex flex-col items-center pt-17 text-center">
          {/* Text over image */}
          <div className="relative w-full">
            <img
              src="./img/lap.png"
              alt="Hero"
              className="w-full rounded-3xl"
            />
            <div
              className=" absolute w-full top-[29px] left-1/2 transform -translate-x-1/2 
                   text-white text-lg md:text-xl font-normal leading-relaxed px-4"
            >
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
        <section className="">
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
                  <br className="hidden md:block" /> Enjoy a no-ads{" "}
                  <br className="hidden md:block" /> experience!
                </h1>
                <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[27px] mt-[73px] w-[238px] h-[87px] bg-white text-[#9864E5] font-bold rounded-full pb-2">
                  Study Now
                </button>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#5448acdc] shadow-md rounded-4xl p-16 md:h-[439px] md:w-[520px] col-span-1">
                  <p className="text-white text-[15px]">No ads</p>
                  <h1 className="font-bold mt-3 text-white text-[29px] leading-9">
                    No Wi-Fi? No problem!
                    <br className="hidden md:block" /> Download study{" "}
                    <br className="hidden md:block" /> materials to learn
                    offline.
                  </h1>
                  <div className="flex gap-5 mt-[43px] ml-[40px]">
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[238px] h-[54px] bg-white text-[#9864E5] font-bold rounded-full pb-2">
                      <i className="fa-solid fa-arrow-down"></i> Download doc
                    </button>
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[86px] h-[54px] bg-white font-bold rounded-full pb-2">
                      <i className="fa-solid fa-star text-[#F7CF30]"></i>{" "}
                      <span className=" text-black">5.0</span>
                    </button>
                  </div>
                  <div className="flex gap-5 mt-[19px]">
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[238px] h-[54px] bg-white text-[#9864E5] font-bold rounded-full pb-2">
                      <i className="fa-solid fa-arrow-down"></i> Download doc
                    </button>
                    <button className="drop-shadow-[0_10px_15px_rgba(99,62,145,100)] shadow-[inset_-4px_-4px_4px_rgba(38,21,62,0.25)] text-[17px] w-[86px] h-[54px] bg-white font-bold rounded-full pb-2">
                      <i className="fa-solid fa-star text-[#F7CF30]"></i>{" "}
                      <span className=" text-black">4.9</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center my-14">
            <button className="px-8 py-3 bg-[#4D93E9] text-[#F1F3FB] rounded-full hover:bg-blue-700 transition font-medium text-[16px] cursor-pointer">
              Go Premium
            </button>
          </div>
        </section>
      </div>
      {/* Final CTA Section */}
      <section className="w-full flex flex-col items-center pt-15">
        {/* Text over image */}
        <div className="relative w-full">
          <img
            src="./img/phone.png"
            alt="Hero"
            className="min-h-[850px] h-auto w-full"
          />
          <div
            className=" absolute w-[700px] top-1/2 left-1/3 transform -translate-x-1/2  -translate-y-1/2 
                   text-black text-lg md:text-xl font-normal leading-relaxed"
          >
            <div className="flex items-end">
              <img src="./img/logo.png" alt="" className="max-w-[100px]" />
              <span className="ml-2">Get our App</span>
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
              <img
                src="/img/appStore.png"
                alt="App Store"
                className="w-[150px] rounded-xl cursor-pointer"
              />
              <img
                src="/img/chPlay.png"
                alt="Play Store"
                className="w-[150px] rounded-xl cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
