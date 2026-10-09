import { useState } from "react";
import Modal from "./Modal";

const MAX = 10;
const clamp = (n) => Math.max(1, Math.min(MAX, Number(n) || 1));
// 칸 안의 | 와 줄바꿈은 마크다운 표를 깨뜨리므로 바꿔 준다.
const cell = (text) => (text.trim() ? text.trim().replace(/\|/g, "\\|").replace(/\n/g, "<br>") : " ");

export function tableToMarkdown(grid) {
  const line = (row) => `| ${row.map(cell).join(" | ")} |`;
  const [head, ...body] = grid;
  return [line(head), `|${head.map(() => "---").join("|")}|`, ...body.map(line)].join("\n");
}

// 행·열 크기를 정하고 칸마다 내용을 입력해 마크다운 표로 넣는다. 첫 줄은 제목 줄.
export default function TableDialog({ onClose, onInsert }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);
  const [grid, setGrid] = useState(() => [["입력", "출력"], ["", ""], ["", ""]]);

  function resize(r, c) {
    r = clamp(r);
    c = clamp(c);
    setRows(r);
    setCols(c);
    setGrid((g) => Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => g[i]?.[j] ?? "")));
  }

  const setCell = (i, j, v) => setGrid((g) => g.map((row, ri) => (ri === i ? row.map((x, cj) => (cj === j ? v : x)) : row)));

  const num = "w-16 rounded-md border border-slate-300 dark:border-slate-600 px-2 py-1 text-sm outline-none focus:border-blue-500";
  return (
    <Modal title="표 추가" onClose={onClose} wide>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            행 <input type="number" min={1} max={MAX} className={num} value={rows} onChange={(e) => resize(e.target.value, cols)} />
          </label>
          <label className="flex items-center gap-2">
            열 <input type="number" min={1} max={MAX} className={num} value={cols} onChange={(e) => resize(rows, e.target.value)} />
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">첫 줄은 제목 줄입니다 · 최대 {MAX}×{MAX}</span>
        </div>

        <div className="max-h-[50vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {grid.map((row, i) => (
                <tr key={i}>
                  {row.map((v, j) => (
                    <td key={j} className="border border-slate-200 dark:border-slate-700 p-0">
                      <input
                        className={`w-full min-w-20 px-2 py-1.5 outline-none focus:bg-blue-50 dark:focus:bg-blue-950 ${i === 0 ? "bg-slate-50 dark:bg-slate-800 font-semibold" : ""}`}
                        placeholder={i === 0 ? `제목 ${j + 1}` : ""}
                        value={v}
                        onChange={(e) => setCell(i, j, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="text-xs text-slate-500 dark:text-slate-400">
          <summary className="cursor-pointer">마크다운으로 보기</summary>
          <pre className="font-code mt-2 overflow-auto rounded bg-slate-100 dark:bg-slate-800 p-2">{tableToMarkdown(grid)}</pre>
        </details>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            취소
          </button>
          <button
            onClick={() => onInsert(`\n${tableToMarkdown(grid)}\n`)}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            지문에 넣기
          </button>
        </div>
      </div>
    </Modal>
  );
}
