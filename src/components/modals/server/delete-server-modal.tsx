import { useMutation } from "@apollo/client";
import { useServer } from "../../../hooks/graphql/servers/use-server";
import useModal from "../../../hooks/useModal";
import { DELETE_SERVER } from "../../../graphql/mutations/server/delete-server";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Text } from "@mantine/core";

const DeleteServerModal = () => {
  const { isOpen, closeModal } = useModal("DeleteServer");
  const { server } = useServer();

  const [deleteChannel, { loading }] = useMutation(DELETE_SERVER, {
    variables: {
      serverId: server?.id,
    },
    refetchQueries: ["GetServers"],
    onCompleted: () => {
      closeModal();
      navigate("/");
    },
  });
  const navigate = useNavigate();

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Delete Server">
      <Text fw={700}>Are you sure you want to delete this server?</Text>
      <Button
        mt="md"
        loading={loading}
        color="red"
        onClick={() => deleteChannel()}
      >
        Delete Server
      </Button>
    </Modal>
  );
  return <div>DeleteServerModal</div>;
};

export default DeleteServerModal;
