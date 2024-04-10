import { baseURL } from '../../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBoxOpen } from 'react-icons/fa'
import { MdEdit, MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'

import { MdGrid3X3 } from 'react-icons/md'

export default function DailyStock() {
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()
  let switchReq = useRef()

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
        <table className="table table-sm table-striped text-center table-bordered border-light caption-top">
          <caption className="ms-3">
            <Link to="/db/create">
              <button className="btn btn-outline-primary btn-sm">
                เพิ่มโค้ดการขาย
              </button>
            </Link>
          </caption>
          <thead className="table-light">
            <tr>
              <th>CF</th>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>สินค้าที่มี</th>
              <th>ราคา</th>
              <th>จำนวน</th>
              <th>ขายเกินจำนวน</th>
              <th>จำนวน CF</th>
              <th>จ่ายแล้ว</th>
              <th>สินค้าคงเหลือ</th>
              <th>ลบ/แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {result.map((doc) => {
              let p = new Intl.NumberFormat().format(doc.price)
              return (
                <tr key={doc._id}>
                  <td>
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="require"
                        role="switch"
                        ref={switchReq}
                      />
                    </div>
                  </td>
                  <td>
                    <div>{doc.itemid}</div>
                  </td>
                  <td>{doc.name}</td>
                  <td>
                    <FaBoxOpen /> &nbsp;
                    {doc.stock}
                  </td>
                  <td>{p} ฿</td>
                  <td>{doc.stock}</td>
                  <td>{doc.over_stock}</td>
                  <td>{0}</td>
                  <td>{0}</td>
                  <td>
                    <FaBoxOpen /> &nbsp;{doc.stock}
                  </td>
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
        <div className="col-lg-12">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> รายการไลฟ์สด</span>
          </h3>
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
