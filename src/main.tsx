import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { hydrateAuthToken } from './hooks/useAuth.ts'
import './i18n'
import './global.css'
import { store } from './store/store.ts'

void hydrateAuthToken()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
