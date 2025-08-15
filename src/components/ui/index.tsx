import {
  Card as MTCard,
  Typography as MTTypography,
  Button as MTButton,
  Input as MTInput,
  List as MTList,
  ListItem as MTListItem,
  ListItemPrefix as MTListItemPrefix,
  Accordion as MTAccordion,
  AccordionHeader as MTAccordionHeader,
  AccordionBody as MTAccordionBody,
  Avatar as MTAvatar,
  Navbar as MTNavbar,
  IconButton as MTIconButton,
  Menu as MTMenu,
  MenuHandler as MTMenuHandler,
  MenuList as MTMenuList,
  MenuItem as MTMenuItem,
} from "@material-tailwind/react";
import type {
  CardProps,
  TypographyProps,
  ButtonProps,
  InputProps,
  ListProps,
  ListItemProps,
  ListItemPrefixProps,
  AccordionProps,
  AccordionHeaderProps,
  AccordionBodyProps,
  AvatarProps,
  NavbarProps,
  IconButtonProps,
  MenuProps,
  MenuHandlerProps,
  MenuListProps,
  MenuItemProps,
} from "@material-tailwind/react";

const defaultProps = {
  onPointerEnterCapture: undefined,
  onPointerLeaveCapture: undefined,
  placeholder: undefined,
  onResize: undefined,
  onResizeCapture: undefined,
};

export const Card = (props: CardProps) => (
  <MTCard {...defaultProps} {...props} />
);

export const Typography = (props: TypographyProps) => (
  <MTTypography {...defaultProps} {...props} />
);

export const Button = (props: ButtonProps) => (
  <MTButton {...defaultProps} {...props} />
);

export const Input = (props: InputProps) => (
  <MTInput crossOrigin={undefined} {...defaultProps} {...props} />
);

export const List = (props: ListProps) => (
  <MTList {...defaultProps} {...props} />
)

export const ListItem = (props: ListItemProps) => (
  <MTListItem {...defaultProps} {...props} />
)

export const ListItemPrefix = (props: ListItemPrefixProps) => (
  <MTListItemPrefix {...defaultProps} {...props} />
);

export const Accordion = (props: AccordionProps) => (
  <MTAccordion {...defaultProps} {...props} />
);

export const AccordionHeader = (props: AccordionHeaderProps) => (
  <MTAccordionHeader {...defaultProps} {...props} />
);

export const AccordionBody = (props: AccordionBodyProps) => (
  <MTAccordionBody {...defaultProps} {...props} />
);

export const Avatar = (props: AvatarProps) => (
  <MTAvatar {...defaultProps} {...props} />
);

export const Navbar = (props: NavbarProps) => (
  <MTNavbar {...defaultProps} {...props} />
);

export const IconButton = (props: IconButtonProps) => (
  <MTIconButton {...defaultProps} {...props} />
);

export const Menu = (props: MenuProps) => (
  <MTMenu {...defaultProps} {...props} />
);

export const MenuHandler = (props: MenuHandlerProps) => (
  <MTMenuHandler {...defaultProps} {...props} />
);

export const MenuList = (props: MenuListProps) => (
  <MTMenuList {...defaultProps} {...props} />
);

export const MenuItem = (props: MenuItemProps) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <MTMenuItem {...defaultProps} {...props} />
);
