import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Menu from "./Menu";
import AccountMenu from "./AccountMenu";
import { useLocation } from "react-router-dom";
import { useCalendarResize } from "../../contexts/CalendarResizeContext";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
	open?: boolean;
}>(({ theme }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `-${drawerWidth}px`,
	variants: [
		{
			props: ({ open }) => open,
			style: {
				transition: theme.transitions.create("margin", {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginLeft: 0,
			},
		},
	],
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				width: `calc(100% - ${drawerWidth}px)`,
				marginLeft: `${drawerWidth}px`,
				transition: theme.transitions.create(["margin", "width"], {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},
		},
	],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
	justifyContent: "space-between",
}));

interface NavbarProps {
	content: React.ReactNode;
}

export default function Navbar({ content }: NavbarProps) {
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);

	const location = useLocation();
	const path = location.pathname;
	const { resizeCalendar } = useCalendarResize();

	const handleDrawerOpen = () => {
		setOpen(true);
		handleCalendarResize();
	};

	const handleDrawerClose = () => {
		setOpen(false);
		handleCalendarResize();
	};

	const handleCalendarResize = () => {
		if (path === "/dashboard" || path === "/timetable") {
			setTimeout(() => {
				resizeCalendar();
			}, theme.transitions.duration.leavingScreen);
		}
	};

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="fixed" open={open} sx={{ pr: "24px !important" }}>
				<Toolbar
					sx={{
						flex: { right: 0, left: 0 },
						justifyContent: "space-between",
						pr: "0px !important",
					}}
				>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={[
							{
								mr: 2,
							},
							open && { visibility: "hidden" },
						]}
					>
						<MenuIcon />
					</IconButton>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<IconButton
							color="inherit"
							component="a"
							href="https://youtu.be/rKz7JDsS364" // Replace with your desired URL
							target="_blank"
							rel="noopener noreferrer"
						>
							<HelpOutlineIcon sx={{ fontSize: 27 }} />
						</IconButton>
						<AccountMenu />
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
				variant="persistent"
				anchor="left"
				open={open}
			>
				<DrawerHeader>
					<img src="/Logo_SU.svg" alt="Logo" width="32" height="32" />
					<Typography noWrap component="div" sx={{ fontWeight: 600 }}>
						Panel Narzędzi
					</Typography>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "ltr" ? (
							<ChevronLeftIcon />
						) : (
							<ChevronRightIcon />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<Menu />
			</Drawer>
			<Main open={open}>
				<DrawerHeader />
				{content}
			</Main>
		</Box>
	);
}
