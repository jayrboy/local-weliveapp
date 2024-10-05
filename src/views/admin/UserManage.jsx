import { baseURL } from '../../App'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

import {
  Box,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import StarsIcon from '@mui/icons-material/Stars'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const UserManage = () => {
  const role = ['admin', 'user']
  let [data, setData] = useState([])
  const { user } = useSelector((state) => state.user)
  // const dispatch = useDispatch()
  // console.log(data)

  useEffect(() => {
    loadData(user.token)
  }, [])

  const loadData = async (authToken) => {
    await axios
      .get(`${baseURL}/api/users`, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then((result) => {
        // console.log(result.data)
        setData(result.data)
      })
      .catch((err) => console.log(err))
  }

  const changeRole = async (authToken, data) => {
    await axios.post(
      `${baseURL}/api/user/change-role`,
      { data },
      {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      }
    )
  }

  const onChangeRole = (id, event) => {
    // console.log(id, event.target.value)

    const newRole = {
      id: id,
      role: event.target.value,
    }
    changeRole(user.token, newRole)
      .then(() => loadData(user.token))
      .catch((err) => console.log(err))
  }

  return (
    <div className="m-3">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <caption>พบข้อมูลทั้งหมด {data.length} รายการ</caption>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>บัญชีผู้ใช้</strong>
              </TableCell>
              <TableCell>
                <strong>ชื่อ Facebook</strong>
              </TableCell>
              <TableCell>
                <strong>บทบาท</strong>
              </TableCell>
              <TableCell>
                <strong>วันที่สร้าง</strong>
              </TableCell>
              <TableCell>
                <strong>เข้าใช้งานล่าสุด</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ? data.map((item, index) => {
                  let cdt = new Date(Date.parse(item.createdAt))
                  let cdf = (
                    <>
                      {cdt.getDate()}-{cdt.getMonth() + 1}-{cdt.getFullYear()}
                    </>
                  )
                  let udt = new Date(Date.parse(item.updatedAt))
                  let udf = (
                    <>
                      {udt.getDate()}-{udt.getMonth() + 1}-{udt.getFullYear()}
                    </>
                  )
                  return (
                    <StyledTableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{item.username}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar src={item.picture[0].data.url} />
                          <Typography noWrap ml={2}>
                            {item.name}
                            &nbsp;
                            {item.role === 'admin' && (
                              <Tooltip title="แอดมิน">
                                <StarsIcon color="warning" fontSize="small" />
                              </Tooltip>
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.role}
                          onChange={(event) => onChangeRole(item._id, event)}
                          style={{ width: '91px', height: '30px' }}
                        >
                          {role.map((item, i) => (
                            <MenuItem key={i + 1} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>{cdf}</TableCell>
                      <TableCell>{udf}</TableCell>

                      {/* <TableCell>
                      <DeleteForeverIcon color="error" />
                    </TableCell> */}

                      {/* <TableCell>
                      <Link to={'/edit/' + item._id}>
                        <EditIcon />
                      </Link>
                    </TableCell> */}
                    </StyledTableRow>
                  )
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default UserManage
