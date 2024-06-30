import { useNavigate, useParams } from "react-router-dom";
import ServerHeader from "./server-header";
import styles from "./server-sidebar.module.css";
import { useEffect } from "react";
import { useServer } from "../../hooks/graphql/servers/use-server";

const ServerSidebar = () => {
  const navigate = useNavigate();

  const { serverId, memberId, channelId } = useParams();

  const { textChannels } = useServer();

  console.log("testing", textChannels, serverId);

  useEffect(() => {
    if (!channelId && !memberId && textChannels?.length > 0) {
      navigate(`/servers/${serverId}/channels/TEXT/${textChannels[0]?.id}`);
    }
  }, [channelId, memberId, textChannels, serverId, navigate]);

  return (
    <nav className={styles.nav}>
      <ServerHeader />
    </nav>
  );
};

export default ServerSidebar;
