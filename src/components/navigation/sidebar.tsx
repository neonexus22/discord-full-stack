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

const Sidebar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const createServerModal = useModal("CreateServer");

  return (
    <nav className={styles.navbar}>
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
