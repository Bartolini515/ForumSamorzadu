import Alert from "@mui/material/Alert";

interface Props {
	message: string;
	severity: "error" | "warning" | "info" | "success";
	timeout: number;
	setAlertOpen: any;
}

export default function FilledAlerts(props: Props) {
	setTimeout(() => {
		props.setAlertOpen(false);
	}, props.timeout);

	const style = {
		margin: 0,
		top: "auto",
		right: "auto",
		bottom: 0,
		left: 0,
		position: "fixed",
		zIndex: 999,
		width: "100%",
	};
	return (
		<Alert sx={style} variant="filled" severity={props.severity}>
			{props.message}
		</Alert>
	);
}
