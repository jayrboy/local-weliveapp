import { useEffect, useState } from 'react'
import { RiLiveFill } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, onLoading, onLoaded } from '../redux/liveSlice'
import { Button } from '@mui/material'

const LiveVideoModalV2 = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { isLoading } = useSelector((state) => state.live)
  const [isDisabled, setIsDisabled] = useState(true)

  useEffect(() => {
    if (user.role === 'admin') {
      setIsDisabled(false)
    }
  }, [])

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
        <div className="card d-flex justify-content-center p-4 rounded-3">
          <h4>
            สร้างออเดอร์อัตโนมัติจาก Comments - <strong>Live Facebook</strong>
          </h4>

          {isLoading ? (
            <div className="text-center bouncing-text-y p-3">
              <RiLiveFill color="red" size={80} />
            </div>
          ) : (
            <div className="text-center">
              <RiLiveFill color="grey" size={80} />
            </div>
          )}

          <form onSubmit={onSubmitForm}>
            <p className="mt-3 text-center text-muted">
              หมายเหตุ: เปิด Live Facebook ระบบจะดึง Comments ให้อัตโนมัติ
            </p>

            <div className="d-flex justify-content-between mt-4">
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
            </div>
          </form>
        </div>
      </aside>
      {/* {isLoading && <GetComments />} */}
    </>
  )
}

export default LiveVideoModalV2
