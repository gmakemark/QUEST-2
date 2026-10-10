// Netlify 함수: STEP1~3 공개/비공개 상태 (주소: /api/status)
// 상태는 Netlify Blobs 의 "cospro-class" 저장소에, 관리자 비밀번호는 환경 변수 ADMIN_PASSWORD 에 있다.
// STEP 을 비공개로 바꾸면 "cospro-class-users" 저장소에서 그 STEP 의 작업을 정리한다(resetStep).
// STEP 이 모두 비공개가 되면 수강생 계정도 지운다.

import { getStore } from "@netlify/blobs";
import { handleStatus } from "../lib/status-core.mjs";
import { resetStep } from "../lib/class-core.mjs";

export default async (req) =>
  handleStatus(req, {
    store: getStore({ name: "cospro-class", consistency: "strong" }),
    adminPassword: process.env.ADMIN_PASSWORD,
    onClose: (step, allClosed) => resetStep(getStore({ name: "cospro-class-users", consistency: "strong" }), step, allClosed),
  });

export const config = { path: "/api/status" };
