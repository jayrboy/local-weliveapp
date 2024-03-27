import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function EXdelete() {
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/ex/read')
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
    let deleteForm = (
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
                <th className="text-center">แก้ไข</th>
                <th className="text-center">ชื่อขนส่ง</th>
                <th className="text-center">ค่าส่งเริ่มต้น</th>
                <th className="text-center">ค่าส่งชิ้นต่อไป</th>
                <th className="text-center">ค่าส่งสูงสุด</th>
                <th className="text-center">ส่งฟรีต่อเมื่อยอดถึง</th>
                <th className="text-center">วันที่เริ่มใช้</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {result.map((doc) => {
                let dt = new Date(Date.parse(doc.date_start))
                let df = (
                  <>
                    {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                  </>
                )

                return (
                  <tr key={doc.exname}>
                    {/* เมื่อคลิก radio บนรายการใด เราก็แนบ document ของรายการนั้น
                      ไปยังฟังก์ชันเป้าหมาย เพื่อใช้ในการอ่านข้อมูลจากแต่ละฟิลด์ไปแสดงที่ฟอร์ม
                  */}
                    <td className=" text-center">
                      <input type="radio" name="exname" value={doc._id} />
                    </td>

                    <td className="text-center">{doc.exname}</td>
                    <td className="text-center">{doc.fprice}</td>
                    <td className="text-center">{doc.sprice}</td>
                    <td className="text-center">{doc.maxprice}</td>
                    <td className="text-center">{doc.whenfprice}</td>
                    <td className="text-center">{df}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <br />
          <div className=" text-center">
            <button className="btn btn-danger btn-sm ">ลบรายการที่เลือก</button>
          </div>
        </form>
      </>
    )

    setData(deleteForm)
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

    fetch('/api/ex/delete', {
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
        navigate('/admin/exdelete')
      })
      .catch((err) => alert(err))
  }

  return (
    <div style={{ margin: '20px' }}>
      <div id="data">{data}</div>
      <br />
    </div>
  )
}
