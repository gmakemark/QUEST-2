import { useState } from "react";
import Modal from "./Modal";
import { checkPassword, hasPassword, setLocalPassword } from "../lib/auth";

export default function LoginDialog({ serverMode, onClose, onSuccess }) {
  const creating = !hasPassword(serverMode);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (creating) {
      if (pw.length < 4) return setError("비밀번호는 4글자 이상으로 해 주세요.");
      if (pw !== pw2) return setError("두 비밀번호가 다릅니다.");
      await setLocalPassword(pw);
      onSuccess();
    } else {
      try {
        if (await checkPassword(pw, serverMode)) onSuccess();
        else setError("비밀번호가 틀렸습니다.");
      } catch (err) {
        setError(err.message);
      }
    }
  }

  const input = "w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 outline-none focus:border-blue-500";
  return (
    <Modal title={creating ? "관리자 비밀번호 만들기" : "관리자 모드"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {creating && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            이 브라우저에 아직 관리자 비밀번호가 없습니다. 새로 만들어 주세요. (이 브라우저에만 저장됩니다)
          </p>
        )}
        <input type="password" autoFocus className={input} placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} />
        {creating && (
          <input type="password" className={input} placeholder="비밀번호 한 번 더" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        )}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700">
          {creating ? "만들고 들어가기" : "들어가기"}
        </button>
      </form>
    </Modal>
  );
}
