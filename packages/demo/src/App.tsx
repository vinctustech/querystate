import { Select, Card, Space, Divider, Typography, Alert } from 'antd'
import { useQueryState, queryState } from 'querystate/src/useQueryState'

const { Title, Text } = Typography

function App() {
  const { category, setCategory, tags, setTags, status, setStatus, priority, setPriority } =
    useQueryState({
      // Original parameters with new syntax
      category: queryState.string(),
      tags: queryState.string().array(),

      // New parameters with default values
      status: queryState.string().default('active'),
      priority: queryState.string().array().default(['medium']),
    })

  return (
    <Card title="URL Query Parameters Demo">
      <Alert
        message="Enhanced QueryState with Defaults"
        description="This demo showcases the new chainable API with default values. Notice how 'status' and 'priority' parameters are automatically populated in the URL."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Single Select (Category)</Title>
          <Select
            placeholder="Select a category"
            allowClear
            style={{ width: 300 }}
            value={category}
            onChange={(value) => setCategory(value)}
            options={[
              { value: '123e4567-e89b-12d3-a456-426614174000', label: 'Electronics' },
              { value: '223e4567-e89b-12d3-a456-426614174001', label: 'Books' },
              { value: '323e4567-e89b-12d3-a456-426614174002', label: 'Clothing' },
              { value: '423e4567-e89b-12d3-a456-426614174003', label: 'Home & Garden' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            No default value - will be removed from URL when cleared
          </Text>
        </div>

        <Divider />

        <div>
          <Title level={4}>Multi-Select (Tags)</Title>
          <Select
            mode="multiple"
            placeholder="Select tags"
            allowClear
            style={{ width: 300 }}
            value={tags}
            onChange={(values) => setTags(values)}
            options={[
              { value: '523e4567-e89b-12d3-a456-426614174004', label: 'New' },
              { value: '623e4567-e89b-12d3-a456-426614174005', label: 'Sale' },
              { value: '723e4567-e89b-12d3-a456-426614174006', label: 'Featured' },
              { value: '823e4567-e89b-12d3-a456-426614174007', label: 'Exclusive' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            No default value - will be removed from URL when cleared
          </Text>
        </div>

        <Divider />

        <div>
          <Title level={4}>Single Select with Default (Status)</Title>
          <Select
            placeholder="Select status"
            allowClear
            style={{ width: 300 }}
            value={status}
            onChange={(value) => setStatus(value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: "active" - will revert to this value when cleared
          </Text>
        </div>

        <Divider />

        <div>
          <Title level={4}>Multi-Select with Default (Priority)</Title>
          <Select
            mode="multiple"
            placeholder="Select priority levels"
            allowClear
            style={{ width: 300 }}
            value={priority}
            onChange={(values) => setPriority(values)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: ["medium"] - will revert to this value when cleared
          </Text>
        </div>

        <Divider />

        <div>
          <Title level={4}>Current URL Parameters:</Title>
          <pre>{window.location.search}</pre>
        </div>

        <div>
          <Title level={4}>Parameter Values:</Title>
          <Space direction="vertical">
            <Text>Category: {category ?? '(none)'}</Text>
            <Text>Tags: {tags.length > 0 ? JSON.stringify(tags) : '(none)'}</Text>
            <Text>Status: {status ?? '(none)'}</Text>
            <Text>Priority: {priority.length > 0 ? JSON.stringify(priority) : '(none)'}</Text>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

export default App
