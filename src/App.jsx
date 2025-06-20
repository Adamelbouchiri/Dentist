import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SecondRegistration } from "./pages/SecondRegistration";

import GuestRoute from "./routes/GuestRoute";
import { GoogleAuthSuccess } from "./pages/GoogleAuthSuccess";
import { FacebookAuthSuccess } from "./pages/FacebookAuthSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
          <Route
            path="/facebook-auth-success"
            element={<FacebookAuthSuccess />}
          />
        </Route>
        <Route path="/second-Registration" element={<SecondRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
