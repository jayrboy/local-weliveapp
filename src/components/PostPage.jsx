import { useRef } from 'react'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import { MdEdit } from 'react-icons/md'
import { baseURL } from '../App'

function PostPage({ setIsOpenPost, page }) {
  const form = useRef()
  const disabledButton = useRef()

  const onSubmitForm = (event) => {
    event.preventDefault()
    disabledButton.current.disabled = true

    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    const postData = {
      ...formEnt,
      pageId: page.id,
      accessToken: page.access_token,
    }

    // console.log(postData)

    fetch(`${baseURL}/api/fb-page-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setIsOpenPost(false)
        toast('โพสต์เพจเฟสบุ๊คสำเร็จ')
      })
      .catch((error) => {
        toast.error('การโพสต์ล้มเหลว')
      })
  }

  return (
    <div className="modal-product">
      <div
        className="card shadow rounded"
        style={{ width: '400px', background: '#fff' }}
      >
        <span className="card-header d-flex justify-content-between align-items-center">
          <h4>PAGE / โพสต์เพจเฟสบุ๊ค</h4>
          <button
            className="btn btn-sm border"
            onClick={() => setIsOpenPost(false)}
          >
            <CloseIcon sx={{ color: 'red' }} />
          </button>
        </span>
        <form ref={form} className="p-4" onSubmit={onSubmitForm}>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 mb-3">
              <label className="form-label mt-2">ข้อความ</label>
              <input
                type="text"
                name="message"
                className="form-control form-control-sm"
                placeholder="ติดตามในไลฟ์ วันนี้ 18:00 น. เปิดไลฟ์ขายของใช้ทั่วไป"
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setIsOpenPost(false)}
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
                <MdEdit color="orange" /> โพสต์
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostPage
