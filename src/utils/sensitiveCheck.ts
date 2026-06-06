export interface SensitiveWordMatch {
  word: string;
  index: number;
  length: number;
}

export function checkSensitiveWords(content: string, sensitiveWords: string[]): SensitiveWordMatch[] {
  const matches: SensitiveWordMatch[] = [];
  if (!content || sensitiveWords.length === 0) return matches;

  const lowerContent = content.toLowerCase();
  for (const word of sensitiveWords) {
    if (!word) continue;
    const lowerWord = word.toLowerCase();
    let index = lowerContent.indexOf(lowerWord);
    while (index !== -1) {
      matches.push({
        word,
        index,
        length: word.length,
      });
      index = lowerContent.indexOf(lowerWord, index + 1);
    }
  }

  return matches.sort((a, b) => a.index - b.index);
}

export function highlightSensitiveWords(content: string, matches: SensitiveWordMatch[]): string {
  if (matches.length === 0) return content;

  let result = '';
  let lastIndex = 0;

  for (const match of matches) {
    result += content.slice(lastIndex, match.index);
    result += `<span class="bg-warning-red/20 text-warning-red font-medium px-1 rounded">${content.slice(match.index, match.index + match.length)}</span>`;
    lastIndex = match.index + match.length;
  }

  result += content.slice(lastIndex);
  return result;
}
