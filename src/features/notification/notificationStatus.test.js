import test from 'node:test'
import assert from 'node:assert/strict'
import { hasNewNotifications } from './notificationStatus.js'
import { SAMPLE_NOW, sampleFamilyNotifications, sampleSelfNotifications } from './notifications.js'

test('never opened the notification screen: new if there is any notification', () => {
  assert.equal(hasNewNotifications(sampleSelfNotifications, null), true)
  assert.equal(hasNewNotifications(sampleFamilyNotifications, null), true)
  assert.equal(hasNewNotifications([], null), false)
})

test('after opening the screen at "now": no new notifications', () => {
  // 가장 최근 예시 알림은 SAMPLE_NOW와 같은 시각 → 본 것으로 친다
  assert.equal(hasNewNotifications(sampleSelfNotifications, SAMPLE_NOW), false)
  assert.equal(hasNewNotifications(sampleFamilyNotifications, SAMPLE_NOW), false)
})

test('a notification newer than the seen time makes it new again', () => {
  const later = { id: 'later', createdAt: '2026-11-14T09:31' }
  assert.equal(hasNewNotifications([...sampleSelfNotifications, later], SAMPLE_NOW), true)
})

test('seen before the latest notification: still new', () => {
  assert.equal(hasNewNotifications(sampleSelfNotifications, new Date('2026-11-14T09:00')), true)
})
