import React, { useState, useEffect, useRef } from "react";
import { EditorState, Transaction, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import { toggleMark } from "prosemirror-commands";
import {
  AlignJustify,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Image,
  IndentIncrease,
  IndentDecrease,
  MinusSquare,
} from "lucide-react";
import "./style.scss";

// Schema definition remains the same as before
const nodes = {
  doc: {
    content: "block+",
  },
  paragraph: {
    content: "inline*",
    group: "block",
    attrs: {
      align: { default: "left" },
      indent: { default: 0 },
      textIndent: { default: 0 },
    },
    parseDOM: [
      {
        tag: "p",
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const classList = element.classList;
          return {
            align: classList.contains("text-center")
              ? "center"
              : classList.contains("text-right")
              ? "right"
              : "left",
            indent: classList.contains("indent-1")
              ? 1
              : classList.contains("indent-2")
              ? 2
              : 0,
            textIndent: classList.contains("text-indent") ? 2 : 0,
          };
        },
      },
    ],
    toDOM(node) {
      const classes = [
        "paragraph",
        `text-${node.attrs.align}`,
        node.attrs.indent > 0 ? `indent-${node.attrs.indent}` : "",
        node.attrs.textIndent > 0 ? "text-indent" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return ["p", { class: classes }, 0];
    },
  },
  heading: {
    content: "inline*",
    group: "block",
    attrs: {
      level: { default: 1 },
      align: { default: "left" },
      indent: { default: 0 },
    },
    parseDOM: [
      {
        tag: "h1",
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const classList = element.classList;
          return {
            level: 1,
            align: classList.contains("text-center")
              ? "center"
              : classList.contains("text-right")
              ? "right"
              : "left",
            indent: classList.contains("indent-1")
              ? 1
              : classList.contains("indent-2")
              ? 2
              : 0,
          };
        },
      },
      {
        tag: "h2",
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const classList = element.classList;
          return {
            level: 2,
            align: classList.contains("text-center")
              ? "center"
              : classList.contains("text-right")
              ? "right"
              : "left",
            indent: classList.contains("indent-1")
              ? 1
              : classList.contains("indent-2")
              ? 2
              : 0,
          };
        },
      },
    ],
    toDOM(node) {
      const classes = [
        "heading",
        `text-${node.attrs.align}`,
        node.attrs.indent > 0 ? `indent-${node.attrs.indent}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      return [`h${node.attrs.level}`, { class: classes }, 0];
    },
  },

  text: {
    group: "inline",
  },
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
    },
    group: "inline",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom) {
          const element = dom as HTMLElement;
          return {
            src: element.getAttribute("src"),
            alt: element.getAttribute("alt"),
            title: element.getAttribute("title"),
          };
        },
      },
    ],
    toDOM(node) {
      return ["img", node.attrs];
    },
  },
  horizontal_rule: {
    group: "block",
    parseDOM: [{ tag: "hr" }],
    toDOM() {
      return ["hr"];
    },
  },
};

const marks = {
  strong: {
    parseDOM: [{ tag: "strong" }, { tag: "b" }, { style: "font-weight=bold" }],
    toDOM() {
      return ["strong", 0];
    },
  },
  em: {
    parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
    toDOM() {
      return ["em", 0];
    },
  },
  underline: {
    parseDOM: [{ tag: "u" }],
    toDOM() {
      return ["u", 0];
    },
  },
  strikethrough: {
    parseDOM: [{ tag: "strike" }],
    toDOM() {
      return ["strike", 0];
    },
  },
};

const mySchema = new Schema({ nodes, marks });
const customSerializer = DOMSerializer.fromSchema(mySchema);

const serializeContent = (doc) => {
  const fragment = customSerializer.serializeFragment(doc);
  const tempDiv = document.createElement("div");
  tempDiv.appendChild(fragment);
  return tempDiv.innerHTML;
};

// Add text indent toggle command
const toggleTextIndent = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void
) => {
  const { from, to } = state.selection;
  const tr = state.tr;
  let changed = false;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === "paragraph") {
      const newIndent = node.attrs.textIndent === 0 ? 2 : 0; // Toggle between 0 and 2 em
      tr.setNodeMarkup(pos, null, {
        ...node.attrs,
        textIndent: newIndent,
      });
      changed = true;
    }
  });

  if (changed && dispatch) {
    dispatch(tr);
  }
  return changed;
};

interface MenuItemProps {
  command: (
    state: EditorState,
    dispatch?: (tr: Transaction) => void
  ) => boolean;
  icon: React.ReactNode;
  isActive?: boolean;
  editorView: EditorView | null;
  title?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  command,
  icon,
  isActive,
  editorView,
  title,
}) => {
  if (!editorView) return null;

  return (
    <button
      className={`p-2 hover:bg-gray-100 rounded ${
        isActive ? "bg-gray-200" : ""
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        command(editorView.state, editorView.dispatch);
      }}
      title={title}
    >
      {icon}
    </button>
  );
};

