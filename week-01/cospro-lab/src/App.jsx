import { useEffect, useRef, useState } from "react";
import { Download, Eye, EyeOff, KeyRound, Loader2, Lock, LockOpen, Menu, Moon, PanelLeftClose, PanelLeftOpen, RefreshCw, RotateCcw, Shuffle, Sun, Upload, Wand2 } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ProblemCell from "./components/ProblemCell";
import ProblemEditor from "./components/ProblemEditor";
import LoginDialog from "./components/LoginDialog";
import SettingsDialog from "./components/SettingsDialog";
import GenerateDialog from "./components/GenerateDialog";
import { preload, subscribeStatus } from "./lib/pyRunner";
import { toggleTheme, useTheme } from "./lib/theme";
import { fetchSiteStatus, setSiteOpen } from "./lib/siteStatus";
import { getSessionPassword } from "./lib/auth";
import { SET_SIZE, isValidSet, loadSets, pickSet, saveSets } from "./lib/practiceSet";
import {
  clearSavedProblems,
  fetchDefaultProblems,
  loadProblems,
  blankKey,
  codeKey,
  newId,
  saveProblems,
  readLS,
  removeLS,
  validateProblems,
  writeLS,
} from "./lib/storage";

export default function App() {
  const [problems, setProblems] = useState(null); // 관리자용: 이 브라우저에서 고친 내용(없으면 problems.json)
  const [published, setPublished] = useState(null); // 학생용: 언제나 public/problems.json
  const [loadError, setLoadError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialog, setDialog] = useState(null); // 'login' | 'settings' | 'generate' | null
  const [verdicts, setVerdicts] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 좁은 화면(휴대폰): 목차를 꺼내 보기
  const [sidebarHidden, setSidebarHidden] = useState(() => readLS("cospro.sidebarHidden", "") === "1"); // 넓은 화면: 목차 접기
  const [pyStatus, setPyStatus] = useState("idle");
  const gradeFilter = 3; // 지금은 3급만 운영한다 (1·2급 문제 틀 코드는 남겨 둠)
  const [site, setSite] = useState({ loaded: false, server: false, open: true }); // 배포 사이트의 공개/비공개
  const [sets, setSets] = useState(loadSets); // 학생 모드: 급수 탭마다 지금 푸는 문제 id 목록
  const [round, setRound] = useState(0); // [다시 풀기] 때 문항 화면을 새로 그리려고
  const theme = useTheme();
  const importRef = useRef(null);

  useEffect(() => {
    preload(); // 페이지가 열리면 바로 파이썬을 미리 불러온다
    // 공개/비공개 상태: 처음 한 번, 그 뒤 2분마다, 그리고 창으로 돌아올 때 다시 확인
    const refreshSite = () => fetchSiteStatus().then((st) => setSite({ loaded: true, ...st }));
    refreshSite();
    const timer = setInterval(refreshSite, 2 * 60 * 1000);
    window.addEventListener("focus", refreshSite);
    loadProblems().then(setProblems).catch((e) => setLoadError(e.message));
    fetchDefaultProblems().then(setPublished).catch((e) => setLoadError(e.message));
    const unsubscribe = subscribeStatus(setPyStatus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refreshSite);
      unsubscribe();
    };
  }, []);

  // 학생 모드는 이 브라우저에 저장된 관리자 수정본과 상관없이 배포된 문제(problems.json)만 본다.
  const shown = isAdmin ? problems : published;
  // 목차에서 고른 급수의 문제들
  const pool = shown && shown.filter((p) => p.grade === gradeFilter);
  // 관리자는 전부, 학생은 그중 고른 SET_SIZE 개만 본다.
  const setIds = sets[gradeFilter];
  const setReady = !!pool && isValidSet(setIds, pool);
  // 학생: 공개 상태를 확인하기 전(waiting)이나 비공개(closed)일 때는 문제를 보여 주지 않는다.
  const waiting = !isAdmin && !site.loaded;
  const closed = !isAdmin && site.loaded && !site.open;
  const visible = !pool ? null : isAdmin ? pool : waiting || closed ? [] : setReady ? setIds.map((id) => pool.find((p) => p.id === id)) : [];

  // 화면에 보이는 문항을 사이드바에서 강조
  useEffect(() => {
    if (!shown) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.dataset.pid);
      },
      { rootMargin: "-64px 0px -60% 0px" }
    );
    document.querySelectorAll("[data-pid]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [shown, isAdmin, sets]);

  // 학생 모드인데 세트가 없거나 문제 목록이 바뀌어 맞지 않으면 새로 고른다.
  useEffect(() => {
    if (pool && pool.length && !isAdmin && !setReady) chooseSet(pickSet(pool, setIds || []));
  }, [pool, isAdmin, setReady]);

  // 세트를 바꾸고, 그 문제들의 지난 풀이와 채점 표시를 지운다.
  function chooseSet(ids) {
    ids.forEach((id) => {
      removeLS(codeKey(id));
      removeLS(blankKey(id));
    });
    setVerdicts({});
    setRound((n) => n + 1);
    setSets((old) => {
      const next = { ...old, [gradeFilter]: ids };
      saveSets(next);
      return next;
    });
  }

  // [다시 풀기] 같은 문제를 처음부터
  function retrySet() {
    if (!confirm("지금 문제를 처음부터 다시 풀까요? 작성한 코드와 채점 결과가 지워집니다.")) return;
    chooseSet(setIds);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // [새로 풀기] 다른 문제로 새로 고르기
  function newSet() {
    if (!confirm(`새로운 ${Math.min(SET_SIZE, pool.length)}문제를 고를까요? 지금 작성한 코드와 채점 결과가 지워집니다.`)) return;
    chooseSet(pickSet(pool, setIds));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 목차 버튼: 넓은 화면에서는 접기/펴기, 좁은 화면에서는 꺼내기/넣기
  function toggleSidebar() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSidebarHidden((v) => {
        writeLS("cospro.sidebarHidden", v ? "" : "1");
        return !v;
      });
    } else {
      setSidebarOpen((v) => !v);
    }
  }

  // ── 관리자: 문제 추가/수정/삭제/이동 ──
  function commit(next) {
    setProblems(next);
    saveProblems(next);
  }

  function addProblem() {
    const grade = gradeFilter;
    const p = { id: newId(), grade, title: "새 문제", description: "### 문제 설명\n\n", starterCode: "def solution():\n    answer = 0\n    return answer\n\n\nprint(solution())\n", answerCode: "", stdin: "" };
    commit([...problems, p]);
    setTimeout(() => document.getElementById(`p-${p.id}`)?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function addGenerated(list) {
    commit([...problems, ...list.map(({ expected, ...p }) => p)]);
    setDialog(null);
    setTimeout(() => document.getElementById(`p-${list[0]?.id}`)?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const saveProblem = (draft) => commit(problems.map((p) => (p.id === draft.id ? draft : p)));

  function deleteProblem(id, number) {
    if (!confirm(`문제 ${number} 을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return;
    commit(problems.filter((p) => p.id !== id));
  }

  // 화면에 보이는 목록에서 바로 위/아래 문제와 자리를 바꾼다.
  function moveProblem(index, dir) {
    const a = problems.indexOf(visible[index]);
    const b = problems.indexOf(visible[index + dir]);
    const next = [...problems];
    [next[a], next[b]] = [next[b], next[a]];
    commit(next);
  }

  function exportProblems() {
    const blob = new Blob([JSON.stringify({ problems }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "problems.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importProblems(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const list = validateProblems(JSON.parse(await file.text()));
      if (confirm(`${list.length}개 문제로 바꿀까요? 지금 문제 목록은 사라집니다.`)) commit(list);
    } catch (err) {
      alert("가져오기 실패: " + err.message);
    }
  }

  async function resetProblems() {
    if (!confirm("이 브라우저에서 고친 내용을 버리고 problems.json 의 원래 문제로 되돌릴까요?")) return;
    clearSavedProblems();
    setProblems(await fetchDefaultProblems());
  }

  // 관리자: 학생에게 공개/비공개 (배포 사이트에서만)
  async function toggleOpen() {
    const next = !site.open;
    const msg = next ? "학생들에게 문제를 공개할까요?" : "비공개로 바꿀까요? 학생들은 문제를 볼 수 없게 됩니다. (이미 열어 둔 화면은 2분 안에, 또는 새로고침할 때 닫힙니다)";
    if (!confirm(msg)) return;
    try {
      const open = await setSiteOpen(next, getSessionPassword());
      setSite((s) => ({ ...s, open }));
    } catch (err) {
      alert("바꾸지 못했습니다: " + err.message);
    }
  }

  function toggleMode() {
    if (isAdmin) setIsAdmin(false);
    else setDialog("login");
  }

  const toolBtn = "inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800";

  return (
    <div className="min-h-screen">
      {/* ── 상단 바 ── */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b bg-white dark:bg-slate-900 px-3 md:px-4">
        <button
          className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={toggleSidebar}
          aria-label="목차 접기/펴기"
          title={sidebarHidden ? "목차 펴기" : "목차 접기"}
        >
          <Menu size={20} className="md:hidden" />
          {sidebarHidden ? <PanelLeftOpen size={20} className="hidden md:block" /> : <PanelLeftClose size={20} className="hidden md:block" />}
        </button>
        <h1 className="truncate font-bold text-slate-800 dark:text-slate-100">
          <span className="text-blue-600 dark:text-blue-400">COS PRO</span> 파이썬 실습
        </h1>
        <PyStatus status={pyStatus} />

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={theme === "dark" ? "라이트 모드로" : "다크 모드로"}
            aria-label={theme === "dark" ? "라이트 모드로" : "다크 모드로"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={toggleMode}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
              isAdmin ? "bg-amber-500 text-white hover:bg-amber-600" : "border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {isAdmin ? <LockOpen size={16} /> : <Lock size={16} />}
            <span className="hidden sm:inline">{isAdmin ? "관리자 모드" : "학생 모드"}</span>
          </button>
        </div>
      </header>

      {/* ── 좌측 사이드바 ── */}
      <aside
        className={`fixed bottom-0 left-0 top-14 z-20 w-64 border-r bg-white dark:bg-slate-900 transition-transform ${
          sidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"
        } ${sidebarHidden ? "md:-translate-x-full" : "md:translate-x-0 md:shadow-none"}`}
      >
        {visible && (
          <Sidebar
            problems={visible}
            gradeLabel={`${gradeFilter}급`}
            activeId={activeId}
            verdicts={verdicts}
            isAdmin={isAdmin}
            onAdd={addProblem}
            onNavigate={() => setSidebarOpen(false)}
          />
        )}
      </aside>

      {/* ── 메인: 문항이 위에서 아래로 쌓임 ── */}
      <main className={`px-4 pb-24 pt-20 transition-[margin] ${sidebarHidden ? "md:ml-0" : "md:ml-64"}`}>
        <div className="mx-auto max-w-4xl space-y-6">
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-3">
              <span className="mr-auto text-sm font-medium text-amber-800 dark:text-amber-200">관리자 모드 · 고친 내용은 이 브라우저에만 저장됩니다 (학생 모드에는 problems.json 의 문제가 보입니다)</span>
              {site.server ? (
                <button
                  onClick={toggleOpen}
                  title="눌러서 학생 공개/비공개를 바꿉니다"
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white ${
                    site.open ? "bg-green-600 hover:bg-green-700" : "bg-slate-500 hover:bg-slate-600"
                  }`}
                >
                  {site.open ? <Eye size={16} /> : <EyeOff size={16} />} {site.open ? "학생 공개 중" : "비공개"}
                </button>
              ) : (
                <span className="text-xs text-amber-700 dark:text-amber-300" title="npm run dev 로 볼 때는 서버 함수가 없습니다">
                  공개/비공개는 배포 사이트에서만
                </span>
              )}
              <button className={toolBtn} onClick={() => setDialog("generate")}>
                <Wand2 size={16} /> 자동 생성
              </button>
              <button className={toolBtn} onClick={exportProblems} title="학생에게 배포하려면 이 파일을 public/problems.json 에 덮어쓰세요">
                <Download size={16} /> 내보내기
              </button>
              <button className={toolBtn} onClick={() => importRef.current.click()}>
                <Upload size={16} /> 가져오기
              </button>
              <button className={toolBtn} onClick={resetProblems}>
                <RefreshCw size={16} /> 원래대로
              </button>
              <button className={toolBtn} onClick={() => setDialog("settings")}>
                <KeyRound size={16} /> 비밀번호
              </button>
              <input ref={importRef} type="file" accept=".json,application/json" hidden onChange={importProblems} />
            </div>
          )}

          {loadError && <div className="rounded-md bg-red-50 dark:bg-red-950/40 p-4 text-red-700 dark:text-red-300">{loadError}</div>}
          {(!shown || waiting) && !loadError && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Loader2 size={18} className="animate-spin" /> 문제를 불러오는 중…
            </div>
          )}

          {closed && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
              <EyeOff size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">지금은 공개 기간이 아닙니다.</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">선생님이 공개하면 다시 문제를 풀 수 있어요.</p>
            </div>
          )}

          {!isAdmin && !waiting && !closed && pool?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
              <span className="mr-auto text-sm text-slate-600 dark:text-slate-300">
                {gradeFilter}급 {pool.length}문제 중 <b>{visible.length}문제</b>
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  · 맞힌 문제 {visible.filter((p) => verdicts[p.id] === "pass").length} / {visible.length}
                </span>
              </span>
              <button className={toolBtn} onClick={retrySet} title="같은 문제를 처음부터 다시 풉니다">
                <RotateCcw size={16} /> 다시 풀기
              </button>
              {pool.length > SET_SIZE && (
                <button className={toolBtn} onClick={newSet} title="다른 문제를 무작위로 새로 고릅니다">
                  <Shuffle size={16} /> 새로 풀기
                </button>
              )}
            </div>
          )}

          {pool?.length === 0 && !closed && !waiting && (
            <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {gradeFilter}급 문제가 아직 없습니다.{isAdmin && " 왼쪽 아래 [문제 추가] 나 위의 [자동 생성] 으로 만들어 보세요."}
            </div>
          )}

          {visible?.map((p, i) => (
            <section key={p.id} id={`p-${p.id}`} data-pid={p.id} className="scroll-mt-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
                문제 {i + 1}
                {!isAdmin && p.title && <span className="ml-2 text-slate-800 dark:text-slate-100">{p.title}</span>}
              </div>
              {isAdmin ? (
                <ProblemEditor
                  key={p.id}
                  problem={p}
                  isFirst={i === 0}
                  isLast={i === visible.length - 1}
                  onSave={saveProblem}
                  onDelete={() => deleteProblem(p.id, i + 1)}
                  onMove={(dir) => moveProblem(i, dir)}
                />
              ) : (
                <ProblemCell
                  key={`${p.id}-${round}-${p.starterCode}`}
                  problem={p}
                  onVerdict={(id, v) => setVerdicts((old) => ({ ...old, [id]: v }))}
                />
              )}
            </section>
          ))}
        </div>
      </main>

      {dialog === "login" && site.loaded && (
        <LoginDialog
          serverMode={site.server}
          onClose={() => setDialog(null)}
          onSuccess={() => {
            setIsAdmin(true);
            setDialog(null);
          }}
        />
      )}
      {dialog === "settings" && <SettingsDialog serverMode={site.server} onClose={() => setDialog(null)} />}
      {dialog === "generate" && (
        <GenerateDialog grade={gradeFilter} onClose={() => setDialog(null)} onGenerate={addGenerated} />
      )}
    </div>
  );
}

function PyStatus({ status }) {
  const map = {
    idle: ["bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400", "파이썬 준비 전"],
    loading: ["bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300", "파이썬 불러오는 중…"],
    ready: ["bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300", "파이썬 준비됨"],
    error: ["bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300", "파이썬 불러오기 실패"],
  };
  const [cls, text] = map[status] || map.idle;
  return <span className={`hidden rounded-full px-2 py-0.5 text-xs sm:inline ${cls}`}>{text}</span>;
}
