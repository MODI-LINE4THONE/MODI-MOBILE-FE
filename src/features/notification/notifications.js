// ─────────────────────────────────────────────────────────────
// 알림 목록 데이터
//
// 지금은 예시 데이터. 서버 API가 생기면 NotificationFlow에서 sampleSelfNotifications 대신
// 서버에서 받은 목록을, SAMPLE_NOW 대신 실제 현재 시각(new Date())을 화면에 넘기면 된다.
// ("오늘/이전 알림" 묶음과 "방금 전 / 오전 9:12 / 어제 / 11월 10일" 표시는 createdAt으로 계산한다:
//  notificationTime.js)
//
// 알림 하나의 모양
//   id: 구분용 값
//   icon: NOTIFICATION_ICON 중 하나 (그림과 원 모양은 NotificationCard가 정한다)
//   title: 제목
//   description: 설명 (\n 위치에서 줄바꿈)
//   createdAt: 알림 시각 'YYYY-MM-DDTHH:mm' (현지 시각)
//   action: (있으면) 바로가기 버튼 { label, tone: ACTION_TONE 중 하나 }
//   familyId: (가족 알림만) 어느 가족의 알림인지. familyProfiles.js의 id와 같은 값
// ─────────────────────────────────────────────────────────────

export const NOTIFICATION_ICON = {
  keyring: 'keyring', // 키링 사용, 키링 연결
  warning: 'warning', // 확인이 필요한 일 (예: 평소와 다른 매장에서 태그)
  person: 'person', // 접근성 설정 변경
  kiosk: 'kiosk', // 키오스크 연습
}

// 바로가기 버튼 색
export const ACTION_TONE = {
  warning: 'warning', // 주황 (예: 분실 신고하기)
  primary: 'primary', // 파랑 (예: 키오스크 연습하기)
}

// 예시 데이터가 디자인과 늘 같게 보이도록 고정한 "지금" 시각
export const SAMPLE_NOW = new Date('2026-11-14T09:30')

// 본인 알림 예시 (최신순)
export const sampleSelfNotifications = [
  {
    id: 'self-keyring-used',
    icon: NOTIFICATION_ICON.keyring,
    title: '키링을 사용했어요.',
    description: '모디카페 강남점에서 키링을 태그했어요.\n주문이 끝나면 기본 화면으로 돌아가요.',
    createdAt: '2026-11-14T09:30',
  },
  {
    id: 'self-keyring-check',
    icon: NOTIFICATION_ICON.warning,
    title: '키링 사용을 확인해 주세요.',
    description: '평소와 다른 매장에서 키링이 태그됐어요.\n내가 아니라면 분실 신고를 해주세요.',
    createdAt: '2026-11-14T09:12',
    action: { label: '분실 신고하기', tone: ACTION_TONE.warning },
  },
  {
    id: 'self-setting-touch-guide',
    icon: NOTIFICATION_ICON.person,
    title: '접근성 설정이 바뀌었어요.',
    description: '“터치 위치 안내”를 켰어요.\n다음 키오스크부터 바로 적용돼요.',
    createdAt: '2026-11-13T18:20',
  },
  {
    id: 'self-practice-suggest',
    icon: NOTIFICATION_ICON.kiosk,
    title: '주문을 미리 연습해 볼까요?',
    description: '“색상 고대비”가 켜진 화면으로\n미리 주문을 연습해요.',
    createdAt: '2026-11-10T15:00',
    action: { label: '키오스크 연습하기', tone: ACTION_TONE.primary },
  },
  {
    id: 'self-setting-high-contrast',
    icon: NOTIFICATION_ICON.person,
    title: '접근성 설정이 바뀌었어요.',
    description: '“색상 고대비”를 켰어요.\n다음 키오스크부터 바로 적용돼요.',
    createdAt: '2026-11-10T14:40',
  },
]
