import { Select, Card, Space, Divider, Typography, Alert, InputNumber, Slider, Badge } from 'antd'
import { useQueryState, queryState } from 'querystate/src/useQueryState'

const { Title, Text } = Typography

function App() {
  const {
    // String parameters (existing)
    category,
    setCategory,
    tags,
    setTags,
    status,
    setStatus,
    priority,
    setPriority,
    // Number parameters (new)
    page,
    setPage,
    limit,
    setLimit,
    priceRange,
    setPriceRange,
    productIds,
    setProductIds,
  } = useQueryState({
    // String parameters
    category: queryState.string(),
    tags: queryState.string().array(),
    status: queryState.string().default('active'),
    priority: queryState.string().array().default(['medium']),
    // Number parameters
    page: queryState.number().default(1),
    limit: queryState.number().default(10),
    priceRange: queryState.number().array().default([0, 100]),
    productIds: queryState.number().array(),
  })

  return (
    <Card title="URL Query Parameters Demo">
      <Alert
        message="Enhanced QueryState with Number Support"
        description="This demo showcases the enhanced API with support for both string and number parameters, including arrays and default values."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* String Parameters Section */}
        <Title level={3}>String Parameters</Title>

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

        {/* Number Parameters Section */}
        <Divider style={{ borderWidth: 2 }} />
        <Title level={3}>Number Parameters</Title>

        <div>
          <Title level={4}>Single Number (Page)</Title>
          <Space>
            <InputNumber
              min={1}
              max={100}
              value={page}
              onChange={(value) => setPage(value !== null ? value : undefined)}
            />
            <Badge count={page} color="blue" />
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: 1 - will revert to this value when cleared
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Single Number (Items per Page)</Title>
          <Space direction="vertical" style={{ width: 300 }}>
            <InputNumber
              min={5}
              max={100}
              step={5}
              value={limit}
              onChange={(value) => setLimit(value !== null ? value : undefined)}
              style={{ width: 120 }}
            />
            <Text>Show {limit} items per page</Text>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: 10 - will revert to this value when cleared
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Number Array (Price Range)</Title>
          <Space direction="vertical" style={{ width: 300 }}>
            <Slider
              range
              min={0}
              max={1000}
              value={priceRange}
              onChange={(values) => setPriceRange(values)}
            />
            <Text>
              Price: ${priceRange[0]} to ${priceRange[1]}
            </Text>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: [0, 100] - will revert to this value when cleared
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Number Array (Product IDs)</Title>
          <Select
            mode="multiple"
            placeholder="Select product IDs"
            allowClear
            style={{ width: 300 }}
            value={productIds}
            onChange={(values) => setProductIds(values)}
            options={[
              { value: 1001, label: 'Product #1001' },
              { value: 1002, label: 'Product #1002' },
              { value: 1003, label: 'Product #1003' },
              { value: 1004, label: 'Product #1004' },
              { value: 1005, label: 'Product #1005' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            No default value - will be removed from URL when cleared
          </Text>
        </div>

        {/* URL and Values Display */}
        <Divider style={{ borderWidth: 2 }} />
        <div>
          <Title level={4}>Current URL Parameters:</Title>
          <pre>{window.location.search}</pre>
        </div>
        <div>
          <Title level={4}>Parameter Values:</Title>
          <Space direction="vertical">
            <Title level={5}>String Parameters</Title>
            <Text>Category: {category ?? '(none)'}</Text>
            <Text>Tags: {tags.length > 0 ? JSON.stringify(tags) : '(none)'}</Text>
            <Text>Status: {status ?? '(none)'}</Text>
            <Text>Priority: {priority.length > 0 ? JSON.stringify(priority) : '(none)'}</Text>

            <Title level={5}>Number Parameters</Title>
            <Text>Page: {page !== undefined ? page : '(none)'}</Text>
            <Text>Limit: {limit !== undefined ? limit : '(none)'}</Text>
            <Text>
              Price Range: {priceRange.length > 0 ? JSON.stringify(priceRange) : '(none)'}
            </Text>
            <Text>
              Product IDs: {productIds.length > 0 ? JSON.stringify(productIds) : '(none)'}
            </Text>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

export default App
