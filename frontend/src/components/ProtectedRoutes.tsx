import { Outlet, Navigate } from "react-router";

export default function ProtectedRoutes() {
	const token = localStorage.getItem("Token");

	if (!token) {
		return <Navigate to="/" />;
	}
	return <Outlet />;
}
