import { Routes, Route } from "react-router";
import "./App.css";
import Index from "./components/Index";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Schedule from "./components/Schedule";
import Timetable from "./components/Timetable";
import Tasks from "./components/Tasks";
import Navbar from "./components/navbar/Navbar";

export default function App() {
	return (
		<>
			<Navbar
				content={
					<Routes>
						<Route path="" element={<Index />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/schedule" element={<Schedule />} />
						<Route path="/timetable" element={<Timetable />} />
						<Route path="/tasks" element={<Tasks />} />
					</Routes>
				}
			/>
		</>
	);
}
