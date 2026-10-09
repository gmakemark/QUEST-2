import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";

// 붙여 넣은 이미지(data:image/...)는 기본 설정에서 지워지므로 이미지일 때만 허용한다.
function urlTransform(url, key) {
  if (key === "src" && url.startsWith("data:image/")) return url;
  return defaultUrlTransform(url);
}

// 시험 화면처럼: 소제목(### 문제 설명 등)은 왼쪽 막대 + 밑줄, 굵은 글씨(**…**)는 밑줄까지
const components = {
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 border-l-4 border-slate-400 pl-2 text-base font-bold underline underline-offset-4 first:mt-0 dark:border-slate-500">{children}</h3>
  ),
  strong: ({ children }) => <strong className="underline underline-offset-4">{children}</strong>,
};

export default function Markdown({ children }) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-md prose-pre:bg-slate-800 prose-table:text-sm prose-table:w-auto prose-th:border prose-th:px-3 prose-td:border prose-td:px-3 prose-th:border-slate-300 prose-td:border-slate-300 dark:prose-th:border-slate-600 dark:prose-td:border-slate-600">
      <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={urlTransform} components={components}>
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}
