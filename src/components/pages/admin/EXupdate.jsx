/* eslint-disable padded-blocks */
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
export default function EXupdate() {
  let [data, setData] = useState('')
  const form = useRef()
  const exname = useRef()
  const fprice = useRef()
  const sprice = useRef()
  const maxprice = useRef()
  const whenfprice = useRef()
  const date_start = useRef()

  useEffect(() => {
    fetch('/api/ex/read') //อ่านข้อมูลมาแสดงผล
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
      <>
        <div className="m-2 row-cols-auto">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> Express List </span>
          </h3>
        </div>

        <form onSubmit={onSubmitForm} ref={form}>
          <table className="table mt-3 table-striped ">
            <thead className="table-success border-bottom border-bottom-5">
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
                    <td className=" text-center">
                      <input
                        type="radio"
                        name="_id"
                        value={doc._id}
                        onClick={() => onClickRadio(doc)}
                      />
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
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="fprice"
                    placeholder="ค่าส่งเริ่มต้น"
                    ref={fprice}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="sprice"
                    placeholder="ค่าส่งชิ้นต่อไป"
                    ref={sprice}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="maxprice"
                    placeholder="ค่าส่งสูงสุด"
                    ref={maxprice}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="whenfprice"
                    placeholder="ส่งฟรีเมื่อยอดถึง"
                    ref={whenfprice}
                  />
                </td>

                <td>
                  <input type="date" name="date_start" ref={date_start} />
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            เลือกรายการที่จะแก้ไข แล้วใส่ข้อมูลใหม่ลงไป จากนั้นคลิกปุ่ม แก้ไข
          </div>
        </form>
      </>
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

    fetch('/api/ex/update', {
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
    <div style={{ margin: '20px' }}>
      <div id="data">{data}</div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <a href="/admin/EXcreate" className="btn btn-primary btn-sm ">
          เพิ่มขนส่งใหม่
        </a>

        <a href="/admin/EXupdate" className="btn btn-light btn-sm ms-3">
          <RestartAltIcon />
        </a>

        <a href="/admin/EXdelete" className="btn btn-danger btn-sm ms-3">
          ลบขนส่งออก
        </a>
      </div>
    </div>
  )
}
