import Button from '@mui/material/Button';

interface Props {
    label: string;
    type: "submit" | "button" | "reset";
}

export default function MyButton(props: Props) {
  return (
      <Button type={props.type} variant="contained" className={"myButton"}>
            {props.label}
      </Button>

  );
}