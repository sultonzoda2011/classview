import { describe, expect, it } from 'vitest'
import { toMinutes } from './time'

describe('toMinutes', () => {
  it('parses HH:mm', () => {
    expect(toMinutes('09:30')).toBe(570)
  })
  it('parses HH:mm:ss (ignores seconds)', () => {
    expect(toMinutes('09:30:15')).toBe(570)
  })
  it('returns null for missing value', () => {
    expect(toMinutes(undefined)).toBeNull()
    expect(toMinutes(null)).toBeNull()
  })
  it('returns null for garbage input', () => {
    expect(toMinutes('not-a-time')).toBeNull()
  })
})
