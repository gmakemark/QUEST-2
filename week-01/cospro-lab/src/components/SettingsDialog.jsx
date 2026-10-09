import { useState } from "react";
import Modal from "./Modal";
import { checkPassword, isPasswordFromEnv, setLocalPassword } from "../lib/auth";

// 관리자 비밀번호 바꾸기 (이 브라우저에 저장된 비밀번호일 때만)
export default function SettingsDialog({ onClose }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [msg, setMsg] = useState("");

  async function changePw(e) {
    e.preventDefault();
    if (!(await checkPassword(oldPw))) return setMsg("지금 비밀번호가 틀렸습니다.");
    if (newPw.length < 4) return setMsg("새 비밀번호는 4글자 이상으로 해 주세요.");
    if (newPw !== newPw2) return setMsg("새 비밀번호 두 개가 다릅니다.");
    await setLocalPassword(newPw);
    setOldPw("");
    setNewPw("");
    setNewPw2("");
    setMsg("비밀번호를 바꿨습니다.");
  }

  const input = "w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-blue-500";
  return (
    <Modal title="관리자 비밀번호" onClose={onClose}>
      {isPasswordFromEnv() ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          비밀번호가 .env.local 의 VITE_ADMIN_PASSWORD_HASH 로 정해져 있습니다. 바꾸려면 그 값을 바꾸고 다시 빌드하세요.
        </p>
      ) : (
        <form onSubmit={changePw} className="space-y-2">
          <input type="password" autoFocus className={input} placeholder="지금 비밀번호" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
          <input type="password" className={input} placeholder="새 비밀번호" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          <input type="password" className={input} placeholder="새 비밀번호 한 번 더" value={newPw2} onChange={(e) => setNewPw2(e.target.value)} />
          <button className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">바꾸기</button>
          {msg && <p className="rounded bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm">{msg}</p>}
        </form>
      )}
    </Modal>
  );
}
