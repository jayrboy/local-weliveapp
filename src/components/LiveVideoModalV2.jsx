import { useEffect, useState } from 'react'
import { RiLiveFill } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, onLoading, onLoaded } from '../redux/liveSlice'
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'

const LiveVideoModalV2 = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { isLoading } = useSelector((state) => state.live)
  const [isDisabled, setIsDisabled] = useState(false)

  // useEffect(() => {
  //   if (user.role === 'admin') {
  //     setIsDisabled(false)
  //   }
  // }, [])

  const onSubmitForm = (e) => {
    e.preventDefault()
    toast.success('เปิด : ระบบดูด comments')
    dispatch(onLoading()) // icon RiLiveFill color="red" and GetComments() to HeaderBar.jsx Component
    dispatch(closeModal())
  }

  const closeLiveVideo = () => {
    toast('ปิด : ระบบดูด comments')
    dispatch(onLoaded()) // icon RiLiveFill color="grey"
    dispatch(closeModal())
  }

  return (
    <>
      <aside className="modal-container">
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            สร้างออเดอร์อัตโนมัติจาก Comments - <strong>Live Facebook</strong>
          </Typography>

          {isLoading ? (
            <Box className="text-center p-3">
              <CircularProgress color="error" size={80} />
            </Box>
          ) : (
            <Box className="text-center">
              <RiLiveFill color="gray" size={80} />
            </Box>
          )}

          <form onSubmit={onSubmitForm}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
              หมายเหตุ: เปิด Live Facebook ระบบจะดึง Comments ให้อัตโนมัติ
            </Typography>

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
              <Button
                type="button"
                color="inherit"
                onClick={() => {
                  dispatch(closeModal())
                }}
              >
                ปิด
              </Button>
              {isLoading ? (
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  onClick={closeLiveVideo}
                >
                  ยกเลิก Live สด
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isDisabled}
                >
                  ยืนยัน Live สด
                </Button>
              )}
            </Box>
          </form>
        </Card>
      </aside>
      {/* {isLoading && <GetComments />} */}
    </>
  )
}

export default LiveVideoModalV2
