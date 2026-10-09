import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ClipboardPaste, Eye, ImagePlus, Pencil, Play, Save, Table, Trash2 } from "lucide-react";
import CodeEditor from "./CodeEditor";
import Markdown from "./Markdown";
import OutputPanel from "./OutputPanel";
import TableDialog from "./TableDialog";
import MarkdownPasteDialog from "./MarkdownPasteDialog";
import { runAllCases } from "../lib/grader";
import { clipboardImage, imageFileToDataURL, imageMarkdown } from "../lib/image";

// 관리자 모드의 문항 하나: 제목 / 지문(마크다운) / 시작 코드 / 정답 코드 / 표준입력
export default function ProblemEditor({ problem, isFirst, isLast, onSave, onDelete, onMove }) {
  const [draft, setDraft] = useState(problem);
  const [tab, setTab] = useState("edit"); // edit | preview
  const [dialog, setDialog] = useState(null); // 'table' | 'markdown' | null
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const textRef = useRef(null);
  const fileRef = useRef(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(problem);
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));

  // 커서 자리에 끼워 넣는다. (미리보기 중이면 지문 맨 끝에)
  function insertAtCursor(text) {
    const el = tab === "edit" ? textRef.current : null;
    setDraft((d) => {
      const start = el?.selectionStart ?? d.description.length;
      const end = el?.selectionEnd ?? start;
      return { ...d, description: d.description.slice(0, start) + text + d.description.slice(end) };
    });
  }

  async function insertImage(file) {
    try {
      insertAtCursor(imageMarkdown(await imageFileToDataURL(file)));
    } catch (err) {
      alert(err.message);
    }
  }

  // 지문 입력칸에 이미지를 붙여 넣으면 마크다운 이미지로 바꿔 넣는다.
  function handlePaste(e) {
    const file = clipboardImage(e);
    if (!file) return;
    e.preventDefault();
    insertImage(file);
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) insertImage(file);
  }

  function insertMarkdown(text, mode) {
    if (mode === "replace") {
      if (draft.description.trim() && !confirm("지금 지문을 지우고 붙여 넣은 내용으로 바꿀까요?")) return;
      set("description")(text);
    } else {
      setDraft((d) => ({ ...d, description: d.description.replace(/\s*$/, "") + (d.description.trim() ? "\n\n" : "") + text }));
    }
    setDialog(null);
  }

  async function testAnswer() {
    setRunning(true);
    setOutput(await runAllCases(draft.answerCode, draft.stdin));
    setRunning(false);
  }

  const label = "mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400";
  const iconBtn = "rounded p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 font-medium outline-none focus:border-blue-500"
          placeholder="문제 제목"
          value={draft.title}
          onChange={(e) => set("title")(e.target.value)}
        />
        <button className={iconBtn} disabled={isFirst} onClick={() => onMove(-1)} title="위로">
          <ArrowUp size={18} />
        </button>
        <button className={iconBtn} disabled={isLast} onClick={() => onMove(1)} title="아래로">
          <ArrowDown size={18} />
        </button>
        <button className={iconBtn + " hover:text-red-600"} onClick={onDelete} title="삭제">
          <Trash2 size={18} />
        </button>
      </div>

      <div>
        <div className="mb-1 flex items-center gap-1">
          <span className="mr-auto text-xs font-semibold text-slate-500 dark:text-slate-400">문제 지문 (마크다운 · 이미지 붙여넣기 가능)</span>
          {[
            ["markdown", ClipboardPaste, "마크다운 붙여넣기", () => setDialog("markdown")],
            ["image", ImagePlus, "이미지", () => fileRef.current.click()],
            ["table", Table, "표 추가", () => setDialog("table")],
          ].map(([key, Icon, text, onClick]) => (
            <button key={key} onClick={onClick} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Icon size={13} /> <span className="hidden sm:inline">{text}</span>
            </button>
          ))}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageFile} />
          <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />
          {[
            ["edit", Pencil, "편집"],
            ["preview", Eye, "미리보기"],
          ].map(([key, Icon, text]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${tab === key ? "bg-slate-200 dark:bg-slate-700 font-medium" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <Icon size={13} /> {text}
            </button>
          ))}
        </div>
        {tab === "edit" ? (
          <textarea
            ref={textRef}
            className="font-code h-56 w-full resize-y rounded-md border border-slate-300 dark:border-slate-600 p-3 text-sm outline-none focus:border-blue-500"
            placeholder={"### 문제 설명\n\n여기에 지문을 쓰세요. 이미지는 복사해서 붙여 넣거나 ![설명](이미지주소) 로 넣으세요."}
            value={draft.description}
            onChange={(e) => set("description")(e.target.value)}
            onPaste={handlePaste}
          />
        ) : (
          <div className="min-h-24 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <Markdown>{draft.description}</Markdown>
          </div>
        )}
      </div>

      <div>
        <span className={label}>학생에게 보여 줄 시작 코드</span>
        <CodeEditor value={draft.starterCode} onChange={set("starterCode")} />
      </div>

      <div>
        <span className={label}>모범 정답 코드 (학생에게 보이지 않음 · 이 코드의 출력과 학생 출력이 같으면 정답)</span>
        <CodeEditor value={draft.answerCode} onChange={set("answerCode")} onRun={testAnswer} />
      </div>

      <div>
        <span className={label}>표준 입력 (input() 을 쓰는 문제만 · 한 줄에 하나씩 · 입력 세트를 여러 개 넣으려면 사이에 --- 한 줄 · 모두 맞아야 정답)</span>
        <textarea
          className="font-code h-16 w-full resize-y rounded-md border border-slate-300 dark:border-slate-600 p-2 text-sm outline-none focus:border-blue-500"
          value={draft.stdin}
          onChange={(e) => set("stdin")(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={testAnswer} disabled={running} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
          <Play size={16} /> 정답 코드 실행해 보기
        </button>
        <button
          onClick={() => onSave(draft)}
          disabled={!dirty}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          <Save size={16} /> {dirty ? "저장" : "저장됨"}
        </button>
        {dirty && (
          <button onClick={() => setDraft(problem)} className="text-sm text-slate-500 dark:text-slate-400 hover:underline">
            되돌리기
          </button>
        )}
      </div>

      <OutputPanel running={running} output={output} />

      {dialog === "table" && (
        <TableDialog
          onClose={() => setDialog(null)}
          onInsert={(md) => {
            insertAtCursor(md);
            setDialog(null);
          }}
        />
      )}
      {dialog === "markdown" && <MarkdownPasteDialog onClose={() => setDialog(null)} onInsert={insertMarkdown} />}
    </div>
  );
}
