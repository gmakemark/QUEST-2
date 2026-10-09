// Pyodide 를 Web Worker 안에서 돌린다.
// 메인 화면과 따로 돌기 때문에 학생 코드가 무한 반복에 빠져도 화면이 멈추지 않고,
// 메인 쪽에서 worker 를 terminate() 해서 강제로 멈출 수 있다.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

// 학생 코드 한 번 실행: 표준입력/출력을 바꿔 끼우고, 매번 새 전역 공간에서 exec 한다.
// 오류가 나면 Pyodide 내부 줄은 빼고 학생 코드(main.py) 줄만 남긴 Traceback 을 돌려준다.
const RUNNER = `
import sys, io, traceback, linecache

def __run(code, stdin_text):
    out = io.StringIO()
    old = sys.stdin, sys.stdout, sys.stderr
    sys.stdin, sys.stdout, sys.stderr = io.StringIO(stdin_text), out, out
    linecache.cache["main.py"] = (len(code), None, code.splitlines(True), "main.py")
    err = None
    try:
        exec(compile(code, "main.py", "exec"), {"__name__": "__main__"})
    except SystemExit:
        pass
    except BaseException as e:
        frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "main.py"]
        err = ("Traceback (most recent call last):\\n" if frames else "") \\
            + "".join(traceback.format_list(frames)) \\
            + "".join(traceback.format_exception_only(type(e), e))
    finally:
        sys.stdin, sys.stdout, sys.stderr = old
    return out.getvalue(), err
`;

let pyodide = null;
let runFn = null;

(async () => {
  try {
    pyodide = await loadPyodide();
    pyodide.runPython(RUNNER);
    runFn = pyodide.globals.get("__run");
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({ type: "load-error", error: String((err && err.message) || err) });
  }
})();

self.onmessage = async (e) => {
  const { id, code, stdin } = e.data;
  try {
    // import numpy 처럼 Pyodide 패키지가 필요한 경우 자동으로 받아 온다.
    await pyodide.loadPackagesFromImports(code);
    const result = runFn(code, stdin || "");
    const [stdout, error] = result.toJs();
    result.destroy();
    self.postMessage({ id, ok: !error, stdout, error: error || null });
  } catch (err) {
    self.postMessage({ id, ok: false, stdout: "", error: String((err && err.message) || err) });
  }
};
