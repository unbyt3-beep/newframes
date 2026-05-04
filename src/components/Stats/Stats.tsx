"use client";

import { useEffect, useState } from "react";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";
import { getSiteData, type Stat } from "@/data/siteData";
import styles from "./Stats.module.css";

function StatItem({ stat }: { stat: Stat }) {
  const countRef = useCountUp(stat.value, 2.5);
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>
        <span ref={countRef}>0</span>
        <span className={styles.statSuffix}>{stat.suffix}</span>
      </div>
      <div className={styles.statLine} />
      <span className={styles.statLabel}>{stat.label}</span>
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const sectionRef = useScrollReveal(0.2);

  useEffect(() => {
    getSiteData().then(data => setStats(data.stats));
  }, []);

  return (
    <section className={`${styles.stats}`} ref={sectionRef}>
      <div className={styles.bgAccent} />
      <div className="container">
        <div className={styles.header}>
          <span className="label">[ 07 ] — Market Impact</span>
        </div>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <StatItem key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
