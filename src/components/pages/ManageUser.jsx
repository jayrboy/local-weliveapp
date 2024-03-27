import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'

const ManageUser = () => {
  const role = ['admin', 'user']
  let [data, setData] = useState([])
  const { user } = useSelector((state) => state.user)
  // const dispatch = useDispatch()

  useEffect(() => {
    loadData(user.token)
  }, [])

  const loadData = async (authToken) => {
    await axios
      .get('/api/users', {
        headers: { authToken },
      })
      .then((result) => {
        // console.log(result.data)
        setData(result.data)
      })
      .catch((err) => console.log(err))
  }

  const changeRole = async (authToken, data) => {
    await axios.post(
      '/api/user/change-role',
      { data },
      {
        headers: { authToken },
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
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>username</TableCell>
              <TableCell>role</TableCell>
              <TableCell>create</TableCell>
              <TableCell>last update</TableCell>
              <TableCell>action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ? data.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>
                      <Select
                        value={item.role}
                        onChange={(event) => onChangeRole(item._id, event)}
                        style={{ width: '100px' }}
                      >
                        {role.map((item, i) => (
                          <MenuItem key={i + 1} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>{item.updatedAt}</TableCell>

                    <TableCell>
                      <DeleteForeverIcon color="error" />
                    </TableCell>

                    {/* <TableCell>
                      <Link to={'/edit/' + item._id}>
                        <EditIcon />
                      </Link>
                    </TableCell> */}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default ManageUser
