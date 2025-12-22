import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 1;
  const nextVdRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    // NOTE: your current logic turns loading off immediately because totalVideos === 1
    // keeping your original intent but making it correct:
    if (loadedVideos >= totalVideos) setLoading(false);
  }, [loadedVideos, totalVideos]);

  // Refresh ScrollTrigger after loading/layout settles (videos/tint/fonts can shift layout)
  useEffect(() => {
    if (!loading) ScrollTrigger.refresh();
  }, [loading]);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // Mini preview -> expand animation
  useGSAP(
    () => {
      if (!hasClicked) return;

      gsap.set("#next-video", { visibility: "visible" });

      gsap.to("#next-video", {
        transformOrigin: "center center",
        scale: 1,
        width: "100%",
        height: "100%",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => nextVdRef.current?.play(),
        overwrite: "auto",
      });

      gsap.from("#current-video", {
        transformOrigin: "center center",
        scale: 0,
        duration: 1.5,
        ease: "power1.inOut",
        overwrite: "auto",
      });
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  // Scroll morph for frame + title reveal (with optional polish)
  useGSAP(() => {
   

    // Title reveal: black title wipes up over the blue title
    gsap.set("#hero-title-bottom", {
      clipPath: "inset(100% 0 0 0)",
    });

    gsap.to("#hero-title-bottom", {
      clipPath: "inset(0% 0 0 0)",
      ease: "none",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Optional polish: fade the blue title out as black title comes in
    gsap.to("#hero-title-top", {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative top-[110px] h-[100%] w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 m-auto h-[500px] w-[88%] overflow-hidden rounded-lg bg-blue-75 md:w-[95%]"
      >
        <div>
          {/* Preview */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted
                  id="current-video"
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad}
                />
              </div>
            </VideoPreview>
          </div>

          {/* Tint over the full background video */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-black/45" />

          {/* Next video (expands when preview clicked) */}
          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          {/* Main background video */}
          <video
            src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 z-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* Stacked titles (perfect alignment) */}
        <div className="pointer-events-none absolute bottom-5 right-5 z-50">
          <h1
            id="hero-title-top"
            className="special-font hero-heading text-white md:!text-[4rem] !text-[3rem]"
          >
            Pre <b>A</b>cademy <br /> Foundation <b>P</b>hase
          </h1>

          <h1
            id="hero-title-bottom"
            className="special-font hero-heading absolute inset-0 text-black md:!text-[4rem] !text-[3rem]"
          >
            Pre <b>A</b>cademy <br /> Foundation <b>P</b>hase
          </h1>
        </div>

        {/* Left content */}
        <div className="absolute left-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-white md:!text-[4rem] !text-[3rem]">
              Beyond <b>h</b>ighlights
            </h1>

            <p className="mb-5 mt-5 max-w-64 font-robert-regular text-white">
              Enter the phases <br /> Belonging to the next generation.
            </p>

            <Button
              id="watch-trailer"
              title="Explore"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

