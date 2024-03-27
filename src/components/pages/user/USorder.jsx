import { Link } from 'react-router-dom'
import { productList } from '../../../data'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'

export default function USorder() {
  return (
    <>
      <div className=" position-relative mt-5 ">
        <h3 className=" m-3">
          <span>We Live</span>
          <span className=" text-success ms-2">
            | ตระกร้าสินค้าของคุณ
            <ShoppingCartIcon />
          </span>
        </h3>
      </div>
      <div className="card mt-5 mx-auto p-4 rounded">
        <table className="table table-striped table-sm">
          <thead className="table-success">
            <tr>
              <td className="text-center">เลขสินค้าที่คอมเม้นท์</td>
              <td className="text-center">ชื่อสินค้า</td>
              <td className="text-center">จำนวน</td>
              <td className="text-center">ราคา</td>
              <td className="text-center">ยอดสั่งซื้อ</td>
              <td className="text-center"></td>
            </tr>
          </thead>

          <tbody className="table-group-divider">
            {productList.map((product) => {
              // คำนวณค่า itempr * among - discount

              return (
                <tr key={product.id}>
                  <td className="text-center"># {product.from.CFcode}</td>
                  <td className="text-center"> {product.from.proName} </td>
                  <td className="text-center"> {product.from.proAmount} </td>
                  <td className="text-center"> {product.from.proPrice} </td>
                  <td className="text-center text-danger">
                    {product.from.proSum}{' '}
                  </td>
                  <td>
                    <div>
                      <button className="btn btn-sm btn-danger">
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="text-center">
          <button className="text-white btn btn-success btn-sm">
            ชำระเงิน
          </button>
        </div>
      </div>

      <div className=" align-items-center text-center mt-3">
        <Link
          to="/user/home"
          className="btn btn-sm btn-outline-light text-dark border-3 border-primary text-center  "
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </>
  )
}
