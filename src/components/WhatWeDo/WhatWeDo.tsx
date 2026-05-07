"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getSiteData } from "@/data/siteData";
import styles from "./WhatWeDo.module.css";
import Image from "next/image";
import { fixImageUrl } from "@/utils/imageUtils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSiteData().then(siteData => setData(siteData.whatWeDo));
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || data.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter((c) => c !== null);
      
      // Clear initial states
      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { zIndex: 10, y: 0, opacity: 1, scale: 1 });
        } else {
          gsap.set(card, { zIndex: 10 + i, y: "100%", opacity: 0, scale: 1 });
        }
      });

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${cards.length * 800}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        // Animate current card coming in
        mainTl.to(card, {
          y: 0,
          opacity: 1,
          duration: 2,
          ease: "none"
        });

        // Subtle scale back for the card being covered
        mainTl.to(cards[index - 1], {
          scale: 0.95,
          opacity: 0.3,
          duration: 2,
          ease: "none"
        }, "<"); 
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!mounted || data.length === 0) return null;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="label">[ 02 ] — Our Methodology</span>
          <h2 className="heading-lg">What We <span className="accent">Do</span></h2>
        </div>
        
        <div ref={containerRef} className={styles.cardsContainer}>
          {data.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={styles.card}
              style={{ zIndex: index + 1 }}
            >
              <div className={styles.cardContent}>
                <div className={styles.textSide}>
                  <span className={styles.number}>0{index + 1}</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>
                <div className={styles.imageSide}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={fixImageUrl(item.imageUrl)}
                      alt={item.title}
                      width={600}
                      height={400}
                      className={styles.image}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
