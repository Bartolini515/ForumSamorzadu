import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { MuiColorInput } from "mui-color-input";
import { Controller } from "react-hook-form";
import { FormHelperText } from "@mui/material";

interface Props {
	label: string;
	name: string;
	control: any;
	selectedColor: any;
	setSelectedColor: (value: any) => void;
	style?: import("@mui/system").SxProps<import("@mui/material").Theme>;
	disabled?: boolean;
	format?: "hex" | "hex8" | "hsl" | "hsv" | "rgb";
	fallbackValue?: string;
	isAlphaHidden?: boolean;
}

export default function MyColorInput(props: Props) {
	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<Box sx={{ minWidth: "20%" }}>
					<FormControl fullWidth>
						<MuiColorInput
							id="simple-select"
							value={value || props.selectedColor}
							label={props.label}
							onChange={(e) => {
								props.setSelectedColor(e);
								onChange(e);
							}}
							name={props.name}
							className={"myForm"}
							sx={props.style || { width: "100%" }}
							disabled={props.disabled}
							format={props.format}
							fallbackValue={props.fallbackValue}
							isAlphaHidden={props.isAlphaHidden}
							error={!!error}
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
