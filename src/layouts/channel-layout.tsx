import { Outlet } from "react-router-dom";
import ServerSidebar from "../components/navigation/server-sidebar";

const ChannelLayout = () => {
  return (
    <div>
      <ServerSidebar />
      <Outlet />
    </div>
  );
};

export default ChannelLayout;
