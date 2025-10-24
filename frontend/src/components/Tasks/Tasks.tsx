import { useEffect, useState } from "react";
import { Box, Skeleton } from "@mui/material";
import AxiosInstance from "../AxiosInstance";
import { useAlert } from "../../contexts/AlertContext";
import DisplayTasks from "./DisplayTasks";
import SingleSelect from "../../UI/forms/SingleSelect";
import MultiSelectCheckbox from "../../UI/forms/MultiSelectCheckbox";
import { useAuth } from "../../contexts/AuthContext";
import FAB from "../../UI/forms/FAB";
import CreateTaskModal from "./CreateTaskModal";

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

export default function Tasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [optionsEvents, setOptionsEvents] = useState<any>([]);
	const [optionsUsers, setOptionsUsers] = useState<any>([]);
	const [selectedOptionUser, setSelectedOptionUser] = useState<number>(0);
	const [selectedOptionEvent, setSelectedOptionEvent] = useState<any>([]);
	const [createTaskModal, setCreateTaskModal] = useState(false);

	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);

	const { setAlert } = useAlert();
	const { user } = useAuth();

	const filteredTasks: Task[] = tasks.filter((task: Task) => {
		const unassignedUser =
			task.users.length < task.max_users && selectedOptionUser === 0;
		const matchesUser = task.users.some(
			(user) => user.id === selectedOptionUser
		);
		const matchesEvent = selectedOptionEvent.includes(task.event.event_name);

		return (matchesUser && matchesEvent) || (unassignedUser && matchesEvent);
	});

	const GetTasks = () => {
		AxiosInstance.get("tasks/")
			.then((response) => {
				// Filtrowanie zadań które mają datę ukończenia nadal możliwą do wykonania
				// Celem jest wyświetlenie zadań które są aktualne
				let tempTasks: Task[] = [];
				response.data.forEach((element: Task) => {
					if (element.due_date >= new Date().toISOString().split("T")[0]) {
						tempTasks.push(element);
					}
				});
				setTasks(tempTasks);
				// Stworzenie listy dostępnych wydarzeń i posortowanie ich alfabetycznie
				let all_events = [
					...new Set(tempTasks.map((task: Task) => task.event.event_name)),
				].sort();
				setOptionsEvents(all_events);
				// Domyślne wybranie wszystkich wydarzeń
				setSelectedOptionEvent(all_events);
				setRefresh(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(
					error.response.data.message
						? error.response.data.message
						: error.message,
					"error"
				);
			});
	};

	const GetUsers = () => {
		AxiosInstance.get("account/")
			.then((response) => {
				let tempUsers: any[] = [];
				// Tworzenie listy dostępnych użytkowników
				// W przypadku braku imienia i nazwiska wyświetlany jest email
				response.data.map((user: any) => {
					let tempOption;
					if (user.first_name && user.last_name) {
						tempOption = `${user.first_name} ${user.last_name}`;
					} else {
						tempOption = user.email;
					}
					tempUsers.push({
						id: user.id,
						option: tempOption,
					});
				});
				tempUsers
					.sort((a: any, b: any) => {
						if (a.option < b.option) return -1;
						if (a.option > b.option) return 1;
						return 0;
					})
					.unshift({ id: 0, option: "Nieprzypisane" });
				setOptionsUsers(tempUsers);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(
					error.response.data.message
						? error.response.data.message
						: error.message,
					"error"
				);
			});
	};

	useEffect(() => {
		GetTasks();
		GetUsers();
		setSelectedOptionUser(user?.id ?? 0); // Domyślnie wyświetlaj zadania przypisane do zalogowanego użytkownika
	}, []);

	useEffect(() => {
		GetTasks();
	}, [refresh]);

	const handleClickFAB = () => {
		setCreateTaskModal(true);
	};

	return (
		<>
			{loading ? (
				<Skeleton variant="rectangular" height={400} />
			) : (
				<>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
							display: "flex",
							justifyContent: "space-evenly",
							marginBottom: "20px",
							flexDirection: { xs: "column", sm: "row" },
						}}
					>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							<SingleSelect
								options={optionsUsers}
								label="Osoba"
								selectedOption={selectedOptionUser}
								setSelectedOption={setSelectedOptionUser}
							/>
						</Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}>
							<MultiSelectCheckbox
								label={"Wydarzenia"}
								options={optionsEvents}
								setSelectedValue={setSelectedOptionEvent}
								selectedValue={selectedOptionEvent}
							/>
						</Box>
						<Box sx={{ width: { xs: "100%", sm: "30%" } }}></Box>
					</Box>
					{filteredTasks.length > 0 ? (
						<DisplayTasks
							tasks={filteredTasks}
							refresh={refresh}
							setRefresh={setRefresh}
						/>
					) : (
						<Box sx={{ textAlign: "center", marginTop: "20px" }}>
							Brak zadań
						</Box>
					)}
					<FAB handleClick={handleClickFAB} color="secondary"></FAB>
					{createTaskModal && (
						<CreateTaskModal
							open={createTaskModal}
							onClose={() => {
								setCreateTaskModal(false);
								setRefresh(true);
							}}
						/>
					)}
				</>
			)}
		</>
	);
}
