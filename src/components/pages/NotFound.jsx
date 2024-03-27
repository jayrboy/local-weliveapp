import img404 from '../../assets/404.png'
import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'

const NotFound = ({ text }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container>
        <Typography variant="h1" color="error">
          404
        </Typography>
        <Typography variant="h2">Page Not Found</Typography>
        <br />
        <Typography variant="h6">{text}</Typography>
        <hr />
        <Link to="/">
          <Button variant="contained">Back Home</Button>
        </Link>
      </Container>
    </Box>
  )
}
export default NotFound
