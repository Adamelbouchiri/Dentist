import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { GuestRoute } from "./routes/GuestRoute";
import { AuthRoute } from "./routes/AuthRoute";
import FlashMessage from "./components/FlashMessage";
import { PageLoader } from "./components/ui/Spinner";

// Route-level code splitting: each page is its own chunk
const page = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const Home = page(() => import("./pages/Home"), "Home");
const CreateAppointments = page(() => import("./pages/CreateAppointments"), "CreateAppointments");
const Login = page(() => import("./pages/Auth/Login"), "Login");
const Register = page(() => import("./pages/Auth/Register"), "Register");
const SecondRegistration = page(() => import("./pages/Auth/SecondRegistration"), "SecondRegistration");
const OAuthSuccess = page(() => import("./pages/Auth/GoogleAuthSuccess"), "OAuthSuccess");
const ForgotPassword = page(() => import("./pages/Auth/ForgotPassword"), "ForgotPassword");
const ResetPassword = page(() => import("./pages/Auth/ResetPassword"), "ResetPassword");
const Dashboard = page(() => import("./pages/Dashboard"), "Dashboard");
const Profile = page(() => import("./pages/Profile"), "Profile");
const Appointments = page(() => import("./pages/Appointments"), "Appointments");
const Settings = page(() => import("./pages/Settings"), "Settings");
const AdminDashboard = page(() => import("./pages/AdminDashboard"), "AdminDashboard");
const AdminOverview = page(() => import("./pages/AdminOverview"), "AdminOverview");
const AdminAppointments = page(() => import("./pages/AdminAppointments"), "AdminAppointments");
const AdminCalendar = page(() => import("./pages/AdminCalendar"), "AdminCalendar");
const AdminUsers = page(() => import("./pages/AdminUsers"), "AdminUsers");
const AdminPatient = page(() => import("./pages/AdminPatient"), "AdminPatient");
const AdminMessages = page(() => import("./pages/AdminMessages"), "AdminMessages");
const AdminReviews = page(() => import("./pages/AdminReviews"), "AdminReviews");
const AdminCatalog = page(() => import("./pages/AdminCatalog"), "AdminCatalog");
const NotFound = page(() => import("./pages/NotFound"), "NotFound");

function App() {
  return (
    <>
      <FlashMessage />
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route element={<AuthRoute />}>
              <Route path="/create-appointments" element={<CreateAppointments />} />

              <Route path="/user/dashboard" element={<Dashboard />}>
                <Route index element={<Profile />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="/admin/dashboard" element={<AdminDashboard />}>
                <Route index element={<AdminOverview />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="calendar" element={<AdminCalendar />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminPatient />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="catalog" element={<AdminCatalog />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/google-auth-success" element={<OAuthSuccess />} />
              <Route path="/facebook-auth-success" element={<OAuthSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route path="/second-registration" element={<SecondRegistration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
