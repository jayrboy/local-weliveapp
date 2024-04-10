import { baseURL } from '../../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { MdEdit, MdDelete, MdOutlineManageSearch } from 'react-icons/md'

export default function CustomerOrder() {
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()

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
    // eslint-disable-next-line
  }, [])

  const showData = (result) => {
    let r = (
      <form onSubmit={onSubmitForm} ref={form}>
        <table className="table table-sm table-striped text-center table-bordered border-light">
          <caption className="ms-3">
            {result.length === 0 ? (
              <>ไม่พบข้อมูล</>
            ) : (
              <small>พบข้อมูลทั้งหมด {result.length} รายการ</small>
            )}
          </caption>
          <thead className="table-light">
            <tr>
              <th>รหัสไอดีผู้ใช้</th>
              <th>โค้ดสินค้า</th>
              <th>ความคิดเห็น</th>
              <th>วันที่และเวลา</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {result.map((doc) => {
              let dt = new Date(Date.parse(doc.date_added))
              let df = (
                <>
                  {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                </>
              )
              let p = new Intl.NumberFormat().format(doc.price)

              return (
                <tr key={doc._id}>
                  <td>{doc.itemid}</td>
                  <td>{doc.name}</td>
                  <td>{p}</td>
                  <td>{df}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger">
                      <MdDelete />
                    </button>
                    &nbsp;
                    <Link to={'/daily-stock/edit/' + doc._id}>
                      <div className="btn btn-sm btn-outline-warning">
                        <MdEdit />
                      </div>
                    </Link>
                    <Link to={'/order/' + doc._id}>
                      <div className="btn btn-sm btn-outline-primary">
                        <MdOutlineManageSearch />
                      </div>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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

    fetch(`${baseURL}/api/db/cart`, {
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
            setData('ไม่มีรายการข้อมูล')
          } else {
            showData(result)
          }
          alert('ข้อมูลถูกลบแล้ว')
        }
        navigate('/db/cart')
      })
      .catch((err) => alert(err))
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> ค้นหาลูกค้า</span>
          </h3>
        </div>
      </div>
      <div id="data">{data}</div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
