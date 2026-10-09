// 붙여 넣거나 고른 이미지를 지문에 넣을 수 있는 data URL 로 바꾼다.
// 문제는 브라우저 저장 공간(약 5MB)에 들어가므로, 큰 이미지는 가로 MAX_WIDTH 로 줄이고 JPEG 로 다시 저장한다.

const MAX_WIDTH = 1000;
const KEEP_AS_IS_BYTES = 200 * 1024; // 이보다 작고 폭도 작으면 그대로 넣는다
const MAX_RESULT_CHARS = 1.5 * 1024 * 1024;

const readAsDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("이미지를 읽지 못했습니다."));
    reader.readAsDataURL(blob);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지 형식을 읽을 수 없습니다."));
    img.src = src;
  });

export async function imageFileToDataURL(file) {
  const original = await readAsDataURL(file);
  const img = await loadImage(original);
  if (file.size <= KEEP_AS_IS_BYTES && img.width <= MAX_WIDTH) return original;

  const scale = Math.min(1, MAX_WIDTH / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; // 투명 배경이 JPEG 에서 검게 나오지 않도록
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const result = canvas.toDataURL("image/jpeg", 0.85);
  if (result.length > MAX_RESULT_CHARS) throw new Error("이미지가 너무 큽니다. 더 작게 잘라서 넣어 주세요.");
  return result;
}

export const imageMarkdown = (dataUrl) => `\n![이미지](${dataUrl})\n`;

// 클립보드에 이미지가 있으면 그 파일을, 없으면 null
export function clipboardImage(e) {
  const item = [...(e.clipboardData?.items || [])].find((it) => it.type.startsWith("image/"));
  return item ? item.getAsFile() : null;
}
