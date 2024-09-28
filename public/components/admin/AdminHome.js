import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getNotice,
} from "../../redux/actions/adminActions";
import Body from "./Body";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AdminHome = () => {
  const dispatch = useDispatch();

  // Fetch all necessary data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getAllStudent());
        dispatch(getAllFaculty());
        dispatch(getAllAdmin());
        dispatch(getAllDepartment());
        dispatch(getNotice());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [dispatch]);

  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
      <div className="flex flex-col  bg-[#f4f6fa] h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 overflow-y-hidden">
        <Header />
        <div className="flex flex-[0.95]">
          <Sidebar />
          {/* Pass any required props to Body if needed */}
          <Body />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
