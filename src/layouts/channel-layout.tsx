import { Outlet } from "react-router-dom";
import MobileSidebar from "../components/navigation/mobile-sidebar";

const ChannelLayout = () => {
  return (
    <>
      <MobileSidebar />
      <Outlet />
    </>
  );
};

export default ChannelLayout;
