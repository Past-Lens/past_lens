import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { contributionData } from "@/utils/chartdata";

const communities = ["All", ...Array.from(new Set(contributionData.map(c => c.community)))];
const titles = ["All", ...Array.from(new Set(contributionData.map(c => c.title)))];
const statuses = ["Pending", "Approved", "InReview"];

function Contributions() {
  const [community, setCommunity] = useState("All");
  const [title, setTitle] = useState("All");
  const [status, setStatus] = useState("Pending");

  // Filtering logic will be added in next step

  return (
    <div className="p-6 w-full min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Community Filter */}
        <div>
          <label className="block text-xs font-semibold mb-1">Community</label>
          <select
            className="rounded border px-3 py-1 text-sm"
            value={community}
            onChange={e => setCommunity(e.target.value)}
          >
            {communities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {/* Title Filter */}
        <div>
          <label className="block text-xs font-semibold mb-1">Title</label>
          <select
            className="rounded border px-3 py-1 text-sm"
            value={title}
            onChange={e => setTitle(e.target.value)}
          >
            {titles.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold mb-1">Status</label>
          <select
            className="rounded border px-3 py-1 text-sm"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Contributions list */}
      <div className="space-y-4">
        {contributionData
          .filter(c =>
            (community === "All" || c.community === community) &&
            (title === "All" || c.title === title) &&
            (status === "Pending") // All are pending for now
          )
          .map((c, idx) => (
            <Card key={c.title + c.author.name + idx} className="shadow-md border bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b">
                <div>
                  <CardTitle className="text-base font-semibold mb-1">{c.title}</CardTitle>
                  <div className="text-xs text-muted-foreground mb-1">{c.community} &middot; {c.date}</div>
                  <div className="text-xs text-muted-foreground">By {c.author.name} ({c.author.role})</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-2 py-1 rounded bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition cursor-pointer text-xs">
                      Actions ▼
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">Approve</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" variant="destructive">Reject</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="py-4">
                <div className="mb-2 text-sm font-medium">{c.description}</div>
                <div className="mb-2 text-xs text-muted-foreground line-clamp-2">{c.content}</div>
                {/* Files preview (optional) */}
                {c.files && c.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.files.map((file, i) => (
                      <span key={file + i} className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">{file}</span>
                    ))}
                  </div>
                )}
                {/* Comment section (always visible) */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold mb-1" htmlFor={`comment-${idx}`}>Comment</label>
                  <textarea
                    id={`comment-${idx}`}
                    className="w-full rounded border px-2 py-1 text-xs min-h-[40px] bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add a comment..."
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        {contributionData.filter(c =>
          (community === "All" || c.community === community) &&
          (title === "All" || c.title === title) &&
          (status === "Pending")
        ).length === 0 && (
          <div className="text-center text-muted-foreground py-12">No contributions found for the selected filters.</div>
        )}
      </div>
    </div>
  );
}

export default function ContributionsPageWithForm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Contributions />
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition"
      >
        <PlusIcon className="w-5 h-5" />
        New Contribution
      </button>
      <MultiStepContributionForm open={open} onOpenChange={setOpen} />
    </>
  );
}
import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const contributionTypes = [
  "Story", "Proverb", "Song", "Architecture", "Ritual", "Music", "Art", "Other"
];
function MultiStepContributionForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    community: "",
    type: "",
    source: "",
    title: "",
    description: "",
    content: "",
    files: [] as File[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleNext() {
    setStep((s) => Math.min(s + 1, 4));
  }
  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setForm((f) => ({ ...f, files: files ? Array.from(files) : [] }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Submission logic here
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Contribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-2">
            {[1,2,3,4].map((s) => (
              <div key={s} className={`flex-1 h-2 mx-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
            ))}
          </div>
          {/* Step 1: Community */}
          {step === 1 && (
            <div>
              <label className="block text-xs font-semibold mb-1">Community</label>
              <select
                name="community"
                value={form.community}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>Select community</option>
                {communities.filter(c => c !== "All").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          {/* Step 2: Type */}
          {step === 2 && (
            <div>
              <label className="block text-xs font-semibold mb-1">Type of Contribution</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>Select type</option>
                {contributionTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
          {/* Step 3: Source (optional) */}
          {step === 3 && (
            <div>
              <label className="block text-xs font-semibold mb-1">Source (optional)</label>
              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 text-sm"
                placeholder="e.g. Book, Oral, Archive, etc."
              />
            </div>
          )}
          {/* Step 4: Details */}
          {step === 4 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Content</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Upload Files</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-slate-900"
                />
                {form.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.files.map((file, i) => (
                      <span key={file.name + i} className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">{file.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-row gap-2 justify-between mt-4">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
              )}
            </div>
            <div className="flex gap-2">
              {step < 4 && (
                <Button type="button" onClick={handleNext}>Next</Button>
              )}
              {step === 4 && (
                <Button type="submit">Submit</Button>
              )}
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
