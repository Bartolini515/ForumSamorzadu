import { useState } from "react";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import NoteDescriptionModal from "../../components/timetable/modals/NoteDescriptionModal";

interface Props {
	notes: {
		id: string;
		title: string;
		content: string;
		created_at: string;
		updated_at: string;
		created_by: string;
		created_by_id: number;
	}[];
	is_creator: boolean;
	isAdmin: boolean;
	onClose: () => void;
}

export default function NotesList(props: Props) {
	const [noteId, setNoteId] = useState<string | null>(null);
	const [noteTitle, setNoteTitle] = useState<string | null>(null);
	const [noteContent, setNoteContent] = useState<string | null>(null);
	const [noteCreatedBy, setNoteCreatedBy] = useState<string | null>(null);
	const [noteCreatedById, setNoteCreatedById] = useState<number | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleNoteClick = (
		id: string,
		title: string,
		content: string,
		created_by: string,
		created_by_id: number
	) => {
		setNoteId(id);
		setNoteTitle(title);
		setNoteContent(content);
		setNoteCreatedBy(created_by);
		setNoteCreatedById(created_by_id);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setNoteId(null);
		setNoteTitle(null);
		setNoteContent(null);
		setNoteCreatedBy(null);
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
				{props.notes.map((note) => (
					<Chip
						key={note.id}
						color={"primary"}
						label={note.title}
						onClick={() =>
							handleNoteClick(
								note.id,
								note.title,
								note.content,
								note.created_by,
								note.created_by_id
							)
						}
					/>
				))}
			</Stack>
			{modalOpen && (
				<NoteDescriptionModal
					note_id={noteId}
					note_title={noteTitle}
					note_content={noteContent}
					note_created_by={noteCreatedBy}
					note_created_by_id={noteCreatedById}
					is_creator={props.is_creator}
					isAdmin={props.isAdmin}
					onClose={closeModal}
				/>
			)}
		</>
	);
}
