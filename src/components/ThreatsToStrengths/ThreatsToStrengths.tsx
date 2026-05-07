"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getSiteData } from "@/data/siteData";
import styles from "./ThreatsToStrengths.module.css";

export default function ThreatsToStrengths() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSiteData().then(siteData => setData(siteData.threatsToStrengths));
  }, []);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      gsap.fromTo(
        q(`.${styles.item}`),
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [data]);

  if (!mounted || data.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left}>
            <span className="label">[ 06 ] — Transformation</span>
            <h2 className="heading-lg">
              How to Convert <br />
              <span className="accent">Threats into Strength</span>
            </h2>
            <p className="body-lg" style={{ marginTop: "2rem", opacity: 0.8 }}>
              Our strategic advisory turns potential market risks into competitive advantages through specialized expertise and structured processes.
            </p>
          </div>
          
          <div ref={containerRef} className={styles.right}>
            {data.map((item: any, index: number) => (
              <div 
                key={item.id} 
                className={`${styles.item} ${selectedId === item.id ? styles.itemSelected : ""}`}
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
              >
                <div className={styles.itemHeader}>
                  <div className={styles.dot} />
                  <span className={styles.text}>{item.title}</span>
                  <span className={styles.plus}>{selectedId === item.id ? "−" : "+"}</span>
                </div>
                <div className={`${styles.details} ${selectedId === item.id ? styles.detailsVisible : ""}`}>
                  <p>{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
