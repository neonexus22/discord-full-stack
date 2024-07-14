import { Drawer, rem } from "@mantine/core";
import { useGeneralStore } from "../../stores/generalStore";
import Sidebar from "./sidebar";
import ServerSidebar from "./server-sidebar";

const MobileSidebar = () => {
  const { drawerOpen, toggleDrawer } = useGeneralStore((state) => state);

  return (
    <>
      <Sidebar />
      <Drawer
        padding="0"
        mb="0"
        zIndex={10}
        onClose={toggleDrawer}
        opened={drawerOpen}
        size={rem(320)}
        position={"left"}
        withOverlay={false}
        styles={{ root: { width: 0, height: 0, position: "fixed" } }}
        withCloseButton={false}
        ml={rem(80)}
      >
        <ServerSidebar />
      </Drawer>
    </>
  );
};

export default MobileSidebar;
