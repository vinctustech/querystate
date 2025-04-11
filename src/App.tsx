import { useState } from 'react'
import { Button, Card } from 'antd'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Card>
      <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
    </Card>
  )
}

export default App
