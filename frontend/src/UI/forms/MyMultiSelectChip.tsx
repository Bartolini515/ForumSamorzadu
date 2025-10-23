import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Controller } from "react-hook-form";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Option {
    id: number;
    option: string;
    label?: JSX.Element;
}

function getStyles(name: string, optionName: readonly string[], theme: Theme) {
    return {
        fontWeight: optionName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

interface Props {
    label: string;
    name: string;
    options: Option[];
    control: any;
    style?: import("@mui/system").SxProps<import("@mui/material").Theme>;
    disabled?: boolean;
    helperText?: string;
}

export default function MultipleSelectChip(props: Props) {
    const theme = useTheme();

    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const selectedOptions =
                    props.options.filter((opt) => value?.includes(opt.id)) || [];

                const handleChange = (event: SelectChangeEvent<number[]>) => {
                    const {
                        target: { value: selectedIds },
                    } = event;
                    onChange(selectedIds);
                };

                return (
                    <Box sx={{ minWidth: "20%" }}>
                        <FormControl sx={{ m: 1, width: "100%" }}>
                            <InputLabel id="multiple-chip-label">{props.label}</InputLabel>
                            <Select
                                labelId="multiple-chip-label"
                                id="multiple-chip"
                                multiple
                                value={value || []}
                                label={props.label}
                                onChange={handleChange}
                                name={props.name}
                                className={"myForm"}
                                sx={props.style || { width: "100%" }}
                                disabled={props.disabled}
                                error={!!error}
                                input={
                                    <OutlinedInput
                                        id="select-multiple-chip"
                                        label={props.label}
                                    />
                                }
                                renderValue={(selectedIds: number[]) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {props.options
                                            .filter((opt) => selectedIds.includes(opt.id))
                                            .map((opt) => (
                                                <Chip key={opt.id} label={opt.option} />
                                            ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {props.options.map((option) => (
                                    <MenuItem
                                        key={option.id}
                                        value={option.id}
                                        style={getStyles(
                                            option.option,
                                            selectedOptions.map((opt) => opt.option),
                                            theme
                                        )}
                                    >
                                        {option.label || option.option}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error && (
                                <FormHelperText sx={{ color: "red" }}>
                                    {error.message}
                                </FormHelperText>
                            )}
                            {props.helperText && !error && (
                                <FormHelperText>{props.helperText}</FormHelperText>
                            )}
                        </FormControl>
                    </Box>
                );
            }}
        />
    );
}