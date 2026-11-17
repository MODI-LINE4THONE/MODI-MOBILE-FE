import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import { onboardingColors as c } from '../../styles/onboarding/colors'

export const Layout = styled(OnboardingLayout)`
  min-height: max(798px, 100dvh);
  button { font-family: inherit; cursor: pointer; }
  button:disabled { cursor: default; }
  button:focus-visible { outline: 3px solid ${c.primary}; outline-offset: 3px; }
`
export const Main = styled.main`
  display: flex; flex: 1; flex-direction: column; padding: 0 25px 61px; outline: none;
  h2 { margin: 0; color: ${c.text}; font-size: 18px; font-weight: 500; line-height: 24px; letter-spacing: -.6px; }
`
export const Description = styled.p`margin: 12px 0 0; color: ${c.textSub}; font-size: 14px; line-height: 22px; letter-spacing: -.45px;`
export const IntroActions = styled.div`
  margin-top: auto; padding-top: 32px;
  > button:last-child:not(:first-child) { display: block; width: 100%; border: 0; background: transparent; color: ${c.textSub}; font-size: 18px; line-height: 32px; margin-top: 13px; min-height: 44px; }
`
export const Empty = styled.div`
  flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px 0;
  p { margin: 16px 0 0; color: ${c.textSub}; font-size: 18px; line-height: 25px; }
`
export const SettingsList = styled.ul`
  list-style: none; padding: 0; margin: 90px 0 32px; display: grid; gap: 17px;
  li { display: flex; align-items: center; gap: 8px; font-size: 18px; color: ${c.primary}; }
  span { padding: 2px 9px; border-radius: 15px; background: white; box-shadow: inset 0 0 4px #2456e840; }
`
export const TutorialCard = styled.div`
  margin-top: 17px; padding: 24px 21px; background: ${c.cardBackground}; border-radius: 30px; display: grid; gap: 11px;
`
export const TutorialRow = styled.div`
  display: grid; grid-template-columns: 116px 1fr; gap: 16px; align-items: center;
  > p { margin: 0; color: ${c.textSub}; font-size: 14px; line-height: 22px; }
`
export const Pill = styled.span`
  display: inline-flex; justify-content: center; align-items: center; gap: 3px; justify-self: start; min-height: 29px; padding: 0 10px; border-radius: 15px; background: white; color: ${c.primary}; font-size: 16px; white-space: nowrap; box-shadow: inset 0 0 4px #2456e840;
`
export const Gestures = styled.div`
  margin-top: 20px; padding: 14px 12px; border-radius: 30px; background: ${c.cardBackground}; display: flex; justify-content: space-around; align-items: end; gap: 6px;
  > div { width: 100px; text-align: center; }
  p { margin: 8px 0 0; color: ${c.textSub}; font-size: 12px; line-height: 16px; }
  span { display: inline-flex; align-items: center; justify-content: center; padding: 10px; border-radius: 20px; background: white; box-shadow: inset 0 0 4px #2456e84d; }
`
export const Stage = styled.section`
  --panel: ${({ $options }) => $options.highContrast ? '#191f28' : '#ffffff'};
  --surface: ${({ $options }) => $options.highContrast ? '#ffee00' : '#f4f6fa'};
  --ink: ${({ $options }) => $options.highContrast ? '#000000' : '#191f28'};
  --muted: ${({ $options }) => $options.highContrast ? '#000000' : '#5b6575'};
  --outline: ${({ $options }) => $options.highContrast ? '#ffee00' : 'rgba(36,86,232,.2)'};
  display: flex; flex-direction: column; flex-shrink: 0; position: relative; height: 396px; min-height: 396px;
  margin-top: 22px; padding: 20px 22px; border-radius: 30px; background: var(--panel); color: var(--ink); box-shadow: inset 0 0 4px var(--outline);
  font-size: 16px;
  &[data-bottom='true'] { justify-content: flex-end; }
  [data-choice] { position: relative; border: 0; border-radius: 15px; background: var(--surface); color: var(--muted); box-shadow: inset 0 0 4px var(--outline); font-size: inherit; }
  [data-choice][aria-pressed='true'] { background: ${({ $options }) => $options.highContrast ? '#00e1ff' : '#e8effe'}; color: ${({ $options }) => $options.highContrast ? '#000' : '#2456e8'}; box-shadow: inset 0 0 4px #2456e8; }
  [data-choice][data-white] { background: ${({ $options }) => $options.highContrast ? '#ffee00' : 'white'}; color: var(--ink); }
  [data-choice][data-white][aria-pressed='true'] { background: ${({ $options }) => $options.highContrast ? '#00e1ff' : '#e8effe'}; }
  [data-choice][data-guided='true'] {
    box-shadow: ${({ $options }) => $options.touchGuidance
      ? '0 0 7px 1px rgba(36,86,232,.55), inset 0 0 3px rgba(36,86,232,.75)'
      : undefined};
  }

  > [data-product] { margin-top: 10px; }
  button:focus-visible { outline-color: ${({ $options }) => $options.highContrast ? 'white' : '#2456e8'}; }

  &[data-large='true'] {
    --place-size: 36px;
    --category-size: 28px;
    --option-size: 28px;
    --action-size: 38px;
    font-size: 32px;
    [data-product] { padding: 10px; gap: 5px; }
    [data-product] > div { min-width: 0; }
    [data-product] strong { font-size: 36px; line-height: 40px; letter-spacing: -1.2px; }
    [data-product] p { font-size: 28px; line-height: 38px; letter-spacing: -1px; }
    &[data-step='options'] [data-product] strong { font-size: 28px; line-height: 34px; }
    &[data-step='options'] [data-product] { gap: 5px; }
    &[data-step='add'] [data-product] { min-height: 118px; align-items: flex-start; }
    &[data-step='cart'] [data-product] { padding-right: 42px; align-items: flex-start; box-shadow: none; }
    &[data-step='cart'] [data-product] strong { white-space: nowrap; }
    &[data-step='cart'] [data-product] p { margin-top: 0; }
    &[data-step='cart'] > div:last-child > button { min-height: 110px; padding: 4px; font-size: 36px !important; letter-spacing: -3px; }
    &[data-step='card'] p { font-size: 32px; line-height: 38px; max-width: 250px; }
    &[data-step='order'] p { font-size: 36px; line-height: 40px; }
  }

`
export const ChoiceColumns = styled.div`display: grid; grid-template-columns: repeat(${({ $count }) => $count ?? 2}, minmax(0, 1fr)); gap: 8px;`
export const PlaceGrid = styled(ChoiceColumns)`flex: 1; button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 356px; font-size: var(--place-size, 18px) !important; }`
export const Categories = styled.div`
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-bottom: 13px;
  button { min-height: 54px; display: flex; align-items: center; justify-content: center; gap: 3px; font-size: var(--category-size, 14px) !important; letter-spacing: -1px; padding: 4px 2px; }
  [data-large='true'] & {
    display: flex; flex-shrink: 0; overflow-x: auto; padding: 2px;
    button { flex: 1 0 auto; padding: 4px 6px; white-space: nowrap; line-height: 1.3; }
  }
`
export const MenuGrid = styled.div`
  [data-large='true'] & { min-height: 0; grid-auto-rows: max-content; align-content: start; }
  [data-large='true'] & button { min-width: 0; min-height: 168px; padding: 10px 6px; line-height: 34px; }
  [data-large='true'] & button > span:last-child { width: 100%; min-width: 0; font-size: 26px; letter-spacing: -1px; margin-top: 6px; word-break: keep-all; overflow-wrap: anywhere; }
  [data-large='true'] & [data-price] { font-size: 28px; white-space: nowrap; }
display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 7px; overflow: auto; flex: 1; padding: 1px; button { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px; padding: 10px 4px; font-size: inherit; line-height: 20px; > span:last-child { margin-top: 7px; font-size: .875em; } }`
export const Picture = styled.span`
  position: relative; display: block; flex-shrink: 0; width: ${({ $size }) => $size ?? 70}px; height: ${({ $size }) => $size ?? 70}px;
  > span { display: block; width: 70px; height: 70px; overflow: hidden; border-radius: 50%; position: absolute; top: 0; left: 0; transform: scale(${({ $size }) => ($size ?? 70) / 70}); transform-origin: top left; }
  img { display: block; position: absolute; max-width: none; }
`
export const ProductRow = styled.div.attrs({ 'data-product': true })`
  display: flex; align-items: center; gap: 12px; min-height: 80px; padding: 10px 20px; border-radius: 15px; background: var(--surface); color: var(--ink); box-shadow: inset 0 0 4px var(--outline);
  strong { font-weight: 500; line-height: 24px; } p { margin: 4px 0 0; color: var(--muted); font-size: .875em; line-height: 22px; }
`
export const FieldLabel = styled.p`[data-large='true'] & { font-size: 28px; line-height: 34px; margin: 8px 0; }margin: 18px 0 10px; font-size: .875em; line-height: 22px; color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'};`
export const OptionsGrid = styled(ChoiceColumns)`button { min-height: 80px; padding: 8px 4px; line-height: 1.2; font-size: var(--option-size, .875em) !important; }`
export const Quantity = styled.div`
  [data-large='true'] & { gap: 8px; font-size: 40px; line-height: 48px; letter-spacing: -1px; }
  [data-large='true'] & button { width: 34px; flex-shrink: 0; }
  [data-large='true'] & strong { font-size: clamp(24px, 10vw, 40px); }

  display: flex; align-items: center; gap: 12px;
  button { display: grid; place-items: center; width: 36px; height: 32px; font-size: 24px !important; line-height: 28px; border-radius: 18px; }
  > strong { margin-left: auto; font-weight: 500; color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'}; }
  > output { color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'}; }
`
export const WideAction = styled.button`width: 100%; min-height: 54px; margin-top: auto; padding: 10px; font-size: var(--action-size, 18px) !important; line-height: 1.2; letter-spacing: -1px;`
export const CartItem = styled.div`[data-large='true'] & { padding-bottom: 8px; } [data-large='true'] & > p { display: none; }position: relative; background: var(--surface); padding: 0 0 12px; border-radius: 15px; box-shadow: inset 0 0 4px var(--outline); margin-bottom: 10px; > button { position: absolute !important; right: 10px; top: 10px; display: grid; place-items: center; width: 32px; height: 32px; padding: 0; } > p { margin: 0 16px; text-align: right; color: var(--muted); font-size: 1.125em; }`
export const CartItems = styled.div`[data-large='true'] & { max-height: 160px; flex-shrink: 1; }max-height: 240px; overflow: auto;`
export const Total = styled.p`[data-large='true'] & { font-size: 28px; line-height: 48px; align-items: center; letter-spacing: -1px; white-space: nowrap; strong { font-size: 40px; } }display: flex; justify-content: space-between; gap: 8px; margin: 12px 0; font-size: .875em; color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'}; strong { color: ${({ $contrast }) => $contrast ? '#ffee00' : '#2456e8'}; font-size: 1.25em; font-weight: 500; }`
export const Payments = styled.div`display: grid; gap: 18px; margin: 10px 0; button { display: flex; align-items: center; justify-content: center; gap: 5px; min-height: 100px; padding: 12px; }`
export const Center = styled.div`display: flex; flex: 1; flex-direction: column; justify-content: center; align-items: center; gap: 14px; text-align: center; p { margin: 0; line-height: 24px; } strong { font-weight: 500; }`
export const CardButton = styled.button`display: grid; place-items: center; border: 0; width: 168px; height: 168px; border-radius: 50%; background: ${({ $paid }) => $paid ? '#dee1e9' : 'transparent'}; > img { width: 113px; height: 117px; }`
export const BottomContent = styled.div`
  display: flex; flex-direction: column; flex: 0 1 auto; min-height: 0; max-height: 100%;
  overflow-y: auto; padding: 2px;
  ${PlaceGrid} { flex: none; button { min-height: 216px; } }
  ${MenuGrid} {
    flex: none; max-height: 151px; grid-auto-rows: minmax(64px, auto); align-content: start; padding-bottom: 16px;
    button { min-height: 64px; flex-direction: row; justify-content: flex-start; gap: 7px; padding: 7px; text-align: left; line-height: 18px; }
    button > span:last-child { margin: 0; min-width: 0; font-size: 14px; word-break: keep-all; overflow-wrap: anywhere; }
  }
  ${ProductRow} { min-height: 60px; padding: 5px 15px; }
  ${FieldLabel} { margin: 10px 0; font-size: 14px; line-height: 18px; }
  ${OptionsGrid} button { min-height: 38px; padding: 4px; line-height: 16px; }
  ${Quantity} { margin: 8px 0 12px; strong { font-size: 20px; } }
  ${WideAction} { min-height: 44px; margin-top: 0; padding: 8px; }
  ${CartItems} { max-height: 164px; flex-shrink: 0; }
  ${Total} { margin: 12px 0 16px; }
  ${Payments} { gap: 12px; margin: 0 0 12px; button { min-height: 54px; } }
  ${Center} { flex: none; margin-bottom: 18px; gap: 14px; }
  [data-step='card'] & ${Center} { gap: 22px; margin-bottom: 20px; }
  [data-step='card'] & ${Center} p { font-size: 14px; }
  [data-large='true'] & {
    ${MenuGrid} {
      max-height: 254px; grid-auto-rows: max-content;
      button { flex-direction: column; min-height: 168px; padding: 10px 6px; text-align: center; line-height: 34px; }
      button > span:last-child { font-size: 26px; margin-top: 6px; }
    }
    ${FieldLabel} { font-size: 28px; line-height: 34px; margin: 8px 0; }
    ${OptionsGrid} button { min-height: 66px; line-height: 1.2; }
    ${Quantity} { font-size: 40px; strong { font-size: clamp(24px, 10vw, 40px); } }
    ${Payments} button { min-height: 80px; }
    ${WideAction} { min-height: 64px; }
    ${CartItems} { max-height: 160px; }
    ${CartItems} ${ProductRow} { padding-right: 42px; }
    [data-step='cart'] & ${WideAction} { min-height: 86px; padding: 4px; font-size: 36px !important; letter-spacing: -3px; }
    [data-step='card'] & ${Center} p { font-size: 32px; }
  }
`
export const Help = styled.aside`
  display: flex; align-items: center; gap: 15px; min-height: 91px; padding: 11px 15px; margin-top: 12px; border-radius: 20px; background: ${c.cardBackground};
  > span { position: relative; display: grid; place-items: center; flex-shrink: 0; width: 70px; height: 70px; > img:first-child { position: absolute; top: 0; left: 0; } > img:last-child { position: relative; } }
  h3 { margin: 0 0 4px; font-size: 18px; font-weight: 500; line-height: 24px; }
  p { margin: 0; font-size: 12px; line-height: 18px; color: ${c.textSub}; white-space: pre-line; letter-spacing: -.4px; }
`
export const Footer = styled.div`
  display: flex; align-items: center; gap: 7px; margin-top: 12px;
  > button { flex: 1; min-width: 0; }
`
export const Back = styled.button`border: 0; background: transparent; color: ${c.textSub}; min-height: 54px; font-size: 18px; font-weight: 500;`
export const Next = styled(PrimaryButton)`font-size: 18px;`
export const FinishList = styled.ul`list-style: none; margin: 22px 0 32px; padding: 27px 23px; border-radius: 30px; background: ${c.cardBackground}; display: grid; gap: 13px; li { display: flex; align-items: center; gap: 18px; font-size: 18px; line-height: 20px; font-weight: 500; }`
