// This is a test component for me to understand basic React and TSX

// import { MouseEvent } from "react";

import { useState } from "react";

// { items: [], heading: string }
interface Props {
	items: string[];
	heading: string;
}

// function ListGroup() {
// 	const items = [
// 		"New York",
// 		"Los Angeles",
// 		"Chicago",
// 		"Houston",
// 		"Philadelphia",
// 	];

function ListGroup(Props: Props) {
	// You can also replace Props with { items, heading}
	// let items = ["New York", "Los Angeles", "Chicago", "Houston", "Philadelphia"];

	// let selectedIndex = -1; // No item selected initially
	// Hook
	const [selectedIndex, setSelectedIndex] = useState(-1);
	// const [name, setName] = useState("");

	// Event handler for the click event
	// const handleClick = (event: MouseEvent) => console.log(event);

	return (
		<>
			<h1>Hello world</h1>
			{Props.items.length === 0 && <p>No items in the list</p>}
			<ul className="list-group">
				{Props.items.map((item, index) => (
					<li
						className={
							selectedIndex === index
								? "list-group-item active"
								: "list-group-item"
						}
						key={item}
						// onClick={() => console.log(item, index)}
						// onClick={handleClick}
						onClick={() => {
							setSelectedIndex(index);
						}}
					>
						{item}
					</li>
				))}
			</ul>
		</>
	);
}

export default ListGroup;
