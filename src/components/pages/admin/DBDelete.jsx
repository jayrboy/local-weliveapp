import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function DBDelete() {
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
      <>
        <h3 className="text-start">
          <Link to="/admin/home" className="  text-decoration-none">
            WE LIVE |
          </Link>{' '}
          <span className="text-success"> คลังสินค้า </span>
        </h3>

        <form onSubmit={onSubmitForm} ref={form}>
          <table className="table table-striped">
            <thead className=" table table-success">
              <tr>
                <th className="text-center">ลบ</th>
                <th className="text-center">รหัสสินค้า</th>
                <th className="text-center">ชื่อสินค้า</th>
                <th className="text-center">ราคา</th>
                <th className="text-center">ราคาต้นทุน</th>
                <th className="text-center">จำนวนสินค้า</th>
                <th className="text-center">สินค้าเกินจำนวน</th>
                <th className="text-center">วันที่เพิ่มสินค้า</th>
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
                let c = new Intl.NumberFormat().format(doc.cost)
                return (
                  <tr key={doc._id}>
                    <td className="text-center">
                      <input type="radio" name="_id" value={doc._id} />
                    </td>
                    <td className="text-center">{doc.itemid}</td>
                    <td className="text-center">{doc.name}</td>
                    <td className="text-center">{p}</td>
                    <td className="text-center">{c}</td>
                    <td className="text-center">{doc.stock}</td>
                    <td className="text-center">{doc.over_stock}</td>
                    <td className="text-center">{df}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <br />
          <button className="btn btn-danger btn-sm">ลบรายการที่เลือก</button>
        </form>
      </>
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
            setData('ไม่มีรายการข้อมูล')
          } else {
            showData(result)
          }
          alert('ข้อมูลถูกลบแล้ว')
        }
        navigate('/db/delete')
      })
      .catch((err) => alert(err))
  }

  return (
    <div style={{ margin: '20px' }}>
      <div id="data">{data}</div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <a href="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </a>
      </div>
    </div>
  )
}
