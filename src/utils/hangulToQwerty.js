// 한글 두벌식 자판으로 입력된 글자를 같은 자리의 영문 키로 바꾼다.
// 예: 'ㅁ' → 'a', '마' → 'ak', 'ㄳ' → 'rt'
// 영문·숫자 등 그 밖의 글자는 그대로 둔다.

// 완성형 음절(가~힣) 분해용: 초성 19 / 중성 21 / 종성 28(없음 포함)
const INITIAL_KEYS = ['r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g']
const MEDIAL_KEYS = ['k', 'o', 'i', 'O', 'j', 'p', 'u', 'P', 'h', 'hk', 'ho', 'hl', 'y', 'n', 'nj', 'np', 'nl', 'b', 'm', 'ml', 'l']
const FINAL_KEYS = ['', 'r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'qt', 't', 'T', 'd', 'w', 'c', 'z', 'x', 'v', 'g']

// 호환용 자모(ㄱ U+3131 ~ ㅎ U+314E, ㅏ U+314F ~ ㅣ U+3163)
const CONSONANT_KEYS = ['r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'E', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'Q', 'qt', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g']

const SYLLABLE_START = 0xac00
const SYLLABLE_END = 0xd7a3
const CONSONANT_START = 0x3131
const VOWEL_START = 0x314f
const VOWEL_END = 0x3163

function charToKeys(ch) {
  const code = ch.charCodeAt(0)

  if (code >= SYLLABLE_START && code <= SYLLABLE_END) {
    const index = code - SYLLABLE_START
    const initial = Math.floor(index / 588)
    const medial = Math.floor((index % 588) / 28)
    const final = index % 28
    return INITIAL_KEYS[initial] + MEDIAL_KEYS[medial] + FINAL_KEYS[final]
  }
  if (code >= CONSONANT_START && code < VOWEL_START) {
    return CONSONANT_KEYS[code - CONSONANT_START]
  }
  if (code >= VOWEL_START && code <= VOWEL_END) {
    return MEDIAL_KEYS[code - VOWEL_START]
  }
  return ch
}

// 글자열 → 눌린 키 순서대로의 글자 배열
export function hangulToQwertyKeys(text) {
  return [...text].flatMap((ch) => [...charToKeys(ch)])
}
