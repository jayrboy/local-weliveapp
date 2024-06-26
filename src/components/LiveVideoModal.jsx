import { useEffect, useState } from 'react'
import { RiLiveFill } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, onLoading, onLoaded } from '../redux/liveSlice'

const LiveVideoModal = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.live)
  let [liveId, setLiveId] = useState(localStorage.getItem('liveVideoId') || '')

  useEffect(() => {
    setLiveId(localStorage.getItem('liveVideoId') || '')
  }, [])

  const onSubmitForm = (e) => {
    e.preventDefault()

    if (!liveId) {
      toast.warning('กรุณาป้อนข้อมูล')
    } else {
      console.log('เปิด : ระบบดูด comments')
      localStorage.setItem('liveVideoId', liveId)
      toast.success('เปิด : ระบบดูด comments')
      dispatch(onLoading()) // icon RiLiveFill color="red" and GetComments() to HeaderBar.jsx Component
      dispatch(closeModal())
    }
  }

  const closeLiveVideo = () => {
    console.log('ปิด : ระบบดูด comments')
    toast('ปิด : ระบบดูด comments')
    dispatch(onLoaded()) // icon RiLiveFill color="grey"
    dispatch(closeModal())
    // localStorage.removeItem('liveVideoId')
    setLiveId('') // Clear the state
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
            <div className="mb-3">
              <label className="form-label">ID ไลฟ์สด Facebook</label>
              <input
                type="text"
                name="liveVideoId"
                value={liveId}
                onChange={(e) => setLiveId(e.target.value)}
                className="form-control shadow-sm"
                placeholder="ป้อน ID ไลฟ์สด"
                disabled={isLoading}
              />
            </div>

            <p className="mt-3 text-center text-muted">
              หมายเหตุ: ระบบจะดึง Comments หลังจากได้ ID ของ URL ที่เปิด Live
              ของ Facebook
            </p>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  dispatch(closeModal())
                }}
              >
                ปิด
              </button>
              {isLoading ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={closeLiveVideo}
                >
                  ยกเลิก Live สด
                </button>
              ) : (
                <button className="btn btn-primary">ยืนยัน Live สด</button>
              )}
            </div>
          </form>
        </div>
      </aside>
      {/* {isLoading && <GetComments />} */}
    </>
  )
}

export default LiveVideoModal
