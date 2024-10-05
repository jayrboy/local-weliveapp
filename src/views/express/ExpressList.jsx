import { baseURL } from '../../App'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

import { MdGrid3X3 } from 'react-icons/md'

import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

import { Button, Checkbox, TextField, Radio } from '@mui/material'
import { toast } from 'react-toastify'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function ExpressList() {
  let [data, setData] = useState('')
  const form = useRef(null)
  const exname = useRef(null)
  const fprice = useRef(null)
  // const sprice = useRef()
  // const maxprice = useRef()
  // const whenfprice = useRef()
  const date_start = useRef()
  const token = localStorage.getItem('token')
  let [selectedId, setSelectedId] = useState('')
  let [expressName, setExpressName] = useState('')
  let [expressUrl, setExpressUrl] = useState('')

  useEffect(() => {
    fetch(`${baseURL}/api/ex/read`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }) //อ่านข้อมูลมาแสดงผล
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          showData(result)
        } else {
          setData(<>ไม่มีรายการข้อมูล</>)
        }
      })
      .catch((e) => alert(e))
  }, [selectedId])

  //เมื่อ radio บนรายการใดถูกคลิก (ในที่นี้เลือกใช้ click แทน change)
  //ก็อ่านข้อมูลในแต่ละฟิลต์จาก document ที่ผ่านเข้ามา แล้วเติมลงในฟอร์ม
  const onClickRadio = (doc) => {
    setSelectedId(doc._id)
    setExpressUrl(doc.expressUrl)
    setExpressName(doc.exname)
    try {
      exname.current.value = doc.exname
      fprice.current.value = doc.fprice
      // sprice.current.value = doc.sprice
      // maxprice.current.value = doc.maxprice
      // whenfprice.current.value = doc.whenfprice
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
    } catch (error) {
      console.log('Error Radio :', error)
    }
  }

  const onClickStatus = (doc) => {
    fetch(`${baseURL}/api/ex/select`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    })
      .then((res) => res.json())
      .then((data) => showData(data))
      .catch((error) => toast.error('Changed Status Error'))
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    // if (!window.confirm('ยืนยันการแก้ไขรายการนี้')) {
    //   return
    // }
    const fd = new FormData(form.current)
    fd.append('_id', selectedId)
    fd.append('expressUrl', expressUrl)
    fd.append('exname', expressName)

    const fe = Object.fromEntries(fd.entries())
    // console.log('Submit :', fe)

    fetch(`${baseURL}/api/ex/update`, {
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
          toast.success('บันทึกข้อมูลสำเร็จ')
        }
      })
      .catch((err) => toast.warning('แก้ไขข้อมูลไม่สำเร็จ'))
  }

  const showData = (data) => {
    let updateForm = (
      <div className="position-relative m-3">
        {/* {selectedId && (
          <div className="d-flex justify-content-end mb-2">
            <Link to="/express/delete">
              <Button variant="contained" color="error">
                ลบขนส่งออก
              </Button>
            </Link>

            <Link to="/express/create" className="ms-3">
              <Button variant="contained" color="primary">
                เพิ่มขนส่งใหม่
              </Button>
            </Link>
          </div>
        )} */}
        <form onSubmit={onSubmitForm} ref={form}>
          <TableContainer component={Paper}>
            <Table>
              <caption className="ms-3">
                <small>
                  เลือกรายการที่จะแก้ไข แล้วใส่ข้อมูลใหม่ลงไป จากนั้นคลิกปุ่ม
                  แก้ไข
                </small>
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <MdGrid3X3 />
                  </TableCell>
                  <TableCell>
                    <strong>ชื่อขนส่ง</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ค่าส่งเริ่มต้น</strong>
                  </TableCell>
                  <TableCell className="text-center">
                    <strong>สถานะ</strong>
                  </TableCell>
                  {/* <TableCell>
                    <strong>ค่าส่งชิ้นต่อไป</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ค่าส่งสูงสุด</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ส่งฟรีต่อเมื่อยอดถึง</strong>
                  </TableCell>
                  <TableCell>
                    <strong>วันที่เริ่มใช้</strong>
                  </TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((doc) => {
                  let dt = new Date(Date.parse(doc.date_start))
                  let df = (
                    <>
                      {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
                    </>
                  )

                  return (
                    <StyledTableRow key={doc._id}>
                      {/* เมื่อคลิก radio บนรายการใด เราก็แนบ document ของรายการนั้น
                          ไปยังฟังก์ชันเป้าหมาย เพื่อใช้ในการอ่านข้อมูลจากแต่ละฟิลด์ไปแสดงที่ฟอร์ม
                      */}
                      <TableCell sx={{ width: '150px' }}>
                        <Radio
                          color="primary"
                          checked={selectedId === doc._id}
                          onChange={() => onClickRadio(doc)}
                          value={doc._id}
                        />
                      </TableCell>

                      <TableCell>{doc.exname}</TableCell>
                      <TableCell>{doc.fprice}</TableCell>
                      {/* <TableCell>{doc.sprice}</TableCell>
                      <TableCell>{doc.maxprice}</TableCell>
                      <TableCell>{doc.whenfprice}</TableCell>
                      <TableCell>{df}</TableCell> */}
                      <TableCell className="text-center">
                        {doc.isSelectEx ? (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => onClickStatus(doc)}
                          >
                            กำลังใช้งาน
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            color="inherit"
                            onClick={() => onClickStatus(doc)}
                          >
                            ไม่ได้ใช้งาน
                          </Button>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  )
                })}

                {/* สร้างฟอร์มไว้ที่แถวสุดท้าย */}
                {selectedId && (
                  <TableRow>
                    <TableCell>
                      <Button type="submit" variant="contained" color="warning">
                        แก้ไข
                      </Button>
                    </TableCell>

                    <TableCell>
                      <input
                        type="text"
                        name="exname"
                        placeholder="ชื่อขนส่ง"
                        ref={exname}
                        className="form-control form-control-sm"
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        name="fprice"
                        placeholder="ค่าส่งเริ่มต้น"
                        ref={fprice}
                        className="form-control form-control-sm"
                      />
                    </TableCell>

                    {/* <TableCell>
                    <input
                      type="number"
                      name="sprice"
                      placeholder="ค่าส่งชิ้นต่อไป"
                      ref={sprice}
                      className="form-control form-control-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      name="maxprice"
                      placeholder="ค่าส่งสูงสุด"
                      ref={maxprice}
                      className="form-control form-control-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      name="whenfprice"
                      placeholder="ส่งฟรีเมื่อยอดถึง"
                      ref={whenfprice}
                      className="form-control form-control-sm"
                    />
                  </TableCell> */}

                    <TableCell>
                      <input
                        type="date"
                        name="date_start"
                        ref={date_start}
                        className="form-control form-control-sm"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </div>
    )

    setData(updateForm)
  }

  return (
    <>
      <div className="row m-3">
        <div className="col-lg-4">
          <h3 className="text-start">
            <Link to="/admin/home" className="text-decoration-none">
              WE LIVE |
            </Link>{' '}
            <span className="text-success"> Express List </span>
          </h3>
        </div>
      </div>
      <>{data}</>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/dashboard" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </>
  )
}
