import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AxiosInstance from "../AxiosInstance";
import { useAlert } from "../../contexts/AlertContext";
import DisplayTasks from "./DisplayTasks";
import SingleSelect from "../forms/SingleSelect";
import MultiSelectCheckbox from "../forms/MultiSelectCheckbox";
import { useAuth } from "../../contexts/AuthContext";

interface Task {
	id: string;
	task_name: string;
	description: string | null;
	user: string | null;
	completion_status: boolean;
	due_date: string | null;
	event: string | null;
	user_id: string | null;
}

export default function Tasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [optionsEvents, setOptionsEvents] = useState<any>([]);
	const [optionsUsers, setOptionsUsers] = useState<any>([]);
	const [selectedOptionUser, setSelectedOptionUser] = useState<number>(0);
	const [selectedOptionEvent, setSelectedOptionEvent] = useState<any>([]);
	// const [selectedOptionAdditional, setSelectedOptionAdditional] = useState<any>(
	// 	[]
	// );
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);

	const { setAlert } = useAlert();
	const { user } = useAuth();

	const filteredTasks: any = tasks.filter((task: any) => {
		// const showUnassigned =
		// 	selectedOptionAdditional.includes("Pokaż nieprzypisane") && !task.user;
		// const showOverdue =
		// 	selectedOptionAdditional.includes("Pokaż po terminie") &&
		// 	task.due_date &&
		// 	new Date(task.due_date) < new Date();
		// const showCompleted =
		// 	selectedOptionAdditional.includes("Pokaż ukończone") &&
		// 	task.completion_status;

		const matchesUser = task.user_id === selectedOptionUser;
		const matchesEvent = selectedOptionEvent.includes(task.event);

		return matchesUser && matchesEvent;
	});

	const GetTasks = () => {
		AxiosInstance.get("tasks/")
			.then((response) => {
				setTasks(response.data);
				// Stworzenie listy dostępnych wydarzeń
				setOptionsEvents([
					...new Set(
						response.data
							.filter((task: any) => task.event != null)
							.map((task: any) => task.event)
					),
				]);
				setRefresh(false);
				// Ustawienie domyślnych wybranych wydarzeń (wszystkich)
				// setSelectedOptionEvent([
				// 	...new Set(
				// 		response.data
				// 			.filter((task: any) => task.event != null)
				// 			.map((task: any) => task.event)
				// 	),
				// ]);
			})
			.catch((error: any) => {
				console.log(error);
				setAlert(error.message, "error");
			});
	};

	const GetUsers = () => {
		AxiosInstance.get("account/")
			.then((response) => {
				let tempUsers: any = [];
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

	return (
		// Generalnie to to musi być tak że są 2 sortowania, jedno po osobach a drugie po wydarzeniach. W osobach da się wybrać nieprzypisane i wtedy tam można je claimować (a i jeszcze sposób odclaimowania)( i to później też wszystko połączyć że da się z wydarzeń claimować)
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
				</>
			)}
		</>
	);
}
