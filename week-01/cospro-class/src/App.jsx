import { useEffect, useRef, useState } from "react";
import { CircleUser, Eye, EyeOff, KeyRound, Lock, LockOpen, LogIn, Menu, Monitor, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import Sidebar from "./components/Sidebar";
import StepView, { LockedStep } from "./components/StepView";
import LoginDialog from "./components/LoginDialog";
import SettingsDialog from "./components/SettingsDialog";
import AccountDialog from "./components/AccountDialog";
import { preload, subscribeStatus } from "./lib/pyRunner";
import { toggleTheme, useTheme } from "./lib/theme";
import { fetchSiteStatus, setStepOpen } from "./lib/siteStatus";
import { getSessionPassword } from "./lib/auth";
import { flushSave, getAccount, logout, promoteToAdmin, reloadWork, restoreLogin, subscribeAccount } from "./lib/account";
import { readLS, writeLS } from "./lib/storage";
import { openAnswerWindow, postEdits, postPosition, setAdminSession } from "./lib/sync";
import { applyEdits, saveEdit } from "./lib/edits";
import step1 from "./content/step1";
import step2 from "./content/step2";
import step3 from "./content/step3";

const STEPS = [step1, step2, step3];

export default function App() {
  const [stepN, setStepN] = useState(() => Number(readLS("class.step", "1")) || 1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialog, setDialog] = useState(null); // 'login' | 'settings' | 'account' | null
  const [site, setSite] = useState({ loaded: false, server: false, steps: { 1: true, 2: false, 3: false }, edits: {} });
  const [verdicts, setVerdicts] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 좁은 화면: 목차 꺼내기
  const [sidebarHidden, setSidebarHidden] = useState(() => readLS("class.sidebarHidden", "") === "1"); // 넓은 화면: 목차 접기
  const [pyStatus, setPyStatus] = useState("idle");
  const [account, setAccount] = useState(getAccount);
  const [workReady, setWorkReady] = useState(false); // 서버에 저장된 작업을 다 불러왔는지
  const [workRev, setWorkRev] = useState(0); // 서버의 작업을 다시 받아 오면 늘려서 화면을 새로 그린다
  const theme = useTheme();

  useEffect(() => subscribeAccount(setAccount), []);

  // 배포 사이트면 남겨 둔 로그인으로 작업을 불러온 뒤에 본문을 그린다
  useEffect(() => {
    if (!site.loaded || workReady) return;
    if (site.server) restoreLogin().finally(() => setWorkReady(true));
    else setWorkReady(true);
  }, [site.loaded, site.server, workReady]);

  // 열려 있던 STEP 이 비공개로 바뀌면(관리자가 정리함) 서버에서 작업을 다시 받아 온다
  const prevSteps = useRef(site.steps);
  useEffect(() => {
    const closed = [1, 2, 3].some((n) => prevSteps.current[n] && !site.steps[n]);
    prevSteps.current = site.steps;
    if (closed && workReady && getAccount().user) reloadWork().then(() => setWorkRev((r) => r + 1));
  }, [site.steps, workReady]);

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

  // 관리자가 공개한 STEP 만 열린다 (관리자는 미리 볼 수 있음)
  const isOpen = (n) => isAdmin || (site.loaded && site.steps[n]);
  // 관리자가 [수정] 으로 고친 칸을 수업 내용 위에 덮는다
  const steps = STEPS.map((s) => applyEdits(s, site.edits));
  const step = steps.find((s) => s.n === stepN) || steps[0];
  const locked = !isOpen(step.n);

  function selectStep(n) {
    setStepN(n);
    writeLS("class.step", String(n));
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }

  // 화면에 보이는 주제를 목차에서 강조
  useEffect(() => {
    // 바뀐 것만 오는 entries 대신, 지금 보이는 것 전체를 기억해 두고 그중 문서에서 가장 아래(가장 안쪽)의 것을 고른다.
    // (주제 안의 문제 칸이 보이면 주제보다 문제를 강조)
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        const els = [...document.querySelectorAll("[data-anchor]")].filter((el) => visible.has(el));
        const pick = els.filter((el) => el.getBoundingClientRect().top <= 80).pop() || els[0];
        if (pick) setActiveId(pick.dataset.anchor);
      },
      { rootMargin: "-64px 0px -60% 0px" }
    );
    document.querySelectorAll("[data-anchor]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stepN, locked]);

  // 로그인한 계정으로 관리자 모드에 들어오면(순서는 상관없음) 관리자 계정으로 표시한다
  const accountId = account.user?.id;
  const accountAdmin = account.user?.admin;
  useEffect(() => {
    if (isAdmin && site.server && accountId && !accountAdmin)
      promoteToAdmin(getSessionPassword()).catch((err) => alert("관리자 계정으로 표시하지 못했습니다: " + err.message));
  }, [isAdmin, site.server, accountId, accountAdmin]);

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

  // 관리자: STEP1~3 공개/비공개 (배포 사이트에서만)
  async function toggleStep(n) {
    const next = !site.steps[n];
    const lastOpen = [1, 2, 3].every((s) => s === n || !site.steps[s]);
    const closeMsg = [
      `STEP${n} 비공개로 전환? 수강생 화면에서 잠김.`,
      "",
      `STEP${n} 정리도 함께 합니다(되돌릴 수 없음):`,
      "· 수강생: +코드·+텍스트 칸과 고친 코드 삭제",
      "· 관리자 계정: +코드·+텍스트 칸은 남기고 고친 코드만 삭제",
      ...(lastOpen ? ["", "STEP 이 모두 비공개가 되므로 수강생 아이디·비밀번호도 모두 삭제합니다(관리자 계정은 남음)."] : []),
    ].join("\n");
    if (!confirm(next ? `STEP${n} 공개?` : closeMsg)) return;
    try {
      if (!next) await flushSave();
      const steps = await setStepOpen(n, next, getSessionPassword());
      setSite((s) => ({ ...s, steps })); // 비공개로 바뀌면 위의 effect 가 정리된 작업을 다시 받아 온다
    } catch (err) {
      alert("바꾸지 못했습니다: " + err.message);
    }
  }

  // 관리자: 수업 칸 하나 고치기 / 원래대로 (value = null). 모든 수강생 화면에 적용된다.
  async function editBlock(key, value) {
    const edits = await saveEdit(key, value, { server: site.server, password: getSessionPassword() });
    setSite((s) => ({ ...s, edits }));
    postEdits(edits); // 열려 있는 정답 창도 바로 바꾼다
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
          <span className="text-accent-600 dark:text-accent-400">COS PRO 3급</span> 파이썬 대비반
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
          {site.server && workReady && (
            <button
              onClick={() => (account.user ? confirm(`${account.user.id} 로그아웃?`) && logout().then(() => setWorkRev((r) => r + 1)) : setDialog("account"))}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              title={account.user ? "눌러서 로그아웃" : "로그인하면 작업이 서버에 저장됩니다"}
            >
              {account.user ? <CircleUser size={16} /> : <LogIn size={16} />}
              <span className="hidden sm:inline">{account.user ? account.user.id : "로그인"}</span>
              {account.user && <SaveStatus save={account.save} />}
            </button>
          )}
          <button
            onClick={toggleMode}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
              isAdmin ? "bg-peach-400 text-white hover:bg-peach-500" : "border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {isAdmin ? <LockOpen size={16} /> : <Lock size={16} />}
            <span className="hidden sm:inline">{isAdmin ? "관리자 모드" : "수업 모드"}</span>
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
          steps={steps}
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
          {account.notice && (
            <p className="rounded-lg border border-peach-300 dark:border-peach-700 bg-peach-50 dark:bg-peach-950/40 px-3 py-2 text-sm text-peach-800 dark:text-peach-200">{account.notice}</p>
          )}
          {site.server && workReady && !account.user && !account.notice && (
            <p className="text-sm text-slate-500 dark:text-slate-400">지금은 이 브라우저에만 저장됩니다. 다른 컴퓨터에서도 이어서 보려면 [로그인] 하세요.</p>
          )}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-peach-300 dark:border-peach-700 bg-peach-50 dark:bg-peach-950/40 p-3">
              <span className="mr-auto text-sm font-medium text-peach-800 dark:text-peach-200">관리자 모드 · 모든 STEP 미리 보기 가능</span>
              {site.server ? (
                [1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleStep(n)}
                    title={`눌러서 STEP${n} 공개/비공개를 바꿉니다`}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white ${
                      site.steps[n] ? "bg-mint-500 hover:bg-mint-600" : "bg-slate-400 hover:bg-slate-500"
                    }`}
                  >
                    {site.steps[n] ? <Eye size={16} /> : <EyeOff size={16} />} STEP{n} {site.steps[n] ? "공개 중" : "비공개"}
                  </button>
                ))
              ) : (
                <span className="text-xs text-peach-700 dark:text-peach-300" title="npm run dev 로 볼 때는 서버 함수가 없습니다">
                  STEP 공개/비공개는 배포 사이트에서만 (지금은 모두 열림)
                </span>
              )}
              <button className={toolBtn} onClick={() => openAnswerWindow(step.n)} title="새 창으로 열어 다른 모니터에 두기. 수업 화면을 따라 움직임.">
                <Monitor size={16} /> 정답 창 열기
              </button>
              <button className={toolBtn} onClick={() => setDialog("settings")}>
                <KeyRound size={16} /> 비밀번호
              </button>
            </div>
          )}

          {locked ? (
            site.loaded ? <LockedStep n={step.n} /> : <p className="text-sm text-slate-500 dark:text-slate-400">공개 상태를 확인하는 중…</p>
          ) : !workReady ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">저장한 작업을 불러오는 중…</p>
          ) : (
            <StepView
              key={`${step.n}-${account.user?.id || ""}-${workRev}`}
              step={step}
              onVerdict={(id, v) => setVerdicts((old) => ({ ...old, [id]: v }))}
              onEdit={isAdmin ? editBlock : undefined}
            />
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
      {dialog === "account" && <AccountDialog onClose={() => setDialog(null)} />}
      {dialog === "settings" && <SettingsDialog serverMode={site.server} onClose={() => setDialog(null)} />}
    </div>
  );
}

function SaveStatus({ save }) {
  const map = {
    saved: ["text-mint-600 dark:text-mint-400", "저장됨"],
    saving: ["text-slate-400", "저장 중…"],
    error: ["text-red-600 dark:text-red-400", "저장 실패 · 다시 시도 중"],
  };
  const [cls, text] = map[save] || map.saved;
  return <span className={`text-xs ${cls}`}>{text}</span>;
}

function PyStatus({ status }) {
  const map = {
    idle: ["bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400", "파이썬 준비 전"],
    loading: ["bg-peach-100 dark:bg-peach-900/50 text-peach-700 dark:text-peach-300", "파이썬 불러오는 중…"],
    ready: ["bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300", "파이썬 준비됨"],
    error: ["bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300", "파이썬 불러오기 실패"],
  };
  const [cls, text] = map[status] || map.idle;
  return <span className={`hidden rounded-full px-2 py-0.5 text-xs sm:inline ${cls}`}>{text}</span>;
}
