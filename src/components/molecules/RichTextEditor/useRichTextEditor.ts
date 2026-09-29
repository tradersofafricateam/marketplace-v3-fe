"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * Paragraphs, bold, italic and lists only - deliberately narrower than
 * StarterKit's defaults (no headings/blockquotes/code blocks) since this
 * editor is for product/company descriptions, not rich documents.
 */
export const useRichTextEditor = ({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) =>
  useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Tailwind's preflight strips list markers, so they're restored here -
        // there's no typography plugin installed to lean on instead.
        class:
          "min-h-40 text-sm leading-6 text-foreground focus:outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
