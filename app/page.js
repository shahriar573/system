"use client";
import { useEffect, useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorDot.current) {
        cursorDot.current.style.left = e.clientX + "px";
        cursorDot.current.style.top = e.clientY + "px";
      }
      if (cursorRing.current) {
        setTimeout(() => {
          if (cursorRing.current) {
            cursorRing.current.style.left = e.clientX + "px";
            cursorRing.current.style.top = e.clientY + "px";
          }
        }, 80);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="noise-overlay fixed inset-0 z-[1] pointer-events-none" />
      <div ref={cursorDot} className="cursor-dot" />
      <div ref={cursorRing} className="cursor-ring" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
