// App.tsx
import { Select, Card, Space, Divider, Typography } from 'antd'
import { useQueryState } from './useQueryState'

const { Title, Text } = Typography

function App() {
  // Define our schema for URL parameters
  const queryState = useQueryState({
    category: { type: 'single' },
    tags: { type: 'array' },
  })

  return (
    <Card title="URL Query Parameters Demo">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Single Select (Category)</Title>
          <Select
            placeholder="Select a category"
            allowClear
            style={{ width: 300 }}
            value={queryState.category.value}
            onChange={(value) => queryState.category.setValue(value)}
            options={[
              { value: '123e4567-e89b-12d3-a456-426614174000', label: 'Electronics' },
              { value: '223e4567-e89b-12d3-a456-426614174001', label: 'Books' },
              { value: '323e4567-e89b-12d3-a456-426614174002', label: 'Clothing' },
              { value: '423e4567-e89b-12d3-a456-426614174003', label: 'Home & Garden' },
            ]}
          />
        </div>

        <Divider />

        <div>
          <Title level={4}>Multi-Select (Tags)</Title>
          <Select
            mode="multiple"
            placeholder="Select tags"
            allowClear
            style={{ width: 300 }}
            value={queryState.tags.value}
            onChange={(values) => queryState.tags.setValue(values)}
            options={[
              { value: '523e4567-e89b-12d3-a456-426614174004', label: 'New' },
              { value: '623e4567-e89b-12d3-a456-426614174005', label: 'Sale' },
              { value: '723e4567-e89b-12d3-a456-426614174006', label: 'Featured' },
              { value: '823e4567-e89b-12d3-a456-426614174007', label: 'Exclusive' },
            ]}
          />
        </div>

        <Divider />

        <div>
          <Title level={4}>Current URL Parameters:</Title>
          <pre>{window.location.search}</pre>
        </div>

        <div>
          <Title level={4}>Parameter Values:</Title>
          <Space direction="vertical">
            <Text>Category: {queryState.category.value ?? '(none)'}</Text>
            <Text>
              Tags:{' '}
              {queryState.tags.value.length > 0 ? JSON.stringify(queryState.tags.value) : '(none)'}
            </Text>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

export default App
