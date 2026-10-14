/**
 * Minimal i18n layer. Italian is the only published locale in phase one; the English
 * dictionary has the same shape so a translation pass can fill it without code changes.
 */
import type { L10n, Locale } from '../data/types'
import { it } from './it'

export type Dict = typeof it
const dictionaries: Record<Locale, Dict> = { it, en: it }

export const locale: Locale = 'it'
export const ui: Dict = dictionaries[locale]

/** Resolve a localised field, falling back to Italian. */
export const tr = (v: L10n | undefined) => (v ? (v[locale] ?? v.it) : '')
