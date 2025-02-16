import "../../App.css";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

interface Props {
	label: string;
	name: string;
	control: any;
}

export default function MyTextField(props: Props) {
	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<TextField
					id="outlined-basic"
					onChange={onChange}
					value={value || ""}
					label={props.label}
					variant="outlined"
					className={"myForm"}
					error={!!error}
					helperText={error ? error.message : ""}
				/>
			)}
		/>
	);
}
