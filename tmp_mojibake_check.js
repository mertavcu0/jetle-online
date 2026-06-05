function fix(t){
  if(typeof t!=="string") return t;
  if(!/[\u00C3\u00C2\u00C4\u00C5\uFFFD]/.test(t)) return t;
  const bytes = Uint8Array.from(Array.from(t).map(ch => ch.charCodeAt(0) & 255));
  const next = new TextDecoder("utf-8").decode(bytes);
  return (next && next !== t ? next.replace(/\uFFFD/g, "") : t.replace(/\uFFFD/g, "")).normalize("NFC");
}
const sample = [
  'ASR / Ã‡ekiÅŸ Kontrol',
  'Yan Hava YastÄ±ÄŸÄ±',
  'Gece GÃ¶rÃ¼ÅŸ Sistemi',
  'IsÄ±tmalÄ± Ayna',
  'Dijital GÃ¶sterge',
  'SÃ¼rÃ¼ÅŸ ModlarÄ±'
];
for (const item of sample) console.log(item + ' => ' + fix(item));
