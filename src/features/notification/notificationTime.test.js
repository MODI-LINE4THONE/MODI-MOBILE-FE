import test from 'node:test'
import assert from 'node:assert/strict'
import { formatNotificationTime, groupNotificationsByDay } from './notificationTime.js'
import { SAMPLE_NOW, sampleSelfNotifications } from './notifications.js'

const now = new Date('2026-11-14T09:30')

test('time labels match the design examples', () => {
  assert.equal(formatNotificationTime('2026-11-14T09:30', now), '방금 전')
  assert.equal(formatNotificationTime('2026-11-14T09:12', now), '오전 9:12')
  assert.equal(formatNotificationTime('2026-11-13T18:20', now), '어제')
  assert.equal(formatNotificationTime('2026-11-10T15:00', now), '11월 10일')
})

test('other time labels', () => {
  assert.equal(formatNotificationTime('2026-11-14T09:29:30', now), '방금 전')
  assert.equal(formatNotificationTime('2026-11-14T09:29', now), '오전 9:29')
  assert.equal(formatNotificationTime('2026-11-14T00:05', new Date('2026-11-14T15:00')), '오전 12:05')
  assert.equal(formatNotificationTime('2026-11-14T12:00', new Date('2026-11-14T15:00')), '오후 12:00')
  assert.equal(formatNotificationTime('2026-11-13T23:59', new Date('2026-11-14T00:00')), '어제')
  assert.equal(formatNotificationTime('2025-12-31T10:00', new Date('2026-01-01T10:00')), '어제')
  assert.equal(formatNotificationTime('2025-11-10T10:00', now), '2025년 11월 10일')
})

test('sample notifications split into today (2) and earlier (3), newest first', () => {
  const shuffled = [...sampleSelfNotifications].reverse()
  const { today, earlier } = groupNotificationsByDay(shuffled, SAMPLE_NOW)
  assert.deepEqual(
    today.map((item) => item.id),
    ['self-keyring-used', 'self-keyring-check'],
  )
  assert.deepEqual(
    earlier.map((item) => item.id),
    ['self-setting-touch-guide', 'self-practice-suggest', 'self-setting-high-contrast'],
  )
})

test('sample data never uses the removed setting name', () => {
  const text = JSON.stringify(sampleSelfNotifications)
  assert.ok(!text.includes('핵심 메뉴 간소화'))
})
