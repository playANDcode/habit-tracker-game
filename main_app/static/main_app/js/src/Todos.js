import csrftoken from "./csrf.js";
import ReactDOM from "react-dom";
import React from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Modal from "./components/Modal.js";

// A single todo item:
function TodoItem(props) {
    const [todo, setTodo] = React.useState(props.todo);
    // Used to mark/unmark a todo as completed:
    function markTodo(action) {
        // "action" parameter can be "mark" or "unmark"
        // Send a fetch request to mark the todo in Django:
        fetch("/todos", {
            method: "PUT",
            headers: {"X-CSRFToken": csrftoken},
            body: JSON.stringify({
                id: todo.id,
                action: action, // "mark" or "unmark"
            })
        }).then(response => {
            if (!response.ok) {
                // If something is wrong
                response.text().then(text => alert(text));
            } else {
                alert("Success!");
                // Update the todo element:
                response.json().then(json => {
                    setTodo(json);
                });
            }
        })
    }

    return (
        // Classes of some element changes based on task completion 
        <div 
            id={"todo" + todo.id} 
            className={todo.completed
                ? "todo-item bg-light border-bottom mb-1 completed"
                : "todo-item bg-light border-bottom mb-1"
            }
        >
            {todo.completed  
                ? <button 
                    className="btn bg-gray" 
                    onClick={() => markTodo("unmark")}>
                    <i className="bi bi-check-circle-fill text-secondary"></i>
                </button>
                : <button 
                    className="btn bg-lightblue" 
                    onClick={() => markTodo("mark")}>
                    <i className="bi bi-check-circle"></i>
                </button>
            }
            <div className="py-1 overflow-hide">
                <div>{todo.title}</div>
                <small className="text-secondary">
                    {todo.description}
                </small>
            </div>
            <div className="py-1 datetime">
                <small>
                    {time_remain(todo.deadline)}
                </small>
            </div>
        </div>
    )
}


// This is used to calculate the remaining time before a deadline:
function time_remain(deadline_str) {
    let date_now = new Date();
    let date_deadline = new Date(deadline_str);
    // Time difference in days:
    let diff = Math.round((date_deadline - date_now)/(1000*60*60*24));

    // Return value:
    let remain = "";

    // Way past deadline:
    if (diff < -1) {
        remain = -diff + " days overdue";
    // Deadline is not yet near:
    } else if (diff > 1) {
        remain = diff + " days left";
    } else {
        // Less than 24 hours left:
        // Time difference in hours:
        diff = Math.round((date_deadline - date_now)/(1000*60*60));
        if (diff == 0) {
            remain = "Less than 30 mins left"
        }
        else if (diff == 1) {
            remain = "1 hour left";
        } else if (diff > 1) {
            remain = diff + " hours left"
        } else {
            // Less than 1 day overdue:
            remain = "Overdue";
        }
    };
    return remain;
}

// For adding todos:
function AddTodoButton() {
    return (
        <div className="mb-1 text-center add-item">
            <button type="button" data-bs-toggle="modal" data-bs-target="#add-todo" className="btn bg-light w-100">
                <i className="bi bi-plus-square"></i>&nbsp;
                Add a Todo
            </button>
        </div>
    )
}


function AddTodoForm() {
    return (
        <form action="">
            <input type="text" className="form-control mb-2" name="title" placeholder="Title"/>
            <textarea name="description" className="form-control mb-2" placeholder="Description"/>
            <Datetime inputProps={{
                name: "deadline",
                placeholder: "Deadline"
            }}/>
        </form>
    )
}

// Used to display all of the todo items together:
function Todos() {
    const [todoAll, setTodoAll] = React.useState([]);

    // This only runs on mount (does not run on state update);
    React.useEffect(() => {
        fetch("/todos").then(response => response.json())
            .then(todoAllFetched => {
                setTodoAll(todoAllFetched);
            });
        return () => {
            setTodoAll([])
        };
    }, []);

    return (
        <div>
            <AddTodoButton />
            <Modal title="Add a Todo" content=<AddTodoForm />/>
            {todoAll.map(todo => (
                <TodoItem 
                    key = {todo.id} 
                    todo = {todo} 
                    setTodoAll = {setTodoAll}
                />
            ))}
        </div>
    )
}

export default Todos;
