import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { GET_SERVER } from "../../../graphql/queries/get-server";
import { ChannelType } from "../../../constants";
import { useProfileStore } from "../../../stores/profileStore";
import { Channel, Member } from "../../../gql/graphql";

export function useServer() {
  const { serverId } = useParams();
  const profileId = useProfileStore((state) => state.profile?.id);

  const navigate = useNavigate();

  const { data: dataServer, loading } = useQuery(GET_SERVER, {
    variables: {
      id: Number(serverId),
    },
    onError: () => {
      console.log("here");
      navigate("/");
    },
  });

  const textChannels = dataServer?.getServer?.channels?.filter(
    (channel: Channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = dataServer?.getServer?.channels?.filter(
    (channel: Channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = dataServer?.getServer?.channels?.filter(
    (channel: Channel) => channel.type === ChannelType.VIDEO
  );

  const members =
    dataServer?.getServer?.members?.filter(
      (member: Member) => member?.profileId !== profileId
    ) || [];

  const role = dataServer?.getServer?.members?.find(
    (member: Member) => member?.profileId === profileId
  )?.role;

  return {
    server: dataServer?.getServer,
    loading,
    textChannels,
    audioChannels,
    videoChannels,
    members,
    role,
  };
}
