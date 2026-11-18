import { useState } from 'react'
import AccountMenu from './AccountMenu'
import profileIcon from '../../assets/account/profile.svg'
import styled from 'styled-components'
import modiLogo from '../../assets/images/modi-logo.png'

const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 28px;
  padding: 0 24px 0 25px;
`
const Logo = styled.img`display: block; width: 100px; height: auto;`
const AccountButton = styled.button`
  display: grid; place-items: center; width: 44px; height: 44px; margin: -9px -9px -9px 0;
  padding: 0; border: 0; border-radius: 50%; background: transparent; cursor: pointer;
  &:active { background: #dee1e9; }
  &:focus-visible { outline: 2px solid #191f28; outline-offset: 2px; }
`
export default function HomeHeader({ target }) {
  const [open, setOpen] = useState(false)
  return <><Header><Logo src={modiLogo} alt="MODI" /><AccountButton aria-label="내 회원 정보" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><img src={profileIcon} alt="" /></AccountButton></Header>{open && <AccountMenu target={target} onClose={() => setOpen(false)} />}</>
}
