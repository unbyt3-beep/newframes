"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSiteData, type Execution } from "@/data/siteData";
import styles from "./Portfolio.module.css";

const CATEGORIES = ["All", "Corporate Office", "IT Campus", "Financial Office", "Innovation Center", "Co-Working", "Executive Suite"];

export default function Portfolio() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal(0.05);

  useEffect(() => {
    setMounted(true);
    getSiteData().then(data => setExecutions(data.executions));
  }, []);

  const filtered = activeCategory === "All"
    ? executions
    : executions.filter((e) => e.category === activeCategory);

  if (!mounted) return null;

  return (
    <section id="portfolio" className={`section ${styles.portfolio}`}>
      <div className="container">
        <div className={styles.header} ref={headerRef}>
          <span className="label">[ 04 ] — Our Executions</span>
          <h2 className={`heading-lg ${styles.heading}`}>
            Project <span className={styles.accent}>Executions</span>
          </h2>
          <p className="body-lg" style={{ maxWidth: "600px" }}>
            Explore our consultancy portfolio of transformative workspace
            projects delivered across India.
          </p>
        </div>

        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.grid} ref={gridRef}>
          {filtered.map((exec, i) => (
            <div
              key={exec.id}
              className={`${styles.card} ${hoveredId && hoveredId !== exec.id ? styles.cardDimmed : ""}`}
              style={{ gridRow: i === 0 ? "span 2" : undefined }}
              onMouseEnter={() => setHoveredId(exec.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={styles.cardImage}>
                <Image
                  src={exec.imageUrl}
                  alt={exec.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.cardImg}
                />
                <div className={styles.cardOverlay} />
                <div className={styles.cardBadge}>{exec.category}</div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span>{exec.year}</span>
                  <span className={styles.dot}>·</span>
                  <span>{exec.location}</span>
                </div>
                <h3 className={styles.cardTitle}>{exec.title}</h3>
                <p className={styles.cardDesc}>{exec.description}</p>
                <div className={styles.cardStats}>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatValue}>{exec.sqft}</span>
                    <span className={styles.cardStatLabel}>Sq. Ft.</span>
                  </div>
                  <div className={styles.cardStat}>
                    <span className={styles.cardStatValue}>{exec.client}</span>
                    <span className={styles.cardStatLabel}>Client</span>
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
