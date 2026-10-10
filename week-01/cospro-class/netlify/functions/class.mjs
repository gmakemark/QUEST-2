// Netlify 함수: 계정과 계정마다 저장한 작업 (주소: /api/class)
// 계정과 작업은 Netlify Blobs 의 "cospro-class-users" 저장소에 있다.

import { getStore } from "@netlify/blobs";
import { handleClass } from "../lib/class-core.mjs";

export default async (req) =>
  handleClass(req, {
    store: getStore({ name: "cospro-class-users", consistency: "strong" }),
    adminPassword: process.env.ADMIN_PASSWORD,
  });

export const config = { path: "/api/class" };
