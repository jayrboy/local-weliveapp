import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

const CenteredContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  padding: theme.spacing(5),
  background: 'transparent',
}))

const LargeCircularProgress = styled(CircularProgress)(({ theme }) => ({
  width: '100px !important',
  height: '100px !important',
}))

const LoadingFn = () => {
  return (
    <CenteredContainer>
      <LargeCircularProgress color="secondary" />
    </CenteredContainer>
  )
}
export default LoadingFn
