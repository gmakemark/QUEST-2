import { useEffect, useRef, useState } from "react";
import { Code2, Pencil, Plus, Trash2, Type } from "lucide-react";
import CodeRunner from "./CodeRunner";
import Markdown from "./Markdown";
import { codeKey, readLS, removeLS, stdinKey, writeLS } from "../lib/storage";

// 수강생이 직접 끼워 넣는 칸 (코랩의 + 코드 / + 텍스트 처럼)
// 칸마다 after(바로 앞에 있는 블록이나 칸의 id)를 저장해서, 원래 내용 사이 원하는 자리에 끼울 수 있다.
// 이 브라우저에만 STEP 별로 저장된다.

const cellsKey = (n) => `class.cells.step${n}`;
const newId = () => "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function useUserCells(stepN) {
  const [cells, setCells] = useState(() => {
    try {
      return JSON.parse(readLS(cellsKey(stepN), "[]"));
    } catch {
      return [];
    }
  });
  useEffect(() => {
    writeLS(cellsKey(stepN), JSON.stringify(cells));
  }, [stepN, cells]);

  // key 바로 뒤에 새 칸 넣기: 원래 key 뒤에 있던 칸들은 새 칸 뒤로 밀린다
  function insert(after, type) {
    const id = newId();
    setCells((old) => [...old.map((c) => (c.after === after ? { ...c, after: id } : c)), { id, after, type, text: "", isNew: true }]);
  }

  function update(id, text) {
    setCells((old) => old.map((c) => (c.id === id ? { ...c, text, isNew: false } : c)));
  }

  function remove(id) {
    if (!confirm("이 칸 삭제?")) return;
    removeLS(codeKey(id));
    removeLS(stdinKey(id));
    setCells((old) => {
      const gone = old.find((c) => c.id === id);
      return old.filter((c) => c.id !== id).map((c) => (c.after === id ? { ...c, after: gone.after } : c));
    });
  }

  return { cells, insert, update, remove };
}

// key 뒤에 붙은 칸들(그리고 그 칸 뒤에 붙은 칸들)을 차례로 그린다. 맨 앞에는 끼워 넣기 줄.
export function CellsAfter({ anchor, store }) {
  const next = store.cells.find((c) => c.after === anchor);
  return (
    <>
      <InsertBar onInsert={(type) => store.insert(anchor, type)} />
      {next && (
        <>
          <UserCell cell={next} store={store} />
          <CellsAfter anchor={next.id} store={store} />
        </>
      )}
    </>
  );
}

function InsertBar({ onInsert }) {
  const btn =
    "inline-flex items-center gap-1 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:border-accent-500 hover:text-accent-600";
  return (
    <div className="group relative -my-2 flex h-6 items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-transparent group-hover:bg-slate-200 dark:group-hover:bg-slate-700" />
      <div className="relative flex gap-2 opacity-30 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button className={btn} onClick={() => onInsert("code")}>
          <Plus size={12} /> 코드
        </button>
        <button className={btn} onClick={() => onInsert("text")}>
          <Plus size={12} /> 텍스트
        </button>
      </div>
    </div>
  );
}

function UserCell({ cell, store }) {
  const del = (
    <button onClick={() => store.remove(cell.id)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800" title="이 칸 지우기">
      <Trash2 size={15} />
    </button>
  );

  if (cell.type === "code") {
    return (
      <div className="space-y-2 rounded-lg border border-dashed border-accent-300 dark:border-accent-700 p-3">
        <div className="flex items-center gap-1 text-xs font-semibold text-accent-600 dark:text-accent-400">
          <Code2 size={14} /> 내 코드
          <span className="ml-auto">{del}</span>
        </div>
        <CodeRunner id={cell.id} code="" />
      </div>
    );
  }
  return <TextCell cell={cell} store={store} del={del} />;
}

function TextCell({ cell, store, del }) {
  const [editing, setEditing] = useState(cell.isNew || !cell.text);
  const [draft, setDraft] = useState(cell.text);
  const ref = useRef(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  function done() {
    store.update(cell.id, draft);
    setEditing(false);
  }

  return (
    <div className="rounded-lg border border-dashed border-peach-300 dark:border-peach-700 bg-peach-50/60 dark:bg-peach-950/20 p-3">
      <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-peach-700 dark:text-peach-300">
        <Type size={14} /> 내 메모
        <span className="ml-auto flex items-center gap-1">
          {!editing && (
            <button onClick={() => setEditing(true)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-accent-600 dark:hover:bg-slate-800" title="고치기">
              <Pencil size={15} />
            </button>
          )}
          {del}
        </span>
      </div>
      {editing ? (
        <div className="space-y-2">
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) done();
            }}
            placeholder="질문이나 메모 적기 (마크다운 사용 가능 · Ctrl+Enter 로 완료)"
            className="h-24 w-full resize-y rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-sm outline-none focus:border-accent-500"
          />
          <button onClick={done} className="rounded-md bg-peach-500 px-3 py-1 text-sm font-medium text-white hover:bg-peach-600">
            완료
          </button>
        </div>
      ) : (
        <div onDoubleClick={() => setEditing(true)} title="두 번 누르면 고치기">
          <Markdown>{cell.text}</Markdown>
        </div>
      )}
    </div>
  );
}
