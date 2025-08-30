import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AlertProvider } from "./contexts/AlertContext.tsx";
import { CalendarResizeProvider } from "./contexts/CalendarResizeContext.tsx";

const theme = createTheme({
	palette: {
		primary: blueGrey,
	},
});

createRoot(document.getElementById("root")!).render(
	<ThemeProvider theme={theme}>
		<AuthProvider>
			<AlertProvider>
				<CalendarResizeProvider>
					<StrictMode>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</StrictMode>
				</CalendarResizeProvider>
			</AlertProvider>
		</AuthProvider>
	</ThemeProvider>
);
