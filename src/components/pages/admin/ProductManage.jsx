import { baseURL } from '../../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { HeaderProduct, FeatureProduct } from './ProductStock'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export default function ProductUpdate() {
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${baseURL}/api/db/read`)
      .then((response) => response.json())
      .then((docs) => {
        if (docs.length > 0) {
          showData(docs)
          setLoading(false)
        } else {
          setData(<>ไม่มีรายการข้อมูล</>)
        }
      })
      .catch((err) => {
        toast.error(err)
        setLoading(true)
      })
    // eslint-disable-next-line
  }, [])

  const onEditClick = (e) => {
    e.preventDefault()

    const selectedInput = document.querySelector('input[name="_id"]:checked')

    if (selectedInput) {
      const selectedId = selectedInput.value
      navigate(`/product/edit/${selectedId}`)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการแก้ไข')
    }
  }

  const showData = (result) => {
    let r = (
      <>
        <form onSubmit={onSubmitForm} ref={form}>
          <table className="table table-sm table-striped mt-3 text-center table-bordered border-light caption-top">
            <caption className="ms-3">
              <button
                onClick={onEditClick}
                className="btn btn-outline-warning btn-sm"
              >
                <FaEdit /> เลือก/แก้ไข
              </button>
              &nbsp;&nbsp;
              <button className="btn btn-outline-danger btn-sm">
                <MdDelete /> เลือก/ลบ
              </button>
            </caption>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>รหัสสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>ราคาต้นทุน</th>
                <th>จำนวนสินค้า</th>
                <th>สินค้าเกินจำนวน</th>
                <th>วันที่เพิ่มสินค้า</th>
                <th>จำนวน CF</th>
                <th>จ่ายแล้ว</th>
                <th>สินค้าคงเหลือ</th>
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
                    <td>
                      <input
                        type="radio"
                        name="_id"
                        value={doc._id}
                        className="form-check-input"
                      />
                    </td>
                    <td>{doc.itemid}</td>
                    <td>{doc.name}</td>
                    <td>{p}</td>
                    <td>{c}</td>
                    <td>{doc.stock}</td>
                    <td>{doc.over_stock}</td>
                    <td>{df}</td>
                    <td>{5}</td>
                    <td>{1}</td>
                    <td>{doc.stock}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <br />
        </form>
      </>
    )

    setData(r)
  }

  const onSubmitForm = (event) => {
    event.preventDefault()

    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    if (Object.keys(fe).length === 0) {
      toast.warning('กรุณาเลือกรายการที่ต้องการลบ')
      return
    }

    fetch(`${baseURL}/api/db/delete`, {
      method: 'POST',
      body: JSON.stringify(fe),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error)
        } else {
          if (result.length === 0) {
            setData('ไม่มีรายการข้อมูล')
          } else {
            showData(result)
          }
          toast.success('ข้อมูลถูกลบแล้ว')
        }
        navigate('/admin/stock/manage')
      })
      .catch((err) => toast.error(err))
  }

  return (
    <>
      <div className="row" style={{ margin: '20px' }}>
        <HeaderProduct title="จัดการสินค้า" />
        <FeatureProduct />
      </div>
      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading..</span>
          </div>
        </div>
      ) : (
        <div id="data">{data}</div>
      )}
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/stock" className="btn btn-light btn-sm">
          กลับไปหน้าสินค้า
        </Link>
      </div>
    </>
  )
}
