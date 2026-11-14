import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALL_FAMILY,
  filterByFamily,
  getFamilyFilterOptions,
  resolveSelectedFamily,
} from './familyFilter.js'
import { groupNotificationsByDay } from './notificationTime.js'
import { SAMPLE_NOW, sampleFamilyNotifications } from './notifications.js'

// familyProfiles.js는 사진(png)을 불러와 node에서 바로 읽을 수 없어서, 같은 id·이름·순서로 둔다
const profiles = [
  { id: 'mother', name: '어머니' },
  { id: 'grandmother', name: '할머니' },
  { id: 'grandfather', name: '할아버지' },
]

const { today, earlier } = groupNotificationsByDay(sampleFamilyNotifications, SAMPLE_NOW)
const names = (options) => options.map((option) => option.name)

test('chips show only families that have notifications in that section', () => {
  assert.deepEqual(names(getFamilyFilterOptions(today, profiles)), ['전체', '어머니', '할머니'])
  assert.deepEqual(names(getFamilyFilterOptions(earlier, profiles)), ['전체', '어머니'])
})

test('chip order follows the family list, not the notification order', () => {
  const reversed = [...today].reverse() // 할머니 알림이 먼저 오게
  assert.deepEqual(names(getFamilyFilterOptions(reversed, profiles)), ['전체', '어머니', '할머니'])
})

test('every chip leads to at least one notification and counts match', () => {
  for (const section of [today, earlier]) {
    for (const option of getFamilyFilterOptions(section, profiles)) {
      const shown = filterByFamily(section, option.id)
      assert.ok(shown.length > 0, option.name)
      assert.equal(shown.length, option.count, option.name)
    }
  }
})

test('filtering keeps only that family', () => {
  assert.deepEqual(
    filterByFamily(today, 'grandmother').map((item) => item.id),
    ['family-grandmother-keyring-pending'],
  )
  assert.equal(filterByFamily(today, ALL_FAMILY), today)
})

test('unknown family ids appear only under 전체', () => {
  const withStranger = [...earlier, { id: 'x', familyId: 'uncle', createdAt: '2026-11-09T10:00' }]
  const options = getFamilyFilterOptions(withStranger, profiles)
  assert.deepEqual(names(options), ['전체', '어머니'])
  assert.equal(options[0].count, 3)
})

test('empty section has only 전체 with 0', () => {
  assert.deepEqual(getFamilyFilterOptions([], profiles), [{ id: ALL_FAMILY, name: '전체', count: 0 }])
})

test('a selected chip that disappeared falls back to 전체', () => {
  const options = getFamilyFilterOptions(earlier, profiles)
  assert.equal(resolveSelectedFamily(options, 'mother'), 'mother')
  assert.equal(resolveSelectedFamily(options, 'grandmother'), ALL_FAMILY)
})
