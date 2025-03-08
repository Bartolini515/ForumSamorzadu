import { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Controller } from "react-hook-form";

interface Props {
	label: string;
	name: string;
	options: {
		id: string;
		event_type: string;
	}[];
	control: any;
}

export default function MySelect(props: Props) {
	const [option, setOption] = useState(props.options[0].id || "");

	const handleChange = (event: SelectChangeEvent) => {
		setOption(event.target.value as string);
	};

	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<Box sx={{ minWidth: 120 }}>
					<FormControl fullWidth>
						<InputLabel id="simple-select-label">{props.label}</InputLabel>
						<Select
							labelId="simple-select-label"
							id="simple-select"
							value={value || option}
							label={props.label}
							onChange={(e) => {
								handleChange(e);
								onChange(e);
							}}
							name={props.name}
							className={"myForm"}
						>
							{props.options.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.event_type}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			)}
		/>
	);
}