// interface MenuBarProps {
//   editorView: EditorView | null;
// }

const MenuBar: React.FC<{ editorView: EditorView | null }> = ({
  editorView,
}) => {
  const [activeMarks, setActiveMarks] = useState<Set<string>>(new Set());
  // const [currentIndent, setCurrentIndent] = useState(0);

  useEffect(() => {
    if (!editorView) return;

    const updateActiveMarks = () => {
      const { state } = editorView;
      const marks = new Set<string>();
      let indent = 0;

      if (state.selection) {
        const { from } = state.selection;
        const node = state.doc.nodeAt(from);
        if (node && node.type.attrs.indent !== undefined) {
          indent = node.attrs.indent || 0;
        }

        state.doc.nodesBetween(
          state.selection.from,
          state.selection.to,
          (node) => {
            if (node.marks) {
              node.marks.forEach((mark) => marks.add(mark.type.name));
            }
          }
        );
      }

      // setCurrentIndent(indent);
      setActiveMarks(marks);
    };

    const originalUpdateState = editorView.updateState.bind(editorView);
    editorView.updateState = (state) => {
      originalUpdateState(state);
      updateActiveMarks();
    };

    updateActiveMarks();
  }, [editorView]);

  if (!editorView) return null;

  const setAlignment = (alignment: string) => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
      const { from, to } = state.selection;
      const tr = state.tr;

      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.attrs.align !== undefined) {
          tr.setNodeMarkup(pos, null, {
            ...node.attrs,
            align: alignment,
          });
        }
      });

      if (dispatch) dispatch(tr);
      return true;
    };
  };

  // const changeIndentation = (delta: number) => {
  //   return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
  //     const { from, to } = state.selection;
  //     const tr = state.tr;
  //     let changed = false;

  //     state.doc.nodesBetween(from, to, (node, pos) => {
  //       if (node.type.attrs.indent !== undefined) {
  //         const newIndent = Math.max(
  //           0,
  //           Math.min(8, (node.attrs.indent || 0) + delta)
  //         );
  //         if (newIndent !== node.attrs.indent) {
  //           tr.setNodeMarkup(pos, null, {
  //             ...node.attrs,
  //             indent: newIndent,
  //           });
  //           changed = true;
  //         }
  //       }
  //     });

  //     if (changed && dispatch) dispatch(tr);
  //     return changed;
  //   };
  // };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      const { state } = editorView;
      const transaction = state.tr.replaceSelectionWith(
        state.schema.nodes.image.create({ src: url })
      );
      editorView.dispatch(transaction);
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b">
      <MenuItem
        command={toggleMark(mySchema.marks.strong)}
        icon={<Bold className="w-5 h-5" />}
        isActive={activeMarks.has("strong")}
        editorView={editorView}
      />
      <MenuItem
        command={toggleMark(mySchema.marks.em)}
        icon={<Italic className="w-5 h-5" />}
        isActive={activeMarks.has("em")}
        editorView={editorView}
      />
      <MenuItem
        command={toggleMark(mySchema.marks.underline)}
        icon={<Underline className="w-5 h-5" />}
        isActive={activeMarks.has("underline")}
        editorView={editorView}
      />
      <MenuItem
        command={toggleMark(mySchema.marks.strikethrough)}
        icon={<Strikethrough className="w-5 h-5" />}
        isActive={activeMarks.has("strikethrough")}
        editorView={editorView}
      />
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <MenuItem
        command={setAlignment("left")}
        icon={<AlignLeft className="w-5 h-5" />}
        editorView={editorView}
      />
      <MenuItem
        command={setAlignment("center")}
        icon={<AlignCenter className="w-5 h-5" />}
        editorView={editorView}
      />
      <MenuItem
        command={setAlignment("right")}
        icon={<AlignRight className="w-5 h-5" />}
        editorView={editorView}
      />
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <MenuItem
        command={toggleTextIndent}
        icon={<IndentIncrease className="w-5 h-5" />}
        title="Toggle First Line Indent"
        editorView={editorView}
      />
      <MenuItem
        command={(state, dispatch) => {
          if (dispatch) {
            const { tr } = state;
            tr.replaceSelectionWith(mySchema.nodes.horizontal_rule.create());
            dispatch(tr);
          }
          return true;
        }}
        icon={<MinusSquare className="w-5 h-5" />}
        editorView={editorView}
      />
      <button className="p-2 hover:bg-gray-100 rounded" onClick={insertImage}>
        <Image className="w-5 h-5" />
      </button>
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<{
  value: string;
  onChange: (content: string) => void;
}> = ({ value, onChange }) => {
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastValueRef = useRef<string>(value);
  const isInternalChange = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const contentElement = document.createElement("div");
    contentElement.innerHTML = value;

    const doc = DOMParser.fromSchema(mySchema).parse(contentElement, {
      preserveWhitespace: true,
    });

    const view = new EditorView(containerRef.current, {
      state: EditorState.create({
        doc,
        plugins: [
          ...exampleSetup({ schema: mySchema, menuBar: false }),
          new Plugin({
            props: {
              attributes: { style: "white-space: pre-wrap;" },
            },
          }),
        ],
      }),
      dispatchTransaction: (transaction: Transaction) => {
        const newState = view.state.apply(transaction);
        view.updateState(newState);

        if (transaction.docChanged) {
          isInternalChange.current = true;
          const htmlContent = serializeContent(newState.doc);

          if (htmlContent !== lastValueRef.current) {
            lastValueRef.current = htmlContent;
            onChange(htmlContent);
          }
          isInternalChange.current = false;
        }
      },
    });

    setEditorView(view);

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (
      editorView &&
      !isInternalChange.current &&
      value !== lastValueRef.current
    ) {
      const contentElement = document.createElement("div");
      contentElement.innerHTML = value;

      const doc = DOMParser.fromSchema(mySchema).parse(contentElement, {
        preserveWhitespace: true,
      });

      const newState = EditorState.create({
        doc,
        plugins: editorView.state.plugins,
      });

      editorView.updateState(newState);
      lastValueRef.current = value;
    }
  }, [value]);

  return (
    <div className="rich-editor border rounded-lg overflow-hidden">
      <MenuBar editorView={editorView} />
      <div ref={containerRef} className="editor-content prose max-w-none p-4" />
    </div>
  );
};

// Add required CSS
const styles = `
  .rich-editor {
    font-family: system-ui, -apple-system, sans-serif;
  }

  .editor-content {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .paragraph, .heading {
    margin-bottom: 1em;
  }

  .text-left { text-align: left; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }

  .indent-1 { margin-left: 20px; }
  .indent-2 { margin-left: 40px; }

  .text-indent { text-indent: 40px; }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default RichTextEditor;
