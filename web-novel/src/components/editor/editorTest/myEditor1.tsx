// import React, { useState, useEffect, useRef } from "react";
// import { EditorState, Transaction, Plugin } from "prosemirror-state";
// import { EditorView } from "prosemirror-view";
// import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
// import { schema } from "prosemirror-schema-basic";
// import { addListNodes } from "prosemirror-schema-list";
// import { exampleSetup } from "prosemirror-example-setup";
// import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
// import {
//   AlignJustify,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   Bold,
//   Italic,
//   Underline,
//   Strikethrough,
//   Heading1,
//   Heading2,
//   Quote,
//   Image,
//   Indent,
//   MinusSquare,
// } from "lucide-react";
// import "./style.scss";
// import ReactDOM from "react-dom";

// // Extend the basic schema to include additional marks
// const marks = {
//   ...schema.spec.marks,
//   underline: {
//     parseDOM: [{ tag: "u" }],
//     toDOM: () => ["u", 0],
//   },
//   strikethrough: {
//     parseDOM: [{ tag: "strike" }],
//     toDOM: () => ["strike", 0],
//   },
//   strong: {
//     parseDOM: [{ tag: "strong" }, { tag: "b" }, { style: "font-weight=bold" }],
//     toDOM: () => ["strong", 0],
//   },
//   em: {
//     parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
//     toDOM: () => ["em", 0],
//   },
// };

// // Define additional nodes for paragraph, heading, and blockquote
// const nodes = addListNodes(schema.spec.nodes, "paragraph block*", "block")
//   .update("paragraph", {
//     ...schema.spec.nodes.get("paragraph"),
//     attrs: {
//       align: { default: "left" },
//       indent: { default: 0 },
//     },
//     parseDOM: [
//       {
//         tag: "p",
//         getAttrs(dom) {
//           const element = dom as HTMLElement;
//           return {
//             align: element.style.textAlign || "left",
//             indent: parseInt(element.style.marginLeft || "0") / 20,
//           };
//         },
//       },
//     ],
//     toDOM(node) {
//       const style = `text-align: ${node.attrs.align}; margin-left: ${
//         node.attrs.indent * 20
//       }px`;
//       return ["p", { style }, 0];
//     },
//   })
//   .update("heading", {
//     ...schema.spec.nodes.get("heading"),
//     attrs: {
//       level: { default: 1 },
//       align: { default: "left" },
//       indent: { default: 0 },
//     },
//     parseDOM: [
//       {
//         tag: "h1",
//         getAttrs(dom) {
//           const element = dom as HTMLElement;
//           return {
//             level: 1,
//             align: element.style.textAlign || "left",
//             indent: parseInt(element.style.marginLeft || "0") / 20,
//           };
//         },
//       },
//       {
//         tag: "h2",
//         getAttrs(dom) {
//           const element = dom as HTMLElement;
//           return {
//             level: 2,
//             align: element.style.textAlign || "left",
//             indent: parseInt(element.style.marginLeft || "0") / 20,
//           };
//         },
//       },
//     ],
//     toDOM(node) {
//       const style = `text-align: ${node.attrs.align}; margin-left: ${
//         node.attrs.indent * 20
//       }px`;
//       return ["h" + node.attrs.level, { style }, 0];
//     },
//   });

// // Create custom schema with additional marks
// const mySchema = new Schema({ nodes, marks });

// // Create custom serializer
// const customSerializer = DOMSerializer.fromSchema(mySchema);

// // Helper function to serialize content
// const serializeContent = (doc: Fragment) => {
//   const fragment = customSerializer.serializeFragment(doc);
//   const tempDiv = document.createElement("div");
//   tempDiv.appendChild(fragment);

//   // Clean up any empty code tags
//   const codeTags = tempDiv.getElementsByTagName("code");
//   Array.from(codeTags).forEach((code) => {
//     if (code.textContent === "…") {
//       code.remove();
//     }
//   });

