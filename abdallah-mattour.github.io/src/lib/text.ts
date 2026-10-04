/** Split "a **bold** b" into parts so components can render <strong> without HTML strings. */
export function boldParts(text: string): { text: string; bold: boolean }[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    part.startsWith('**') ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false },
  )
}
