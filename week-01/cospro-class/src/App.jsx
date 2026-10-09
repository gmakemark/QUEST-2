import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, LockOpen, Menu, Monitor, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import Sidebar from "./components/Sidebar";
import StepView, { LockedStep } from "./components/StepView";
import LoginDialog from "./components/LoginDialog";
import SettingsDialog from "./components/SettingsDialog";
import { preload, subscribeStatus } from "./lib/pyRunner";
import { toggleTheme, useTheme } from "./lib/theme";
import { fetchSiteStatus, setStepOpen } from "./lib/siteStatus";
import { getSessionPassword } from "./lib/auth";
import { readLS, writeLS } from "./lib/storage";
import { openAnswerWindow, postPosition, setAdminSession } from "./lib/sync";
import step1 from "./content/step1";
import step2 from "./content/step2";
import step3 from "./content/step3";

const STEPS = [step1, step2, step3];

export default function App() {
  const [stepN, setStepN] = useState(() => Number(readLS("class.step", "1")) || 1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialog, setDialog] = useState(null); // 'login' | 'settings' | null
  const [site, setSite] = useState({ loaded: false, server: false, steps: { 2: false, 3: false } });
  const [verdicts, setVerdicts] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 좁은 화면: 목차 꺼내기
  const [sidebarHidden, setSidebarHidden] = useState(() => readLS("class.sidebarHidden", "") === "1"); // 넓은 화면: 목차 접기
  const [pyStatus, setPyStatus] = useState("idle");
  const theme = useTheme();

  useEffect(() => {
    preload(); // 페이지가 열리면 바로 파이썬을 미리 불러온다
    // STEP 공개 상태: 처음 한 번, 그 뒤 2분마다, 그리고 창으로 돌아올 때 다시 확인
    const refresh = () => fetchSiteStatus().then((st) => setSite({ loaded: true, ...st }));
    refresh();
    const timer = setInterval(refresh, 2 * 60 * 1000);
    window.addEventListener("focus", refresh);
    const unsubscribe = subscribeStatus(setPyStatus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      unsubscribe();
    };
  }, []);

  // STEP1 은 늘 공개, STEP2·3 은 관리자가 공개해야 열린다 (관리자는 미리 볼 수 있음)
  const isOpen = (n) => n === 1 || isAdmin || (site.loaded && site.steps[n]);
  const step = STEPS.find((s) => s.n === stepN) || step1;
  const locked = !isOpen(step.n);

  function selectStep(n) {
    setStepN(n);
    writeLS("class.step", String(n));
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }

  // 화면에 보이는 주제를 목차에서 강조
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActiveId(seen[0].target.dataset.anchor);
      },
      { rootMargin: "-64px 0px -60% 0px" }
    );
    document.querySelectorAll("[data-anchor]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stepN, locked]);

  // 관리자일 때: 정답 창이 따라올 수 있도록 지금 보는 STEP·주제를 알린다
  useEffect(() => {
    if (isAdmin) postPosition(stepN, activeId);
  }, [isAdmin, stepN, activeId]);

  function toggleSidebar() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSidebarHidden((v) => {
        writeLS("class.sidebarHidden", v ? "" : "1");
        return !v;
      });
    } else {
      setSidebarOpen((v) => !v);
    }
  }

  // 관리자: STEP2·3 공개/비공개 (배포 사이트에서만)
  async function toggleStep(n) {
    const next = !site.steps[n];
    if (!confirm(next ? `STEP${n} 을 공개할까요?` : `STEP${n} 을 비공개로 바꿀까요? 학생 화면에서 잠깁니다.`)) return;
    try {
      const steps = await setStepOpen(n, next, getSessionPassword());
      setSite((s) => ({ ...s, steps }));
    } catch (err) {
      alert("바꾸지 못했습니다: " + err.message);
    }
  }

  function toggleMode() {
    if (isAdmin) {
      setIsAdmin(false);
      setAdminSession(false);
    } else setDialog("login");
  }

  const toolBtn = "inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800";

  return (
    <div className="min-h-screen">
      {/* ── 상단 바 ── */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b bg-white dark:bg-slate-900 px-3 md:px-4">
        <button className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={toggleSidebar} aria-label="목차 접기/펴기" title={sidebarHidden ? "목차 펴기" : "목차 접기"}>
          <Menu size={20} className="md:hidden" />
          {sidebarHidden ? <PanelLeftOpen size={20} className="hidden md:block" /> : <PanelLeftClose size={20} className="hidden md:block" />}
        </button>
        <h1 className="truncate font-bold text-slate-800 dark:text-slate-100">
          <span className="text-blue-600 dark:text-blue-400">COS PRO 3급</span> 파이썬 대비반
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
            <span className="hidden sm:inline">{isAdmin ? "관리자 모드" : "수강생 모드"}</span>
          </button>
        </div>
      </header>

      {/* ── 좌측 목차 ── */}
      <aside
        className={`fixed bottom-0 left-0 top-14 z-20 w-72 border-r bg-white dark:bg-slate-900 transition-transform ${
          sidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"
        } ${sidebarHidden ? "md:-translate-x-full" : "md:translate-x-0 md:shadow-none"}`}
      >
        <Sidebar
          steps={STEPS}
          current={step.n}
          isOpen={isOpen}
          activeId={activeId}
          verdicts={verdicts}
          onSelect={selectStep}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>

      {/* ── 본문 ── */}
      <main className={`px-4 pb-24 pt-20 transition-[margin] ${sidebarHidden ? "md:ml-0" : "md:ml-72"}`}>
        <div className="mx-auto max-w-4xl space-y-6">
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-3">
              <span className="mr-auto text-sm font-medium text-amber-800 dark:text-amber-200">관리자 모드 · 모든 STEP 을 미리 볼 수 있어요</span>
              {site.server ? (
                [2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleStep(n)}
                    title={`눌러서 STEP${n} 공개/비공개를 바꿉니다`}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white ${
                      site.steps[n] ? "bg-green-600 hover:bg-green-700" : "bg-slate-500 hover:bg-slate-600"
                    }`}
                  >
                    {site.steps[n] ? <Eye size={16} /> : <EyeOff size={16} />} STEP{n} {site.steps[n] ? "공개 중" : "비공개"}
                  </button>
                ))
              ) : (
                <span className="text-xs text-amber-700 dark:text-amber-300" title="npm run dev 로 볼 때는 서버 함수가 없습니다">
                  STEP 공개/비공개는 배포 사이트에서만 (지금은 모두 열림)
                </span>
              )}
              <button className={toolBtn} onClick={() => openAnswerWindow(step.n)} title="새 창으로 열어 다른 모니터에 두세요. 수업 화면을 따라 움직여요.">
                <Monitor size={16} /> 정답 창 열기
              </button>
              <button className={toolBtn} onClick={() => setDialog("settings")}>
                <KeyRound size={16} /> 비밀번호
              </button>
            </div>
          )}

          {locked ? (
            site.loaded ? <LockedStep n={step.n} /> : <p className="text-sm text-slate-500 dark:text-slate-400">공개 상태를 확인하는 중…</p>
          ) : (
            <StepView key={step.n} step={step} onVerdict={(id, v) => setVerdicts((old) => ({ ...old, [id]: v }))} />
          )}
        </div>
      </main>

      {dialog === "login" && site.loaded && (
        <LoginDialog
          serverMode={site.server}
          onClose={() => setDialog(null)}
          onSuccess={() => {
            setIsAdmin(true);
            setAdminSession(true);
            setDialog(null);
          }}
        />
      )}
      {dialog === "settings" && <SettingsDialog serverMode={site.server} onClose={() => setDialog(null)} />}
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
