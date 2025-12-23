// components/TopStories.jsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// Replace these with your real stories (CMS later)
const topStories = [
  {
    id: "story-1",
    category: "Pre-academy",
    title: "Manchester United Win the Christmas Cup",
    author: "Controllah Gabi",
    date: "22 Dec 2025",
    href: "/stories/pre-academy-grind",
    imageSrc: "/img/pakistaniplayer.jpg",
    featured: true,
  },
  {
    id: "story-2",
    category: "Foundation Phase",
    title: "Manchester City Lech Cup Winners",
    author: "Controllah Gabi",
    date: "12 Dec 2025",
    href: "/stories/decision-speed",
    imageSrc: "/img/masonnews3.jpg",
  },
  {
    id: "story-3",
    category: "Pathway",
    title: "Scholarships Explained: What Actually Changes At U16",
    author: "The Phases",
    date: "20 Dec 2025",
    href: "/stories/u16-scholarship-explained",
    imageSrc: "/img/charlieburnet.jpg",
  },
  {
    id: "story-4",
    category: "Scouting",
    title: "What Scouts Notice In The First 5 Minutes (And What They Don’t)",
    author: "The Phases",
    date: "19 Dec 2025",
    href: "/stories/scouts-first-5-minutes",
    imageSrc: "/img/stories/story-4.jpg",
  }
];

const FeaturedStory = ({ story }) => {
  return (
    <a
      data-featured
      href={story.href}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-black/30"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4]">
        <img
          src={story.imageSrc}
          alt={story.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          loading="eager"
        />
        {/* editorial overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        {/* subtle sheen */}
        <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-wider text-white/80">
            {story.category}
          </span>
          <span className="text-xs text-white/60">{story.date}</span>
        </div>

        <h3 className="text-xl font-semibold leading-snug text-white md:text-2xl">
          {story.title}
        </h3>

        <p className="mt-3 text-sm text-white/70">
          By {story.author}
        </p>
      </div>
    </a>
  );
};

const StoryRow = ({ story }) => {
  return (
    <a
      data-item
      href={story.href}
      className="group flex gap-4 rounded-2xl border border-white/10 p-3 transition"
    >
      <div className="relative h-[200px] w-[300px] flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={story.imageSrc}
          alt={story.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
       
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-black/60">
            {story.category}
          </span>
          <span className="text-xs text-black/40">•</span>
          <time className="text-xs text-black/50">{story.date}</time>
        </div>

        <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-black">
          {story.title}
        </h4>

        <p className="mt-1 text-xs text-black/60">By {story.author}</p>
      </div>
    </a>
  );
};

const TopStories = () => {
  const sectionRef = useRef(null);

  const featured = topStories.find((s) => s.featured) ?? topStories[0];
  const rest = topStories.filter((s) => s.id !== featured.id).slice(0, 4);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const title = section.querySelector("[data-title]");
      const featuredEl = section.querySelector("[data-featured]");
      const items = section.querySelectorAll("[data-item]");

      gsap.fromTo(
        title,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        }
      );

      gsap.fromTo(
        featuredEl,
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%" },
        }
      );

      gsap.fromTo(
        items,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 80%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <>
    
    <section
      ref={sectionRef}
      id="top-stories"
      className="relative mx-auto w-[88%] md:w-[95%] pb-10 pt-20 top-[100px] h-[973px]"
    >
      {/* soft background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-6 h-52 w-[92%] -translate-x-1/2 rounded-[40px]" />
      </div>

  
      {/* 50/50 layout */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 h-[573px]">
        <FeaturedStory story={featured} />

        <div className="flex flex-col gap-3">
          {rest.map((story) => (
            <StoryRow key={story.id} story={story} />
          ))}

          {/* optional: a small callout card */}
          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <p className="text-sm text-white/70">
              Want weekly watchlists and development breakdowns?
            </p>
            <button className="mt-3 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/15">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
    </section>
    
    
    </>
  );
};

export default TopStories;


