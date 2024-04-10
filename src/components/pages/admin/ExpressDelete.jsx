import { baseURL } from '../../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function ExpressDelete() {
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${baseURL}/api/ex/read`)
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
        <div className="row m-3">
          <div className="col-lg-4">
            <h3 className="text-start">
              <Link to="/admin/home" className="text-decoration-none">
                WE LIVE |
              </Link>{' '}
              <span className="text-success"> ลบขนส่ง</span>
            </h3>
          </div>
        </div>

        <form onSubmit={onSubmitForm} ref={form}>
          <table className="table table-sm table-striped text-center table-bordered border-light">
            <thead className="table-light">
              <tr>
                <th>แก้ไข</th>
                <th>ชื่อขนส่ง</th>
                <th>ค่าส่งเริ่มต้น</th>
                <th>ค่าส่งชิ้นต่อไป</th>
                <th>ค่าส่งสูงสุด</th>
                <th>ส่งฟรีต่อเมื่อยอดถึง</th>
                <th>วันที่เริ่มใช้</th>
              </tr>
            </thead>
            <tbody>
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

                    <td>{doc.exname}</td>
                    <td>{doc.fprice}</td>
                    <td>{doc.sprice}</td>
                    <td>{doc.maxprice}</td>
                    <td>{doc.whenfprice}</td>
                    <td>{df}</td>
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

  return <>{data}</>
}
