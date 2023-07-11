/** @jsxImportSource @emotion/react */
import { EncooLayout } from '@/pages/mainChat/Layout'
import '@pages/mainChat/styles/index.css'
import '@pages/styles/global.css'
import { createRoot } from 'react-dom/client'

const element = document.getElementById('root') as HTMLElement
const root = createRoot(element!)

root.render(<EncooLayout />)
