import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";

// 붙여 넣은 이미지(data:image/...)는 기본 설정에서 지워지므로 이미지일 때만 허용한다.
function urlTransform(url, key) {
  if (key === "src" && url.startsWith("data:image/")) return url;
  return defaultUrlTransform(url);
}

export default function Markdown({ children }) {
  return (
    <div className="prose prose-slate max-w-none prose-img:rounded-md prose-pre:bg-slate-800 prose-table:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={urlTransform}>
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}
