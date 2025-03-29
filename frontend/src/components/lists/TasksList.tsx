import { useState } from "react";
import TaskDescriptionModal from "../modalsAndDialogs/TaskDescriptionModal"; // Import the new modal component
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface Props {
	tasks: {
		id: string;
		task_name: string;
		task_description: string;
		assigned: string;
		completion_status: boolean;
		due_date: string;
	}[];
}

export default function TasksList(props: Props) {
	const [taskDescription, setTaskDescription] = useState<string | null>(null);
	const [taskAssigned, setTaskAssigned] = useState<string | null>(null);
	const [taskCompletionStatus, setTaskCompletionStatus] = useState<
		boolean | null
	>(null);
	const [taskDueDate, setTaskDueDate] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleTaskClick = (
		task_description: string,
		task_due_date: string,
		task_assigned: string,
		task_completion_status: boolean
	) => {
		setTaskDescription(task_description);
		setTaskDueDate(task_due_date);
		setTaskAssigned(task_assigned);
		setTaskCompletionStatus(task_completion_status);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setTaskDescription(null);
		setTaskDueDate(null);
	};

	return (
		<>
			<Stack
				direction={{ sx: "column", sm: "row" }}
				// spacing={0}
				sx={{
					marginBottom: "5px",
					flexWrap: "wrap",
					gap: "5px",
				}}
			>
				{props.tasks.map((task) => (
					<Chip
						key={task.id}
						color={`${task.completion_status === true ? "success" : "error"}`}
						// sx={{
						// 	backgroundColor: `${
						// 		task.completion_status === true
						// 			? "rgb(46, 125, 50)"
						// 			: "rgb(211, 47, 47)"
						// 	}`,
						// 	color: "white",
						// }}
						label={task.task_name}
						onClick={() =>
							handleTaskClick(
								task.task_description,
								task.due_date,
								task.assigned,
								task.completion_status
							)
						}
					/>
				))}
			</Stack>
			{modalOpen && (
				<TaskDescriptionModal
					task_description={taskDescription}
					task_due_date={taskDueDate}
					task_assigned={taskAssigned}
					task_completion_Status={taskCompletionStatus}
					onClose={closeModal}
				/>
			)}
		</>
	);
}
