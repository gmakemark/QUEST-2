import { Fragment, useState } from "react";
import { Lock, Pencil } from "lucide-react";
import Markdown from "./Markdown";
import CodeRunner from "./CodeRunner";
import ProblemCell from "./ProblemCell";
import EditDialog from "./EditDialog";
import { CellsAfter, useUserCells } from "./UserCells";

// STEP 하나: 머리말(목표) → 주제(1. 2. 3. …)마다 흰 박스들
// 흰 박스 하나 = 밑줄 있는 소제목(### …) 하나. 박스 안에 소제목 · 설명 · 연습 · 실습이 차례로 들어가고,
// 연습·실습은 따로 테두리 없이 흐린 번호로만 구분한다. 시험 형식 문제(STEP3)는 문제마다 따로 카드.
// 블록마다 아래에 [+ 코드] [+ 텍스트] 줄이 있어서 수강생이 자기 칸을 끼워 넣을 수 있다.
// 관리자 모드(onEdit 이 있을 때)에서는 연습·실습·코드 칸 위에 [수정] 버튼이 있다. 고친 내용은 모든 수강생 화면에 적용된다.
// 코드 칸의 key 에 내용을 넣어서, 관리자가 고친 내용이 들어오면 그 칸만 새로 그린다.
export default function StepView({ step, onVerdict, onEdit }) {
  const store = useUserCells(step.n);
  const numbers = numberBlocks(step);
  const [editing, setEditing] = useState(null); // { key, block, title }

  function editBar(key, b, title) {
    if (!onEdit) return null;
    return (
      <div className="flex items-center gap-2">
        {b.edited && <span className="text-xs text-peach-600 dark:text-peach-400">수정됨</span>}
        <button
          onClick={() => setEditing({ key, block: b, title })}
          className="inline-flex items-center gap-1 rounded-md border border-peach-300 dark:border-peach-700 px-2 py-0.5 text-xs text-peach-700 dark:text-peach-300 hover:bg-peach-50 dark:hover:bg-peach-950/40"
          title="이 칸의 문제·코드를 고칩니다. 모든 수강생 화면에 적용됩니다."
        >
          <Pencil size={12} /> 수정
        </button>
      </div>
    );
  }

  function renderItem(item) {
    const { block: b, key, text } = item;
    if (b.type === "md") return <Markdown>{text}</Markdown>;
    if (b.type === "code") {
      return (
        <div className="space-y-2">
          {onEdit && <div className="flex justify-end">{editBar(key, b, "코드 칸")}</div>}
          <CodeRunner key={b.code} id={key} code={b.code} />
        </div>
      );
    }
    if (b.type === "task") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>연습 {numbers[key]}</Label>
            {editBar(key, b, `연습 ${numbers[key]}`)}
          </div>
          <CodeRunner key={b.starter + b.answer} id={key} code={b.starter} answer={b.answer} />
        </div>
      );
    }
    if (b.type === "exercise") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>실습 {numbers[key]}</Label>
            {editBar(key, b, `실습 ${numbers[key]}`)}
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-100">{b.title}</div>
          <div className="font-semibold [&_.prose]:text-slate-800 dark:[&_.prose]:text-slate-100">
            <Markdown>{b.prompt}</Markdown>
          </div>
          <CodeRunner key={b.starter + b.answer} id={key} code={b.starter} answer={b.answer} />
        </div>
      );
    }
    return null;
  }

  function renderProblem(b, key) {
    return (
      <div
        id={`p-${b.problem.id}`}
        data-anchor={`p-${b.problem.id}`}
        className="scroll-mt-20 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-900 p-5"
      >
        <div className="mb-3 text-sm text-slate-400 dark:text-slate-500">
          [문제 {String(numbers[key]).padStart(2, "0")}] <span className="font-semibold text-slate-800 dark:text-slate-100">{b.problem.title}</span>
        </div>
        <ProblemCell problem={b.problem} onVerdict={onVerdict} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-xl border border-accent-200 dark:border-accent-800 bg-gradient-to-r from-accent-100 via-accent-50 to-peach-50 dark:from-accent-950 dark:via-slate-900 dark:to-peach-950/40 p-5">
        <div className="text-sm font-semibold text-accent-600 dark:text-accent-300">STEP{step.n}</div>
        <h1 className="text-xl font-bold text-accent-900 dark:text-accent-100">{step.title}</h1>
        <ul className="mt-2 grid gap-x-6 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          {step.summary.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </header>

      {step.topics.map((topic, ti) => (
        <section key={topic.id} id={topic.id} data-anchor={topic.id} className="scroll-mt-20 space-y-4">
          <h2 className="border-b-2 border-accent-300 dark:border-accent-700 pb-1 text-lg font-bold text-slate-800 dark:text-slate-100">
            {ti + 1}. {topic.title}
          </h2>

          {groupBySubtitle(topic).map((group, gi) =>
            group.problem ? (
              <Fragment key={group.key}>
                {renderProblem(group.problem, group.key)}
                <CellsAfter anchor={group.key} store={store} />
              </Fragment>
            ) : (
              <div
                key={gi}
                {...(group.sub && { id: group.sub.id, "data-anchor": group.sub.id })}
                className="scroll-mt-20 space-y-5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-900 p-5">
                {group.items.map((item) => (
                  <Fragment key={item.id}>
                    {renderItem(item)}
                    {/* 설명이 여러 소제목으로 나뉘면, 끼워 넣기 줄은 그 설명의 마지막 조각 뒤에만 */}
                    {item.last && <CellsAfter anchor={item.key} store={store} />}
                  </Fragment>
                ))}
              </div>
            )
          )}
        </section>
      ))}

      {editing && (
        <EditDialog title={editing.title} block={editing.block} onSave={(value) => onEdit(editing.key, value)} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function Label({ children }) {
  return <div className="text-xs text-slate-400 dark:text-slate-500">{children}</div>;
}

// 주제의 블록들을 "### 소제목" 단위로 묶는다.
// 설명(md) 하나에 소제목이 여럿 있으면 소제목마다 잘라서 새 묶음을 시작한다.
function groupBySubtitle(topic) {
  const groups = [];
  let current = null;
  const open = () => {
    current = { items: [] };
    groups.push(current);
  };
  topic.blocks.forEach((b, bi) => {
    const key = blockKey(topic, bi);
    if (b.type === "problem") {
      groups.push({ problem: b, key });
      current = null;
      return;
    }
    if (b.type === "md") {
      const parts = b.text.split(/\n(?=### )/);
      parts.forEach((text, pi) => {
        if (!current || text.startsWith("### ")) open();
        current.items.push({ block: b, key, text, id: `${key}-${pi}`, last: pi === parts.length - 1 });
      });
      return;
    }
    if (!current) open();
    current.items.push({ block: b, key, id: key, last: true });
  });
  // "### 소제목" 으로 시작하는 묶음에는 목차에서 찾아갈 수 있도록 id 와 이름을 붙인다
  groups.forEach((g, gi) => {
    const first = g.items?.[0];
    if (first?.block.type === "md" && first.text.startsWith("### "))
      g.sub = { id: `${topic.id}--${gi}`, title: first.text.split("\n")[0].slice(4).replace(/`|\*\*/g, "").trim() };
  });
  return groups;
}

// 목차에 보일 소제목 목록 (주제 아래 하위 항목)
export const subtitles = (topic) => groupBySubtitle(topic).filter((g) => g.sub).map((g) => g.sub);

export const blockKey = (topic, i) => `${topic.id}-${i}`;

// 번호 붙이기 (정답 창도 같은 번호를 쓴다)
//   연습: 주제 번호-순서 (예: 3-2), 실습: STEP 안에서 1, 2, 3 …, 문제: 1, 2, 3 …
export function numberBlocks(step) {
  const numbers = {};
  let exercise = 0;
  let problem = 0;
  step.topics.forEach((topic, ti) => {
    let t = 0;
    topic.blocks.forEach((b, i) => {
      const key = blockKey(topic, i);
      if (b.type === "task") numbers[key] = `${ti + 1}-${++t}`;
      if (b.type === "exercise") numbers[key] = ++exercise;
      if (b.type === "problem") numbers[key] = ++problem;
    });
  });
  return numbers;
}

export function LockedStep({ n }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
      <Lock size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
      <p className="font-semibold text-slate-700 dark:text-slate-200">STEP{n} 미공개</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">수업에서 공개되면 열림</p>
    </div>
  );
}
