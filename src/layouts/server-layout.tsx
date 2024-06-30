import { Outlet } from "react-router-dom";
import ServerSidebar from "../components/navigation/server-sidebar";

const ServerLayout = () => {
  return (
    <div>
      <ServerSidebar />
      <Outlet />
    </div>
  );
};

export default ServerLayout;
