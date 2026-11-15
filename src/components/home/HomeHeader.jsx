import styled from 'styled-components'
import modiLogo from '../../assets/images/modi-logo.png'

const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  margin-top: 28px;
  padding: 0 24px 0 25px;
`
const Logo = styled.img`display: block; width: 57px; height: 20px;`
export default function HomeHeader() {
  return <Header><Logo src={modiLogo} alt="MODI" /></Header>
}
