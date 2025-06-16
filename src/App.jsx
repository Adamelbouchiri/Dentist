import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SecondRegistration } from "./pages/SecondRegistration";

import GuestRoute from "./routes/GuestRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/second-Registration" element={<SecondRegistration />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
