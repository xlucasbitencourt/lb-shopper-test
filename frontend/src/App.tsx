import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import './toast.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
