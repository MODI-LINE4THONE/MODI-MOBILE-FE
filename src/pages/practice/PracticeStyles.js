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

`
export const ChoiceColumns = styled.div`display: grid; grid-template-columns: repeat(${({ $count }) => $count ?? 2}, minmax(0, 1fr)); gap: 8px;`
export const PlaceGrid = styled(ChoiceColumns)`flex: 1; button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 356px; font-size: 18px !important; }`
export const Categories = styled.div`display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-bottom: 13px; button { min-height: 54px; display: flex; align-items: center; justify-content: center; gap: 3px; font-size: 14px !important; padding: 4px 2px; }`
export const MenuGrid = styled.div`display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 7px; overflow: auto; flex: 1; padding: 1px; button { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px; padding: 10px 4px; font-size: inherit; line-height: 20px; > span:last-child { margin-top: 7px; font-size: .875em; } }`
export const Picture = styled.span`
  position: relative; display: block; flex-shrink: 0; width: ${({ $size }) => $size ?? 70}px; height: ${({ $size }) => $size ?? 70}px;
  > span { display: block; width: 70px; height: 70px; overflow: hidden; border-radius: 50%; position: absolute; top: 0; left: 0; transform: scale(${({ $size }) => ($size ?? 70) / 70}); transform-origin: top left; }
  img { display: block; position: absolute; max-width: none; }
`
export const ProductRow = styled.div.attrs({ 'data-product': true })`
  display: flex; align-items: center; gap: 12px; min-height: 80px; padding: 10px 20px; border-radius: 15px; background: var(--surface); color: var(--ink); box-shadow: inset 0 0 4px var(--outline);
  strong { font-weight: 500; line-height: 24px; } p { margin: 4px 0 0; color: var(--muted); font-size: .875em; line-height: 22px; }
`
export const FieldLabel = styled.p`margin: 18px 0 10px; font-size: .875em; line-height: 22px; color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'};`
export const OptionsGrid = styled(ChoiceColumns)`button { min-height: 80px; padding: 8px 4px; line-height: 22px; font-size: .875em !important; }`
export const Quantity = styled.div`
  display: flex; align-items: center; gap: 12px;
  button { display: grid; place-items: center; width: 36px; height: 32px; font-size: 24px !important; line-height: 28px; border-radius: 18px; }
  > strong { margin-left: auto; font-weight: 500; color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'}; }
  > output { color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'}; }
`
export const WideAction = styled.button`width: 100%; min-height: 54px; margin-top: auto; padding: 10px; font-size: 18px !important;`
export const CartItem = styled.div`position: relative; background: var(--surface); padding: 0 0 12px; border-radius: 15px; box-shadow: inset 0 0 4px var(--outline); margin-bottom: 10px; > button { position: absolute !important; right: 10px; top: 10px; display: grid; place-items: center; width: 32px; height: 32px; padding: 0; } > p { margin: 0 16px; text-align: right; color: var(--muted); font-size: 1.125em; }`
export const CartItems = styled.div`max-height: 240px; overflow: auto;`
export const Total = styled.p`display: flex; justify-content: space-between; gap: 8px; margin: 12px 0; font-size: .875em; color: ${({ $contrast }) => $contrast ? '#ffffff' : 'inherit'}; strong { color: ${({ $contrast }) => $contrast ? '#ffee00' : '#2456e8'}; font-size: 1.25em; font-weight: 500; }`
export const Payments = styled.div`display: grid; gap: 18px; margin: 10px 0; button { display: flex; align-items: center; justify-content: center; gap: 5px; min-height: 100px; padding: 12px; }`
export const Center = styled.div`display: flex; flex: 1; flex-direction: column; justify-content: center; align-items: center; gap: 14px; text-align: center; p { margin: 0; line-height: 24px; } strong { font-weight: 500; }`
export const CardButton = styled.button`display: grid; place-items: center; border: 0; width: 168px; height: 168px; border-radius: 50%; background: ${({ $paid }) => $paid ? '#dee1e9' : 'transparent'}; > img { width: 113px; height: 117px; }`
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
