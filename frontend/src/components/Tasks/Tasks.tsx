import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AxiosInstance from "../AxiosInstance";
import { useAlert } from "../../contexts/AlertContext";
import DisplayTasks from "./DisplayTasks";
import SingleSelect from "../forms/SingleSelect";
import MultiSelectCheckbox from "../forms/MultiSelectCheckbox";
import { useAuth } from "../../contexts/AuthContext";
import FAB from "../forms/FAB";
import CreateTaskModal from "../modals/CreateTaskModal";

interface Task {
	id: string;
	task_name: string;
	description: string | null;
	user: string | null;
	completion_status: boolean;
	due_date: string | null;
	event: string | null;
	user_id: number | null;
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

	const filteredTasks: any = tasks.filter((task: any) => {
		const unassignedUser = task.user_id === null && selectedOptionUser === 0;
		const matchesUser = task.user_id === selectedOptionUser;
		const matchesEvent =
			selectedOptionEvent.includes(task.event) ||
			(task.event === null && selectedOptionEvent.includes("Bez wydarzenia"));

		return (matchesUser && matchesEvent) || (unassignedUser && matchesEvent);
	});

	const GetTasks = () => {
		AxiosInstance.get("tasks/")
			.then((response) => {
				// Filtrowanie zadań które mają datę ukończenia nadal możliwą do wykonania
				// lub nie mają daty ukończenia i nie są ukończone
				// Celem jest wyświetlenie zadań które są aktualne
				let tempTasks: any[] = [];
				response.data.forEach((element: any) => {
					if (
						element.due_date >= new Date().toISOString().split("T")[0] ||
						(element.due_date === null && element.completion_status === false)
					) {
						tempTasks.push(element);
					}
				});
				setTasks(tempTasks);
				// Stworzenie listy dostępnych wydarzeń
				setOptionsEvents([
					...new Set(
						tempTasks
							.filter((task: any) => task.event != null)
							.map((task: any) => task.event)
					),
					"Bez wydarzenia",
				]);
				setRefresh(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	const GetUsers = () => {
		AxiosInstance.get("account/")
			.then((response) => {
				let tempUsers: any = [{ id: 0, option: "Nieprzypisane" }];
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
				setOptionsUsers(tempUsers);
				setLoading(false);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
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
				<p>Pobieranie danych</p>
			) : (
				<>
					<Box
						sx={{
							boxShadow: 3,
							padding: "20px",
							display: "flex",
							justifyContent: "space-evenly",
							marginBottom: "20px",
						}}
					>
						<Box sx={{ width: "30%" }}>
							<SingleSelect
								options={optionsUsers}
								label="Osoba"
								selectedOption={selectedOptionUser}
								setSelectedOption={setSelectedOptionUser}
							/>
						</Box>
						<Box sx={{ width: "30%" }}>
							<MultiSelectCheckbox
								label={"Wydarzenia"}
								options={optionsEvents}
								setSelectedValue={setSelectedOptionEvent}
								selectedValue={selectedOptionEvent}
							/>
						</Box>
						<Box sx={{ width: "30%" }}>
							{/* <MultiSelectCheckbox
								label={"Dodatkowe opcje"}
								options={[
									"Pokaż nieprzypisane"
								]}
								setSelectedValue={setSelectedOptionAdditional}
								selectedValue={selectedOptionAdditional}
							/> */}
						</Box>
					</Box>
					<DisplayTasks
						tasks={filteredTasks}
						refresh={refresh}
						setRefresh={setRefresh}
					></DisplayTasks>
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
