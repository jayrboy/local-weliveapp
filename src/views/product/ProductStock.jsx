import { baseURL } from '../../App'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Tooltip,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Pagination,
  Stack,
} from '@mui/material'

import {
  MdEdit,
  MdDeleteForever,
  MdGrid3X3,
  MdOutlineSearch,
} from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'

import ProductCreate from './ProductCreate'
import ProductEdit from './ProductEdit'

import TroubleshootIcon from '@mui/icons-material/Troubleshoot'

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
  let [totalPages, setTotalPages] = useState(1) // Track the total number of pages
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
          // console.log('Result :', result)
          showData(result)
          paginate(result)
          setTotalPages(result.totalPages) // Update the total number of pages
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
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <caption>
                พบข้อมูล {result.docs.length} รายการ จากทั้งหมด{' '}
                {result.totalDocs} รายการ (หน้า {result.page} จาก{' '}
                {result.totalPages})
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '50px', textAlign: 'center' }}>
                    <MdGrid3X3 />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>สินค้า</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>จำนวน</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>ต้นทุน</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>ราคา</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>CF</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      จ่ายแล้ว
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.docs.map((product, index) => (
                  <StyledTableRow key={product._id}>
                    <TableCell>
                      <input
                        type="radio"
                        name="_id"
                        value={product._id}
                        className="ms-2 form-check-input"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography noWrap>
                        <span
                          className="btn btn-secondary"
                          style={{ fontSize: '20px' }}
                        >
                          {product.code}
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <Tooltip title="ดูผลรายงานสินค้า">
                          <Link
                            to={`/admin/product-graph/${product._id}`}
                            state={{ _id: product._id }}
                          >
                            {product.name}
                          </Link>
                        </Tooltip>
                      </Typography>
                    </TableCell>

                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      {product.cost
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </TableCell>
                    <TableCell>
                      {product.price
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </TableCell>
                    <TableCell>{product.cf}</TableCell>
                    <TableCell>{product.paid}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
    let url = `/stock?q=${q}&page=`

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

  // Handle page change
  const handlePageChange = (event, value) => {
    console.log('Selected Page:', value)
    setPage(value) // อัปเดต page state ตามค่า value ที่เลือก
    // อาจจะต้องการนำค่า page ไปปรับ URL ด้วย
    const newParams = new URLSearchParams(params)
    newParams.set('page', value)
    navigate(`/stock?${newParams.toString()}`) // ปรับ URL ตามหน้าใหม่
  }

  return (
    <>
      <div className="m-3">
        <h3 className="text-start">
          <Link to="/dashboard" className="text-decoration-none">
            WE LIVE |
          </Link>
          <span className="text-success">&nbsp; สต็อกสินค้า</span>
        </h3>
      </div>

      {/* Search Params 'q' */}
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          container
          alignItems="center"
          justifyContent="center"
        >
          <form action="/stock" method="get">
            <div className="d-inline-block">
              <TextField
                type="text"
                name="q"
                size="small"
                label="พิมพ์ชื่อสินค้าที่จะค้นหา"
                defaultValue={q}
                className="form-control form-control-sm"
              />
            </div>
            &nbsp;&nbsp;
            <IconButton
              type="submit"
              className="btn btn-sm btn-light border mt-2"
            >
              <MdOutlineSearch />
            </IconButton>
          </form>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            <FaPlus color="blue" />
            &nbsp;เพิ่ม
          </Button>
          &nbsp;
          <Button onClick={onEditClick} variant="contained" color="warning">
            <MdEdit color="orange" />
            &nbsp;แก้ไข
          </Button>
          &nbsp;
          <Button variant="contained" color="error" onClick={onSubmitForm}>
            <MdDeleteForever color="white" />
            &nbsp;ลบ
          </Button>
        </Grid>
      </Grid>

      <>{data}</>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <Stack spacing={2}>
          <Pagination
            count={totalPages} // Total pages from API
            // page={page} // Current page
            onChange={handlePageChange} // Page change handler
            variant="outlined"
            color="primary"
          />
        </Stack>
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
