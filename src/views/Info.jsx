import { Link } from 'react-router-dom'

const Info = () => {
  return (
    <div className="mt-5 text-center">
      <h1>วิธีการใช้งาน</h1>
      <br />
      <div className="d-flex justify-content-center mx-auto">
        <Link to="/admin/home" className="btn btn-light btn-sm">
          หน้าหลัก
        </Link>
      </div>
    </div>
  )
}
export default Info
