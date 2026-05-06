import { BrowserRouter, Route, Routes } from "react-router-dom"
import { App } from "../app"
import { Checkout } from "../pages/Checkout"
import { Login } from "../pages/Login"
import { Register } from "../pages/Register"

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
