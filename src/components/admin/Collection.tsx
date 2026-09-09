import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/content";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "number" | "select" | "checkbox" | "image" | "images";
  options?: readonly string[];
  help?: string;
  required?: boolean;
};

type Row = Record<string, unknown> & { id: string };

const inputClass =
  "w-full rounded-2xl bg-surface px-4 py-3 font-body text-sm text-ink ring-1 ring-line focus:ring-2 focus:ring-amber focus:outline-none";

async function uploadImage(file: File) {
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signError || !data) throw new Error(signError?.message ?? "Could not create image link");
  return data.signedUrl;
}

function ImageField({
  value,
  onChange,
  multiple,
}: {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  multiple?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const list = multiple ? ((value as string[] | null) ?? []) : value ? [value as string] : [];

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadImage(file));
      onChange(multiple ? [...list, ...urls] : (urls[0] ?? null));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {list.map((url) => (
          <div key={url} className="relative">
            <img src={url} alt="" className="size-24 rounded-2xl object-cover ring-1 ring-line" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => {
                const next = list.filter((item) => item !== url);
                onChange(multiple ? next : null);
              }}
              className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-ink text-paper"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <label className="grid size-24 cursor-pointer place-items-center rounded-2xl bg-surface text-ink-soft ring-1 ring-line hover:text-ink">
          {busy ? <span className="font-body text-xs">…</span> : <Upload className="size-5" />}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
    </div>
  );
}

export function Collection({
  table,
  title,
  description,
  fields,
  titleField = "title",
  slugFrom = "title",
  queryKey,
  orderBy,
}: {
  table: string;
  title: string;
  description: string;
  fields: Field[];
  titleField?: string;
  slugFrom?: string | null;
  queryKey: string;
  orderBy?: { column: string; ascending?: boolean };
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", queryKey],
    queryFn: async () => {
      let request = supabase.from(table).select("*");
      if (orderBy) request = request.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await request;
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const payload = { ...values };
      if (slugFrom && !payload["slug"]) payload["slug"] = slugify(String(payload[slugFrom] ?? ""));
      const id = payload["id"] as string | undefined;
      delete payload["id"];
      const { error } = id
        ? await supabase.from(table).update(payload).eq("id", id)
        : await supabase.from(table).insert(payload);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setEditing(null);
      toast.success("Saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function blank(): Row {
    const row: Record<string, unknown> = { id: "" };
    for (const field of fields) {
      row[field.name] = field.type === "checkbox" ? true : field.type === "images" ? [] : "";
    }
    return row as Row;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const values: Record<string, unknown> = {};
    for (const field of fields) {
      const value = editing[field.name];
      if (field.type === "number") values[field.name] = value === "" || value == null ? null : Number(value);
      else if (field.type === "date") values[field.name] = value ? value : null;
      else values[field.name] = value ?? (field.type === "images" ? [] : "");
    }
    if (editing.id) values["id"] = editing.id;
    save.mutate(values);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-1 font-body text-sm text-ink-soft">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-sans text-sm font-medium text-paper hover:bg-ink/85"
        >
          <Plus className="size-4" /> Add new
        </button>
      </div>

      {editing ? (
        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-[24px] bg-paper p-6 ring-1 ring-line">
          {fields.map((field) => {
            const value = editing[field.name];
            const id = `${table}-${field.name}`;
            return (
              <div key={field.name}>
                <label htmlFor={id} className="font-sans text-sm font-medium text-ink">
                  {field.label}
                </label>
                {field.help ? (
                  <p className="mt-0.5 font-body text-xs text-ink-soft">{field.help}</p>
                ) : null}
                <div className="mt-2">
                  {field.type === "textarea" ? (
                    <textarea
                      id={id}
                      rows={5}
                      value={String(value ?? "")}
                      required={field.required}
                      onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                      className={inputClass}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={id}
                      value={String(value ?? "")}
                      onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Choose…</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <label className="flex items-center gap-2 font-body text-sm text-ink-soft">
                      <input
                        id={id}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => setEditing({ ...editing, [field.name]: e.target.checked })}
                        className="size-4 accent-[var(--amber)]"
                      />
                      Visible on the website
                    </label>
                  ) : field.type === "image" || field.type === "images" ? (
                    <ImageField
                      multiple={field.type === "images"}
                      value={(value as string | string[] | null) ?? null}
                      onChange={(next) => setEditing({ ...editing, [field.name]: next })}
                    />
                  ) : (
                    <input
                      id={id}
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      value={String(value ?? "")}
                      required={field.required}
                      onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                      className={inputClass}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-full bg-amber px-6 py-3 font-sans text-sm font-medium text-paper hover:bg-amber-deep disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full bg-surface px-6 py-3 font-sans text-sm font-medium text-ink ring-1 ring-line"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-8 grid gap-3">
        {isLoading ? <p className="font-body text-sm text-ink-soft">Loading…</p> : null}
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-paper px-5 py-4 ring-1 ring-line"
          >
            <div>
              <p className="font-sans text-sm font-medium text-ink">{String(row[titleField] ?? "Untitled")}</p>
              <p className="font-body text-xs text-ink-soft">
                {[row["location"], row["category"], row["status"], row["value"]]
                  .filter(Boolean)
                  .map(String)
                  .join(" · ")}
                {"published" in row && !row["published"] ? " · hidden" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing({ ...(row as Row) })}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 font-sans text-xs font-medium text-ink ring-1 ring-line"
              >
                <Pencil className="size-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this item? This cannot be undone.")) remove.mutate(row.id);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 font-sans text-xs font-medium text-destructive ring-1 ring-line"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
