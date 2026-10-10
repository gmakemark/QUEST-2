import { useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import Modal from "./Modal";
import CodeEditor from "./CodeEditor";
import { baseOf, fieldsOf } from "../lib/edits";

const LABELS = {
  starter: "문제 주석 + 시작 코드 (수강생 코드 칸에 처음 보이는 내용)",
  answer: "예시 답안",
  code: "코드",
  title: "실습 제목",
  prompt: "실습 문제 설명 (마크다운)",
};

// 맨 위의 # 주석 줄들 (연습 칸의 문제)
const headOf = (code) => (code.match(/^(#.*\n)+/) || [""])[0];

// 관리자: 수업 칸 하나 고치기. 저장하면 모든 수강생의 수업 화면에 적용된다.
//  block: 지금 화면의 칸 (고친 적 있으면 original 에 원래 칸이 있다)
export default function EditDialog({ title, block, onSave, onClose }) {
  const original = block.original || block;
  const [fields, setFields] = useState(() => fieldsOf(block));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function change(name, value) {
    setFields((f) => {
      const next = { ...f, [name]: value };
      // 연습 칸: 시작 코드의 문제 주석을 고치면, 예시 답안 맨 위의 같은 주석도 함께 바꾼다
      if (name === "starter" && "answer" in f) {
        const oldHead = headOf(f.starter);
        if (oldHead && f.answer.startsWith(oldHead)) next.answer = headOf(value) + f.answer.slice(oldHead.length);
      }
      return next;
    });
  }

  async function save(restore) {
    if (restore && !confirm("이 칸을 원래 수업 내용으로 되돌립니다. 모든 수강생 화면에 적용됩니다.")) return;
    setBusy(true);
    setMsg("");
    try {
      const same = JSON.stringify(fields) === baseOf(original);
      await onSave(restore || same ? null : { base: baseOf(original), fields });
      onClose();
    } catch (err) {
      setMsg("저장하지 못했습니다: " + err.message);
      setBusy(false);
    }
  }

  const btn = "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50";
  return (
    <Modal title={`${title} 수정`} onClose={onClose} wide>
      <div className="space-y-4">
        {Object.keys(fields).map((name) => (
          <div key={name} className="space-y-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{LABELS[name]}</span>
            {name === "title" ? (
              <input
                value={fields[name]}
                onChange={(e) => change(name, e.target.value)}
                className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent-500"
              />
            ) : name === "prompt" ? (
              <textarea
                value={fields[name]}
                onChange={(e) => change(name, e.target.value)}
                rows={5}
                className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent-500"
              />
            ) : (
              <CodeEditor value={fields[name]} onChange={(v) => change(name, v)} minHeight={60} />
            )}
          </div>
        ))}

        <p className="text-xs text-slate-500 dark:text-slate-400">
          저장하면 모든 수강생의 수업 화면에 적용됩니다(열려 있는 화면은 2분 안에, 또는 새로고침할 때). 수강생이 이 칸에서 고쳐 둔 코드는 새 내용으로 바뀝니다.
        </p>
        {msg && <p className="rounded bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{msg}</p>}

        <div className="flex flex-wrap items-center gap-2">
          {block.edited && (
            <button onClick={() => save(true)} disabled={busy} className={`${btn} text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`}>
              <RotateCcw size={16} /> 원래대로
            </button>
          )}
          <button onClick={onClose} disabled={busy} className={`${btn} ml-auto border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800`}>
            취소
          </button>
          <button onClick={() => save(false)} disabled={busy} className={`${btn} bg-accent-600 text-white hover:bg-accent-700`}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 저장 · 모두에게 적용
          </button>
        </div>
      </div>
    </Modal>
  );
}
