import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "../lib/theme";

// 수업용 편집기 색: 코드 칸은 연한 회색 배경, 주석(= 연습 문제)은 굵게
function defineThemes(monaco) {
  monaco.editor.defineTheme("class-light", {
    base: "vs",
    inherit: true,
    rules: [{ token: "comment", foreground: "3f3b52", fontStyle: "bold" }],
    colors: {
      "editor.background": "#f1f2f6",
      "editorGutter.background": "#f1f2f6",
      "editor.lineHighlightBackground": "#e8e9f0",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#a3a7b7",
      "editorLineNumber.activeForeground": "#6b6f80",
    },
  });
  monaco.editor.defineTheme("class-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "d6d1ea", fontStyle: "bold" }],
    colors: {
      "editor.background": "#24222f",
      "editorGutter.background": "#24222f",
      "editor.lineHighlightBackground": "#2d2a3b",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#5f5a73",
    },
  });
}

// Monaco 에디터. 코드 길이에 맞춰 높이가 늘어나고, Ctrl+Enter 로 실행할 수 있다.
export default function CodeEditor({ value, onChange, onRun, readOnly = false, minHeight = 120, maxHeight = 600 }) {
  const [height, setHeight] = useState(minHeight);
  const theme = useTheme();
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  function handleMount(editor, monaco) {
    const fit = () => setHeight(Math.min(maxHeight, Math.max(minHeight, editor.getContentHeight())));
    editor.onDidContentSizeChange(fit);
    fit();
    // Ctrl+Enter 로 실행. addCommand 는 편집기가 여러 개면 마지막 편집기에만 연결되는 문제가 있어서
    // 편집기마다 키 입력을 직접 받는다.
    editor.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Enter && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        onRunRef.current?.();
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f1f2f6] dark:bg-[#24222f]">
      <Editor
        height={height}
        language="python"
        theme={theme === "dark" ? "class-dark" : "class-light"}
        beforeMount={defineThemes}
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        onMount={handleMount}
        loading={<div className="p-3 text-sm text-slate-400 dark:text-slate-500">에디터 불러오는 중…</div>}
        options={{
          readOnly,
          fontSize: 14,
          // 영문은 Consolas, 한글은 맑은 고딕 (Consolas 에는 한글이 없어 굵은 주석이 흐리게 보이기 때문)
          fontFamily: "Consolas, 'D2Coding', 'Malgun Gothic', 'Apple SD Gothic Neo', monospace",
          tabSize: 4,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbersMinChars: 3,
          padding: { top: 10, bottom: 10 },
          renderLineHighlight: "line",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          // 에디터 위에서 마우스 휠을 굴려도 페이지가 스크롤되게
          scrollbar: { alwaysConsumeMouseWheel: false },
          // 새 입력 방식(EditContext) 대신 예전 textarea 를 쓴다.
          // Vimium 같은 확장 프로그램이 EditContext 를 입력칸으로 알아보지 못해 글자를 단축키로 가로채기 때문.
          editContext: false,
        }}
      />
    </div>
  );
}
