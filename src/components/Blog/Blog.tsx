"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSiteData, type BlogPost } from "@/data/siteData";
import styles from "./Blog.module.css";
import { fixImageUrl } from "@/utils/imageUtils";

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal(0.1);

  useEffect(() => {
    getSiteData().then(data => setBlogs(data.blogs));
  }, []);

  const featured = blogs.find((b) => b.featured);
  const others = blogs.filter((b) => !b.featured);

  return (
    <section id="blog" className={`section ${styles.blog}`}>
      <div className="container">
        <div className={styles.header} ref={headerRef}>
          <span className="label">[ 08 ] — Insights</span>
          <h2 className={`heading-lg ${styles.heading}`}>
            Latest <span className={styles.accent}>Thinking</span>
          </h2>
        </div>

        <div className={styles.layout} ref={gridRef}>
          {featured && (
            <article className={styles.featured}>
              <div className={styles.featuredImage}>
                <Image 
                  src={fixImageUrl(featured.imageUrl)} 
                  alt={featured.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 60vw" 
                  className={styles.featuredImg} 
                />
                <div className={styles.featuredOverlay} />
                <div className={styles.featuredBadge}>{featured.category}</div>
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.featuredDate}>{new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <h3 className={styles.featuredTitle}>{featured.title}</h3>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <span className={styles.readMore}>Read Article <span>→</span></span>
              </div>
            </article>
          )}

          <div className={styles.sideList}>
            {others.map((post: any) => (
              <article key={post.id} className={styles.sidePost}>
                <div className={styles.sideImageWrap}>
                  <Image 
                    src={fixImageUrl(post.imageUrl)} 
                    alt={post.title} 
                    fill 
                    sizes="100px" 
                    className={styles.sideImg} 
                  />
                </div>
                <div className={styles.sideContent}>
                  <div className={styles.sideMeta}>
                    <span className={styles.sideCategory}>{post.category}</span>
                    <span className={styles.sideDate}>{new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>
                  <h4 className={styles.sideTitle}>{post.title}</h4>
                  <p className={styles.sideExcerpt}>{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
