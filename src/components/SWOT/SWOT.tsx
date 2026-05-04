"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getSiteData } from "@/data/siteData";
import styles from "./SWOT.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SWOTAnalysis() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSiteData().then(siteData => setData(siteData.swot));
  }, []);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(`.${styles.swotCard}`);
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [data]);

  if (!mounted || !data) return null;

  return (
    <section id="swot" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <span className="label">[ 05 ] — Strategic Insight</span>
          <h2 className="heading-lg">SWOT <span className="accent">Analysis</span></h2>
          <p className="body-lg" style={{ maxWidth: "700px", margin: "1.5rem auto" }}>
            Our expertise includes a deep understanding of our strategic position, allowing us to leverage strengths and mitigate risks effectively.
          </p>
        </div>

        <div ref={containerRef} className={styles.grid}>
          {/* Strengths */}
          <div className={`${styles.swotCard} ${styles.strengths}`}>
            <div className={styles.cardHeader}>
              <span className={styles.letter}>S</span>
              <h3 className={styles.cardTitle}>Strengths</h3>
            </div>
            <ul className={styles.list}>
              {data.strengths.map((item: string, i: number) => (
                <li key={`strength-${i}`} className={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className={`${styles.swotCard} ${styles.weaknesses}`}>
            <div className={styles.cardHeader}>
              <span className={styles.letter}>W</span>
              <h3 className={styles.cardTitle}>Weaknesses</h3>
            </div>
            <ul className={styles.list}>
              {data.weaknesses.map((item: string, i: number) => (
                <li key={`weakness-${i}`} className={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className={`${styles.swotCard} ${styles.opportunities}`}>
            <div className={styles.cardHeader}>
              <span className={styles.letter}>O</span>
              <h3 className={styles.cardTitle}>Opportunities</h3>
            </div>
            <ul className={styles.list}>
              {data.opportunities.map((item: string, i: number) => (
                <li key={`opportunity-${i}`} className={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className={`${styles.swotCard} ${styles.threats}`}>
            <div className={styles.cardHeader}>
              <span className={styles.letter}>T</span>
              <h3 className={styles.cardTitle}>Threats</h3>
            </div>
            <ul className={styles.list}>
              {data.threats.map((item: string, i: number) => (
                <li key={`threat-${i}`} className={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
