import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css'
import { ConfigProvider, Layout, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#141414' }}>
        <Content style={{ padding: '24px', background: '#141414' }}>
          <App />
        </Content>
      </Layout>
    </ConfigProvider>
  </StrictMode>,
)
