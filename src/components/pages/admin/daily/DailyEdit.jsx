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
} from '../../../../redux/dailyStockSlice'

import { SiFacebooklive } from 'react-icons/si'

import DailyProductEdit from '../daily/DailyProductEdit'

const DailyEdit = () => {
  let { dailyStock, total } = useSelector((store) => store.dailyStock)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useRef()
  let [isOpenEdit, setOpenEdit] = useState(false)
  let [idEdit, setIdEdit] = useState('')
  let [idProduct, setIdProduct] = useState('')

  let status = ['new', 'clear']
  const { id } = useParams()

  useEffect(() => {
    dispatch(calTotals())
  }, [dailyStock])

  useEffect(() => {
    if (!isOpenEdit) {
      dispatch(getDaily(id))
      setIdEdit(id)
    }
  }, [isOpenEdit])

  const onSubmitForm = (e) => {
    e.preventDefault()
    const data = {
      id: id,
      total: total,
    }
    fetch(`${baseURL}/api/daily/update/total`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        toast.success('ข้อมูลถูกจัดเก็บแล้ว')
        navigate('/admin/daily-stock')
      })
      .catch((err) => toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก'))
  }

  const onEditClick = (e) => {
    e.preventDefault()
    const selectedInput = document.querySelector('input[name="_id"]:checked')
    if (selectedInput) {
      setOpenEdit(true)
      const _id = selectedInput.value
      setIdProduct(_id)
      // navigate(`/product/edit/${id}`)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการแก้ไข')
    }
  }

  const onDeleteClick = (e) => {
    e.preventDefault()

    const selectedInput = document.querySelector('input[name="_id"]:checked')
    if (!selectedInput) {
      toast.warning('กรุณาเลือกรายการที่ต้องการลบ')
      return
    }

    const idP = selectedInput.value
    // console.log(idP)

    fetch(`${baseURL}/api/daily/delete/product/${idP}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((result) => {
        toast.success(result)
        dispatch(deletedProduct(idP))
        navigate(`/admin/daily-stock/edit/${id}`)
      })
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
              <strong className="text-primary">{df}</strong>
            </header>
            <div className="container">
              <div className="row">
                <div className="col-6 d-flex align-items-center">
                  Status:&nbsp;
                  <select
                    className="btn btn-sm btn-light border text-capitalize"
                    name="status"
                    defaultValue={dailyStock.status}
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
                        className="btn btn-sm btn-light border"
                        onClick={onEditClick}
                      >
                        <MdEdit color="orange" />
                      </button>
                    </th>
                    <th>รหัส</th>
                    <th>สินค้า</th>
                    <th>สินค้าที่มี</th>
                    <th>limit</th>
                    <th>ราคา</th>
                    <th>เหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStock.products &&
                    dailyStock.products.map((p, index) => {
                      // console.log(p)
                      return (
                        <tr key={index + 1}>
                          <td>
                            <input
                              type="radio"
                              name="_id"
                              defaultValue={p._id}
                              className="form-check-input"
                            />
                          </td>
                          <td>{p.code}</td>
                          <td>{p.name}</td>
                          <td>{p.stock}</td>
                          <td>{p.limit}</td>
                          <td>{p.price}</td>
                          <td>{p.remaining}</td>
                        </tr>
                      )
                    })}
                  <tr>
                    <td>
                      <button
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
          idEdit={idEdit}
          idProduct={idProduct}
        />
      )}
    </>
  )
}
export default DailyEdit
