import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function EXcreate() {
  const form = useRef()
  const navigate = useNavigate()

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    fetch('/api/ex/create', {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        if (result === 'true') {
          form.current.reset()
          alert('ข้อมูลถูกจัดเก็บแล้ว')
        } else {
          alert('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก')
        }
        navigate('/admin/excreate')
      })
      .catch((e) => alert(e))
  }

  return (
    <>
      <h3 className="text-start m-3">
        <Link to="/admin/home" className="  text-decoration-none ">
          WE LIVE |
        </Link>{' '}
        <span className="text-success"> จัดการค่าขนส่ง </span>
      </h3>
      <div className="card m-3">
        <form className="relative" onSubmit={onSubmitForm} ref={form}>
          <div className=" m-3 ">
            <div className="mt-2  ">
              <div className="p-3 text-start w-50 border-bottom m-auto">
                <div>
                  <span>ชื่อขนส่ง :</span>
                  <input
                    type="text"
                    name="exname"
                    placeholder="' J&T Express '"
                    className="form-control form-control-sm mt-1"
                    required
                  />
                </div>

                <div className="mt-2">
                  <span>ค่าส่งเริ่มต้น :</span>
                  <input
                    type="number"
                    name="fprice"
                    placeholder="' 50 ฿ '"
                    className="form-control form-control-sm"
                    required
                  />
                </div>

                <div className="mt-2">
                  <span>ค่าส่งชิ้นต่อไป :</span>
                  <input
                    type="number"
                    name="sprice"
                    placeholder="' 30  '"
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="mt-2">
                  <span>ค่าส่งสูงสุด :</span>
                  <input
                    type="number"
                    name="maxprice"
                    placeholder="' 100  '"
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="mt-2">
                  <span>ส่งฟรีต่อเมื่อยอดถึง :</span>
                  <input
                    type="number"
                    name="whenfprice"
                    placeholder="' 1000  '"
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="mt-2">
                  <span>ค่าส่งเพิ่มเติมกรณี COD :</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="' 30 '"
                    className="form-control form-control-sm mt-1"
                  />
                </div>

                <div className="mt-2">
                  <span>วันที่เริ่มต้น :</span>
                  <input
                    type="Date"
                    name="date_start"
                    className="form-control form-control-sm"
                  />
                </div>
                <div className=" justify-content-around text-md-start border-bottom mt-4 m-auto "></div>
              </div>
              <div className=" m-auto text-center">
                <div>
                  <button className=" btn btn-sm bg-success text-white mt-3">
                    เพิ่มขนส่ง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
