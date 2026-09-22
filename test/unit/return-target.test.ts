import { describe, expect, it } from 'vitest'
import { safeReturnTarget } from '../../app/utils/return-target'

describe('safeReturnTarget', () => {
  it('keeps internal paths including query and hash', () => {
    expect(safeReturnTarget('/work?tab=open#item')).toBe('/work?tab=open#item')
  })

  it.each([
    'https://attacker.example/path',
    '//attacker.example/path',
    '/\\attacker.example/path',
    null
  ])('rejects unsafe target %s', (target) => {
    expect(safeReturnTarget(target)).toBe('/')
  })
})
