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
  DialogTitle,
  Dialog,
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

import FileDownloadIcon from '@mui/icons-material/FileDownload'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import PublishIcon from '@mui/icons-material/Publish'
import { read, utils, writeFile } from 'xlsx'
import excelIcon from '../../assets/excelicon.png'

import { useDispatch, useSelector } from 'react-redux'
import {
  getProducts,
  onImport,
  handleOpen,
  handleOpened,
  clearImport,
} from '../../redux/productSlice'

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
  let [page, setPage] = useState(0)
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
  let [selectItem, setSelectItem] = useState(false)

  const token = localStorage.getItem('token')

  // let [productsToExport, setProductsToExport] = useState([])
  const { products, productsToImport, isOpen } = useSelector(
    (state) => state.product
  ) // สำหรับ export: products get all
  const dispatch = useDispatch()

  const handleClickOpen = () => {
    dispatch(handleOpen())
  }

  const handleClose = () => {
    dispatch(handleOpened())
  }

  useEffect(() => {
    // ดึงค่า page จาก query string
    const params = new URLSearchParams(location.search)
    const pageFromParams = params.get('page') ? parseInt(params.get('page')) : 1 // ถ้าไม่มี page จะตั้งค่าเป็น 1

    fetch(`${baseURL}/api/product/search?` + params, {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log('Result :', result)
        showData(result)
        setTotalPages(result.totalPages) // Update the total number of pages
        // setProductsToExport(result.docs) //? ถ้าต้องการ export ทีละหน้า

        // ตรวจสอบค่า page จาก URL
        if (location.search) {
          // console.log('Page from URL:', pageFromParams) // แสดงค่าของ page ที่แยกมาได้
          setPage(pageFromParams)
        } else {
          setPage(result.page)
        }
      })
      .catch((err) => toast.error(err))
  }, [location, isOpenEdit, page])

  useEffect(() => {
    dispatch(getProducts())
  }, [])

  //TODO: Import file V1
  // const importFileExcel = async (event) => {
  //   const file = event.target.files[0]

  //   if (file) {
  //     const fileReader = new FileReader()
  //     fileReader.onload = (event) => {
  //       const wb = read(event.target.result)
  //       const sheets = wb.SheetNames

  //       if (sheets.length) {
  //         const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
  //         // console.table(rows)

  //         // //TODO: for fetch api cell if want to save this data in DB
  //         dispatch(onImport(rows))
  //         handleClickOpen()
  //       }
  //     }

  //     fileReader.readAsArrayBuffer(file)
  //   }
  // }

  //TODO: Import file V2
  const expectedHeaders = [
    'date_added',
    'code',
    'name',
    'price',
    'stock_quantity',
    'cost',
  ]

  const importFileExcel = async (event) => {
    const file = event.target.files[0]

    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const wb = read(event.target.result)
        const sheets = wb.SheetNames

        if (sheets.length) {
          // แปลง sheet เป็น json
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], { header: 1 })
          const fileHeaders = rows[0] // header ของไฟล์
          // console.log('File Headers:', fileHeaders)

          // ตรวจสอบว่า header ในไฟล์ตรงกับที่เราคาดหวังหรือไม่
          const isHeaderValid = expectedHeaders.every(
            (header, index) => header === fileHeaders[index]
          )

          if (!isHeaderValid) {
            toast.warning(`กรุณาตรวจสอบไฟล์ข้อมูลให้ตรง ${expectedHeaders}`)
            toast(`เริ่มต้นกำหนด "A1" [date_added] ปี-เดือน-วัน`)
            return
          }

          // ลบแถว header ก่อน dispatch ข้อมูล
          const dataRows = rows.slice(1)
          const formattedData = dataRows.map((row) => ({
            date_added: row[0],
            code: row[1],
            name: row[2],
            price: row[3],
            stock_quantity: row[4],
            cost: row[5],
          }))

          // dispatch ข้อมูลไปยัง store หรืออื่นๆ
          dispatch(onImport(formattedData))
          handleClickOpen()
        }
      }

      fileReader.readAsArrayBuffer(file)
    }
  }

  const exportFileExcel = async () => {
    try {
      const headings = [
        [
          'ไอดี',
          'รหัสสินค้า',
          'สินค้า',
          'ราคา',
          'จำนวน',
          'ต้นทุน',
          'CF',
          'จ่ายแล้ว',
        ],
      ]

      const wb = utils.book_new()
      const ws = utils.json_to_sheet([])

      // เพิ่ม headings ก่อนที่จะกำหนดสไตล์
      utils.sheet_add_aoa(ws, headings)

      // TODO: ดึงข้อมูลจาก api มาเพิ่มใน sheet
      const productsData = products.map((p) => ({
        ไอดี: p._id,
        รหัสสินค้า: p.code,
        สินค้า: p.name,
        ราคา: p.price,
        จำนวน: p.stock_quantity,
        ต้นทุน: p.cost,
        CF: p.cf,
        จ่ายแล้ว: p.paid,
      }))

      // เพิ่มข้อมูลใน sheet
      utils.sheet_add_json(ws, productsData, {
        origin: 'A2',
        skipHeader: true,
      })

      // เพิ่ม worksheet ใน workbook
      utils.book_append_sheet(wb, ws, 'Products Report')

      // เขียนไฟล์ Excel
      writeFile(wb, 'Products_Report.xlsx')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการ export file')
    }
  }

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
                    <Typography sx={{ fontWeight: 'bold' }}>ราคา</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>จำนวน</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>ต้นทุน</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>CF</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      จ่ายแล้ว
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold', color: 'green' }}>
                      คงเหลือ
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
                        onChange={() => setSelectItem(true)}
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
                    <TableCell>
                      {product.price
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </TableCell>

                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      {product.cost
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </TableCell>
                    <TableCell>{product.cf}</TableCell>
                    <TableCell>{product.paid}</TableCell>
                    <TableCell>{product.remaining_cf}</TableCell>
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
    setPage(value) // อัปเดตหน้าปัจจุบัน
    navigate(`?page=${value}`) // ปรับ URL ให้ตรงกับหน้าปัจจุบัน
  }

  const saveProductsToImport = () => {
    // ตรวจสอบข้อมูลก่อนส่ง
    if (!productsToImport || productsToImport.length === 0) {
      toast.error('ไม่มีข้อมูลสำหรับการนำเข้า')
      return
    }

    // console.log(productsToImport)

    fetch(`${baseURL}/api/product/excel/import`, {
      method: 'POST',
      body: JSON.stringify(productsToImport),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        // ตรวจสอบสถานะ response ก่อนแปลงเป็น JSON
        if (!res.ok) {
          throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
        }
        return res.json()
      })
      .then((data) => {
        // console.log(data)
        toast.success('บันทึกข้อมูลสำเร็จ')
        handleClose()
        dispatch(clearImport())
        navigate('/stock')
      })
      .catch((err) => {
        toast.warning(มีรหัสโค้ดสินค้าซ้ำกับสินค้าที่มีอยู่)
      })
  }

  const onSubmitForm = (event) => {
    event.preventDefault()

    const fd = new FormData(form.current)
    const fe = Object.fromEntries(fd.entries())

    if (Object.keys(fe).length === 0) {
      toast.warning('กรุณาเลือกรายการที่ต้องการลบ')
      return
    }

    if (!window.confirm('ยืนยันการลบรายการนี้')) {
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

      <Grid container spacing={1}>
        {/* Search Params 'q' */}
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
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
                sx={{ width: 190 }}
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

        {/* Export / Import File Excel */}
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          container
          alignItems="center"
          justifyContent="center"
        >
          <input
            type="file"
            name="file"
            id="upload-button-file"
            style={{ display: 'none' }}
            onChange={importFileExcel}
          />
          <label htmlFor="upload-button-file">
            <Button
              startIcon={<PublishIcon />}
              variant="contained"
              component="span"
              color="inherit"
            >
              Import
            </Button>
            {/* Dialog Import Product */}
            <Dialog onClose={handleClose} open={isOpen}>
              <DialogTitle>Import Products</DialogTitle>
              <TableContainer sx={{ pt: 0 }} component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>วันที่</strong>
                      </TableCell>
                      <TableCell>
                        <strong>รหัส</strong>
                      </TableCell>
                      <TableCell>
                        <strong>ชื่อ</strong>
                      </TableCell>
                      <TableCell>
                        <strong>ราคา</strong>
                      </TableCell>
                      <TableCell>
                        <strong>จำนวน</strong>
                      </TableCell>
                      <TableCell>
                        <strong>ต้นทุน</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsToImport.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.date_added}</TableCell>
                        <TableCell>{p.code}</TableCell>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.price}</TableCell>
                        <TableCell>{p.stock_quantity}</TableCell>
                        <TableCell>{p.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid
                container
                spacing={2}
                justifyContent="flex-end"
                sx={{ mt: 2 }}
              >
                <Grid item>
                  <Button type="button" onClick={handleClose}>
                    ยกเลิก
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="button" onClick={saveProductsToImport}>
                    บันทึก
                  </Button>
                </Grid>
              </Grid>
            </Dialog>
          </label>
          &nbsp;
          <Button
            type="button"
            variant="contained"
            color="inherit"
            onClick={exportFileExcel}
            startIcon={
              <img
                src={excelIcon} // แทนที่ด้วย URL ของรูปภาพที่คุณต้องการใช้
                alt="Export"
                style={{ width: '24px', height: '24px' }} // ปรับขนาดและระยะห่างตามต้องการ
              />
            }
          >
            Export
          </Button>
        </Grid>

        {/* CRUD Buttons */}
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            <FaPlus color="blue" />
            &nbsp;เพิ่ม
          </Button>
          &nbsp;
          {selectItem && (
            <>
              <Button onClick={onEditClick} variant="contained" color="warning">
                <MdEdit color="orange" />
                &nbsp;แก้ไข
              </Button>
              &nbsp;
              <Button variant="contained" color="error" onClick={onSubmitForm}>
                <MdDeleteForever color="white" />
                &nbsp;ลบ
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      <>{data}</>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <Stack spacing={2}>
          <Pagination
            count={totalPages} // Total pages from API
            page={page} // Current page
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
          page={page}
        />
      )}
      {isOpenEdit && (
        <ProductEdit
          isOpenEdit={isOpenEdit}
          setOpenEdit={setOpenEdit}
          idEdit={idEdit}
          setSelectItem={setSelectItem}
        />
      )}
    </>
  )
}

export default Stock
