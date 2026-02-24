import { useEffect, useState, useCallback, useRef, useMemo } from "react";

const AUTO_PLAY_DELAY = 8000;

const Header = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Load images once
  useEffect(() => {
    const modules = import.meta.glob<string>(
      "/src/images/*.{jpg,jpeg,png,gif}",
      { eager: true, as: "url" },
    );

    const loadedImages = Object.values(modules);
    setImages(loadedImages);
  }, []);

  // Memoized total length
  const totalImages = useMemo(() => images.length, [images]);

  // Clear interval helper
  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Start autoplay
  const startAutoPlay = useCallback(() => {
    clearAutoPlay();

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, AUTO_PLAY_DELAY);
  }, [clearAutoPlay, totalImages]);

  // Setup autoplay
  useEffect(() => {
    if (totalImages === 0) return;

    startAutoPlay();

    return () => clearAutoPlay();
  }, [totalImages, startAutoPlay, clearAutoPlay]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    startAutoPlay();
  }, [totalImages, startAutoPlay]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
    startAutoPlay();
  }, [totalImages, startAutoPlay]);

  // Preload next image (optimization)
  useEffect(() => {
    if (totalImages === 0) return;

    const nextIndex = (currentIndex + 1) % totalImages;
    const img = new Image();
    img.src = images[nextIndex];
  }, [currentIndex, images, totalImages]);

  if (totalImages === 0) return null;

  return (
    <div className="flex justify-center mt-6 mb-8">
      <div className="relative w-11/12 h-112 overflow-hidden rounded-lg shadow-lg group">
        <img
          src={images[currentIndex]}
          alt={`Banner ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-700"
          loading="eager"
        />

        {/* Previous */}
        <button
          onClick={handlePrevious}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition opacity-0 group-hover:opacity-100"
        >
          <ArrowLeft />
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition opacity-0 group-hover:opacity-100"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Header;

/* Extracted SVG components */
const ArrowLeft = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ArrowRight = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
