import { baseURL } from '../../App'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import {
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  styled,
  Button,
  Radio,
  TextField,
} from '@mui/material'
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

export default function ExpressDelete() {
  let [selectedId, setSelectedId] = useState('')
  let [data, setData] = useState('')
  const form = useRef()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`${baseURL}/api/ex/read`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((docs) => {
        if (docs.length > 0) {
          showData(docs)
        } else {
          setData(<>ไม่มีรายการข้อมูล</>)
        }
      })
      .catch((err) => alert(err))
    // eslint-disable-next-line
  }, [selectedId])

  const showData = (result) => {
    let deleteForm = (
      <>
        <div className="row m-3">
          <div className="col-lg-4">
            <h3 className="text-start">
              <Link to="/admin/home" className="text-decoration-none">
                WE LIVE |
              </Link>{' '}
              <span className="text-success"> ลบขนส่ง</span>
            </h3>
          </div>
        </div>

        <div className="position-relative m-3">
          <form onSubmit={onSubmitForm} ref={form}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>แก้ไข</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ชื่อขนส่ง</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ค่าส่งเริ่มต้น</strong>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {result.map((doc) => {
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
                        <TableCell>
                          <Radio
                            color="primary"
                            checked={selectedId == doc._id}
                            onChange={() => setSelectedId(doc._id)}
                            value={doc._id}
                          />
                        </TableCell>

                        <TableCell>{doc.exname}</TableCell>
                        <TableCell>{doc.fprice}</TableCell>
                        <TableCell>{doc.sprice}</TableCell>
                        <TableCell>{doc.maxprice}</TableCell>
                        <TableCell>{doc.whenfprice}</TableCell>
                        <TableCell>{df}</TableCell>
                      </StyledTableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <div className=" text-center">
              <button className="btn btn-danger btn-sm ">
                ลบรายการที่เลือก
              </button>
            </div>
          </form>
        </div>
      </>
    )

    setData(deleteForm)
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    if (!window.confirm('ยืนยันการลบรายการนี้')) {
      return
    }

    const fd = new FormData(form.current)
    fd.append('_id', selectedId)
    const fe = Object.fromEntries(fd.entries())

    if (Object.keys(fe).length === 0) {
      alert('ต้องเลือกรายการที่จะลบ')
      return
    }

    fetch(`${baseURL}/api/ex/delete`, {
      method: 'POST',
      body: JSON.stringify(fe),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          toast.error('เกิดข้อผิดพลาด')
        } else {
          if (result.length === 0) {
            setData('ไม่มีรายการข้อมูล')
          } else {
            showData(result)
          }
          toast.success('ลบข้อมูลสำเร็จ')
        }
        navigate('/express/delete')
      })
      .catch((err) => toast.error('โปรดติดต่อทีมงาน'))
  }

  return <>{data}</>
}
