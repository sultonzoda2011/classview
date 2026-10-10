#!/usr/bin/env node
/**
 * Сравнивает набор ключей в public/locales/{en,ru,tj}/translation.json.
 * Падает (exit 1), если где-то не хватает ключа или есть лишний относительно en.
 * Запуск: node scripts/check-i18n.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LANGS = ['en', 'ru', 'tj']

function flatten(obj, prefix = '') {
  const out = new Set()
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const k of flatten(value, path)) out.add(k)
    } else {
      out.add(path)
    }
  }
  return out
}

const keysByLang = {}
for (const lang of LANGS) {
  const path = join(__dirname, '..', 'public', 'locales', lang, 'translation.json')
  keysByLang[lang] = flatten(JSON.parse(readFileSync(path, 'utf8')))
}

let ok = true
const base = keysByLang.en
for (const lang of LANGS) {
  if (lang === 'en') continue
  const missing = [...base].filter((k) => !keysByLang[lang].has(k))
  const extra = [...keysByLang[lang]].filter((k) => !base.has(k))
  if (missing.length) {
    ok = false
    console.error(`[${lang}] missing ${missing.length} key(s):\n  ${missing.join('\n  ')}`)
  }
  if (extra.length) {
    ok = false
    console.error(`[${lang}] has ${extra.length} extra key(s) not in en:\n  ${extra.join('\n  ')}`)
  }
}

if (ok) {
  console.log(`OK: ${base.size} keys, in sync across ${LANGS.join(', ')}`)
  process.exit(0)
} else {
  process.exit(1)
}
