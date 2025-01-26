import * as React from "react";
import { Link, useLocation } from "react-router"; // Ensure this is from react-router-dom
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import GridViewIcon from "@mui/icons-material/GridView";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import EditNoteIcon from "@mui/icons-material/EditNote";

export default function Menu() {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	const location = useLocation();
	const path = location.pathname;

	return (
		<List
			sx={{
				width: "100%",
				maxWidth: 360,
				bgcolor: "background.paper",
				color: "rgba(0, 0, 0, 0.54)",
			}}
			component="nav"
		>
			<ListItemButton
				component={Link}
				to="/dashboard"
				selected={path === "/dashboard"}
			>
				<ListItemIcon>
					<GridViewIcon />
				</ListItemIcon>
				<ListItemText primary="Pulpit" />
			</ListItemButton>
			<ListItemButton
				onClick={handleClick}
				selected={path === "/timetable" || path === "/tasks"}
			>
				<ListItemIcon>
					<ScheduleIcon />
				</ListItemIcon>
				<ListItemText primary="Wydarzenia" />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<ListItemButton
						sx={{ pl: 3 }}
						component={Link}
						to="/timetable"
						selected={path === "/timetable"}
					>
						<CalendarMonthIcon>
							<StarBorder />
						</CalendarMonthIcon>
						<ListItemText primary="Harmonogram" />
					</ListItemButton>
				</List>
			</Collapse>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<ListItemButton
						sx={{ pl: 3 }}
						component={Link}
						to="/tasks"
						selected={path === "/tasks"}
					>
						<EditNoteIcon>
							<StarBorder />
						</EditNoteIcon>
						<ListItemText primary="Zadania" />
					</ListItemButton>
				</List>
			</Collapse>

			<ListItemButton
				component={Link}
				to="/schedule"
				selected={path === "/schedule"}
			>
				<ListItemIcon>
					<SchoolIcon />
				</ListItemIcon>
				<ListItemText primary="Plan lekcji" />
			</ListItemButton>
		</List>
	);
}
