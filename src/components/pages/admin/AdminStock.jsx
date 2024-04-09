import { baseURL } from '../../../App'
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import ViewListIcon from '@mui/icons-material/ViewList'
import SearchIcon from '@mui/icons-material/Search'
import DBCreate from './DBCreate'

import { useSelector, useDispatch } from 'react-redux'
import { getProducts } from '../../../redux/productSlice'

export const HeaderProduct = ({ title }) => {
  return (
    <h3 className="text-start">
      <Link to="/admin/home" className="  text-decoration-none">
        WE LIVE |
      </Link>
      <span className="text-success">&nbsp;{title}</span>
    </h3>
  )
}

export const FeatureProduct = () => {
  let [openCreate, setOpenCreate] = useState(false)

  return (
    <>
      <div className="col-sm-6 d-flex justify-content-start mt-2">
        <Link to="/admin/stock">
          <button className="btn btn-success btn-sm">
            <ViewListIcon />
          </button>
        </Link>
        &nbsp;
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setOpenCreate(true)}
          style={{ height: '34px' }}
        >
          <AddBusinessOutlinedIcon />
        </button>
        &nbsp;
        <Link to="/db/update">
          <button className="btn btn-warning btn-sm">
            <EditNoteOutlinedIcon />
          </button>
        </Link>
        &nbsp;
        <Link to="/db/delete">
          <button className="btn btn-danger btn-sm">
            <RemoveShoppingCartOutlinedIcon />
          </button>
        </Link>
      </div>
      {openCreate ? (
        <DBCreate openCreate={openCreate} setOpenCreate={setOpenCreate} />
      ) : (
        ''
      )}
    </>
  )
}

//TODO: Product
const Stock = () => {
  let { products } = useSelector((store) => store.product)

  let [data, setData] = useState('')
  let [page, setPage] = useState([])
  let [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

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
        dispatch(getProducts())
        showData(result)
        paginate(result)
        setLoading(false)
      })
      .catch((err) => {
        toast.error(err)
        setLoading(true)
      })
  }, [location])

  const showData = (result) => {
    const numDocs = result.totalDocs
    const hidden = {
      visibility: 'hidden',
    }

    let r = (
      <React.Fragment>
        <table className="table table-sm table-striped mt-3 text-center table-bordered border-light">
          <caption className="ms-3">
            {numDocs === 0 ? (
              <>ไม่พบข้อมูล</>
            ) : (
              <small>พบข้อมูลทั้งหมด {result.totalDocs} รายการ</small>
            )}
          </caption>
          <thead className="table-light">
            <tr style={numDocs === 0 ? hidden : null}>
              <th>CF CODE</th>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>จำนวน</th>
              <th>ราคาต้นทุน</th>
              <th>ราคาสินค้าทั้งหมด</th>
              <th>วันที่เพิ่มสินค้า</th>
              <th>จำนวน CF</th>
              <th>จ่ายแล้ว</th>
              <th>สินค้าคงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {result.docs.map((doc) => {
              //จัดรูปแบบวันเดือนปี ที่สามารถเข้าใจได้
              let dt = new Date(Date.parse(doc.date_added))
              let df = (
                <>
                  {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                </>
              )
              let p = new Intl.NumberFormat().format(doc.price)
              let c = new Intl.NumberFormat().format(doc.cost)
              let q = new Intl.NumberFormat().format(doc.stock)

              return (
                <tr key={doc._id}>
                  <td>{doc.itemid}</td>
                  <td>{doc.name}</td>
                  <td>{p}</td>
                  <td>{q}</td>
                  <td>{c}</td>
                  <td>{p * q}</td>
                  <td>{df}</td>
                  <td>{0}</td>
                  <td>{0}</td>
                  <td>{q - 0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
    <>
      <div className="row" style={{ margin: '20px' }}>
        <HeaderProduct title="สินค้า" />
        <FeatureProduct />
        <div className="col-sm-6 mt-2 d-flex">
          <form action="/admin/stock" method="get" className="d-flex">
            <div className="d-inline-block">
              <input
                type="text"
                name="q"
                placeholder="พิมพ์ชื่อสินค้าที่จะค้นหา"
                // defaultValue={params.get('q')}
                defaultValue={q}
                className="form-control form-control"
              />
            </div>
            &nbsp;&nbsp;
            <button className="btn btn-sm btn-primary">
              <SearchIcon />
            </button>
          </form>
        </div>
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
export default Stock
