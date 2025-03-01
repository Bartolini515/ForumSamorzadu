import Button from "@mui/material/Button";

interface Props {
	label: string;
	type: "submit" | "button" | "reset";
	onClick?: () => void;
}

export default function MyButton(props: Props) {
	return (
		<Button
			type={props.type}
			variant="contained"
			className={"myButton"}
			onClick={props.onClick}
		>
			{props.label}
		</Button>
	);
}
