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
import useModal from "../../hooks/useModal";
import { useForm } from "@mantine/form";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";
import styles from "./create-server-modal.module.css";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useMutation } from "@apollo/client";
import { CREATE_SERVER } from "../../graphql/mutations/server/create-server";
import { useProfileStore } from "../../stores/profileStore";

const CreateServerModal = () => {
  const { isOpen, closeModal } = useModal("CreateServer");

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

  const [createServer, { loading, error: mutationError }] = useMutation(
    CREATE_SERVER,
    {}
  );

  const profileId = useProfileStore((state) => state.profile?.id);
  const onSubmit = () => {
    if (!form.validate()) return;
    createServer({
      variables: {
        input: {
          name: form.values.name,
          profileId,
        },
        file,
      },
      onCompleted: () => {
        setImagePreview(null);
        setFile(null);
        form.reset();
        closeModal();
      },
      onError: (error) => {
        console.log("Error creating server", { error, mutationError });
      },
      refetchQueries: ["GetServers"],
    });
  };

  return (
    <Modal title="Create a server" opened={isOpen} onClose={closeModal}>
      <Text>
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
                    <Text size="xl" inline>
                      Drop images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Upload a server icon
                    </Text>
                  </>
                </Group>
              </Dropzone>
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
                  onClick={() => setImagePreview(null)}
                >
                  <IconX color="white" />
                </Button>
                <Image
                  src={imagePreview}
                  w={rem(150)}
                  h={rem(150)}
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
            w={"30%"}
            type="submit"
            variant="gradient"
          >
            Create server
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateServerModal;
