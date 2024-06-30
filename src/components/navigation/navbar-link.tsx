import { Image, Tooltip, UnstyledButton, rem } from "@mantine/core";

type NavbarLinkProps = {
  label: string;
  active?: boolean;
  imageUrl: string;
  onClick?: () => void;
};

const NavbarLink = ({ label, active, imageUrl, onClick }: NavbarLinkProps) => {
  return (
    <Tooltip label={label} position="right">
      <UnstyledButton
        onClick={onClick}
        data-active={active}
        variant="transparent"
        style={{ borderRadius: rem(100) }}
      >
        <Image src={imageUrl} w={rem(50)} h={rem(50)} radius={100} />
      </UnstyledButton>
    </Tooltip>
  );
};

export default NavbarLink;
