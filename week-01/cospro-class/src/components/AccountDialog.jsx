import { useState } from "react";
import Modal from "./Modal";
import { login } from "../lib/account";

// 수강생·관리자 로그인 / 가입. 로그인하면 작업이 서버에 저장되어 다른 컴퓨터에서도 이어서 볼 수 있다.
export default function AccountDialog({ onClose }) {
  const [isNew, setIsNew] = useState(false);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const cleanId = id.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(cleanId)) return setError("아이디는 영어 소문자·숫자·_ 로 3~20글자");
    if (pw.length < 4) return setError("비밀번호는 4글자 이상");
    if (isNew && pw !== pw2) return setError("두 비밀번호가 다릅니다.");
    setBusy(true);
    try {
      await login(cleanId, pw, isNew);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 outline-none focus:border-accent-500";
  const tab = (on) => `flex-1 rounded-md py-1.5 text-sm font-medium ${on ? "bg-accent-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`;
  return (
    <Modal title="로그인" onClose={onClose}>
      <div className="mb-3 flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
        <button type="button" className={tab(!isNew)} onClick={() => setIsNew(false)}>로그인</button>
        <button type="button" className={tab(isNew)} onClick={() => setIsNew(true)}>처음이면 가입</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          로그인하면 고친 코드와 +코드·+텍스트 칸이 서버에 저장되어 다른 컴퓨터에서도 이어서 볼 수 있습니다.
          {isNew && " 아이디에는 실명을 쓰지 마세요. 수업이 끝나 관리자가 STEP 을 닫으면 계정과 작업이 지워집니다."}
        </p>
        <input autoFocus className={input} placeholder="아이디 (영어 소문자·숫자)" autoComplete="username" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="password" className={input} placeholder="비밀번호" autoComplete={isNew ? "new-password" : "current-password"} value={pw} onChange={(e) => setPw(e.target.value)} />
        {isNew && <input type="password" className={input} placeholder="비밀번호 한 번 더" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-md bg-accent-600 py-2 font-medium text-white hover:bg-accent-700 disabled:opacity-60">
          {busy ? "잠시만…" : isNew ? "가입하고 들어가기" : "들어가기"}
        </button>
      </form>
    </Modal>
  );
}
