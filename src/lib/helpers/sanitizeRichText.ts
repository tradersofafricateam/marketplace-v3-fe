const ALLOWED_TAGS = new Set(["P", "STRONG", "EM", "B", "I", "UL", "OL", "LI", "BR"]);

/**
 * Strips anything outside our rich-text editor's own output shape before it
 * reaches dangerouslySetInnerHTML - defends against a payload that bypassed
 * the editor (e.g. a direct API call) rather than trusting stored HTML.
 */
export const sanitizeRichText = (html: string): string => {
  if (typeof window === "undefined") return "";

  const doc = new DOMParser().parseFromString(html, "text/html");

  const clean = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove();
      return;
    }

    const element = node as Element;
    // Sanitize descendants first, while they're still attached to `element` -
    // this way a disallowed tag can never smuggle out an unclean child by
    // being unwrapped before its own children are checked.
    Array.from(element.childNodes).forEach(clean);

    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attr) => element.removeAttribute(attr.name));
  };

  Array.from(doc.body.childNodes).forEach(clean);

  return doc.body.innerHTML;
};
