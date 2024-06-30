import { Button, Center, Stack, useMantineColorScheme } from "@mantine/core";
import styles from "./sidebar.module.css";
import {
  IconArrowsJoin,
  IconMoon,
  IconPlus,
  IconSun,
} from "@tabler/icons-react";
import useModal from "../../hooks/useModal";
import { UserButton } from "@clerk/clerk-react";
import { useGetServers } from "../../hooks/graphql/servers/use-get-servers";
import NavbarLink from "./navbar-link";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const createServerModal = useModal("CreateServer");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const { servers } = useGetServers();

  const links = servers?.map((server, index: number) => (
    <NavbarLink
      key={server.id}
      onClick={() => {
        setActive(index);
        navigate(`/servers/${server.id}`);
      }}
      label={server.name}
      active={index === active}
      imageUrl={server.imageUrl}
    />
  ));

  return (
    <nav className={styles.navbar}>
      <Stack>
        <Center>
          <Button
            className={styles.link}
            variant="subtle"
            radius={100}
            onClick={createServerModal.openModal}
          >
            <IconPlus radius={100} />
          </Button>
        </Center>
        <Center>
          <Button
            className={styles.link}
            variant="subtle"
            radius={100}
            onClick={() => {}}
          >
            <IconArrowsJoin radius={100} />
          </Button>
        </Center>
        <Stack justify="center" gap="md" mt="xl">
          {links}
        </Stack>
      </Stack>

      <Stack justify="center" align="center">
        <Button
          className={styles.link}
          variant="subtle"
          onClick={toggleColorScheme}
          radius={100}
          p={0}
        >
          {colorScheme === "light" ? (
            <IconMoon radius={100} />
          ) : (
            <IconSun radius={100} />
          )}
        </Button>
        <UserButton />
      </Stack>
    </nav>
  );
};

export default Sidebar;
