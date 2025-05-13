import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";


const client = generateClient<Schema>();

function App() {
	const { user, signOut } = useAuthenticator();
	const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

	useEffect(() => {
		client.models.Todo.observeQuery().subscribe({
			next: (data) => setTodos([...data.items]),
		});
	}, []);
	// useEffect(() => {
	// 	if (user) {
	// 		const interval = setInterval(() => {
	// 			const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
	// 			const oxygenLevel = Math.floor(Math.random() * (100 - 90 + 1)) + 90;

	// 			client.models.HealthSnapshot.create({
	// 				userID: user?.signInDetails?.loginId ?? "unknown",
	// 				heartRate,
	// 				oxygenLevel,
	// 				timestamp: Date.now(),
	// 			})
	// 				.then((res) => console.log("Simulated snapshot sent:", res))
	// 				.catch((err) => console.error("Simulated snapshot failed:", err));
	// 		}, 10000);

	// 		return () => clearInterval(interval);
	// 	}
	// }, [user]);


	function deleteTodo(id: string) {
		client.models.Todo.delete({ id });
	}

	function createTodo() {
		client.models.Todo.create({ content: window.prompt("Todo content") });
	}

function createHealthSnapshot() {
	const heartRateInput = window.prompt("Enter heart rate:");
	const oxygenLevelInput = window.prompt("Enter oxygen level:");

	const heartRate = parseInt(heartRateInput ?? "", 10);
	const oxygenLevel = parseInt(oxygenLevelInput ?? "", 10);

	if (isNaN(heartRate) || isNaN(oxygenLevel)) {
		alert("Please enter valid numbers.");
		return;
	}

	client.models.HealthSnapshot.create({
		userID: user?.signInDetails?.loginId ?? "unknown",
		heartRate,
		oxygenLevel,
		timestamp: Date.now(),
	})
		.then((res) => {
			console.log("HealthSnapshot created:", res);
			alert("Snapshot created!");
		})
		.catch((err) => {
			console.error("Error creating HealthSnapshot:", err);
			alert("Failed to create snapshot.");
		});
}
	return (
		<main>
			<h1>{user?.signInDetails?.loginId}'s todos</h1>
			<button onClick={createTodo}>+ new</button>
			<ul>
				{todos.map((todo) => (
					<li
						onClick={() => deleteTodo(todo.id)}
						key={todo.id}>
						{todo.content}
					</li>
				))}
			</ul>
			<div>
				🥳 App successfully hosted. Try creating a new todo.
				<br />
				<a href='https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates'>
					Review next step of this tutorial.
				</a>
			</div>
			<button onClick={signOut}>Sign out</button>
			<button onClick={createHealthSnapshot}>Create Health Snapshot</button>
		</main>
	);
}

export default App;