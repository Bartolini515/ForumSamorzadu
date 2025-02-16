import { Routes, Route, useLocation } from "react-router";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Schedule from "./components/Schedule";
import Timetable from "./components/Timetable";
import Tasks from "./components/Tasks";
import Navbar from "./components/navbar/Navbar";
import TablesModeratorPanel from "./components/TablesModeratorPanel";
import ProtectedRoutes from "./components/ProtectedRoutes";

export default function App() {
	const location = useLocation();
	const noNavbar =
		location.pathname === "/" || location.pathname === "/register";
	return (
		<>
			{noNavbar ? (
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<Register />} />
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
							</Route>
						</Routes>
					}
				/>
			)}
		</>
	);
}
