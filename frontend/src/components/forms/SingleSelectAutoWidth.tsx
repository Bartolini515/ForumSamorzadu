import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";

interface Props {
	label: string;
	options: string[];
	setSelectedValue: any;
	selectedValue: string;
}

export default function SingleSelectAutoWidth(props: Props) {
	const handleChange = (event: SelectChangeEvent) => {
		props.setSelectedValue(event.target.value);
	};

	return (
		<div>
			<FormControl sx={{ m: 1, minWidth: 80 }}>
				<InputLabel id="demo-simple-select-autowidth-label">
					{props.label}
				</InputLabel>
				<Select
					labelId="demo-simple-select-autowidth-label"
					id="demo-simple-select-autowidth"
					value={props.selectedValue}
					onChange={handleChange}
					autoWidth
					label={props.label}
				>
					{props.options.map((option) => (
						<MenuItem key={option} value={option}>
							<ListItemText primary={option} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
