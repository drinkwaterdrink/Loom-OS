import { basicSetup, EditorView } from "codemirror";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";

export type CodeEditorLanguage = "json" | "html" | "css" | "javascript" | "text";

export interface CodeEditorHandle {
  getValue(): string;
  setValue(value: string): void;
  focus(): void;
  destroy(): void;
}

function languageExtension(language: CodeEditorLanguage) {
  if (language === "json") return json();
  if (language === "html") return html();
  if (language === "css") return css();
  if (language === "javascript") return javascript();
  return [];
}

export function mountCodeEditor(
  parent: HTMLElement,
  value: string,
  language: CodeEditorLanguage,
  onChange: (value: string) => void,
): CodeEditorHandle {
  const view = new EditorView({
    doc: value,
    extensions: [
      basicSetup,
      languageExtension(language),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          backgroundColor: "var(--loomos-code-bg, #111217)",
          color: "var(--loomos-ink, #f5f5f5)",
          fontSize: "12px",
          minHeight: "260px",
        },
        ".cm-content": {
          caretColor: "var(--loomos-accent, #7c6cff)",
          fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
          padding: "10px 0",
        },
        ".cm-gutters": {
          backgroundColor: "var(--loomos-code-gutter, #17181d)",
          borderRight: "1px solid var(--loomos-border, #3a3b43)",
          color: "var(--loomos-muted, #aaa)",
        },
        ".cm-activeLine, .cm-activeLineGutter": {
          backgroundColor: "color-mix(in srgb, var(--loomos-accent, #7c6cff) 8%, transparent)",
        },
        "&.cm-focused": {
          outline: "2px solid color-mix(in srgb, var(--loomos-accent, #7c6cff) 35%, transparent)",
          outlineOffset: "-2px",
        },
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) onChange(update.state.doc.toString());
      }),
    ],
    parent,
  });
  return {
    getValue: () => view.state.doc.toString(),
    setValue: (next) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: next },
      });
    },
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}
