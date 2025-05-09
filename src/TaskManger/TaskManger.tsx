import { useEffect, useRef, useState } from "react";

type Todo = {
  id: number;
  priority: "high" | "medium" | "low";
  time: number;
  data: string;
};

// Priority thresholds (in seconds)
const HIGH_PRIORITY_LIMIT = 10;
const MEDIUM_PRIORITY_LIMIT = 20;
const MAX_AGE_SECONDS = 30;

export default function TaskManager() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const todosRef = useRef<Todo[]>([]);
  const [textInput, setTextInput] = useState<string>("");

  useEffect(() => {
    const myInterval = setInterval(() => {
      const now = Date.now();

      const updatedTodos = todosRef.current
        .filter((item) => {
          console.log(item.data, (now - item?.time) / 1000);
          const ageInSeconds = (now - item.time) / 1000;
          return ageInSeconds < MAX_AGE_SECONDS;
        })
        .map((item) => {
          const ageInSeconds = (now - item.time) / 1000;
          let updatedPriority: Todo["priority"] = "high";
          if (ageInSeconds > MEDIUM_PRIORITY_LIMIT) {
            updatedPriority = "low";
          } else if (ageInSeconds > HIGH_PRIORITY_LIMIT) {
            updatedPriority = "medium";
          }

          return { ...item, priority: updatedPriority };
        });

      todosRef.current = updatedTodos; // Update the ref once
      setTodos(updatedTodos); // Trigger UI update

      // Optional logging
      //   const lastTodo = todosRef.current[todosRef.current.length - 1];
      //   const timeSinceLast = lastTodo ? (now - lastTodo.time) / 1000 : 0;
      //   console.log("Time since last todo (s):", timeSinceLast);
    }, 1000);

    return () => clearInterval(myInterval);
  }, []);

  function addTodo() {
    const newTodo: Todo = {
      id: todos.length + 1,
      priority: "high",
      time: Date.now(),
      data: `${textInput} | ${todos.length + 1}`,
    };

    setTodos((prev) => {
      const newState = [...prev, newTodo];
      todosRef.current = newState;
      return newState;
    });

    setTextInput("");
  }

  return (
    <div>
      <input
        value={textInput}
        onChange={(event) => setTextInput(event.target.value)}
        type="text"
      />
      <button onClick={addTodo}>Add Todo</button>
      <br />
      <div>{JSON.stringify(todos)}</div>
    </div>
  );
}