//   return tempDiv.innerHTML;
// };

// // Helper functions for alignment and indentation
// const setAlignment = (alignment: string) => {
//   return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
//     const { from, to } = state.selection;
//     const tr = state.tr;

//     state.doc.nodesBetween(from, to, (node, pos) => {
//       if (node.type.attrs.align !== undefined) {
//         tr.setNodeMarkup(pos, null, {
//           ...node.attrs,
//           align: alignment,
//         });
//       }
//     });

//     if (dispatch) dispatch(tr);
//     return true;
//   };
// };

// const changeIndentation = (delta: number) => {
//   return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
//     const { from, to } = state.selection;
//     const tr = state.tr;
//     let changed = false;

//     state.doc.nodesBetween(from, to, (node, pos) => {
//       if (node.type.attrs.indent !== undefined) {
//         const newIndent = Math.max(0, (node.attrs.indent || 0) + delta);
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

// interface MenuItemProps {
//   command: (
//     state: EditorState,
//     dispatch?: (tr: Transaction) => void
//   ) => boolean;
//   icon: React.ReactNode;
//   isActive?: boolean;
//   editorView: EditorView;
// }

// const MenuItem: React.FC<MenuItemProps> = ({
//   command,
//   icon,
//   isActive,
//   editorView,
// }) => {
//   return (
//     <button
//       className={`p-2 hover:bg-gray-100 rounded ${
//         isActive ? "bg-gray-200" : ""
//       }`}
//       onMouseDown={(e) => {
//         e.preventDefault();
//         command(editorView.state, editorView.dispatch);
//       }}
//     >
//       {icon}
//     </button>
//   );
// };

// const MenuBar: React.FC<{ editorView: EditorView }> = ({ editorView }) => {
//   const [activeMarks, setActiveMarks] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     const updateActiveMarks = () => {
//       const { state } = editorView;
//       const marks = new Set<string>();

//       if (state.selection) {
//         state.doc.nodesBetween(
//           state.selection.from,
//           state.selection.to,
//           (node) => {
//             if (node.marks) {
//               node.marks.forEach((mark) => marks.add(mark.type.name));
//             }
//           }
//         );
//       }

//       setActiveMarks(marks);
//     };

//     editorView.updateState = (state) => {
//       EditorView.prototype.updateState.call(editorView, state);
//       updateActiveMarks();
//     };
//   }, [editorView]);

//   const insertImage = () => {
//     const url = prompt("Enter image URL:");
//     if (url) {
//       const { state } = editorView;
//       const transaction = state.tr.replaceSelectionWith(
//         state.schema.nodes.image.create({ src: url })
//       );
//       editorView.dispatch(transaction);
//     }
//   };

