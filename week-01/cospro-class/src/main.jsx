import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AnswerSheet from "./AnswerSheet";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ?answers 로 열면 관리자용 정답 창 */}
    {new URLSearchParams(window.location.search).has("answers") ? <AnswerSheet /> : <App />}
  </React.StrictMode>
);
