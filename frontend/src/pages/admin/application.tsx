import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/custom/Footer";
import { users } from "@/utils/usersData";
import { useState } from "react";

const features = [
  {
    title: "Cultural Archives",
    desc: "Explore a growing archive of stories, artifacts, and traditions from diverse communities.",
  },
  {
    title: "Community Contributions",
    desc: "Anyone can contribute stories, photos, and research to help preserve heritage.",
  },
  {
    title: "Admin Dashboard",
    desc: "Admins can review, approve, and manage all contributions and users.",
  },
];

export default function Application() {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pastlens.com';
  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col gap-10">
        <section className="text-center flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2">About Past Lens</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Past Lens is a collaborative platform dedicated to preserving and celebrating cultural heritage. Our mission is to empower communities to share their stories, traditions, and artifacts for future generations.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="h-full">
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <div className="px-6 pb-6 text-muted-foreground">{f.desc}</div>
            </Card>
          ))}
        </section>
        <section className="flex flex-col md:flex-row gap-8 items-center justify-between bg-card rounded-xl border p-8 shadow">
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-xl font-semibold">How to Contribute</h2>
            <p className="text-muted-foreground text-sm">
              1. Register or log in to your account.<br />
              2. Submit your story, photo, or research via the Contributions page.<br />
              3. Admins will review and publish your contribution to the archive.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[180px]">
            <span className="text-4xl font-bold text-primary">{users.length}</span>
            <span className="text-muted-foreground text-sm">Registered Users</span>
            <Button variant="outline" className="mt-2 w-full" onClick={handleCopy}>{copied ? "Copied!" : "Copy Site Link"}</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

