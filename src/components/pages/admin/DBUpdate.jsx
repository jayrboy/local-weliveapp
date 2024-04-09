import { baseURL } from '../../../App'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'

import { HeaderProduct, FeatureProduct } from './AdminStock'

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
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${baseURL}/api/db/read`) //อ่านข้อมูลมาแสดงผล
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          showData(result)
          setLoading(false)
        } else {
          setData(<>ไม่มีรายการข้อมูล</>)
        }
      })
      .catch((e) => {
        toast.error(e)
        setLoading(true)
      })
  }, [])

  const showData = (result) => {
    let r = (
      <>
        <form onSubmit={onSubmitForm} ref={form}>
          <table className="table table-sm table-striped mt-3 text-center table-bordered border-light">
            <caption className="ms-3">
              <small>
                เลือกรายการที่จะแก้ไข แล้วใส่ข้อมูลใหม่ลงไป จากนั้นคลิกปุ่ม
                แก้ไข
              </small>
            </caption>
            <thead className="table-light">
              <tr>
                <th>แก้ไข</th>
                <th>รหัสสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>ราคาต้นทุน</th>
                <th>จำนวนสินค้า</th>
                <th>ขายเกินจำนวน</th>
                <th>วันที่เพิ่มสินค้า</th>
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
                    <td>{doc.itemid}</td>
                    <td>{doc.name}</td>
                    <td>{p}</td>
                    <td>{c}</td>
                    <td>{doc.stock}</td>
                    <td>{doc.over_stock}</td>
                    <td>{df}</td>
                  </tr>
                )
              })}

              {/* สร้างฟอร์มไว้ที่แถวสุดท้าย */}
              <tr>
                <td>
                  <button className="btn btn-outline-warning btn-sm">
                    แก้ไข
                  </button>
                </td>
                <td>
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    name="itemid"
                    placeholder="รหัสสินค้า"
                    ref={itemid}
                  />
                </td>
                <td>
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    name="name"
                    placeholder="ชื่อสินค้า"
                    ref={name}
                  />
                </td>
                <td>
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    name="price"
                    placeholder="ราคาสินค้า"
                    ref={price}
                  />
                </td>
                <td>
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    name="cost"
                    placeholder="ราคาต้นทุน"
                    ref={cost}
                  />
                </td>
                <td>
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    name="stock"
                    placeholder="จำนวนสินค้า"
                    ref={stock}
                  />
                </td>
                <td>
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    name="over_stock"
                    placeholder="จำนวนสินค้าล้นสต็อก"
                    ref={over_stock}
                  />
                </td>
                <td>
                  <input
                    className="form-control form-control-sm"
                    type="date"
                    name="date_added"
                    ref={date_added}
                  />
                </td>
              </tr>
            </tbody>
          </table>
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

    fetch(`${baseURL}/api/db/update`, {
      method: 'POST',
      body: JSON.stringify(fe),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error)
        } else {
          //หลังการแก้ไข ฝั่งเซิร์ฟเวอร์จะอ่านข้อมูลใหม่
          //แล้วส่งกลับมา เราก็นำมาแสดงผลอีกครั้ง
          showData(result)
          form.current.reset()
          toast.success('ข้อมูลถูกแก้ไขแล้ว')
        }
      })
      .catch((err) => toast.error(err))
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
    <>
      <div className="row" style={{ margin: '20px' }}>
        <HeaderProduct title="แก้ไขสินค้า" />
        <FeatureProduct />
      </div>
      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading..</span>
          </div>
        </div>
      ) : (
        <div>{data}</div>
      )}
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/stock" className="btn btn-light btn-sm">
          กลับไปหน้าสินค้า
        </Link>
      </div>
    </>
  )
}
