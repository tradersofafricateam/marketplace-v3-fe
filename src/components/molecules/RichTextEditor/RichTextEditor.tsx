"use client";

import { EditorContent } from "@tiptap/react";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRichTextEditor } from "./useRichTextEditor";

const toolbarButtons = [
  { mark: "bold", icon: Bold, label: "Bold", run: (editor: NonNullable<ReturnType<typeof useRichTextEditor>>) => editor.chain().focus().toggleBold().run() },
  { mark: "italic", icon: Italic, label: "Italic", run: (editor: NonNullable<ReturnType<typeof useRichTextEditor>>) => editor.chain().focus().toggleItalic().run() },
  { mark: "orderedList", icon: ListOrdered, label: "Numbered list", run: (editor: NonNullable<ReturnType<typeof useRichTextEditor>>) => editor.chain().focus().toggleOrderedList().run() },
  { mark: "bulletList", icon: List, label: "Bulleted list", run: (editor: NonNullable<ReturnType<typeof useRichTextEditor>>) => editor.chain().focus().toggleBulletList().run() },
] as const;

const RichTextEditor = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
}: {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}) => {
  const editor = useRichTextEditor({ value, onChange, placeholder, disabled });

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div
        className={cn(
          "rounded-xl border border-border bg-background transition-all",
          "focus-within:border-(--orange)",
          error && "border-destructive",
        )}
      >
        <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
          {toolbarButtons.map(({ mark, icon: Icon, label: buttonLabel, run }) => (
            <button
              key={mark}
              type="button"
              aria-label={buttonLabel}
              aria-pressed={editor?.isActive(mark) ?? false}
              disabled={disabled || !editor}
              onClick={() => editor && run(editor)}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
                editor?.isActive(mark) && "bg-(--orange-light) text-(--orange)",
              )}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
        <EditorContent editor={editor} className="px-3.5 py-3" />
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
};

export default RichTextEditor;
