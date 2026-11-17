import test from 'node:test'
import assert from 'node:assert/strict'
import { nearestTouchTarget } from './touchCorrection.js'

const targets = [
  { id: 'left', left: 0, top: 0, width: 100, height: 54 },
  { id: 'right', left: 108, top: 0, width: 100, height: 54 },
]
test('버튼 밖 8px까지 보정하고 범위를 넘으면 선택하지 않는다', () => {
  assert.equal(nearestTouchTarget(targets, -7, 20).id, 'left')
  assert.equal(nearestTouchTarget(targets, -9, 20), null)
})
test('확장 영역이 겹치면 가장 가까운 버튼 하나만 선택한다', () => {
  assert.equal(nearestTouchTarget(targets, 102, 20).id, 'left')
  assert.equal(nearestTouchTarget(targets, 106, 20).id, 'right')
  assert.equal(nearestTouchTarget(targets, 110, 20).id, 'right')
})
test('비활성·숨겨진 버튼은 선택하지 않는다', () => {
  assert.equal(nearestTouchTarget([{ ...targets[0], disabled: true }], 50, 20), null)
  assert.equal(nearestTouchTarget([{ ...targets[0], width: 0 }], 0, 20), null)
})
