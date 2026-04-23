import {
  ar,
  base,
  de,
  el,
  en,
  es,
  fa,
  Faker,
  fr,
  he,
  hy,
  ja,
  ka_GE,
  ko,
  ne,
  ru,
  ta_IN,
  th,
  tr,
  vi,
  yo_NG,
  zh_CN,
  zu_ZA,
} from "@faker-js/faker";

// ロケール重み: おおよその母語話者数 (百万人)
const LOCALE_WEIGHTS = [
  { locale: zh_CN, weight: 1100 },
  { locale: es, weight: 490 },
  { locale: en, weight: 380 },
  { locale: ar, weight: 310 },
  { locale: ru, weight: 150 },
  { locale: ja, weight: 125 },
  { locale: de, weight: 95 },
  { locale: fr, weight: 80 },
  { locale: ko, weight: 78 },
  { locale: vi, weight: 85 },
  { locale: tr, weight: 85 },
  { locale: fa, weight: 80 },
  { locale: ta_IN, weight: 75 },
  { locale: th, weight: 60 },
  { locale: yo_NG, weight: 45 },
  { locale: ne, weight: 25 },
  { locale: el, weight: 13 },
  { locale: zu_ZA, weight: 12 },
  { locale: he, weight: 9 },
  { locale: hy, weight: 7 },
  { locale: ka_GE, weight: 4 },
];

const FAKERS = LOCALE_WEIGHTS.map(({ locale }) => new Faker({ locale: [locale, en, base] }));

// 年齢の 5 歳区切り重み (最後は 100 歳単独)。世界人口ピラミッドのおおよその比率。
const AGE_BUCKETS: Array<{ upTo: number; perYear: number }> = [
  { upTo: 4, perYear: 130 },
  { upTo: 9, perYear: 130 },
  { upTo: 14, perYear: 126 },
  { upTo: 19, perYear: 120 },
  { upTo: 24, perYear: 118 },
  { upTo: 29, perYear: 114 },
  { upTo: 34, perYear: 112 },
  { upTo: 39, perYear: 106 },
  { upTo: 44, perYear: 100 },
  { upTo: 49, perYear: 92 },
  { upTo: 54, perYear: 86 },
  { upTo: 59, perYear: 80 },
  { upTo: 64, perYear: 70 },
  { upTo: 69, perYear: 60 },
  { upTo: 74, perYear: 48 },
  { upTo: 79, perYear: 34 },
  { upTo: 84, perYear: 22 },
  { upTo: 89, perYear: 12 },
  { upTo: 94, perYear: 5 },
  { upTo: 99, perYear: 2 },
  { upTo: 100, perYear: 1 },
];

function cumulative(weights: readonly number[]): number[] {
  const out: number[] = [];
  let sum = 0;
  for (const w of weights) {
    sum += w;
    out.push(sum);
  }
  return out;
}

const LOCALE_CUM = cumulative(LOCALE_WEIGHTS.map((e) => e.weight));
const LOCALE_TOTAL = LOCALE_CUM[LOCALE_CUM.length - 1]!;

const AGE_CUM = cumulative(
  (() => {
    const perAge: number[] = [];
    let prev = -1;
    for (const { upTo, perYear } of AGE_BUCKETS) {
      for (let a = prev + 1; a <= upTo; a++) perAge.push(perYear);
      prev = upTo;
    }
    return perAge;
  })(),
);
const AGE_TOTAL = AGE_CUM[AGE_CUM.length - 1]!;

function pickWeighted(cum: readonly number[], r: number): number {
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (r < cum[mid]!) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

export type Profile = {
  id: number;
  name: string;
  age: number;
};

function hash(seed: number, salt: number): number {
  let x = (seed + salt * 0x9e3779b9) | 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x = (x ^ (x >>> 16)) >>> 0;
  return x;
}

export function profile(index: number): Profile {
  const faker = FAKERS[pickWeighted(LOCALE_CUM, hash(index, 0) % LOCALE_TOTAL)]!;
  faker.seed(index + 1);
  return {
    id: index + 1,
    name: faker.person.fullName(),
    age: pickWeighted(AGE_CUM, hash(index, 3) % AGE_TOTAL),
  };
}
