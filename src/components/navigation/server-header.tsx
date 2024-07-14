import { Divider, Flex, Menu, rem } from "@mantine/core";
import { MemberRole, Server } from "../../gql/graphql";
import {
  IconArrowAutofitDown,
  IconPlus,
  IconSettings,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import useModal from "../../hooks/useModal";

const ServerHeader = ({
  server,
  memberRole,
}: {
  server: Server;
  memberRole: MemberRole;
}) => {
  const isAdmin = memberRole === MemberRole.Admin;
  const isModerator = memberRole === MemberRole.Moderator || isAdmin;

  const inviteModal = useModal("InvitePeople");
  const updateServerModal = useModal("UpdateServer");
  const createChannelModal = useModal("CreateChannel");
  const deleteServerModal = useModal("DeleteServer");

  return (
    <Menu shadow="md" width={rem(300)}>
      <Menu.Target>
        <Flex
          p="md"
          justify="space-between"
          align="center"
          w="100%"
          style={{ cursor: "pointer" }}
        >
          {server?.name} <IconArrowAutofitDown />
        </Flex>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={inviteModal.openModal} rightSection={<IconPlus />}>
          Invite People
        </Menu.Item>
        {isAdmin && (
          <Menu.Item
            onClick={updateServerModal.openModal}
            rightSection={<IconSettings />}
          >
            Update Server
          </Menu.Item>
        )}
        {isModerator && (
          <Menu.Item
            onClick={createChannelModal.openModal}
            rightSection={<IconPlus />}
          >
            Create Channel
          </Menu.Item>
        )}
        {isModerator && <Divider />}
        {isAdmin && (
          <Menu.Item
            onClick={deleteServerModal.openModal}
            color="red"
            rightSection={<IconTrash />}
          >
            Delete Server
          </Menu.Item>
        )}
        {!isAdmin && (
          <Menu.Item color="red" rightSection={<IconX />}>
            Leave Server
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ServerHeader;
