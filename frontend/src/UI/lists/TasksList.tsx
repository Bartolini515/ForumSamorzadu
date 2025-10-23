import { useState } from "react";
import TaskDescriptionModal from "../../components/timetable/modals/TaskDescriptionModal"; // Import the new modal component
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
}

interface Event {
	id: number;
	event_name: string;
	event_color: string;
}

interface Task {
	id: number;
	task_name: string;
	description: string | null;
	users: User[];
	completion_status: boolean;
	due_date: string;
	event: Event;
	max_users: number;
}

interface Props {
	tasks: Task[];
	is_creator: boolean;
	isAdmin: boolean;
	onClose?: () => void;
}

export default function TasksList(props: Props) {
	const [taskId, setTaskId] = useState<number | null>(null);
	const [taskDescription, setTaskDescription] = useState<string | null>(null);
	const [taskAssigned, setTaskAssigned] = useState<User[]>([]);
	const [taskCompletionStatus, setTaskCompletionStatus] = useState<
		boolean | null
	>(null);
	const [taskDueDate, setTaskDueDate] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleTaskClick = (
		task_id: number,
		task_description: string | null,
		task_due_date: string,
		task_assigned: User[],
		task_completion_status: boolean
	) => {
		setTaskId(task_id);
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
		setTaskAssigned([]);
		setTaskCompletionStatus(null);
		setTaskId(null);
		if (props.onClose) {
			props.onClose();
		}
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
								task.id,
								task.description,
								task.due_date,
								task.users,
								task.completion_status
							)
						}
					/>
				))}
			</Stack>
			{modalOpen && (
				<TaskDescriptionModal
					task_id={taskId}
					task_description={taskDescription}
					task_due_date={taskDueDate}
					task_assigned={taskAssigned}
					task_completion_Status={taskCompletionStatus}
					is_creator={props.is_creator}
					isAdmin={props.isAdmin}
					onClose={closeModal}
				/>
			)}
		</>
	);
}
