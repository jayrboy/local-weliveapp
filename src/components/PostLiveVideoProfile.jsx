import { useRef } from 'react'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import { MdEdit } from 'react-icons/md'
import { baseURL } from '../App'
import { Description } from '@mui/icons-material'

function PostLiveVideoProfile({ setIsOpenLiveVideoProfile, user }) {
  const form = useRef()
  const disabledButton = useRef()
  const accessToken = localStorage.getItem('accessToken')

  const onSubmitForm = (event) => {
    event.preventDefault()
    disabledButton.current.disabled = true

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    const userData = {
      ...formEnt,
      pageId: user.username,
      accessToken: accessToken,
    }

    // console.log(userData)

    fetch(`${baseURL}/api/fb-live-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(data)
          setIsOpenLiveVideoProfile(false)
          toast('ไลฟ์สดบนเพจโปรไฟล์สำเร็จ')
          toast.success('Live Video ID : ' + data.id)
          localStorage.setItem('liveVideoId', data.id)
        } else {
          console.log(data)
          toast.warning('ไลฟ์สดบนเพจโปรไม่สำเร็จ')
          setIsOpenLiveVideoProfile(false)
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
          <h4>PROFILE / ไลฟ์สดเพจโปรไฟล์</h4>
          <button
            className="btn btn-sm border"
            onClick={() => setIsOpenLiveVideoProfile(false)}
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
                onClick={() => setIsOpenLiveVideoProfile(false)}
              >
                ยกเลิก
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-light btn-sm border"
                ref={disabledButton}
                disabled={false}
              >
                <MdEdit color="orange" /> ไลฟ์สด
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostLiveVideoProfile
