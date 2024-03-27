/* eslint-disable padded-blocks */
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

export default function DBUpdate() {
  let [data, setData] = useState('')
  const form = useRef()
  const itemid = useRef()
  const name = useRef()
  const cost = useRef()
  const price = useRef()
  const stock = useRef()
  const over_stock = useRef()
  const date_added = useRef()

  useEffect(() => {
    fetch('/api/db/read') //อ่านข้อมูลมาแสดงผล
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

  const showData = (result) => {
    let r = (
      <>
        <div className="m-2 row-cols-auto">
          <h3 className="text-start">
            <Link to="/admin/home" className="  text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> แก้ไขสินค้า </span>
          </h3>
        </div>

        <form onSubmit={onSubmitForm} ref={form}>
          <table className="table mt-3 table-striped ">
            <thead className="table-success border-bottom border-bottom-5">
              <tr>
                <th className="text-center">แก้ไข</th>
                <th className="text-center">รหัสสินค้า</th>
                <th className="text-center">ชื่อสินค้า</th>
                <th className="text-center">ราคา</th>
                <th className="text-center">ราคาต้นทุน</th>
                <th className="text-center">จำนวนสินค้า</th>
                <th className="text-center">สินค้าเกินจำนวน</th>
                <th className="text-center">วันที่เพิ่มสินค้า</th>
                <td className="text-center"></td>
                <td className="text-center"></td>
                <td className="text-center"></td>
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
                    {/* เมื่อคลิก radio บนรายการใด เราก็แนบ document ของรายการนั้น
                      ไปยังฟังก์ชันเป้าหมาย เพื่อใช้ในการอ่านข้อมูลจากแต่ละฟิลด์ไปแสดงที่ฟอร์ม
                  */}
                    <td>
                      <input
                        type="radio"
                        name="_id"
                        value={doc._id}
                        onClick={() => onClickRadio(doc)}
                      />
                    </td>

                    <td className="text-center">{doc.itemid}</td>
                    <td className="text-center">{doc.name}</td>
                    <td className="text-center">{p}</td>
                    <td className="text-center">{c}</td>
                    <td className="text-center">{doc.stock}</td>
                    <td className="text-center">{doc.over_stock}</td>
                    <td className="text-center">{df}</td>
                    <td className="text-center"></td>
                    <td className="text-center"></td>
                    <td className="text-center"></td>
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
                    name="itemid"
                    placeholder="รหัสสินค้า "
                    ref={itemid}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="name"
                    placeholder="ชื่อสินค้า"
                    ref={name}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="price"
                    placeholder="ราคาสินค้า"
                    ref={price}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="cost"
                    placeholder="ราคาต้นทุน"
                    ref={cost}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="stock"
                    placeholder="จำนวนสินค้า"
                    ref={stock}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="over_stock"
                    placeholder="จำนวนสินค้าล้นสต็อก"
                    ref={over_stock}
                  />
                </td>
                <td>
                  <input type="date" name="date_added" ref={date_added} />
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div>
            เลือกรายการที่จะแก้ไข แล้วใส่ข้อมูลใหม่ลงไป จากนั้นคลิกปุ่ม แก้ไข
          </div>
        </form>
      </>
    )

    setData(r)
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    if (!window.confirm('ยืนยันการแก้ไขรายการนี้')) {
      return
    }
    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    fetch('/api/db/update', {
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
    itemid.current.value = doc.itemid
    name.current.value = doc.name
    price.current.value = doc.price
    cost.current.value = doc.cost
    stock.current.value = doc.stock
    over_stock.current.value = doc.over_stock

    let dt = new Date(Date.parse(doc.date_added))
    let y = dt.getFullYear()
    let m = dt.getMonth() + 1
    //ค่าที่จะกำหนดให้แก่อินพุตชนิด date ต้องเป็นรูปแบบ yyyy-mm-dd
    //สำหรับเดือนและวันที่ หากเป็นเลขตัวเดียวต้องเติม 0 ข้างหน้า
    m = m >= 10 ? m : '0' + m
    let d = dt.getDate()
    d = d >= 10 ? d : '0' + d
    date_added.current.value = `${y}-${m}-${d}`
  }

  return (
    <div style={{ margin: '20px' }}>
      <div id="data">{data}</div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <a href="admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </a>
      </div>
    </div>
  )
}
