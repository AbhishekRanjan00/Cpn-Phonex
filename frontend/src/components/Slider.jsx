import React, { useEffect, useState } from "react";

const slides = [
  "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1400&q=80",
  "https://www.bigbasket.com/media/uploads/banner_images/hp_m_petstore_250923_400.jpg?tr=w-1130,q-80",
  "https://www.bigbasket.com/media/uploads/banner_images/hp_m_babycare_250923_400.jpg?tr=w-1130,q-80",
  "https://www.bigbasket.com/media/uploads/banner_images/hp_bcd_m_bcd_250923_400.jpg?tr=w-1130,q-80",
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // Slower for better viewing
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-[400px] overflow-hidden mt-4 rounded-xl shadow-md">
      {slides.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index + 1}`}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
    </div>
  );
};

export default Slider;
