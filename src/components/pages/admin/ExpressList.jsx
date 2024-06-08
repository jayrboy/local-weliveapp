import { baseURL } from '../../../App'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

import { MdGrid3X3 } from 'react-icons/md'

export default function ExpressList() {
  let [data, setData] = useState('')
  const form = useRef()
  const exname = useRef()
  const fprice = useRef()
  const sprice = useRef()
  const maxprice = useRef()
  const whenfprice = useRef()
  const date_start = useRef()
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`${baseURL}/api/ex/read`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }) //อ่านข้อมูลมาแสดงผล
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          showData(result)
        } else {
          setData(<>ไม่มีรายการข้อมูล</>)
        }
      })
      .catch((e) => alert(e))
  }, [])

  const showData = (data) => {
    let updateForm = (
      <form onSubmit={onSubmitForm} ref={form}>
        <table className="table table-sm table-striped text-center table-bordered border-light">
          <caption className="ms-3">
            <small>
              เลือกรายการที่จะแก้ไข แล้วใส่ข้อมูลใหม่ลงไป จากนั้นคลิกปุ่ม แก้ไข
            </small>
          </caption>
          <thead className="table-light">
            <tr>
              <th>
                <MdGrid3X3 />
              </th>
              <th>ชื่อขนส่ง</th>
              <th>ค่าส่งเริ่มต้น</th>
              <th>ค่าส่งชิ้นต่อไป</th>
              <th>ค่าส่งสูงสุด</th>
              <th>ส่งฟรีต่อเมื่อยอดถึง</th>
              <th>วันที่เริ่มใช้</th>
            </tr>
          </thead>
          <tbody>
            {data.map((doc) => {
              let dt = new Date(Date.parse(doc.date_start))
              let df = (
                <>
                  {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                </>
              )

              return (
                <tr key={doc._id}>
                  {/* เมื่อคลิก radio บนรายการใด เราก็แนบ document ของรายการนั้น
                      ไปยังฟังก์ชันเป้าหมาย เพื่อใช้ในการอ่านข้อมูลจากแต่ละฟิลด์ไปแสดงที่ฟอร์ม
                  */}
                  <td>
                    <input
                      type="radio"
                      name="_id"
                      value={doc._id}
                      onClick={() => onClickRadio(doc)}
                      className="form-check-input"
                    />
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

            {/* สร้างฟอร์มไว้ที่แถวสุดท้าย */}
            <tr>
              <td>
                <button className="btn btn-warning btn-sm">แก้ไข</button>
              </td>
              <td>
                <input
                  type="text"
                  name="exname"
                  placeholder="ชื่อขนส่ง "
                  ref={exname}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="fprice"
                  placeholder="ค่าส่งเริ่มต้น"
                  ref={fprice}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="sprice"
                  placeholder="ค่าส่งชิ้นต่อไป"
                  ref={sprice}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="maxprice"
                  placeholder="ค่าส่งสูงสุด"
                  ref={maxprice}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="whenfprice"
                  placeholder="ส่งฟรีเมื่อยอดถึง"
                  ref={whenfprice}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="date"
                  name="date_start"
                  ref={date_start}
                  className="form-control form-control-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    )

    setData(updateForm)
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    if (!window.confirm('ยืนยันการแก้ไขรายการนี้')) {
      return
    }
    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    fetch(`${baseURL}/api/ex/update`, {
      method: 'POST',
      body: JSON.stringify(fe),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          alert(result.error)
        } else {
          //หลังการแก้ไข ฝั่งเซิร์ฟเวอร์จะอ่านข้อมูลใหม่
          //แล้วส่งกลับมา เราก็นำมาแสดงผลอีกครั้ง
          showData(result)
          form.current.reset()
          alert('ข้อมูลถูกแก้ไขแล้ว')
        }
      })
      .catch((err) => alert(err))
  }

  //เมื่อ radio บนรายการใดถูกคลิก (ในที่นี้เลือกใช้ click แทน change)
  //ก็อ่านข้อมูลในแต่ละฟิลต์จาก document ที่ผ่านเข้ามา แล้วเติมลงในฟอร์ม
  const onClickRadio = (doc) => {
    exname.current.value = doc.exname
    fprice.current.value = doc.fprice
    sprice.current.value = doc.sprice
    maxprice.current.value = doc.maxprice
    whenfprice.current.value = doc.whenfprice
    date_start.current.value = doc.date_start

    let dt = new Date(Date.parse(doc.date_start))
    let y = dt.getFullYear()
    let m = dt.getMonth() + 1
    //ค่าที่จะกำหนดให้แก่อินพุตชนิด date ต้องเป็นรูปแบบ yyyy-mm-dd
    //สำหรับเดือนและวันที่ หากเป็นเลขตัวเดียวต้องเติม 0 ข้างหน้า
    m = m >= 10 ? m : '0' + m
    let d = dt.getDate()
    d = d >= 10 ? d : '0' + d
    date_start.current.value = `${y}-${m}-${d}`
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-4">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> Express List </span>
          </h3>
        </div>
      </div>
      <>{data}</>
      <div className="d-flex justify-content-center mx-auto mb-3">
        <Link to="/express/create" className="btn btn-primary btn-sm">
          เพิ่มขนส่งใหม่
        </Link>
        <Link to="/express/delete" className="btn btn-danger btn-sm ms-3">
          ลบขนส่งออก
        </Link>
      </div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
