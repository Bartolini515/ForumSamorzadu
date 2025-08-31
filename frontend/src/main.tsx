import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AlertProvider } from "./contexts/AlertContext.tsx";
import { CalendarResizeProvider } from "./contexts/CalendarResizeContext.tsx";
import { CustomThemeProvider } from "./contexts/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
	<CustomThemeProvider>
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
	</CustomThemeProvider>
);
