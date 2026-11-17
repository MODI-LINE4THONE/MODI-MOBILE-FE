export const practiceSteps = ['settings', 'tutorial', 'intro', 'place', 'menu', 'options', 'add', 'cart', 'payment', 'card', 'order', 'finish']
export const menuItems = [
  { id: 'americano', name: '아메리카노', price: 4500, category: 'coffee', recommended: true },
  { id: 'matcha', name: '말차 라떼', price: 5800, category: 'drink', recommended: true },
  { id: 'tea', name: '아이스티', price: 5000, category: 'drink', recommended: true },
  { id: 'chocolate', name: '초코릿 케이크', price: 8800, category: 'dessert', recommended: true },
  { id: 'latte', name: '카페 라떼', price: 5200, category: 'coffee' },
  { id: 'mocha', name: '카페 모카', price: 5700, category: 'coffee' },
  { id: 'espresso', name: '에스프레소', price: 3900, category: 'coffee' },
  { id: 'strawberry', name: '딸기 라떼', price: 6500, category: 'drink' },
  { id: 'shake', name: '밀크쉐이크', price: 6500, category: 'drink' },
  { id: 'icecream', name: '딸기 아이스크림', price: 3500, category: 'dessert' },
  { id: 'cheese', name: '치즈케이크', price: 5900, category: 'dessert' },
  { id: 'mango', name: '망고 케이크', price: 6800, category: 'dessert' },
]
export const initialPractice = () => ({ step: 0, place: null, category: 'recommended', menuId: null, temperature: null, size: null, quantity: 1, cart: [], added: false, cartConfirmed: false, payment: null, paid: false })
export const cartTotal = cart => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
export function canContinue(state) {
  switch (practiceSteps[state.step]) {
    case 'place': return state.place === 'store'
    case 'menu': return state.menuId === 'americano'
    case 'options': return !!state.temperature && !!state.size
    case 'add': return state.added
    case 'cart': return state.cart.length > 0 && state.cartConfirmed
    case 'payment': return state.payment === 'credit'
    case 'card': return state.paid
    default: return true
  }
}
export function practiceReducer(state, action) {
  switch (action.type) {
    case 'next': return canContinue(state) ? { ...state, step: Math.min(state.step + 1, practiceSteps.length - 1) } : state
    case 'back': return { ...state, step: Math.max(0, state.step - 1) }
    case 'restart': return initialPractice()
    case 'set': {
      if (!['place', 'category', 'menuId', 'temperature', 'size', 'payment'].includes(action.field)) return state
      return { ...state, [action.field]: action.value, ...(['menuId', 'temperature', 'size'].includes(action.field) ? { added: false, cartConfirmed: false, paid: false } : {}), ...(action.field === 'payment' ? { paid: false } : {}) }
    }
    case 'quantity': return Number.isInteger(action.value) && action.value >= 1 && action.value <= 99 ? { ...state, quantity: action.value, added: false, cartConfirmed: false, paid: false } : state
    case 'add': {
      if (state.added || !state.temperature || !state.size) return state
      const menu = menuItems.find(item => item.id === state.menuId)
      if (!menu) return state
      const key = `${menu.id}-${state.temperature}-${state.size}`
      const existing = state.cart.find(item => item.key === key)
      if (existing && existing.quantity + state.quantity > 99) return state
      const item = { ...menu, key, temperature: state.temperature, size: state.size, quantity: state.quantity }
      return { ...state, added: true, cartConfirmed: false, paid: false, cart: existing ? state.cart.map(row => row.key === key ? { ...row, quantity: row.quantity + state.quantity } : row) : [...state.cart, item] }
    }
    case 'remove': return { ...state, cart: state.cart.filter(item => item.key !== action.key), cartConfirmed: false, added: false, paid: false }
    case 'more': return { ...state, step: practiceSteps.indexOf('menu'), added: false, cartConfirmed: false, quantity: 1, paid: false }
    case 'order': return state.cart.length ? { ...state, cartConfirmed: true } : state
    case 'pay': return state.payment === 'credit' && state.cart.length > 0 ? { ...state, paid: true } : state
    default: return state
  }
}
