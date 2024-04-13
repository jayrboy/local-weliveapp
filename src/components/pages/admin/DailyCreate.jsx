import { baseURL } from '../../../App'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'
import { MdEdit, MdDelete, MdGrid3X3 } from 'react-icons/md'

import { useSelector, useDispatch } from 'react-redux'
import {
  getProducts,
  calTotals,
  deletedProduct,
  editedProduct,
} from '../../../redux/productSlice'

import ProductEdit from './ProductEdit'

const DailyCreate = () => {
  let { products, total } = useSelector((store) => store.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useRef()
  const code = useRef()
  const name = useRef()
  const stock = useRef()
  const limit = useRef()
  const price = useRef()
  const remaining = useRef()
  let [isOpenEdit, setOpenEdit] = useState(false)
  let [idEdit, setIdEdit] = useState('')

  useEffect(() => {
    dispatch(calTotals())
  }, [products])

  useEffect(() => {
    dispatch(getProducts())
  }, [])

  const onSubmitForm = () => {
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    fetch(`${baseURL}/api/daily/create`, {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((result) => {
        if (result === 'true') {
          form.current.reset()
          toast.success('ข้อมูลถูกจัดเก็บแล้ว')
          navigate('/admin/stock')
        } else {
          toast.error('เกิดข้อผิดพลาด ข้อมูลไม่ถูกบันทึก')
        }
      })
      .catch((e) => toast.error(e))
  }

  const onEditClick = (e) => {
    e.preventDefault()
    const selectedInput = document.querySelector('input[name="_id"]:checked')
    if (selectedInput) {
      setOpenEdit(true)
      const id = selectedInput.value
      setIdEdit(id)
      // navigate(`/product/edit/${id}`)
    } else {
      toast.warning('กรุณาเลือกรายการที่ต้องการแก้ไข')
    }
  }

  return (
    <>
      <div className="px-1 mt-1">
        <div className="card shadow mx-auto rounded" style={{ width: '100%' }}>
          <form ref={form} onSubmit={onSubmitForm}>
            {/* Card Header */}
            <header className="card-header d-flex justify-content-between align-items-center p-3">
              <h4>DAILY / เพิ่มรายการไลฟ์สด</h4>
              <button
                className="btn btn-sm"
                onClick={() => navigate('/admin/daily-stock')}
              >
                <CloseIcon sx={{ color: 'red' }} />
              </button>
            </header>

            <div className="row p-4">
              <div className="col-sm-4">
                <label className="form-label">วันที่</label>
                <input
                  type="Date"
                  name="date_added"
                  className="form-control form-control-sm mb-3"
                />
              </div>
              <div className="col-sm-4">
                <label className="form-label">สถานะ</label>
                <select className="form-select form-select-sm">
                  <option value="new" name="new">
                    New
                  </option>
                  <option value="clear" name="clear">
                    Clear
                  </option>
                </select>
              </div>
              <div className="col-sm-4">
                <label className="form-label">Chanel</label>
                <select className="form-select form-select-sm">
                  <option value="facebook" name="facebook">
                    Facebook
                  </option>
                </select>
              </div>
            </div>
            {/* Table */}
            <div className="table-responsive">
              <table className="table table-sm table-striped text-center table-bordered border-light">
                <thead className="table-light">
                  <tr>
                    <th>
                      <button
                        className="btn btn-sm btn-light"
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    return (
                      <tr key={p._id}>
                        <td>
                          <input
                            type="radio"
                            name="_id"
                            value={p._id}
                            className="form-check-input"
                          />
                        </td>
                        <td>
                          <div>{p.code}</div>
                        </td>
                        <td>{p.name}</td>
                        <td>{p.stock}</td>
                        <td>{p.limit}</td>
                        <td>{p.price}</td>
                        <td>{p.remaining}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-light"
                            onClick={() => dispatch(deletedProduct(p._id))}
                          >
                            <MdDelete color="red" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Total */}
            <div className="row p-4">
              <div className="col-sm-8">
                <label className="form-label">ราคารวมจำนวนสินค้าทั้งหมด</label>
              </div>
              <div className="col-sm-4">
                <span>
                  {total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}{' '}
                  บาท
                </span>
              </div>
            </div>
            {/* Footer Button */}
            <footer className="d-flex justify-content-center p-4">
              <button type="submit" className="btn btn-light btn-sm">
                เพิ่มรายการไลฟ์สด
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
      {isOpenEdit ? (
        <ProductEdit
          isOpenEdit={isOpenEdit}
          setOpenEdit={setOpenEdit}
          idEdit={idEdit}
        />
      ) : (
        ''
      )}
    </>
  )
}
export default DailyCreate
