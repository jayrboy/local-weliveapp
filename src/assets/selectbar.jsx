import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function SelectVariants() {
  const [express, setAge] = React.useState('')

  const handleChange = (event) => {
    setAge(event.target.value)
  }

  return (
    <div>
      <FormControl variant="standard" sx={{ width: '500px' }}>
        <InputLabel id="demo-simple-select-standard-label">
          เลือกขนส่ง
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={express}
          onChange={handleChange}
        >
          <MenuItem value={1}>Standard</MenuItem>
          <MenuItem value={2}>Flash</MenuItem>
          <MenuItem value={3}>Kerry</MenuItem>
          <MenuItem value={4}>J&T</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
