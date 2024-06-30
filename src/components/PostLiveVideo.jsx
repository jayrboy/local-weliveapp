import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import { MdEdit } from 'react-icons/md'
import { baseURL } from '../App'
import { Description } from '@mui/icons-material'

function PostLiveVideo({ setIsOpenLiveVideo, page }) {
  const dispatch = useDispatch()
  const form = useRef()

  const onSubmitForm = (event) => {
    event.preventDefault()

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    const postData = {
      ...formEnt,
      pageId: page.id,
      accessToken: page.access_token,
    }

    // console.log(postData)

    fetch(`${baseURL}/api/fb-live-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(data)
          setIsOpenLiveVideo(false)
          toast('โพสต์เพจเฟสบุ๊คสำเร็จ')
        } else {
          console.log(data)
          toast.warning('โปรไฟล์ของคุณต้องมีอายุอย่างน้อย 60 วัน')
          setIsOpenLiveVideo(false)
        }
      })
  }

  return (
    <div className="modal-product">
      <div
        className="card shadow rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center">
          <h4>PAGE / ไลฟ์สดเพจเฟสบุ๊ค</h4>
          <button
            className="btn btn-sm border"
            onClick={() => setIsOpenLiveVideo(false)}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form ref={form} className="p-4" onSubmit={onSubmitForm}>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 mb-3">
              <label className="form-label mt-2">Title</label>
              <input
                type="text"
                name="title"
                className="form-control form-control-sm"
                placeholder="Live Video Now"
                required
              />
            </div>
            <div className="col-12 col-md-12 col-lg-12 mb-3">
              <label className="form-label mt-2">description</label>
              <input
                type="text"
                name="description"
                className="form-control form-control-sm"
                placeholder="This is a live video description."
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setIsOpenLiveVideo(false)}
              >
                ยกเลิก
              </button>
              &nbsp;&nbsp;&nbsp;
              <button type="submit" className="btn btn-light btn-sm border">
                <MdEdit color="orange" /> ไลฟ์สด
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostLiveVideo
