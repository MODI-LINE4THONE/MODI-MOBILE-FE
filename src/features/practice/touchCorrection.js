// 버튼 사각형까지의 거리가 가장 가까운 하나만 선택한다.
// 실제 버튼 안쪽 입력이 항상 확장 영역보다 우선하고 동률은 중심 거리로 비교한다.
export function nearestTouchTarget(targets, x, y, padding = 8) {
  let selected = null
  let bestDistance = Infinity
  let bestCenter = Infinity
  for (const target of targets) {
    if (target.disabled || target.width <= 0 || target.height <= 0) continue
    const right = target.left + target.width
    const bottom = target.top + target.height
    if (x < target.left - padding || x > right + padding || y < target.top - padding || y > bottom + padding) continue
    const dx = Math.max(target.left - x, 0, x - right)
    const dy = Math.max(target.top - y, 0, y - bottom)
    const distance = dx * dx + dy * dy
    const center = (x - target.left - target.width / 2) ** 2 + (y - target.top - target.height / 2) ** 2
    if (distance < bestDistance || (distance === bestDistance && center < bestCenter)) {
      selected = target
      bestDistance = distance
      bestCenter = center
    }
  }
  return selected
}
