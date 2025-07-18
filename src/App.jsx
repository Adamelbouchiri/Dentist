import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";

// appointments
import { CreateAppointments } from "./pages/CreateAppointments";

// auth
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { SecondRegistration } from "./pages/Auth/SecondRegistration";
import { GoogleAuthSuccess } from "./pages/Auth/GoogleAuthSuccess";
import { FacebookAuthSuccess } from "./pages/Auth/FacebookAuthSuccess";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";

import { GuestRoute } from "./routes/GuestRoute";
import { AuthRoute } from "./routes/AuthRoute";
import FlashMessage from "./components/FlashMessage";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Appointments } from "./pages/Appointments";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <>
      <FlashMessage />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<AuthRoute />}>
            <Route path="/appointments" element={<CreateAppointments />} />

            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Profile />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/google-auth-success"
              element={<GoogleAuthSuccess />}
            />
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
    </>
  );
}

export default App;
