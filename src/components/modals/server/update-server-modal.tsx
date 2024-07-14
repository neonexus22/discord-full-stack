import {
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import useModal from "../../../hooks/useModal";
import { useForm } from "@mantine/form";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import styles from "./update-server-modal.module.css";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useMutation } from "@apollo/client";
import { UPDATE_SERVER } from "../../../graphql/mutations/server/update-server";
import { useServer } from "../../../hooks/graphql/servers/use-server";

const UpdateServerModal = () => {
  const { isOpen, closeModal } = useModal("UpdateServer");

  const { server } = useServer();

  useEffect(() => {
    if (!server) return;
    setImagePreview(server?.imageUrl);
    form.setValues({ name: server.name });
  }, [server?.name, server?.imageUrl]);

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => !value.trim() && "Please enter a name",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleDropzoneChange: DropzoneProps["onDrop"] = (files) => {
    if (files.length === 0) {
      return setImagePreview(null);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    setFile(files[0]);
    reader.readAsDataURL(files[0]);
  };

  const [updateServer, { loading, error: mutationError }] = useMutation(
    UPDATE_SERVER,
    {}
  );

  const onSubmit = () => {
    if (!form.validate()) return;
    updateServer({
      variables: {
        input: {
          name: form.values.name,
          serverId: server?.id,
        },
        file,
      },
      onCompleted: () => {
        setImagePreview(null);
        setFile(null);
        form.reset();
        closeModal();
      },
      refetchQueries: ["GetServers"],
    });
  };

  return (
    <Modal title="Update a server" opened={isOpen} onClose={closeModal}>
      <Text c="gray" size={rem(13)}>
        Give your server a personality with a name and an image. You can always
        change it later.
      </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Flex justify="center" align="center" direction="column">
            {!imagePreview && (
              <Dropzone
                onDrop={(files) => {
                  handleDropzoneChange(files);
                }}
                className={styles.dropzone}
                mt="md"
                accept={IMAGE_MIME_TYPE}
              >
                <Group style={{ minHeight: rem(100), pointerEvents: "none" }}>
                  <Dropzone.Accept>
                    <IconUpload size="3.2rem" stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size="3.2rem" stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconUpload size="3.2rem" stroke={1.5} />
                  </Dropzone.Idle>
                  <>
                    <Text size="md" inline>
                      Drop images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Upload a server icon
                    </Text>
                  </>
                </Group>
              </Dropzone>
            )}
            {mutationError?.message && !file && (
              <Text c="red" mt="xs" size={rem(13)}>
                {mutationError?.message}
              </Text>
            )}
            {imagePreview && (
              <Flex pos="relative" w={rem(150)} h={rem(150)} mt="md">
                <Button
                  pos="absolute"
                  color="red"
                  style={{
                    zIndex: 1,
                    borderRadius: "50%",
                    padding: 0,
                    width: rem(20),
                    height: rem(20),
                    top: 0,
                    right: 10,
                  }}
                  onClick={() => {
                    setImagePreview(null);
                    setFile(null);
                  }}
                >
                  <IconX color="white" />
                </Button>
                <Image
                  src={imagePreview}
                  width={rem(150)}
                  height={rem(150)}
                  radius={"50%"}
                />
              </Flex>
            )}
          </Flex>
          <TextInput
            label="Server name"
            placeholder="Enter server name"
            {...form.getInputProps("name")}
            error={form.errors.name}
          />
          <Button
            disabled={!!form.errors.name || loading}
            w={"35%"}
            type="submit"
            variant="gradient"
          >
            Update server
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateServerModal;
