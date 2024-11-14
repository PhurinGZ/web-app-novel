import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

interface NovelEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const NovelEditor: React.FC<NovelEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [indentLevel, setIndentLevel] = useState(0);

  // Store selection range
  const selectionRange = useRef<Range | null>(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selectionRange.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && selectionRange.current) {
      selection.removeAllRanges();
      selection.addRange(selectionRange.current);
    }
  };

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      // Set the initial content only once
      editorRef.current.innerHTML = value;
      countWords();
    }
  }, []);

  const handleContentChange = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        // Check if the content was actually changed by the user
        // and not just by cursor movement or backspace
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const startNode = range.startContainer;
          const endNode = range.endContainer;
          if (
            startNode.parentNode === editorRef.current &&
            endNode.parentNode === editorRef.current
          ) {
            // The selection is within the editor, so this is a real content change
            onChange(currentContent);
            countWords();
            updateIndentLevel();
          }
        }
      }
    }
  };

  const updateIndentLevel = () => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;

    let currentNode = selection.anchorNode;
    if (currentNode.nodeType === Node.TEXT_NODE) {
      currentNode = currentNode.parentNode;
    }

    const computedStyle = window.getComputedStyle(currentNode as Element);
    const paddingLeft = parseInt(computedStyle.paddingLeft || "0", 10);
    setIndentLevel(Math.floor(paddingLeft / 40)); // 40px per indent level
  };

  const countWords = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    }
  };

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (command === "indent" || command === "outdent") {
      updateIndentLevel();
    }
  };

  const handleFormat = (format: string) => {
    switch (format) {
      case "chapter":
        if (document.queryCommandState("formatBlock") === "h2") {
          execCommand("formatBlock", "p"); // Remove chapter formatting
        } else {
          execCommand("formatBlock", "h2");
        }
        break;
      case "scene":
        if (document.querySelector("hr.my-8")) {
          // Remove scene break
          const hrElement = document.querySelector("hr.my-8");
          hrElement?.remove();
        } else {
          execCommand("insertHTML", '<hr class="my-8">');
        }
        break;
      case "dialogue":
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const selectedText = selection.toString();
          if (selectedText.startsWith('"') && selectedText.endsWith('"')) {
            // Remove dialogue formatting
            execCommand("insertHTML", selectedText.slice(1, -1));
          } else {
            execCommand(
              "insertHTML",
              '"<span class="dialogue">' + selectedText + '</span>"'
            );
          }
        }
        break;
      case "indent":
        execCommand("indent");
        setIndentLevel((prev) => prev + 1);
        break;
      case "outdent":
        execCommand("outdent");
        setIndentLevel((prev) => Math.max(0, prev - 1));
        break;
    }
  };

  const handleBackspace = (e: KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;

    let currentNode = selection.anchorNode;
    let parentNode = currentNode.parentNode;

    // Use parentNode if in text node
    if (currentNode.nodeType === Node.TEXT_NODE) {
      currentNode = parentNode;
      parentNode = currentNode?.parentNode;
    }

    const caretPosition = selection.anchorOffset;
    const currentElement = currentNode as Element;

    // Check if the cursor is at the beginning of the element
    if (caretPosition === 0) {
      // Handle removal of specific elements
      if (currentElement.tagName === "H2") {
        e.preventDefault();
        const textContent = currentElement.textContent;
        const p = document.createElement("p");
        p.textContent = textContent;
        parentNode.replaceChild(p, currentElement);
      } else if (
        currentElement.tagName === "HR" ||
        (parentNode instanceof Element && parentNode.tagName === "HR")
      ) {
        e.preventDefault();
        const hrElement =
          currentElement.tagName === "HR" ? currentElement : parentNode;
        hrElement.remove();
      } else if (
        currentElement.classList.contains("dialogue") ||
        (parentNode instanceof Element &&
          parentNode.classList.contains("dialogue"))
      ) {
        e.preventDefault();
        const dialogueElement = currentElement.classList.contains("dialogue")
          ? currentElement
          : parentNode;
        const textContent = dialogueElement.textContent;
        const textNode = document.createTextNode(textContent || "");
        dialogueElement.parentNode?.replaceChild(textNode, dialogueElement);
        const quotesRegex = /^[""](.+)[""]$/;
        if (quotesRegex.test(textContent || "")) {
          textNode.textContent = textContent?.replace(quotesRegex, "$1") || "";
        }
      } else if (indentLevel > 0) {
        e.preventDefault();
        handleFormat("outdent");
      }
    } else {
      // If the cursor is not at the beginning, allow the backspace to function normally
      return;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    saveSelection();

    // Check if Ctrl (Windows) or Cmd (Mac) is pressed
    const ctrlOrCmd = e.ctrlKey || e.metaKey;

    // Handle arrow keys
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      // Do not prevent the default behavior of the arrow keys
      // const selection = window.getSelection();
      // if (selection) {
      //   const range = selection.getRangeAt(0);
      //   switch (e.key) {
      //     case "ArrowUp":
      //       range.setStart(range.startContainer, range.startOffset - 1);
      //       break;
      //     case "ArrowDown":
      //       range.setStart(range.startContainer, range.startOffset + 1);
      //       break;
      //     case "ArrowLeft":
      //       range.setStart(range.startContainer, range.startOffset - 1);
      //       break;
      //     case "ArrowRight":
      //       range.setStart(range.startContainer, range.startOffset + 1);
      //       break;
      //   }
      //   selection.removeAllRanges();
      //   selection.addRange(range);
      // }
    } else if (e.key === "Backspace") {
      handleBackspace(e);
    } else if (ctrlOrCmd) {
      switch (e.key.toLowerCase()) {
        case "h": // Chapter (Ctrl/Cmd + H)
          e.preventDefault();
          handleFormat("chapter");
          break;
        case "s": // Scene Break (Ctrl/Cmd + S)
          e.preventDefault();
          handleFormat("scene");
          break;
        case "d": // Dialogue (Ctrl/Cmd + D)
          e.preventDefault();
          handleFormat("dialogue");
          break;
        case "]": // Indent (Ctrl/Cmd + ])
          e.preventDefault();
          handleFormat("indent");
          break;
        case "[": // Outdent (Ctrl/Cmd + [)
          e.preventDefault();
          handleFormat("outdent");
          break;
        case "f": // Fullscreen (Ctrl/Cmd + F)
          e.preventDefault();
          toggleFullscreen();
          break;
        case "/": // Show/Hide Shortcuts (Ctrl/Cmd + /)
          e.preventDefault();
          setShowShortcuts((prev) => !prev);
          break;
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        handleFormat("outdent");
      } else {
        handleFormat("indent");
      }
    } else {
      // Update the content for any other key press
      handleContentChange();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyUp = () => {
    restoreSelection();
  };

  return (
    <div
      className={`bg-white transition-all ${
        isFullscreen ? "fixed inset-0 z-50" : "relative"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm font-medium"
            onClick={() => handleFormat("chapter")}
            title="บทใหม่ (Ctrl + H)"
          >
            บทใหม่
          </button>
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm"
            onClick={() => handleFormat("scene")}
            title="แบ่งฉาก (Ctrl + S)"
          >
            แบ่งฉาก
          </button>
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm"
            onClick={() => handleFormat("dialogue")}
            title="บทสนทนา (Ctrl + D)"
          >
            บทสนทนา
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm"
            onClick={() => handleFormat("indent")}
            title="ย่อหน้า (Tab หรือ Ctrl + ])"
          >
            ย่อหน้า →
          </button>
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm"
            onClick={() => handleFormat("outdent")}
            title="ลดย่อหน้า (Backspace หรือ Shift + Tab หรือ Ctrl + [)"
          >
            ← ลดย่อหน้า
          </button>
          <div className="flex-grow" />
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm"
            onClick={() => setShowShortcuts((prev) => !prev)}
            title="แสดงคีย์ลัด (Ctrl + /)"
          >
            ⌨️
          </button>
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-sm"
            onClick={toggleFullscreen}
            title="เต็มจอ (Ctrl + F)"
          >
            {isFullscreen ? "❌" : "⛶"}
          </button>
        </div>

        {/* Shortcuts Modal */}
        {showShortcuts && (
          <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 m-2 border w-72 z-50">
            <h3 className="font-medium mb-2">คีย์ลัด</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl + H</kbd>{" "}
                สร้างบทใหม่
              </li>
              <li>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl + S</kbd> แบ่งฉาก
              </li>
              <li>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl + D</kbd>{" "}
                เพิ่มบทสนทนา
              </li>
              <li>
                <kbd className="bg-gray-100 px-1 rounded">Tab</kbd> หรือ{" "}
                <kbd className="bg-gray-100 px-1 rounded">Ctrl + ]</kbd> ย่อหน้า
              </li>
              <li>
                <kbd className="bg-gray-100 px-1 rounded">Backspace</kbd> หรือ{" "}
                <kbd className="bg-gray-100 px-1 rounded">Shift + Tab</kbd> หรือ{" "}
                <kbd className="bg-gray-100 px-1 rounded">Ctrl + [</kbd>{" "}
                ลดย่อหน้า
              </li>
              <li>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl + F</kbd> เต็มจอ
              </li>
              <li>
                <kbd className="bg-gray-100 px-1 rounded">Ctrl + /</kbd>{" "}
                แสดง/ซ่อนคีย์ลัด
              </li>
            </ul>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-grow overflow-auto">
          <div
            ref={editorRef}
            className="max-w-3xl mx-auto p-8 min-h-[600px] focus:outline-none"
            style={{
              fontFamily: "'Sarabun', sans-serif",
              fontSize: "1.1rem",
              lineHeight: "1.8",
            }}
            contentEditable
            onInput={handleContentChange} // Handle changes directly here
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
        {/* Status Bar */}
        <div className="p-2 border-t bg-gray-50 text-sm text-gray-600">
          จำนวนคำ: {wordCount.toLocaleString()}
        </div>
      </div>

      <style jsx global>{`
        [contenteditable] {
          outline: none;
        }

        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 2rem 0 1rem 0;
        }

        [contenteditable] hr {
          border: none;
          text-align: center;
          margin: 2rem 0;
        }

        [contenteditable] hr:after {
          content: "* * *";
          display: block;
          text-align: center;
          color: #666;
        }

        .dialogue {
          display: inline;
          color: #2563eb;
        }

        [contenteditable] p {
          margin: 0;
          min-height: 1.8em;
        }
      `}</style>
    </div>
  );
};

export default NovelEditor;
