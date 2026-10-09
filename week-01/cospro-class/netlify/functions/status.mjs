// Netlify 함수: STEP2·STEP3 공개/비공개 상태 (주소: /api/status)
// 상태는 Netlify Blobs 의 "cospro-class" 저장소에, 관리자 비밀번호는 환경 변수 ADMIN_PASSWORD 에 있다.

import { getStore } from "@netlify/blobs";
import { handleStatus } from "../lib/status-core.mjs";

export default async (req) =>
  handleStatus(req, {
    store: getStore({ name: "cospro-class", consistency: "strong" }),
    adminPassword: process.env.ADMIN_PASSWORD,
  });

export const config = { path: "/api/status" };
