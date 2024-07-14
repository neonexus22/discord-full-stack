import { useMutation } from "@apollo/client";
import { DELETE_CHANNEL } from "../../../../graphql/mutations/server/delete-channel";
import { useGeneralStore } from "../../../../stores/generalStore";
import useModal from "../../../../hooks/useModal";
import { useServer } from "../../../../hooks/graphql/servers/use-server";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Text } from "@mantine/core";

const DeleteChannelModal = () => {
  const { isOpen, closeModal } = useModal("DeleteChannel");
  const { server } = useServer();

  const channelToBeDeletedOrUpdatedId = useGeneralStore(
    (state) => state.channelToBeDeletedOrUpdatedId
  );

  const [deleteChannel, { loading }] = useMutation(DELETE_CHANNEL, {
    variables: {
      channelId: channelToBeDeletedOrUpdatedId,
    },
    refetchQueries: ["GetServer"],
    onCompleted: () => {
      closeModal();
      navigate(`/servers/${server?.id}`);
    },
  });
  const navigate = useNavigate();

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Delete Channel">
      <Text fw={700}>Are you sure you want to delete this channel?</Text>
      <Button
        mt="md"
        loading={loading}
        color="red"
        onClick={() => deleteChannel()}
      >
        Delete Channel
      </Button>
    </Modal>
  );
};

export default DeleteChannelModal;
