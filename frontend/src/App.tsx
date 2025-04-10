import { Routes, Route, useLocation } from "react-router";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Schedule from "./components/Schedule";
import Timetable from "./components/timetable/Timetable";
import Tasks from "./components/Tasks/Tasks";
import Navbar from "./components/navbar/Navbar";
import TablesModeratorPanel from "./components/moderatorPanel/dataManagement/ModeratorPanelDataManagement";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ChangePassword from "./components/ChangePassword";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { de } from "date-fns/locale";
import { plPL } from "@mui/x-date-pickers/locales";
import Account from "./components/Account";

export default function App() {
	const location = useLocation();
	const noNavbar =
		location.pathname === "/" ||
		location.pathname === "/register" ||
		location.pathname === "/change_password";

	return (
		<LocalizationProvider
			dateAdapter={AdapterDateFns}
			adapterLocale={de}
			localeText={
				plPL.components.MuiLocalizationProvider.defaultProps.localeText
			}
		>
			{noNavbar ? (
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/change_password" element={<ChangePassword />} />
				</Routes>
			) : (
				<Navbar
					content={
						<Routes>
							<Route element={<ProtectedRoutes />}>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/schedule" element={<Schedule />} />
								<Route path="/timetable" element={<Timetable />} />
								<Route path="/tasks" element={<Tasks />} />
								<Route
									path="/moderator_panel_tables"
									element={<TablesModeratorPanel />}
								/>
								<Route path="/account" element={<Account />} />
							</Route>
						</Routes>
					}
				/>
			)}
		</LocalizationProvider>
	);
}
