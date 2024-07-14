import { useClipboard } from "@mantine/hooks";
import { useServer } from "../../../hooks/graphql/servers/use-server";
import useModal from "../../../hooks/useModal";
import {
  Button,
  Flex,
  Modal,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useMutation } from "@apollo/client";
import { UPDATE_SERVER_WITH_NEW_INVITE_CODE } from "../../../graphql/mutations/server/update-server-with-new-invite-code";
import { MutationUpdateServerWithNewInviteCodeArgs } from "../../../gql/graphql";
import { useForm } from "@mantine/form";
import { useEffect, useRef } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

const InviteModal = () => {
  const ref = useRef<HTMLInputElement>(null);
  const { isOpen, closeModal } = useModal("InvitePeople");

  const { server } = useServer();

  const clipboard = useClipboard({ timeout: 500 });

  const [updateServerWithNewInviteCode, { loading }] =
    useMutation<MutationUpdateServerWithNewInviteCodeArgs>(
      UPDATE_SERVER_WITH_NEW_INVITE_CODE,
      {
        variables: {
          serverId: server?.id,
        },
      }
    );

  const form = useForm({
    initialValues: {
      inviteCode: "",
    },
  });

  useEffect(() => {
    if (!server?.inviteCode) return;
    form.setValues({
      inviteCode: server.inviteCode,
    });
  }, [server?.inviteCode]);

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Invite People">
      <Stack>
        <Flex align="center">
          <TextInput
            ref={ref}
            label="Server Invite Code"
            w="100%"
            {...form.getInputProps("inviteCode")}
          />
          <Button
            variant="transparent"
            onClick={() => {
              clipboard.copy(ref.current?.value || "");
            }}
            style={{ marginTop: rem(20) }}
          >
            {!clipboard.copied ? <IconCopy /> : <IconCheck color="green" />}
          </Button>
        </Flex>
        <Button
          disabled={loading}
          onClick={() => updateServerWithNewInviteCode()}
        >
          <Text mr="md">Generate New Invite Code</Text>
        </Button>
      </Stack>
    </Modal>
  );
};

export default InviteModal;
