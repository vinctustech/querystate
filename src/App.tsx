import { Select, Card, Space } from 'antd'
import { useSearchParams } from 'react-router-dom'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedItems = searchParams.getAll('items')

  const handleChange = (values: string[]) => {
    searchParams.delete('items')

    values.forEach((value) => {
      searchParams.append('items', value)
    })

    setSearchParams(searchParams)
  }

  return (
    <Card title="URL Query Parameters Test">
      <Space direction="vertical">
        <div>
          <h4>Multi-Select with useSearchParams</h4>
          <Select
            mode="multiple"
            placeholder="Select items"
            allowClear
            style={{ width: 300 }}
            value={selectedItems}
            onChange={handleChange}
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' },
              { value: 'c', label: 'Option C' },
              { value: 'd', label: 'Option D' },
            ]}
          />
        </div>

        <div>
          <h4>Current URL Parameters:</h4>
          <pre>{window.location.search}</pre>
        </div>

        <div>
          <h4>Selected Values:</h4>
          <pre>{JSON.stringify(selectedItems, null, 2)}</pre>
        </div>
      </Space>
    </Card>
  )
}

export default App
