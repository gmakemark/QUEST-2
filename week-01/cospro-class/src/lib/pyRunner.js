// 메인 화면 쪽에서 Pyodide worker 를 관리한다.
// - 실행은 한 번에 하나씩 줄을 세워 처리한다.
// - 시간 제한을 넘기면 worker 를 죽이고 새로 띄운다 (무한 반복 대비).

export const TIMEOUT_MS = 10000;

let worker = null;
let readyPromise = null;
let queue = Promise.resolve();
let nextId = 1;
let status = "idle"; // idle | loading | ready | error
const listeners = new Set();

function setStatus(s) {
  status = s;
  listeners.forEach((fn) => fn(s));
}

export function subscribeStatus(fn) {
  listeners.add(fn);
  fn(status);
  return () => listeners.delete(fn);
}

function boot() {
  setStatus("loading");
  worker = new Worker(import.meta.env.BASE_URL + "py-worker.js");
  readyPromise = new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data.type === "ready") {
        setStatus("ready");
        resolve();
      } else if (e.data.type === "load-error") {
        setStatus("error");
        reject(new Error(e.data.error));
      }
    };
    worker.onerror = (e) => {
      setStatus("error");
      reject(new Error(e.message || "worker 오류"));
    };
  });
  readyPromise.catch(() => {});
}

export function preload() {
  if (!worker) boot();
  return readyPromise;
}

async function runOnce(code, stdin, echo) {
  try {
    await preload();
  } catch (err) {
    worker?.terminate();
    worker = null; // 다음 실행 때 다시 시도
    return { ok: false, stdout: "", error: "파이썬 실행기를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.\n" + err.message };
  }

  const id = nextId++;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      worker.terminate();
      boot();
      resolve({
        ok: false,
        stdout: "",
        error: `실행 시간이 ${TIMEOUT_MS / 1000}초를 넘어서 멈췄습니다. 무한 반복이 없는지 확인해 보세요.`,
        timeout: true,
      });
    }, TIMEOUT_MS);
    worker.onmessage = (e) => {
      if (e.data.id !== id) return;
      clearTimeout(timer);
      resolve(e.data);
    };
    worker.postMessage({ id, code, stdin, echo });
  });
}

/**
 * 파이썬 코드를 실행하고 { ok, stdout, error } 를 돌려준다.
 * echo: true 면 input() 의 안내 문구와 입력값을 출력에 함께 남긴다 (수업 실습용).
 */
export function runPython(code, stdin = "", { echo = false } = {}) {
  const p = queue.then(() => runOnce(code, stdin, echo));
  queue = p.catch(() => {});
  return p;
}
