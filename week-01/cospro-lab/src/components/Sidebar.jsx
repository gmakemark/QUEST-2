import { CheckCircle2, Circle, Plus, XCircle } from "lucide-react";

export default function Sidebar({ problems, activeId, verdicts, isAdmin, onAdd, onNavigate }) {
  function go(id) {
    document.getElementById(`p-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    onNavigate?.();
  }

  return (
    <nav className="flex h-full flex-col">
      <div className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">목차</div>
      <ul className="flex-1 overflow-y-auto px-2 pb-4">
        {problems.map((p, i) => {
          const v = verdicts[p.id];
          const active = p.id === activeId;
          return (
            <li key={p.id}>
              <button
                onClick={() => go(p.id)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                  active ? "bg-blue-100 font-medium text-blue-800" : "hover:bg-slate-100"
                }`}
              >
                {v === "pass" ? (
                  <CheckCircle2 size={16} className="shrink-0 text-green-600" />
                ) : v === "fail" ? (
                  <XCircle size={16} className="shrink-0 text-red-500" />
                ) : (
                  <Circle size={16} className="shrink-0 text-slate-300" />
                )}
                <span className="truncate">
                  문제 {i + 1}
                  {p.title ? `. ${p.title}` : ""}
                </span>
              </button>
            </li>
          );
        })}
        {problems.length === 0 && <li className="px-3 py-2 text-sm text-slate-400">문제가 없습니다.</li>}
      </ul>
      {isAdmin && (
        <div className="border-t p-3">
          <button onClick={onAdd} className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus size={16} /> 문제 추가
          </button>
        </div>
      )}
    </nav>
  );
}
