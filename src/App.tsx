import { useState } from 'react'
import { Select, Card, Space } from 'antd'

function App() {
  const [sel1, setSel1] = useState()
  const [sel2, setSel2] = useState()

  return (
    <Card>
      <Space>
        <Select
          placeholder="sel1"
          allowClear
          style={{ width: 120 }}
          value={sel1}
          onChange={setSel1}
          options={[
            { value: 'a', label: 'a' },
            { value: 'b', label: 'b' },
            { value: 'c', label: 'c' },
          ]}
        ></Select>
        <Select
          mode="multiple"
          placeholder="sel2"
          allowClear
          style={{ width: 120 }}
          value={sel2}
          onChange={setSel2}
          options={[
            { value: 'a', label: 'a' },
            { value: 'b', label: 'b' },
            { value: 'c', label: 'c' },
          ]}
        ></Select>
      </Space>
    </Card>
  )
}

export default App
