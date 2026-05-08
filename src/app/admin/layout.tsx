import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Frames n Spaces",
  description: "Admin panel for managing Frames n Spaces website content.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
