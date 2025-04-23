import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdSlider = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get('https://agroapi-qwvb.onrender.com/ads/')
      .then((response) => setAds(response.data))
      .catch((error) => console.error('Erreur lors du chargement des publicités', error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, ads]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (ads.length === 0) return null;

  return (
    <div className="relative w-full h-60 md:h-72 bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Image slider */}
      <img
        src={ads[currentIndex].image_url}
        alt={ads[currentIndex].title}
        className="w-full h-full object-cover transition-all duration-700 ease-in-out"
      />

      {/* Overlay for title and description */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <h2 className="text-lg md:text-xl font-bold">{ads[currentIndex].title}</h2>
        <p className="text-sm md:text-base">{ads[currentIndex].description}</p>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
      >
        <ChevronRight />
      </button>

      {/* Dots indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdSlider;
