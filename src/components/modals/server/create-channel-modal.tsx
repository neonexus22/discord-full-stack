import {
  Button,
  Flex,
  Group,
  Modal,
  rem,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import useModal from "../../../hooks/useModal";
import { useGeneralStore } from "../../../stores/generalStore";
import { useForm } from "@mantine/form";
import { ChannelType } from "../../../gql/graphql";
import { useServer } from "../../../hooks/graphql/servers/use-server";
import { useMutation } from "@apollo/client";
import { CREATE_CHANNEL } from "../../../graphql/mutations/server/create-channel";
import { useEffect } from "react";

function CreateChannelModal() {
  const { isOpen, closeModal } = useModal("CreateChannel");
  const channelType = useGeneralStore(
    (state) => state.chanelTypeForCreateChannelModal
  );

  const form = useForm({
    initialValues: {
      name: "",
      type: channelType ? channelType : ChannelType.Text,
    },
    validate: {
      name: (value) =>
        !value.trim()
          ? "Please enter a name"
          : value === "genneral"
          ? "Channel name cannot be general"
          : null,
      type: (value) => !value.trim() && "Please select a type",
    },
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (!channelType) return;
    form.setFieldValue("type", channelType);
  }, [channelType]);

  const { server } = useServer();

  const [createChannel, { loading, error }] = useMutation(CREATE_CHANNEL, {
    variables: {
      input: {
        serverId: server?.id,
        name: form.values.name,
        type: form.values.type,
      },
    },
    refetchQueries: ["GetServer"],
    onCompleted: () => {
      closeModal();
      form.reset();
    },
  });

  return (
    <Modal title="Create Channel" opened={isOpen} onClose={closeModal}>
      <Stack>
        <Flex direction="column" h={rem(250)}>
          <TextInput
            mb="md"
            label="Channel Name"
            {...form.getInputProps("name")}
            error={form.errors.name || error?.message}
          />
          <Select
            {...form.getInputProps("type")}
            label="Channel Type"
            data={Object.values(ChannelType).map((type) => type)}
          />
        </Flex>
        <Group>
          <Button color="red" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => createChannel()}
            loading={loading}
            variant="gradient"
            disabled={
              !form.values.name ||
              !form.values.type ||
              loading ||
              !!error?.message
            }
          >
            Create Channel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default CreateChannelModal;
