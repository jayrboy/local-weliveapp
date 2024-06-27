import { baseURL } from '../../App'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'

import {
  MdEdit,
  MdDeleteForever,
  MdGrid3X3,
  MdOutlineSearch,
} from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'

import ProductCreate from './ProductCreate'
import ProductEdit from './ProductEdit'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const Stock = () => {
  let [data, setData] = useState('')
  let [page, setPage] = useState([])
  const form = useRef()

  let qStr = window.location.search
  let params = new URLSearchParams(qStr)
  const location = useLocation()
  const { q } = useParams()
  const navigate = useNavigate()

  let [isOpenCreate, setOpenCreate] = useState(false)
  let [isOpenEdit, setOpenEdit] = useState(false)
  let [idEdit, setIdEdit] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!isOpenEdit) {
      fetch(`${baseURL}/api/product/search?` + params, {
        headers: { Authorization: 'Bearer ' + token },
      })
        .then((response) => response.json())
        .then((result) => {
          showData(result)
          paginate(result)
        })
        .catch((err) => toast.error(err))
    }
  }, [location, isOpenEdit])

  const showData = (result) => {
    const numDocs = result.totalDocs
    const hidden = {
      visibility: 'hidden',
    }

    let r = (
      <form onSubmit={onSubmitForm} ref={form}>
        <div className="m-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <caption>พบข้อมูลทั้งหมด {result.docs.length} รายการ</caption>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '100px' }}>
                    <strong>รายการที่</strong>
                  </TableCell>
                  <TableCell>
                    <strong>รหัสสินค้า</strong>
                  </TableCell>
                  <TableCell className="text-center">
                    <strong>จำนวนสินค้า</strong>
                  </TableCell>
                  <TableCell className="text-center">
                    <strong>ต้นทุน</strong>
                  </TableCell>
                  <TableCell className="text-center">
                    <strong>ราคา</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.docs.map((product, index) => {
                  console.log(index)
                  console.log(product)
                  return (
                    <StyledTableRow key={product._id}>
                      <TableCell>
                        <input
                          type="radio"
                          name="_id"
                          value={product._id}
                          className="ms-2 form-check-input"
                        />
                        &nbsp;&nbsp;{index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/product-graph/${product._id}`}
                          state={{ _id: product._id }}
                        >
                          {product.name}
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        {product.stock_quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.cost}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.price}
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <table className="table table-sm table-striped text-center table-bordered border-light table-hover">
                <caption className="ms-3">
                  {numDocs === 0 ? (
                    <>ไม่พบข้อมูล</>
                  ) : (
                    <small>พบข้อมูลทั้งหมด {result.totalDocs} รายการ</small>
                  )}
                </caption>
                <thead className="table-light">
                  <tr style={numDocs === 0 ? hidden : null}>
                    <th>
                      <MdGrid3X3 />
                    </th>
                    <th>รหัส</th>
                    <th>สินค้า</th>
                    <th>จำนวน</th>
                    <th>ราคา</th>
                    <th>ต้นทุน</th>
                    <th>วันที่</th>
                    <th>CF</th>
                    <th>Paid</th>
                    <th>เหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {result.docs.map((doc) => {
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
                        <td>
                          <Link
                            to={`/order/${doc._id}`}
                            state={{ _id: doc._id }}
                          >
                            {doc.code}
                          </Link>
                        </td>
                        <td>{doc.name}</td>
                        <td>{doc.stock_quantity}</td>
                        <td>{p}</td>
                        <td>{c}</td>
                        <td>{df}</td>
                        <td>{doc.cf}</td>
                        <td>{doc.paid}</td>
                        <td>{doc.remaining}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table> */}
        </div>
      </form>
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

    let start = result.page - 2
    start = start < 1 ? 1 : start

    let end = result.page + 2
    end = end < result.totalPages ? end : result.totalPages

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

  const onSubmitForm = (event) => {
    event.preventDefault()

    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    if (Object.keys(fe).length === 0) {
      toast.warning('กรุณาเลือกรายการที่ต้องการลบ')
      return
    }

    fetch(`${baseURL}/api/product/delete`, {
      method: 'DELETE',
      body: JSON.stringify(fe),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.length === 0) {
          setData('ไม่มีรายการข้อมูล')
        }
        toast.success('ข้อมูลถูกลบแล้ว')
        navigate('/stock')
      })
      .catch((err) => toast.error(err))
  }

  const onEditClick = (e) => {
    e.preventDefault()
    const selectedInput = document.querySelector('input[name="_id"]:checked')
    if (selectedInput) {
      setOpenEdit(true)
      const id = selectedInput.value
      setIdEdit(id)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการแก้ไข')
    }
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-4">
          <h3 className="text-start">
            <Link to="/dashboard" className="text-decoration-none">
              WE LIVE |
            </Link>
            <span className="text-success">&nbsp; สินค้าทั้งหมด</span>
          </h3>
        </div>

        <div className="col-lg-4 p-1">
          <form action="/stock" method="get">
            <div className="d-inline-block">
              <input
                type="text"
                name="q"
                placeholder="พิมพ์ชื่อสินค้าที่จะค้นหา"
                defaultValue={q}
                className="form-control form-control-sm"
              />
            </div>
            &nbsp;&nbsp;
            <button className="btn btn-sm btn-light border">
              <MdOutlineSearch />
            </button>
          </form>
        </div>

        <div className="col-lg-4 p-1">
          <button
            className="btn btn-sm btn-light border"
            onClick={() => setOpenCreate(true)}
          >
            <FaPlus color="blue" />
            &nbsp;เพิ่ม
          </button>
          &nbsp;
          <button onClick={onEditClick} className="btn btn-sm btn-light border">
            <MdEdit color="orange" />
            &nbsp;แก้ไข
          </button>
          &nbsp;
          <button
            className="btn btn-sm btn-light border"
            onClick={onSubmitForm}
          >
            <MdDeleteForever color="red" />
            &nbsp;ลบ
          </button>
        </div>
      </div>
      <>{data}</>
      <div className="d-flex justify-content-center">
        <ul className="pagination pagination-sm">
          {page.map((p, i) => (
            <React.Fragment key={i + 1}>{p}</React.Fragment>
          ))}
        </ul>
      </div>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/dashboard" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
      {isOpenCreate && (
        <ProductCreate
          isOpenCreate={isOpenCreate}
          setOpenCreate={setOpenCreate}
        />
      )}
      {isOpenEdit && (
        <ProductEdit
          isOpenEdit={isOpenEdit}
          setOpenEdit={setOpenEdit}
          idEdit={idEdit}
        />
      )}
    </>
  )
}
export default Stock
