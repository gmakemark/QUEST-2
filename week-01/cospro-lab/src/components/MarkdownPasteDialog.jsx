import { useState } from "react";
import Modal from "./Modal";
import Markdown from "./Markdown";
import { clipboardImage, imageFileToDataURL, imageMarkdown } from "../lib/image";

// 다른 곳에서 쓴 마크다운 지문을 통째로 붙여 넣고, 미리 본 뒤 지문에 넣는다.
export default function MarkdownPasteDialog({ onClose, onInsert }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handlePaste(e) {
    const file = clipboardImage(e);
    if (!file) return;
    e.preventDefault();
    try {
      const md = imageMarkdown(await imageFileToDataURL(file));
      setText((t) => t + md);
    } catch (err) {
      setError(err.message);
    }
  }

  const btn = "rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-40";
  return (
    <Modal title="마크다운 붙여넣기" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <textarea
            autoFocus
            className="font-code h-72 w-full resize-y rounded-md border border-slate-300 dark:border-slate-600 p-3 text-sm outline-none focus:border-blue-500"
            placeholder={"여기에 마크다운을 붙여 넣으세요 (Ctrl+V)\n\n### 문제 설명\n...\n\n| 입력 | 출력 |\n|---|---|\n| 1 | 2 |"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
          />
          <div className="h-72 overflow-auto rounded-md border border-slate-200 dark:border-slate-700 p-3">
            {text.trim() ? <Markdown>{text}</Markdown> : <p className="text-sm text-slate-400 dark:text-slate-500">미리보기</p>}
          </div>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <button onClick={onClose} className={btn + " font-normal text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}>
            취소
          </button>
          <button disabled={!text.trim()} onClick={() => onInsert(text, "replace")} className={btn + " border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"}>
            지문을 이것으로 바꾸기
          </button>
          <button disabled={!text.trim()} onClick={() => onInsert(text, "append")} className={btn + " bg-blue-600 text-white hover:bg-blue-700"}>
            지문 끝에 붙이기
          </button>
        </div>
      </div>
    </Modal>
  );
}
