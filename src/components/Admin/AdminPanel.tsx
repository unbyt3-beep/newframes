"use client";

import { useState, useEffect } from "react";
import {
  getSiteData,
  saveSiteData,
  getPasscode,
  setPasscode,
  isAdminAuthenticated,
  setAdminAuth,
  generateId,
  type SiteData,
  type Service,
  type Execution,
  type BlogPost,
  type HeroData,
  type AboutData,
} from "@/data/siteData";
import styles from "./AdminPanel.module.css";

type Tab = "hero" | "about" | "stats" | "services" | "executions" | "blogs" | "clientele" | "settings";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [data, setData] = useState<SiteData | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newPasscode, setNewPasscode] = useState("");
  const [passMsg, setPassMsg] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAuthenticated(true);
      getSiteData().then(setData);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput })
      });
      const result = await res.json();
      if (result.success) {
        setPasscode(passcodeInput);
        setAdminAuth(true);
        setAuthenticated(true);
        getSiteData().then(setData);
        setError("");
      } else {
        setError("Incorrect passcode. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setAuthenticated(false);
    setData(null);
  };

  const save = async (newData: SiteData) => {
    setData(newData);
    await saveSiteData(newData);
  };

  const handlePasscodeChange = () => {
    if (newPasscode.length < 6) {
      setPassMsg("Passcode must be at least 6 characters.");
      return;
    }
    setPasscode(newPasscode);
    setPassMsg("Passcode updated successfully!");
    setNewPasscode("");
    setTimeout(() => setPassMsg(""), 3000);
  };

  // ── Hero ──
  const updateHero = (updates: Partial<HeroData>) => {
    if (!data) return;
    save({ ...data, hero: { ...data.hero, ...updates } });
  };

  // ── About ──
  const updateAbout = (updates: Partial<AboutData>) => {
    if (!data) return;
    save({ ...data, about: { ...data.about, ...updates } });
  };

  // ── Stats ──
  const updateStat = (id: string, updates: Partial<{ value: number; label: string; suffix: string }>) => {
    if (!data) return;
    save({ ...data, stats: data.stats.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
  };

  // ── Service CRUD ──
  const addService = () => {
    if (!data) return;
    const newSvc: Service = {
      id: generateId(),
      title: "New Service",
      subtitle: "Subtitle",
      description: "Service description here.",
      icon: "◈",
      features: ["Feature 1"],
      imageUrl: "/images/exec1.png",
    };
    save({ ...data, services: [...data.services, newSvc] });
    setEditingItem(newSvc.id);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    if (!data) return;
    save({ ...data, services: data.services.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
  };

  const deleteService = (id: string) => {
    if (!data) return;
    save({ ...data, services: data.services.filter((s) => s.id !== id) });
  };

  // ── Execution CRUD ──
  const addExecution = () => {
    if (!data) return;
    const newExec: Execution = {
      id: generateId(),
      title: "New Project",
      client: "Client Name",
      location: "City, India",
      category: "Corporate Office",
      description: "Project description.",
      imageUrl: "/images/exec1.png",
      year: new Date().getFullYear().toString(),
      sqft: "10,000",
    };
    save({ ...data, executions: [...data.executions, newExec] });
    setEditingItem(newExec.id);
  };

  const updateExecution = (id: string, updates: Partial<Execution>) => {
    if (!data) return;
    save({ ...data, executions: data.executions.map((e) => (e.id === id ? { ...e, ...updates } : e)) });
  };

  const deleteExecution = (id: string) => {
    if (!data) return;
    save({ ...data, executions: data.executions.filter((e) => e.id !== id) });
  };

  // ── Blog CRUD ──
  const addBlog = () => {
    if (!data) return;
    const newBlog: BlogPost = {
      id: generateId(),
      title: "New Blog Post",
      excerpt: "Blog post excerpt.",
      content: "Full blog content here.",
      author: "Frames n Spaces Team",
      date: new Date().toISOString().split("T")[0],
      category: "Design",
      imageUrl: "/images/exec1.png",
      featured: false,
    };
    save({ ...data, blogs: [...data.blogs, newBlog] });
    setEditingItem(newBlog.id);
  };

  const updateBlog = (id: string, updates: Partial<BlogPost>) => {
    if (!data) return;
    save({ ...data, blogs: data.blogs.map((b) => (b.id === id ? { ...b, ...updates } : b)) });
  };

  const deleteBlog = (id: string) => {
    if (!data) return;
    save({ ...data, blogs: data.blogs.filter((b) => b.id !== id) });
  };

  // ── Clientele CRUD ──
  const addClient = () => {
    if (!data) return;
    save({ ...data, clientele: [...data.clientele, { name: "New Client", logo: "" }] });
  };

  const updateClient = (index: number, updates: Partial<{ name: string; logo: string }>) => {
    if (!data) return;
    const newClientele = [...data.clientele];
    newClientele[index] = { ...newClientele[index], ...updates };
    save({ ...data, clientele: newClientele });
  };

  const deleteClient = (index: number) => {
    if (!data) return;
    save({ ...data, clientele: data.clientele.filter((_, i) => i !== index) });
  };

  // ── Passcode Gate ──
  if (!authenticated) {
    return (
      <div className={styles.gate}>
        <div className={styles.gateCard}>
          <div className={styles.gateLogo}>
            <span className={styles.gateIcon}>◈</span>
            <span className={styles.gateBrand}>Frames n Spaces</span>
          </div>
          <h1 className={styles.gateTitle}>Admin Access</h1>
          <p className={styles.gateSubtitle}>Enter your passcode to access the admin panel.</p>
          <form onSubmit={handleLogin} className={styles.gateForm}>
            <div className={styles.gateField}>
              <input type="password" value={passcodeInput} onChange={(e) => setPasscodeInput(e.target.value)} placeholder="Enter passcode" className={styles.gateInput} autoFocus />
            </div>
            {error && <p className={styles.gateError}>{error}</p>}
            <button type="submit" className={styles.gateBtn}>Access Panel</button>
          </form>
          <a href="/" className={styles.gateBack}>← Back to Website</a>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ──
  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo}>
            <span className={styles.gateIcon}>◈</span>
            <div>
              <span className={styles.sidebarBrand}>Frames n Spaces</span>
              <span className={styles.sidebarRole}>Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {([
            { key: "hero", label: "Hero Section", icon: "🏠" },
            { key: "about", label: "About Section", icon: "ℹ️" },
            { key: "stats", label: "Stats", icon: "📊" },
            { key: "services", label: "Services", icon: "◇" },
            { key: "executions", label: "Executions", icon: "◆" },
            { key: "blogs", label: "Blog Posts", icon: "◈" },
            { key: "clientele", label: "Clientele", icon: "🤝" },
          ] as { key: Tab; label: string; icon: string }[]).map((tab) => (
            <button
              key={tab.key}
              className={`${styles.navItem} ${activeTab === tab.key ? styles.navItemActive : ""}`}
              onClick={() => { setActiveTab(tab.key); setEditingItem(null); }}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <a href="/" className={styles.viewSite}>View Website →</a>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>
            {activeTab === "hero" && "Edit Hero Section"}
            {activeTab === "about" && "Edit About Section"}
            {activeTab === "stats" && "Edit Stats"}
            {activeTab === "services" && "Manage Services"}
            {activeTab === "executions" && "Manage Executions"}
            {activeTab === "blogs" && "Manage Blog Posts"}
            {activeTab === "clientele" && "Manage Clientele"}
          </h1>
          {(activeTab === "services" || activeTab === "executions" || activeTab === "blogs" || activeTab === "clientele") && (
            <button className={styles.addBtn} onClick={() => {
              if (activeTab === "services") addService();
              if (activeTab === "executions") addExecution();
              if (activeTab === "blogs") addBlog();
              if (activeTab === "clientele") addClient();
            }}>+ Add New</button>
          )}
        </div>

        <div className={styles.content}>
          {/* ── Hero Tab ── */}
          {activeTab === "hero" && data && (
            <div className={styles.settingsPanel}>
              <div className={styles.settingsSection}>
                <h3 className={styles.settingsTitle}>Hero Content</h3>
                <div className={styles.editRow}>
                  <label>Heading Line 1</label>
                  <input value={data.hero.heading1} onChange={(e) => updateHero({ heading1: e.target.value })} />
                </div>
                <div className={styles.editRow}>
                  <label>Heading Line 2</label>
                  <input value={data.hero.heading2} onChange={(e) => updateHero({ heading2: e.target.value })} />
                </div>
                <div className={styles.editRow}>
                  <label>Heading Accent Word</label>
                  <input value={data.hero.headingAccent} onChange={(e) => updateHero({ headingAccent: e.target.value })} />
                </div>
                <div className={styles.editRow}>
                  <label>Subtitle</label>
                  <textarea value={data.hero.subtitle} onChange={(e) => updateHero({ subtitle: e.target.value })} rows={3} />
                </div>
                <div className={styles.editRow}>
                  <label>Background Image URL</label>
                  <input value={data.hero.imageUrl} onChange={(e) => updateHero({ imageUrl: e.target.value })} placeholder="/images/hero-bg.png" />
                </div>
                {data.hero.imageUrl && (
                  <div className={styles.imagePreview}>
                    <img src={data.hero.imageUrl} alt="Hero preview" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── About Tab ── */}
          {activeTab === "about" && data && (
            <div className={styles.settingsPanel}>
              <div className={styles.settingsSection}>
                <h3 className={styles.settingsTitle}>About Content</h3>
                <div className={styles.editRow}>
                  <label>Heading</label>
                  <input value={data.about.heading} onChange={(e) => updateAbout({ heading: e.target.value })} />
                </div>
                <div className={styles.editRow}>
                  <label>Heading Accent</label>
                  <input value={data.about.headingAccent} onChange={(e) => updateAbout({ headingAccent: e.target.value })} />
                </div>
                <div className={styles.editRow}>
                  <label>Description 1</label>
                  <textarea value={data.about.description1} onChange={(e) => updateAbout({ description1: e.target.value })} rows={4} />
                </div>
                <div className={styles.editRow}>
                  <label>Description 2</label>
                  <textarea value={data.about.description2} onChange={(e) => updateAbout({ description2: e.target.value })} rows={4} />
                </div>
                <div className={styles.editRow}>
                  <label>About Image URL</label>
                  <input value={data.about.imageUrl} onChange={(e) => updateAbout({ imageUrl: e.target.value })} placeholder="/images/about.png" />
                </div>
                {data.about.imageUrl && (
                  <div className={styles.imagePreview}>
                    <img src={data.about.imageUrl} alt="About preview" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Stats Tab ── */}
          {activeTab === "stats" && data && (
            <div className={styles.settingsPanel}>
              <div className={styles.settingsSection}>
                <h3 className={styles.settingsTitle}>Company Statistics</h3>
                {data.stats.map((stat) => (
                  <div key={stat.id} className={styles.statEditCard}>
                    <div className={styles.editRow}>
                      <label>Label</label>
                      <input value={stat.label} onChange={(e) => updateStat(stat.id, { label: e.target.value.toUpperCase() })} />
                    </div>
                    <div className={styles.editRow}>
                      <label>Value</label>
                      <input type="number" value={stat.value} onChange={(e) => updateStat(stat.id, { value: Number(e.target.value) })} />
                    </div>
                    <div className={styles.editRow}>
                      <label>Suffix (e.g. +)</label>
                      <input value={stat.suffix} onChange={(e) => updateStat(stat.id, { suffix: e.target.value })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Services Tab ── */}
          {activeTab === "services" && data?.services.map((svc) => (
            <div key={svc.id} className={`${styles.itemCard} ${editingItem === svc.id ? styles.itemCardEditing : ""}`}>
              {editingItem === svc.id ? (
                <div className={styles.editForm}>
                  <div className={styles.editGrid}>
                    <div className={styles.editRow}><label>Title</label><input value={svc.title} onChange={(e) => updateService(svc.id, { title: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Subtitle</label><input value={svc.subtitle} onChange={(e) => updateService(svc.id, { subtitle: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Icon</label><input value={svc.icon} onChange={(e) => updateService(svc.id, { icon: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Image URL</label><input value={svc.imageUrl} onChange={(e) => updateService(svc.id, { imageUrl: e.target.value })} /></div>
                  </div>
                  <div className={styles.editRow}><label>Description</label><textarea value={svc.description} onChange={(e) => updateService(svc.id, { description: e.target.value })} rows={3} /></div>
                  <div className={styles.editRow}><label>Features (one per line)</label><textarea value={svc.features.join("\n")} onChange={(e) => updateService(svc.id, { features: e.target.value.split("\n").filter(Boolean) })} rows={4} /></div>
                  {svc.imageUrl && <div className={styles.imagePreview}><img src={svc.imageUrl} alt="Service preview" /></div>}
                  <button className={styles.doneBtn} onClick={() => setEditingItem(null)}>Done Editing</button>
                </div>
              ) : (
                <div className={styles.itemPreview}>
                  <div className={styles.itemLeft}>
                    <span className={styles.itemIcon}>{svc.icon}</span>
                    <div><h3 className={styles.itemTitle}>{svc.title}</h3><p className={styles.itemSub}>{svc.subtitle}</p></div>
                  </div>
                  <div className={styles.itemActions}>
                    <button className={styles.editBtn} onClick={() => setEditingItem(svc.id)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => deleteService(svc.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ── Executions Tab ── */}
          {activeTab === "executions" && data?.executions.map((exec) => (
            <div key={exec.id} className={`${styles.itemCard} ${editingItem === exec.id ? styles.itemCardEditing : ""}`}>
              {editingItem === exec.id ? (
                <div className={styles.editForm}>
                  <div className={styles.editGrid}>
                    <div className={styles.editRow}><label>Title</label><input value={exec.title} onChange={(e) => updateExecution(exec.id, { title: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Client</label><input value={exec.client} onChange={(e) => updateExecution(exec.id, { client: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Location</label><input value={exec.location} onChange={(e) => updateExecution(exec.id, { location: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Category</label><input value={exec.category} onChange={(e) => updateExecution(exec.id, { category: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Year</label><input value={exec.year} onChange={(e) => updateExecution(exec.id, { year: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Sq. Ft.</label><input value={exec.sqft} onChange={(e) => updateExecution(exec.id, { sqft: e.target.value })} /></div>
                  </div>
                  <div className={styles.editRow}><label>Description</label><textarea value={exec.description} onChange={(e) => updateExecution(exec.id, { description: e.target.value })} rows={3} /></div>
                  <div className={styles.editRow}><label>Image URL</label><input value={exec.imageUrl} onChange={(e) => updateExecution(exec.id, { imageUrl: e.target.value })} /></div>
                  {exec.imageUrl && <div className={styles.imagePreview}><img src={exec.imageUrl} alt="Execution preview" /></div>}
                  <button className={styles.doneBtn} onClick={() => setEditingItem(null)}>Done Editing</button>
                </div>
              ) : (
                <div className={styles.itemPreview}>
                  <div className={styles.itemLeft}>
                    {exec.imageUrl && <div className={styles.itemThumb} style={{ backgroundImage: `url(${exec.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                    <div><h3 className={styles.itemTitle}>{exec.title}</h3><p className={styles.itemSub}>{exec.client} · {exec.location} · {exec.year}</p></div>
                  </div>
                  <div className={styles.itemActions}>
                    <button className={styles.editBtn} onClick={() => setEditingItem(exec.id)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => deleteExecution(exec.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ── Blogs Tab ── */}
          {activeTab === "blogs" && data?.blogs.map((blog) => (
            <div key={blog.id} className={`${styles.itemCard} ${editingItem === blog.id ? styles.itemCardEditing : ""}`}>
              {editingItem === blog.id ? (
                <div className={styles.editForm}>
                  <div className={styles.editGrid}>
                    <div className={styles.editRow}><label>Title</label><input value={blog.title} onChange={(e) => updateBlog(blog.id, { title: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Category</label><input value={blog.category} onChange={(e) => updateBlog(blog.id, { category: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Author</label><input value={blog.author} onChange={(e) => updateBlog(blog.id, { author: e.target.value })} /></div>
                    <div className={styles.editRow}><label>Date</label><input type="date" value={blog.date} onChange={(e) => updateBlog(blog.id, { date: e.target.value })} /></div>
                  </div>
                  <div className={styles.editRow}><label>Excerpt</label><textarea value={blog.excerpt} onChange={(e) => updateBlog(blog.id, { excerpt: e.target.value })} rows={2} /></div>
                  <div className={styles.editRow}><label>Content</label><textarea value={blog.content} onChange={(e) => updateBlog(blog.id, { content: e.target.value })} rows={6} /></div>
                  <div className={styles.editRow}><label>Image URL</label><input value={blog.imageUrl} onChange={(e) => updateBlog(blog.id, { imageUrl: e.target.value })} /></div>
                  {blog.imageUrl && <div className={styles.imagePreview}><img src={blog.imageUrl} alt="Blog preview" /></div>}
                  <div className={styles.editRow}>
                    <label className={styles.checkLabel}><input type="checkbox" checked={blog.featured} onChange={(e) => updateBlog(blog.id, { featured: e.target.checked })} />Featured Post</label>
                  </div>
                  <button className={styles.doneBtn} onClick={() => setEditingItem(null)}>Done Editing</button>
                </div>
              ) : (
                <div className={styles.itemPreview}>
                  <div className={styles.itemLeft}>
                    <div><h3 className={styles.itemTitle}>{blog.featured && <span className={styles.featuredBadge}>★</span>}{blog.title}</h3><p className={styles.itemSub}>{blog.category} · {blog.author} · {blog.date}</p></div>
                  </div>
                  <div className={styles.itemActions}>
                    <button className={styles.editBtn} onClick={() => setEditingItem(blog.id)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => deleteBlog(blog.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ── Clientele Tab ── */}
          {activeTab === "clientele" && data?.clientele.map((client, index) => (
            <div key={index} className={styles.itemCard}>
              <div className={styles.editForm}>
                <div className={styles.editGrid}>
                  <div className={styles.editRow}>
                    <label>Client Name</label>
                    <input value={client.name} onChange={(e) => updateClient(index, { name: e.target.value })} />
                  </div>
                  <div className={styles.editRow}>
                    <label>Logo PNG URL</label>
                    <input value={client.logo} onChange={(e) => updateClient(index, { logo: e.target.value })} placeholder="/images/logos/client.png" />
                  </div>
                </div>
                {client.logo && (
                  <div className={styles.imagePreview}>
                    <img src={client.logo} alt="Client logo preview" style={{ maxHeight: '100px', width: 'auto' }} />
                  </div>
                )}
                <div style={{ marginTop: '1rem' }}>
                  <button className={styles.deleteBtn} onClick={() => deleteClient(index)}>Delete Client</button>
                </div>
              </div>
            </div>
          ))}


        </div>
      </main>
    </div>
  );
}
