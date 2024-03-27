import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DBCart() {
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/db/read')
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
        <table className="table table-striped">
          <thead className="table-success">
            <tr>
              <th className="text-center">รหัสไอดีผู้ใช้</th>
              <th className="text-center">โค้ดสินค้า</th>
              <th className="text-center">ความคิดเห็น</th>
              <th className="text-center">วันที่และเวลา</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
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
                  <td className="text-center">{doc.itemid}</td>
                  <td className="text-center">{doc.name}</td>
                  <td className="text-center">{p}</td>
                  <td className="text-center">{df}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <br />
        <button className="btn btn-danger btn-sm">ลบรายการที่เลือก</button>
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

    fetch('/api/db/cart', {
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
    <div style={{ margin: '20px' }}>
      <div id="data">{data}</div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <a href="http://localhost:5173/" className="btn btn-light btn-sm">
          หน้าหลัก
        </a>
      </div>
    </div>
  )
}
