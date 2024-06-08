import { baseURL } from '../../../../App'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { MdEdit, MdDelete } from 'react-icons/md'

import { useSelector, useDispatch } from 'react-redux'
import {
  getDaily,
  calTotals,
  deletedProduct,
  updateDailyStockStatus,
  updatePriceTotal,
} from '../../../../redux/dailyStockSlice'

import { SiFacebooklive } from 'react-icons/si'

import DailyProductEdit from '../daily/DailyProductEdit'

const DailyEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const form = useRef()
  const token = localStorage.getItem('token')
  let status = ['new', 'clear']

  let { dailyStock, total } = useSelector((store) => store.dailyStock)
  const dispatch = useDispatch()

  let [isOpenEdit, setOpenEdit] = useState(false)
  let [index, setIndex] = useState(0)

  useEffect(() => {
    dispatch(calTotals())
  }, [dailyStock])

  useEffect(() => {
    dispatch(getDaily(id))
  }, [])

  useEffect(() => {
    dispatch(updatePriceTotal(total))
  }, [total])

  const onSubmitForm = (e) => {
    e.preventDefault()

    // console.log(dailyStock.price_total)

    fetch(`${baseURL}/api/daily/update`, {
      method: 'PUT',
      body: JSON.stringify(dailyStock),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        toast.success('แก้ไขข้อมูลสำเร็จ')
        navigate('/admin/daily-stock')
      })
      .catch((err) => toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก'))
  }

  const onEditClick = (e) => {
    e.preventDefault()

    const selectedInput = document.querySelector('input[name="index"]:checked')

    if (selectedInput) {
      setOpenEdit(true)
      const index = selectedInput.value
      setIndex(index)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการแก้ไข')
    }
  }

  const onDeleteClick = () => {
    const selectedInput = document.querySelector('input[name="index"]:checked')

    if (!selectedInput) {
      toast.warning('กรุณาเลือกรายการที่ต้องการลบ')
      return
    }

    let index = selectedInput.value
    dispatch(deletedProduct(index))

    console.log('delete selected')
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    dispatch(updateDailyStockStatus(newStatus))
  }

  let dt = new Date(Date.parse(dailyStock.date_added))
  let df = (
    <>
      {dt.getDate()}-{dt.getMonth() + 1}-{dt.getFullYear()}
    </>
  )

  return (
    <>
      <div className="px-1 mt-1">
        <div className="card shadow mx-auto rounded" style={{ width: '100%' }}>
          <form ref={form} onSubmit={onSubmitForm}>
            {/* Card Header */}
            <header className="card-header d-flex justify-content-start align-items-center p-3">
              วันที่:&nbsp;
              <span className="text-primary" name="date_added">
                {df}
              </span>
            </header>
            <div className="container">
              <div className="row">
                <div className="col-6 d-flex align-items-center">
                  Status:&nbsp;
                  <select
                    name="status"
                    className="btn btn-sm btn-light border text-capitalize"
                    defaultValue={dailyStock.status}
                    onChange={handleStatusChange} // เพิ่มการจัดการการเปลี่ยนแปลง
                    style={{ height: '30px' }}
                  >
                    {status.map((item, i) => (
                      <option key={i + 1} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6 d-flex justify-content-end align-items-center">
                  Chanel:&nbsp;
                  {dailyStock.chanel && <SiFacebooklive size={45} />}
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="table-responsive px-2">
              <table className="table table-sm table-striped text-center table-bordered border-light table-hover">
                <caption className="ms-3">
                  {dailyStock.length === 0 ? (
                    <>ไม่พบข้อมูล</>
                  ) : (
                    <>
                      <small>
                        พบข้อมูลทั้งหมด{' '}
                        {dailyStock.products.length
                          ? dailyStock.products.length
                          : 0}{' '}
                        รายการ
                      </small>
                    </>
                  )}
                </caption>
                <thead className="table-light">
                  <tr>
                    <th>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border"
                        onClick={onEditClick}
                      >
                        <MdEdit color="orange" />
                      </button>
                    </th>
                    <th>รหัส</th>
                    <th>สินค้า</th>
                    <th>จำนวน</th>
                    <th>limit</th>
                    <th>ราคา</th>
                    <th>คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStock.products &&
                    dailyStock.products.map((p, index) => {
                      // console.log(p)
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="radio"
                              name="index"
                              defaultValue={index}
                              className="form-check-input"
                            />
                          </td>
                          <td>{p.code}</td>
                          <td>{p.name}</td>
                          <td>{p.stock_quantity}</td>
                          <td>{p.limit}</td>
                          <td>{p.price}</td>
                          <td>{p.remaining}</td>
                        </tr>
                      )
                    })}
                  <tr>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border"
                        onClick={onDeleteClick}
                      >
                        <MdDelete color="red" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="text-end container">
              <label className="form-label">ยอดรวม&nbsp;&nbsp;</label>
              <span>
                {total.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                &nbsp;&nbsp;&nbsp;บาท
              </span>
            </div>
            {/* Footer Button */}
            <footer className="d-flex justify-content-center p-4">
              <button type="submit" className="btn btn-light btn-sm border">
                ยืนยัน
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                className="btn btn-sm"
                onClick={() => navigate('/admin/daily-stock')}
              >
                ยกเลิก
              </button>
            </footer>
          </form>
        </div>
      </div>
      {isOpenEdit && (
        <DailyProductEdit
          isOpenEdit={isOpenEdit}
          setOpenEdit={setOpenEdit}
          index={index}
        />
      )}
    </>
  )
}
export default DailyEdit
