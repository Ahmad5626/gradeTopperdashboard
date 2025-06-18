import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContext";
import Login from "./pages/Login";

import Overview from "./pages/Overview";


import PageNotFound from "./pages/PageNotFound";
import Profile from "./components/Profile";
import Home from "./components/Home";

import MoneyBlockerFinder from "./components/MoneyBlockerFinder";




import PastClass from "./components/PastClass";
import InspiringInstitutes from "./components/InspiringInstitutes";

import Upcommingclass from "./components/Upcommingclass";
import Request from "./components/Request";
import Shedule from "./components/Shedule";
import Campaigns from "./components/Campaigns";
import EditButtons from "./components/EditButtons";
import RecommendedCauses from "./components/RecommendedCauses";
import FundRequest from "./components/FundRequest";

function App() {
  
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
           
            <Route path="/" element={<Login/>} />
           <Route
              path="overview"
              element={<Overview/>}
            >
             
              <Route path="home" element={<Home />} />
              <Route path="campaigns" element={<Campaigns  />} />
              <Route path="profile" element={<Profile />} />
              <Route path="editbuttons" element={<EditButtons />} />
              <Route path="inspiringinstitutes" element={<InspiringInstitutes />} />
              <Route path="recommendedcauses" element={<RecommendedCauses />} />
              <Route path="teacher" element={<MoneyBlockerFinder />} />
              <Route path="request" element={<Request />} />
              <Route path="pastclass" element={<PastClass />} />
              <Route path="upcommingclass" element={<Upcommingclass />} />
              <Route path="shedule" element={<Shedule />} />
              <Route path="fundrequest" element={<FundRequest />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
