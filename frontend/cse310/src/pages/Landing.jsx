import { Button, Select, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function Landing() {
  const [showHero, setShowHero] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showCtaText, setShowCtaText] = useState(false);
  const [showCtaImage, setShowCtaImage] = useState(false);

  const heroRef = useRef(null);
  const premiumRef = useRef(null);
  const ctaRef = useRef(null);

  // Animate Hero Section
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowHero(true);
        observer.disconnect();
      }
    });
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate Premium Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowPremium(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (premiumRef.current) observer.observe(premiumRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate Final CTA Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCtaText(true);
          setShowCtaImage(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#EEF2F7] pt-[92px]">
      <div className="container mx-auto w-fit">
        {/* Hero Section */}
        <section ref={heroRef} className="pb-6 pt-26">
          <div className="w-fit mx-auto">
            <h1
              className={`text-center text-[50px] font-semibold text-black transition-all duration-700 ease-in transform
              ${
                showHero
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
            >
              Join the ultimate material hub
            </h1>

            {/* SELECTOR DIV */}
            <form action="">
              <div className="flex gap-x-3 pt-4">
                <div className="w-1/2">
                  <Select
                    checkIconPosition="right"
                    data={["EIU", "VNU", "HUST", "HUB"]}
                    pb={15}
                    placeholder="Select University"
                    radius="lg"
                    size="md"
                  />
                </div>
                <div className="w-1/2">
                  <Select
                    checkIconPosition="right"
                    data={["EIU", "VNU", "HUST", "HUB"]}
                    pb={15}
                    placeholder="Select Course"
                    radius="lg"
                    size="md"
                  />
                </div>
              </div>
              <div className="flex gap-x-2">
                <div className="flex-auto w-6/7">
                  <TextInput
                    placeholder="Search for documents name, notes, and more... (Optional)"
                    leftSection={<Search size="16" />}
                    radius="lg"
                    size="md"
                  />
                </div>
                <div className="flex-auto w-1/7">
                  <Button
                    size="md"
                    variant="filled"
                    radius="lg"
                    fullWidth
                    color="#0052cc"
                  >
                    Find
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Hero image */}
          <div className="grid grid-cols-2 mt-0 gap-[33px] px-18 pt-[155px]">
            <div
              className={`shadow-md flex justify-center items-center rounded-4xl md:h-[750px] md:w-full col-span-1
    transition-all duration-700 ease-in transform
    ${showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="relative w-full h-full">
                {/* Background Image */}
                <img
                  src="src/assets/green-bg.png"
                  alt=""
                  className="w-full h-full object-cover rounded-3xl"
                />

                {/* Text Overlay */}
                <div className="text-white absolute top-[34px] inset-0 flex flex-col text-center px-4">
                  <p className="text-[15px] font-medium">Shared Documents</p>
                  <p className="text-[30px] font-bold mt-[20px] mx-auto leading-snug">
                    Thousands of real student <br className="hidden md:block" />
                    notes, past exams
                    <br className="hidden md:block" /> & more!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div
                className={`bg-[#64addf] shadow-md flex justify-center items-center rounded-4xl md:h-[750px] md:w-full col-span-1
                  transition-all duration-700 ease-in transform
                  ${
                    showHero
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
              >
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  <img
                    src="src/assets/purple-bg.png"
                    alt=""
                    className="w-full h-full object-cover rounded-3xl"
                  />

                  {/* Text Overlay */}
                  <div className="text-white absolute top-[34px] inset-0 flex flex-col text-center px-4">
                    <p className="text-[15px] font-medium">Contribute & Earn</p>
                    <p className="text-[30px] font-bold mt-[20px] mx-auto leading-snug">
                      Upload your own materials{" "}
                      <br className="hidden md:block" />
                      to help others — and
                      <br className="hidden md:block" /> get rewarded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section
            className={`w-full flex flex-col px-18 items-center pt-[33px] text-center transition-all duration-700 ease-in transform ${
              showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="relative w-full">
              <img
                src="src/assets/sky.png"
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
        </section>

        {/* Premium Section */}
        <section ref={premiumRef} className="w-full px-18 flex flex-col">
          <h2 className="text-3xl md:text-[40px] font-semibold my-[90px] text-center">
            Unlock Logo’s full potential with <br className="hidden md:block" />{" "}
            Premium
          </h2>
          <div className="grid grid-cols-2 mt-0 gap-[33px]">
            <div
              className={`bg-[#4192fd] shadow-md flex justify-center items-center rounded-4xl p-16 md:h-[550px] md:w-full col-span-1
                transition-all duration-700 ease-in transform
                ${
                  showPremium
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
            >
              <div className="w-fit">
                <p className="text-white text-[15px] font-medium">No ads</p>
                <h1 className="font-bold mt-5 text-white text-[35px] leading-9">
                  Study distraction-free:
                  <br className="hidden md:block" /> Enjoy a no-ads
                  <br className="hidden md:block" /> experience!
                </h1>
                <button className="drop-shadow-[0_2px_5px_#b7e0fe] shadow-[inset_-4px_-4px_4px_#b7e0fe] mt-[73px] w-[238px] h-[87px] bg-white text-[#61b7f5] font-bold rounded-full pb-2">
                  <b className="text-[27px]">Study Now</b>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <div
                className={`bg-[#64addf] shadow-md flex justify-center items-center rounded-4xl p-16 md:h-[550px] md:w-full col-span-1
                  transition-all duration-700 ease-in transform
                  ${
                    showPremium
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
              >
                <div className="w-fit">
                  <p className="text-white text-[15px]">
                    <span className="font-medium">Download Documents</span>
                  </p>
                  <h1 className="font-bold mt-3 text-white text-[34px] leading-9">
                    No Wi-Fi? No problem!
                    <br className="hidden md:block" /> Download study
                    <br className="hidden md:block" /> materials to learn
                    offline.
                  </h1>
                  <div className="flex gap-5 mt-[43px] ml-[40px]">
                    <button className="drop-shadow-[0_10px_15px_#61b7f5] shadow-[inset_-4px_-4px_4px_#b7e0fe] text-[17px] w-[238px] h-[54px] bg-white text-[#61b7f5] rounded-full pb-2">
                      <i className="fa-solid fa-arrow-down"></i>{" "}
                      <b>Download doc</b>
                    </button>
                    <button className="drop-shadow-[0_10px_15px_#61b7f5] shadow-[inset_-4px_-4px_4px_#b7e0fe] text-[17px] w-[86px] h-[54px] bg-white rounded-full pb-2">
                      <i className="fa-solid fa-star text-[#F7CF30]"></i>{" "}
                      <span className="text-black font-bold">5.0</span>
                    </button>
                  </div>
                  <div className="flex gap-5 mt-[19px]">
                    <button className="drop-shadow-[0_10px_15px_#61b7f5] shadow-[inset_-4px_-4px_4px_#b7e0fe] text-[17px] w-[238px] h-[54px] bg-white text-[#61b7f5] rounded-full pb-2">
                      <i className="fa-solid fa-arrow-down"></i>{" "}
                      <b>Download doc</b>
                    </button>
                    <button className="drop-shadow-[0_10px_15px_#61b7f5] shadow-[inset_-4px_-4px_4px_#b7e0fe] text-[17px] w-[86px] h-[54px] bg-white font-bold rounded-full pb-2">
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
        {/* Final CTA Section */}
        <section ref={ctaRef} className="flex flex-col items-center pt-15">
          <div className="relative w-full">
            <img
              src="src/assets/yellow-bg.png"
              alt="Mobile App"
              className="min-h-[850px] h-auto w-full"
            />
            {/* LEFT TEXT */}
            <div
              className={`absolute w-[650px] top-1/2 left-[10%] transform -translate-y-1/2 text-black transition-all duration-700 ease-in ${
                showCtaText
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
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
              <p className="mb-12 text-[17px]">
                Elevate your study routine and unlock a world of knowledge at
                your fingertips! With our app, available on both iOS and
                Android, you can seamlessly access tools designed to improve
                your learning experience. Download now and start learning
                smarter, not harder!
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
            {/* RIGHT IMAGE */}
            <div
              className={`absolute w-[270px] top-1/2 right-[10%] transform -translate-y-1/2 transition-all duration-700 ease-in ${
                showCtaImage
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <img src="src/assets/phone.png" alt="Phone" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
