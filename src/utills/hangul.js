const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

export function getInitialConsonant(char) {
  if (!char || typeof char !== "string") return "";
  const code = char.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const choIndex = Math.floor((code - 0xac00) / 588);
    return CHO[choIndex];
  }
  return char.toUpperCase();
}

export const CHOSEONG = [...CHO];

export function isKoreanChar(char) {
  const code = char.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3;
}

export function isEnglishUppercase(char) {
  return /^[A-Z]$/.test(char);
}

export function isChoseong(char) {
  return CHOSEONG.includes(char);
}
