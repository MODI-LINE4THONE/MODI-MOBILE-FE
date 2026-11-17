import test from 'node:test'
import assert from 'node:assert/strict'
import { initialPractice, practiceSteps, practiceReducer as reduce, canContinue, cartTotal } from './practiceState.js'

const at = step => ({ ...initialPractice(), step: practiceSteps.indexOf(step) })
const set = (state, field, value) => reduce(state, { type: 'set', field, value })

test('단계별 필수 선택 전에는 다음으로 넘어가지 않는다', () => {
  for (const step of ['place', 'menu', 'options', 'add', 'cart', 'payment', 'card']) {
    const state = at(step)
    assert.equal(canContinue(state), false)
    assert.equal(reduce(state, { type: 'next' }).step, state.step)
  }
  assert.equal(canContinue(set(at('place'), 'place', 'takeout')), false)
  assert.equal(canContinue(set(at('place'), 'place', 'store')), true)
  assert.equal(canContinue(set(at('menu'), 'menuId', 'latte')), false)
  assert.equal(canContinue(set(at('menu'), 'menuId', 'americano')), true)
})

test('기본 연습 흐름이 설정 확인부터 종료까지 이어진다', () => {
  let state = initialPractice()
  const next = () => { state = reduce(state, { type: 'next' }) }
  next(); next(); next()
  assert.equal(practiceSteps[state.step], 'place')
  state = set(state, 'place', 'store'); next()
  state = set(state, 'menuId', 'americano'); next()
  state = set(state, 'temperature', 'ice')
  assert.equal(canContinue(state), false)
  state = set(state, 'size', 'M'); next()
  state = reduce(state, { type: 'quantity', value: 2 })
  state = reduce(state, { type: 'add' }); next()
  assert.equal(practiceSteps[state.step], 'cart')
  assert.equal(cartTotal(state.cart), 9000)
  assert.equal(state.cart[0].temperature, 'ice')
  assert.equal(state.cart[0].size, 'M')
  state = reduce(state, { type: 'order' }); next()
  state = set(state, 'payment', 'credit'); next()
  state = reduce(state, { type: 'pay' }); next()
  assert.equal(practiceSteps[state.step], 'order')
  next()
  assert.equal(practiceSteps[state.step], 'finish')
  assert.deepEqual(reduce(state, { type: 'restart' }), initialPractice())
})

test('장바구니 중복 클릭을 무시하고 재추가는 수량을 합산한다', () => {
  let state = { ...at('add'), menuId: 'americano', temperature: 'ice', size: 'M' }
  state = reduce(state, { type: 'add' })
  assert.deepEqual(reduce(state, { type: 'add' }), state)
  state = reduce(state, { type: 'more' })
  state = reduce(state, { type: 'add' })
  assert.equal(state.cart.length, 1)
  assert.equal(state.cart[0].quantity, 2)
  state = reduce(state, { type: 'remove', key: state.cart[0].key })
  assert.equal(state.cart.length, 0)
  assert.equal(cartTotal(state.cart), 0)
  assert.equal(state.cartConfirmed, false)
})

test('수량 경계와 연습 결제 선행 조건을 지킨다', () => {
  const state = at('add')
  for (const value of [0, -1, 1.5, 100, Infinity]) assert.equal(reduce(state, { type: 'quantity', value }).quantity, 1)
  assert.equal(reduce(state, { type: 'quantity', value: 99 }).quantity, 99)
  assert.equal(reduce(at('card'), { type: 'pay' }).paid, false)
  let paid = { ...at('card'), payment: 'credit', cart: [{ price: 4500, quantity: 1 }] }
  paid = reduce(paid, { type: 'pay' })
  assert.equal(paid.paid, true)
  assert.equal(set(paid, 'payment', 'mobile').paid, false)
  assert.equal(reduce(paid, { type: 'more' }).paid, false)
})

test('이전 단계로 돌아가도 선택 상태를 보관하고 범위를 벗어나지 않는다', () => {
  const state = { ...at('options'), menuId: 'americano', place: 'store' }
  const previous = reduce(state, { type: 'back' })
  assert.equal(practiceSteps[previous.step], 'menu')
  assert.equal(previous.menuId, 'americano')
  assert.equal(previous.place, 'store')
  assert.equal(reduce(initialPractice(), { type: 'back' }).step, 0)
})
