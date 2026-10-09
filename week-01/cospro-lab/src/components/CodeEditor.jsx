import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

// Monaco 에디터. 코드 길이에 맞춰 높이가 늘어나고, Ctrl+Enter 로 실행할 수 있다.
export default function CodeEditor({ value, onChange, onRun, readOnly = false, minHeight = 120, maxHeight = 600 }) {
  const [height, setHeight] = useState(minHeight);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  function handleMount(editor, monaco) {
    const fit = () => setHeight(Math.min(maxHeight, Math.max(minHeight, editor.getContentHeight())));
    editor.onDidContentSizeChange(fit);
    fit();
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.());
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white">
      <Editor
        height={height}
        language="python"
        theme="vs"
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        onMount={handleMount}
        loading={<div className="p-3 text-sm text-slate-400">에디터 불러오는 중…</div>}
        options={{
          readOnly,
          fontSize: 14,
          tabSize: 4,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbersMinChars: 3,
          padding: { top: 8, bottom: 8 },
          // 에디터 위에서 마우스 휠을 굴려도 페이지가 스크롤되게
          scrollbar: { alwaysConsumeMouseWheel: false },
        }}
      />
    </div>
  );
}
