import { useEffect, useState } from 'react'
import { RiLiveFill } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, onLoading, onLoaded } from '../redux/liveSlice'

const LiveVideoModalV2 = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.live)

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
                <button type="submit" className="btn btn-primary">
                  ยืนยัน Live สด
                </button>
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
