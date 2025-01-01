import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";

import { Dashboard } from "./components/user/dashboard/Dashboard";
import { Userprofile } from "./components/user/userProfile/Userprofile";
import { Feedback } from "./components/user/feedback/Feedback";
import { Interview } from "./components/user/interview/Interview";
import { Pay } from "./components/user/pay/Pay";
import { Resume } from "./components/user/resume/Resume";
import { Schedule } from "./components/user/schedule/Schedule";

import { History } from "./components/admin/history/History";
import { Info } from "./components/admin/info/Info";
import { Permission } from "./components/admin/permission/Permission";
import { Response } from "./components/admin/response/Response";
import { Subs } from "./components/admin/subs/Subs";
import { Transaction } from "./components/admin/transaction/Transaction";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HorizontalNavbar from "./components/navbar/HorizontalNavbar";
import { Profile } from "./components/admin/profile/Profile";

const RoutesWrapper = () => {
  const location = useLocation();
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

 
  const toggleNavbar = () => {
    setIsNavbarOpen((prev) => !prev);
  };

 
  const showNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user");
  const hideHorizontalNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="app h-screen w-screen bg-bg-color overflow-x-hidden">
      <div className="flex">
        {showNavbar && isNavbarOpen && <Navbar toggleNavbar={toggleNavbar} />}
      
        {!hideHorizontalNavbar && (
          <HorizontalNavbar toggleNavbar={toggleNavbar} />
        )}
        <div
          className={`${
            showNavbar && isNavbarOpen ? "ml-56 mt-20 mr-4" : "ml-0 "
          } ${!hideHorizontalNavbar ? " mt-20 " : "  "} flex-1 transition-all `}
        >

          {!isNavbarOpen && (
            <button
              onClick={toggleNavbar}
              className="fixed left-4 bg-p-color text-bg-color p-2 rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          )}
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/profile" element={<Userprofile />} />
            <Route path="/user/feedback" element={<Feedback />} />
            <Route path="/user/interview" element={<Interview />} />
            <Route path="/user/payment" element={<Pay />} />
            <Route path="/user/upload-Resume" element={<Resume />} />
            <Route path="/user/schedule" element={<Schedule />} />


            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/history" element={<History />} />
            <Route path="/admin/information" element={<Info />} />
            <Route path="/admin/permission" element={<Permission />} />
            <Route path="/admin/response" element={<Response />} />
            <Route path="/admin/subscription" element={<Subs />} />
            <Route path="/admin/transaction" element={<Transaction />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
};

export default App;
