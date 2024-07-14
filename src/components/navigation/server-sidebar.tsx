import { useNavigate, useParams } from "react-router-dom";
import ServerHeader from "./server-header";
import styles from "./server-sidebar.module.css";
import { useEffect, useState } from "react";
import { useServer } from "../../hooks/graphql/servers/use-server";
import { ScrollArea, Stack } from "@mantine/core";
import ServerSidebarSection from "./server-sidebar-section";
import { ServerChannel } from "./server-channel";
import { Channel, ChannelType, Member } from "../../gql/graphql";

const ServerSidebar = () => {
  const navigate = useNavigate();

  const { serverId, memberId, channelId } = useParams();

  const { textChannels, audioChannels, videoChannels, server, role, members } =
    useServer();

  useEffect(() => {
    if (!channelId && !memberId && textChannels?.length > 0) {
      navigate(`/servers/${serverId}/channels/TEXT/${textChannels[0]?.id}`);
    }
  }, [channelId, memberId, textChannels, serverId, navigate]);

  const [activeChannelId, setActiveChannelId] = useState<number | null>();
  const [activeMemberId, setActiveMemberId] = useState<number | null>();

  useEffect(() => {
    if (memberId) {
      setActiveMemberId(parseInt(memberId));
      setActiveChannelId(null);
    }
    if (channelId) {
      setActiveChannelId(parseInt(channelId));
      setActiveMemberId(null);
    }
  }, [channelId, memberId, textChannels]);

  return (
    <nav className={styles.nav}>
      <ServerHeader server={server} memberRole={role} />

      {/* Server search */}

      <ScrollArea>
        {!!textChannels?.length && (
          <ServerSidebarSection
            sectionType="channels"
            channelType={ChannelType.Text}
            role={role}
            label="Text Channels"
          />
        )}
        <Stack>
          {textChannels?.map((channel: Channel) => (
            <ServerChannel
              key={channel?.id}
              channel={channel}
              isActive={activeChannelId === channel?.id}
              role={role}
              server={server}
            />
          ))}
        </Stack>
        {!!audioChannels?.length && (
          <ServerSidebarSection
            sectionType="channels"
            channelType={ChannelType.Audio}
            role={role}
            label="Audio Channels"
          />
        )}
        <Stack>
          {audioChannels?.map((channel: Channel) => (
            <ServerChannel
              key={channel?.id}
              channel={channel}
              isActive={activeChannelId === channel?.id}
              role={role}
              server={server}
            />
          ))}
        </Stack>
        {!!videoChannels?.length && (
          <ServerSidebarSection
            sectionType="channels"
            channelType={ChannelType.Video}
            role={role}
            label="Video Channels"
          />
        )}
        <Stack>
          {videoChannels?.map((channel: Channel) => (
            <ServerChannel
              key={channel?.id}
              channel={channel}
              isActive={activeChannelId === channel?.id}
              role={role}
              server={server}
            />
          ))}
        </Stack>
        {!!members?.length && (
          <ServerSidebarSection
            sectionType="members"
            role={role}
            label="Member"
          />
        )}
        {/* <Stack>
          {members?.map((member: Member) => (
            <Servermember
              key={member?.id}
              member={member}
              isActive={activeMemberId === member?.id}
              server={server}
            />
          ))}
        </Stack> */}
      </ScrollArea>
    </nav>
  );
};

export default ServerSidebar;
