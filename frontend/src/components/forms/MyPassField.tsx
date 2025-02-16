import * as React from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";

interface Props {
	label: string;
	name: string;
	control: any;
}

export default function MyPassField(props: Props) {
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: any) => {
		event.preventDefault();
	};

	return (
		<Controller
			name={props.name}
			control={props.control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<FormControl variant="outlined" className={"myForm"}>
					<InputLabel htmlFor="outlined-adornment-password">
						{props.label}
					</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						onChange={onChange}
						value={value}
						error={!!error}
						type={showPassword ? "text" : "password"}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						label={props.label}
					/>

					<FormHelperText sx={{ color: "#d32f2f" }}>
						{" "}
						{error?.message}{" "}
					</FormHelperText>
				</FormControl>
			)}
		/>
	);
}