//   return (
//     <div className="flex items-center gap-1 p-2 border-b">
//       {mySchema.marks.strong && (
//         <MenuItem
//           command={toggleMark(mySchema.marks.strong)}
//           icon={<Bold className="w-5 h-5" />}
//           isActive={activeMarks.has("strong")}
//           editorView={editorView}
//         />
//       )}
//       {mySchema.marks.em && (
//         <MenuItem
//           command={toggleMark(mySchema.marks.em)}
//           icon={<Italic className="w-5 h-5" />}
//           isActive={activeMarks.has("em")}
//           editorView={editorView}
//         />
//       )}
//       {mySchema.marks.underline && (
//         <MenuItem
//           command={toggleMark(mySchema.marks.underline)}
//           icon={<Underline className="w-5 h-5" />}
//           isActive={activeMarks.has("underline")}
//           editorView={editorView}
//         />
//       )}
//       {mySchema.marks.strikethrough && (
//         <MenuItem
//           command={toggleMark(mySchema.marks.strikethrough)}
//           icon={<Strikethrough className="w-5 h-5" />}
//           isActive={activeMarks.has("strikethrough")}
//           editorView={editorView}
//         />
//       )}
//       <div className="w-px h-6 bg-gray-300 mx-2" />
//       <MenuItem
//         command={setAlignment("left")}
//         icon={<AlignLeft className="w-5 h-5" />}
//         editorView={editorView}
//       />
//       <MenuItem
//         command={setAlignment("center")}
//         icon={<AlignCenter className="w-5 h-5" />}
//         editorView={editorView}
//       />
//       <MenuItem
//         command={setAlignment("right")}
//         icon={<AlignRight className="w-5 h-5" />}
//         editorView={editorView}
//       />
//       <div className="w-px h-6 bg-gray-300 mx-2" />
//       <MenuItem
//         command={changeIndentation(1)}
//         icon={<Indent className="w-5 h-5" />}
//         editorView={editorView}
//       />
//       <MenuItem
//         command={(state, dispatch) => {
//           if (dispatch) {
//             const { tr } = state;
//             tr.replaceSelectionWith(mySchema.nodes.horizontal_rule.create());
//             dispatch(tr);
//           }
//           return true;
//         }}
//         icon={<MinusSquare className="w-5 h-5" />}
//         editorView={editorView}
//       />
//       <button className="p-2 hover:bg-gray-100 rounded" onClick={insertImage}>
//         <Image className="w-5 h-5" />
//       </button>
//     </div>
//   );
// };

// interface RichTextEditorProps {
//   value: string;
//   onChange: (content: string) => void;
// }

// console.log(mySchema.marks);

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
//   const editorViewRef = useRef<EditorView | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const lastValueRef = useRef<string>(value);
//   const isInternalChange = useRef<boolean>(false);

//   useEffect(() => {
//     const contentElement = document.createElement("div");
//     contentElement.innerHTML = value;
//     const doc = DOMParser.fromSchema(mySchema).parse(contentElement);

//     editorViewRef.current = new EditorView(containerRef.current, {
//       state: EditorState.create({
//         doc,
//         plugins: [
//           ...exampleSetup({ schema: mySchema, menuBar: false }),
//           new Plugin({
//             view: (view) => {
//               const menuContainer = document.createElement("div");
//               view.dom.parentNode?.insertBefore(menuContainer, view.dom);
//               ReactDOM.render(<MenuBar editorView={view} />, menuContainer);
//               return {
//                 destroy: () => {
//                   ReactDOM.unmountComponentAtNode(menuContainer);
//                   menuContainer.remove();
//                 },
//               };
//             },
//           }),
//         ],
//       }),
//       dispatchTransaction: (transaction: Transaction) => {
//         const newState = editorViewRef.current!.state.apply(transaction);
//         editorViewRef.current!.updateState(newState);

//         if (!transaction.docChanged) {
//           return;
//         }

//         isInternalChange.current = true;
//         const htmlContent = serializeContent(newState.doc.content);

//         if (htmlContent !== lastValueRef.current) {
//           lastValueRef.current = htmlContent;
//           onChange(htmlContent);
//         }
//         isInternalChange.current = false;
//       },
//     });

//     return () => {
//       editorViewRef.current?.destroy();
//     };
//   }, []);

//   useEffect(() => {
//     if (
//       editorViewRef.current &&
//       !isInternalChange.current &&
//       value !== lastValueRef.current
//     ) {
//       const { state } = editorViewRef.current;
//       const contentElement = document.createElement("div");
//       contentElement.innerHTML = value;
//       const doc = DOMParser.fromSchema(state.schema).parse(contentElement);

//       const newState = EditorState.create({
//         doc,
//         plugins: state.plugins,
//         schema: state.schema,
//       });

//       editorViewRef.current.updateState(newState);
//       lastValueRef.current = value;
//     }
//   }, [value]);

//   return (
//     <div className="border rounded-lg overflow-hidden">
//       <div ref={containerRef} className="prose max-w-none p-4" />
//     </div>
//   );
// };

// export default RichTextEditor;
