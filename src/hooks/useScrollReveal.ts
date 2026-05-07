"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP-powered scroll-triggered reveal animation.
 * Smooth, buttery animations driven by ScrollTrigger.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(el, { opacity: 0, y: 70 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          });
        },
      });
    });

    return () => ctx.revert();
  }, [threshold]);

  return ref;
}

/**
 * GSAP staggered children reveal.
 */
export function useStaggerReveal(staggerDelay = 0.12) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(".stagger-child");
    if (children.length === 0) return;

    gsap.set(children, { opacity: 0, y: 50 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: staggerDelay,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [staggerDelay]);

  return containerRef;
}

/**
 * GSAP parallax scrolling effect.
 */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [speed]);

  return ref;
}

/**
 * Horizontal text scroll animation (marquee-like).
 */
export function useHorizontalScroll(direction: "left" | "right" = "left") {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xValue = direction === "left" ? -200 : 200;

    gsap.to(el, {
      x: xValue,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction]);

  return ref;
}

/**
 * Animated counter hook for stats — GSAP powered.
 */
export function useCountUp(target: number, duration = 2.5) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;
    hasAnimated.current = true;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        const current = Math.floor(obj.val);
        el.textContent =
          target >= 1000 ? current.toLocaleString() : current.toString();
      },
    });
  }, [target, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: animate,
      });
    });

    return () => ctx.revert();
  }, [animate]);

  return ref;
}

/**
 * Text split reveal animation — words fly in.
 */
export function useTextReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll(".word");
    if (words.length === 0) return;

    gsap.set(words, { opacity: 0, y: "100%", rotateX: -40 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(words, {
          opacity: 1,
          y: "0%",
          rotateX: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}
