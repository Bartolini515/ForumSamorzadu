import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { Checkbox, FormHelperText } from "@mui/material";

interface Props {
	name: string;
	control: any;
	selectedValue: any;
	setSelectedValue: (value: any) => void;
	style?: import("@mui/system").SxProps<import("@mui/material").Theme>;
	disabled?: boolean;
}

export default function MyCheckbox(props: Props) {
	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<Box sx={{ minWidth: "20%" }}>
					<FormControl fullWidth>
						<Checkbox
							id="simple-select"
							value={value || props.selectedValue}
							onChange={(e) => {
								props.setSelectedValue(e.target.checked);
								onChange(e.target.checked);
							}}
							name={props.name}
							className={"myForm"}
							sx={props.style}
							disabled={props.disabled}
							checked={props.selectedValue}
						/>

						{error && (
							<FormHelperText sx={{ color: "red" }}>
								{error.message}
							</FormHelperText>
						)}
					</FormControl>
				</Box>
			)}
		/>
	);
}
