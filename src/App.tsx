import { useState } from "react";

type AppProps = {
    user: { loginId: string };
    signOut: () => void;
};

type Todo = { id: string; content: string };

function App({ user, signOut }: AppProps) {
    const [todos, setTodos] = useState<Todo[]>([
        { id: "1", content: "Sample Todo 1" },
        { id: "2", content: "Sample Todo 2" },
    ]);

    function deleteTodo(id: string) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }

    function createTodo() {
        const content = window.prompt("Todo content");
        if (content) {
            setTodos((prev) => [...prev, { id: Date.now().toString(), content }]);
        }
    }

    return (
        <main>
            <h1>{user.loginId}'s todos</h1>
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
        </main>
    );
}

export default App;
