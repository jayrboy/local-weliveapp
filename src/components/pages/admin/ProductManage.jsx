import React, { useState, useRef, useEffect } from 'react'
import { baseURL } from '../../../App'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { HeaderProduct, FeatureProduct } from './ProductStock'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export default function ProductUpdate() {
  const navigate = useNavigate()
  let [data, setData] = useState('')
  let [loading, setLoading] = useState(false)

  const form = useRef()

  let [page, setPage] = useState([])
  let qStr = window.location.search
  let params = new URLSearchParams(qStr)

  useEffect(() => {
    fetch(`${baseURL}/api/db/read`)
      .then((response) => response.json())
      .then((docs) => {
        setLoading(true)
        console.log(docs)
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

  const paginate = (result) => {
    if (result.totalPages === 1) {
      setPage([])
      return
    }

    let links = []
    let q = params.get('q') || ''
    let url = `/admin/stock?q=${q}&page=`

    //เนื่องจากจำนวนข้อมูลตัวอย่างมีไม่มาก
    //จึงให้แสดงหมายเลขในช่วง -/+ 2 จากเพจปัจจุบัน

    //ให้แสดง 2 หมายเลขก่อนเพจปัจจุบัน แต่ต้องไม่ต่ำกว่า 1
    let start = result.page - 2
    start = start < 1 ? 1 : start

    //ถัดจากเพจปัจจุบัน ให้แสดงอีก 2 หมายเลข (ต้องไม่เกินจำนวนเพจทั้งหมด)
    let end = result.page + 2
    end = end < result.totalPages ? end : result.totalPages

    //ถ้าช่วงหมายเลขเพจที่แสดง ยังสามารถเลื่อนกลับไปยังหมายเลขที่ตำ่กว่านี้ได้
    //ให้แสดงลิงก์ '|<' เพื่อสำหรับคลิกย้อนกลับไป
    if (start > 1) {
      links.push(
        <li className="page-item" key="first-page">
          <Link to={`${url}1`} className="page-link">
            {'|<'}
          </Link>
        </li>
      )
    }

    for (let i = start; i <= end; i++) {
      if (i === result.page) {
        links.push(
          <li className="page-item" key={i}>
            <span className="page-link active">{i}</span>
          </li>
        )
      } else {
        links.push(
          <li className="page-item" key={i}>
            <Link to={`${url}${i}`} className="page-link">
              {i}
            </Link>
          </li>
        )
      }
    }

    //ถ้าช่วงหมายเลขเพจที่แสดง ยังสามารถเลื่อนไปยังหมายเลขที่สูงกว่านี้ได้
    //ให้แสดงลิงก์ '>|' เพื่อสำหรับคลิกย้อนไปยังเพจเหล่านั้น
    if (end < result.totalPages) {
      links.push(
        <li className="page-item" key="last-page">
          <Link to={`${url}${result.totalPages}`} className="page-link">
            {'>|'}
          </Link>
        </li>
      )
    }

    setPage(links)
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
        <>{data}</>
      )}
      <div className="d-flex justify-content-center">
        <ul className="pagination pagination-sm">
          {page.map((p, i) => (
            <React.Fragment key={i + 1}>{p}</React.Fragment>
          ))}
        </ul>
      </div>
    </>
  )
}
