interface Props {
	schedule: any[]; // Replace 'any' with the actual type of your schedule items
}

export default function ScheduleTable(props: Props) {
	return (
		<div>
			{props.schedule.map((item, index) => (
				<div key={index}>{item.details}</div>
			))}
		</div>
	);
}
