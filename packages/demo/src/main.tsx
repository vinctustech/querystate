import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, Layout, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import 'antd/dist/reset.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Layout style={{ minHeight: '100vh', background: '#141414' }}>
          <Content style={{ padding: '0', background: '#141414' }}>
            <App />
          </Content>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
