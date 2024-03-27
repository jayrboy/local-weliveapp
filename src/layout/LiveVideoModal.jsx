import { useDispatch } from 'react-redux'
import { closeModal } from '../redux/liveVideoModalSlice'

import { useContext } from 'react'
import { firstLoadContext } from '../routes/AdminRoute'

import { toast } from 'react-toastify'

import { RiLiveFill } from 'react-icons/ri'

export default function LiveVideoModal() {
  const dispatch = useDispatch()
  let [firstLoad, setFirstLoad] = useContext(firstLoadContext)

  return (
    <aside className="modal-container">
      <div
        className="card d-flex justify-content-center p-4 rounded-3"
        style={{ height: '300px' }}
      >
        <h4>สร้างคำสั่งขายอัตโนมัติจาก Live Facebook</h4>
        <div className="text-center bouncing-text-y">
          <RiLiveFill color="red" size={80} />
        </div>
        <p className="mt-3 text-center">
          หมายเหตุ: ระบบจะดูด Comments หลังจากเปิด Live สดที่ Facebook
        </p>

        <div className="btn-container">
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => {
              console.log('เปิด : ระบบดูด comments')
              toast.success('เปิด : ระบบดูด comments')
              setFirstLoad(true)
              dispatch(closeModal())
            }}
          >
            ยืนยัน Live สด
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              console.log('ปิด : ระบบดูด comments')
              toast('ปิด : ระบบดูด comments')
              setFirstLoad(false)
              dispatch(closeModal())
            }}
          >
            ยกเลิก Live สด
          </button>
          <button
            type="button"
            className="btn btn-grey"
            onClick={() => {
              dispatch(closeModal())
            }}
          >
            ปิด
          </button>
        </div>
      </div>
    </aside>
  )
}
