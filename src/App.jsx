import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { SecondRegistration } from "./pages/Auth/SecondRegistration";

import GuestRoute from "./routes/GuestRoute";
import { GoogleAuthSuccess } from "./pages/Auth/GoogleAuthSuccess";
import { FacebookAuthSuccess } from "./pages/Auth/FacebookAuthSuccess";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/second-Registration" element={<SecondRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
