import { baseURL } from '../../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBoxOpen } from 'react-icons/fa'
import { MdEdit, MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function DailyStock() {
  const navigate = useNavigate()
  let [data, setData] = useState('')
  const form = useRef()

  useEffect(() => {
    fetch(`${baseURL}/api/db/read`)
      .then((response) => response.json())
      .then((docs) => {
        if (docs.length > 0) {
          showData(docs)
        } else {
          setData(<>ไม่มีรายการข้อมูล</>)
        }
      })
      .catch((err) => alert(err))
  }, [])

  const showData = (result) => {
    let r = (
      <form onSubmit={onSubmitForm} ref={form} className="px-2">
        <div className="table-responsive">
          <table className="table table-sm table-striped text-center table-bordered border-light table-hover">
            <caption className="ms-3">
              {result.length === 0 ? (
                <>ไม่พบข้อมูล</>
              ) : (
                <small>พบข้อมูลทั้งหมด {result.length} รายการ</small>
              )}
            </caption>
            <thead className="table-light">
              <tr>
                <th>วันที่</th>
                <th>สถานะ</th>
                <th>Chanel</th>
                <th>รายการไลฟ์สด</th>
                <th>ราคาทั้งหมด</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {result.map((doc) => {
                let price = new Intl.NumberFormat().format(doc.price)
                let stock = new Intl.NumberFormat().format(doc.stock)
                let dt = new Date(Date.parse(doc.date_added))
                let df = (
                  <>
                    {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                  </>
                )

                return (
                  <tr key={doc._id}>
                    <td>{df}</td>
                    <td>
                      <div>{doc.code}</div>
                    </td>
                    <td>{doc.name}</td>
                    <td>
                      <FaBoxOpen /> &nbsp;
                      {stock}
                    </td>
                    <td>{price} ฿</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger m-1">
                        <MdDelete />
                      </button>
                      <Link to={'/daily-stock/edit/' + doc._id}>
                        <div className="btn btn-sm btn-outline-warning">
                          <MdEdit />
                        </div>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </form>
    )

    setData(r)
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    if (!window.confirm('ยืนยันการลบรายการนี้')) {
      return
    }

    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    if (Object.keys(fe).length === 0) {
      alert('ต้องเลือกรายการที่จะลบ')
      return
    }

    fetch('/api/db/delete', {
      method: 'POST',
      body: JSON.stringify(fe),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          alert(result.error)
        } else {
          if (result.length === 0) {
            setData('ไม่มี CF CODE ดังกล่าว')
          } else {
            showData(result)
          }
          alert('cf code ถูกลบแล้ว')
        }
        navigate('/db/cfcode')
      })
      .catch((err) => alert(err))
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-6">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> รายการไลฟ์สด</span>
          </h3>
        </div>
        <div className="col-lg-6">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate('/daily-stock/create')}
          >
            เพิ่มรายการไลฟ์สด
          </button>
        </div>
      </div>
      {data}
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
