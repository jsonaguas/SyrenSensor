import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";


const client = generateClient<Schema>();

function App() {
	const { user, signOut } = useAuthenticator();
	const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
	const [latestSnapshot, setLatestSnapshot] = useState<Schema["HealthSnapshot"]["type"] | null>(null);

	useEffect(() => {
		client.models.Todo.observeQuery().subscribe({
			next: (data) => setTodos([...data.items]),
		});
	}, []);

	useEffect(() => {
		if (!user) return;

		client.models.HealthSnapshot.list({
			filter: {
				userID: { eq: user.signInDetails?.loginId },
			},
		})
			.then((res) => {
				if (res.data.length > 0) {
					// Sort by timestamp descending and pick the latest
					const sorted = [...res.data].sort((a, b) => (b.timestamp as number) - (a.timestamp as number));
					setLatestSnapshot(sorted[0]);
				}
			})
			.catch((err) => {
				console.error("Failed to load latest vitals", err);
			});
	}, [user]);

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
			{latestSnapshot && (
				<div>
					<h2>Latest Health Snapshot</h2>
					<p>Heart Rate: {latestSnapshot.heartRate}</p>
					<p>Oxygen Level: {latestSnapshot.oxygenLevel}</p>
					<p>Timestamp: {new Date(latestSnapshot.timestamp as number).toLocaleString()}</p>
				</div>
			)}
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