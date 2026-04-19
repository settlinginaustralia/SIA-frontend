import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AccessTierProvider } from './context/AccessTierContext'
import { ThemeProvider } from './context/ThemeContext'
import LayoutM from './LayoutM'
import MainSiteLayout from './components/MainSiteLayout'
import Home from './components/Home'
import About from './pages/About'
import Membership from './pages/Membership'
import ResourcesBlog from './pages/ResourcesBlog'
import Faq from './pages/Faq'
import Contact from './pages/Contact'
import Settings from './pages/Settings'
import Community from './pages/Community'
import './styles/global.css'
import './styles/responsive.css'

function App() {
  return (
    <div className="sia-app-root">
      <BrowserRouter>
        <ThemeProvider>
          <AccessTierProvider>
            <Routes>
              <Route path="/" element={<LayoutM />}>
                <Route element={<MainSiteLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="membership" element={<Membership />} />
                  <Route path="resources" element={<ResourcesBlog />} />
                  <Route path="faq" element={<Faq />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="community" element={<Community />} />
                </Route>
              </Route>
            </Routes>
          </AccessTierProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
