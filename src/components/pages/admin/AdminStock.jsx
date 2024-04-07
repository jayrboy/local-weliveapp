import { baseURL } from '../../../App'
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

const Stock = () => {
  let [data, setData] = useState('')
  let [page, setPage] = useState([])
  let [loading, setLoading] = useState(false)

  //อ่านคีย์เวิร์ดจาก URL
  let qStr = window.location.search
  let params = new URLSearchParams(qStr)
  const location = useLocation()
  let { q } = useParams()

  useEffect(() => {
    setLoading(true)
    fetch(`${baseURL}/api/db/search?` + params)
      .then((response) => response.json())
      .then((result) => {
        showData(result)
        paginate(result)
        setLoading(false)
      })
      .catch((err) => alert(err))
  }, [location])

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading..</span>
        </div>
      </div>
    )
  }

  const showData = (result) => {
    const numDocs = result.totalDocs
    const hidden = {
      visibility: 'hidden',
    }

    let r = (
      <React.Fragment>
        <div className="m-2 row-cols-auto">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success"> คลังสินค้า </span>
          </h3>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 mb-2 d-flex">
              <form action="/admin/stock" method="get" className="d-flex">
                <div className="d-inline-block">
                  <input
                    type="text"
                    name="q"
                    placeholder="พิมพ์คำที่จะค้นหา"
                    // defaultValue={params.get('q')}
                    defaultValue={q}
                    className="form-control form-control-sm"
                  />
                </div>
                &nbsp;
                <button className="btn btn-sm btn-primary">ค้นหา</button>
              </form>
            </div>
            <div className="col-sm-6">
              <Link to="/db/create">
                <button className="btn btn-primary btn-sm">Add</button>
              </Link>
              &nbsp;
              <Link to="/db/update">
                <button className="btn btn-warning btn-sm">EDIT</button>
              </Link>
              &nbsp;
              <Link to="/db/delete">
                <button className="btn btn-danger btn-sm">Delete</button>
              </Link>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped caption-top mt-3">
              <thead className="table-success">
                <tr style={numDocs === 0 ? hidden : null}>
                  <th>#</th>
                  <th>CF CODE</th>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>ราคาต้นทุน</th>
                  <th>จำนวนสินค้า</th>
                  <th>สินค้าเกินจำนวน</th>
                  <th>วันที่เพิ่มสินค้า</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc, i) => {
                  //จัดรูปแบบวันเดือนปี ที่สามารถเข้าใจได้
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
                      <td className="text-center">{i + 1}</td>
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
          </div>
          <span className="ms-3">
            {numDocs === 0 ? (
              <>ไม่พบข้อมูล</>
            ) : (
              <small>พบข้อมูลทั้งหมด {result.totalDocs} รายการ</small>
            )}
          </span>
        </div>
      </React.Fragment>
    )

    setData(r)
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
    <div style={{ margin: '20px' }}>
      <div>{data}</div>
      <br />
      <div>
        <ul className="pagination">
          {page.map((p, i) => (
            <React.Fragment key={i + 1}>{p}</React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default Stock
