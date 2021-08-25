import ReactDOM from "react-dom";
import React from "react";
// Datetime Picker for setting deadlines:
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
// Bootstrap Modal:
import Modal from "./components/Modal.js";
// CSRF token for Django:
import csrftoken from "./csrf.js";

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
                action: action, // can be "mark" or "unmark"
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
    //
    // Used to delete a Todo
    function deleteTodo() {
        fetch("/todos", {
            method: "PUT",
            headers: {"X-CSRFToken": csrftoken},
            body: JSON.stringify({
                id: todo.id,
                action: "delete",
            })
        }).then(response => {
            if (response.ok) {
                // delete from state
                props.setTodoAll(
                    props.todoAll.filter(todo_i => todo_i.id != todo.id)
                )
            } else {
                response.text().then(text => alert(text))
            }
        })
    }

    function editTodo() {
        // The following block is used to prefill the edit form 
        let form = document.querySelector("#edit-todo form");
        form.querySelector("input[name='id']").value = todo.id;
        form.querySelector("input[name='title']").value = todo.title;
        let desc = form.querySelector("textarea[name='description']");
        desc.value = todo.description;
        let deadline = form.querySelector("input[name='deadline']");
        let deadline_date = new Date(todo.deadline);
        deadline.value = deadline_date.toLocaleString();

        // Handle edit form submission:
        form.onsubmit = (event) => {
            event.preventDefault();
            console.log("Submitted");
            let formData = new FormData(form);
            let new_deadline = new Date(formData.get("deadline"));
            formData.set("deadline", new_deadline.toISOString());
            // Used to tell Django that the "action" is editing a Todo:
            let dataObject = {"action": "edit"};
            formData.forEach((value, key) => {
                dataObject[key] = value;
            });
            fetch("/todos", {
                method: "PUT",
                headers: {"X-CSRFToken": csrftoken},
                body: JSON.stringify(dataObject)
            }).then(response => {
                if (!response.ok) {
                    response.text().then(text => alert(text));
                } else {
                    response.json().then(json => setTodo(json));
                }
            })
        }
    }

    return (
        // Classes of some element changes based on task completion 
        // The div element for a single Todo item (buttons included):
        <div 
            id={"todo" + todo.id} 
            className={todo.completed
                ? "todo-item border-bottom mb-1 completed"
                : "todo-item border-bottom mb-1"
            }
        >
            {todo.completed  
                ? <button 
                    className="btn bg-success" 
                    onClick={() => markTodo("unmark")}>
                    <i className="fas fa-check-square"></i>
                </button>
                : <button 
                    className="btn bg-warning" 
                    onClick={() => markTodo("mark")}>
                    <i className="far fa-check-square"></i>
                </button>
            }
            <div className="py-1 overflow-hide todo-title">
                <div>
                    {todo.title}
                </div>
                <small className="todo-desc text-secondary">
                    <span>
                        {time_remain(todo.deadline)}
                    </span>
                    <span>
                        {todo.description ? ": " + todo.description: ""}
                    </span>
                </small>
            </div>
            {todo.completed
                ?<button className="btn delete-todo" onClick={deleteTodo}>
                    <i className="text-light far fa-trash-alt"></i>
                </button>
                :<button data-bs-toggle="modal" data-bs-target="#edit-todo" onClick={editTodo} className="btn delete-todo">
                    <i className="text-light fas fa-pencil-alt"></i>
                </button>
            }
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

// Button for adding todos:
function AddTodoButton() {
    return (
        <div className="mb-1 text-center add-item">
            <button type="button" data-bs-toggle="modal" data-bs-target="#add-todo" className="btn bg-gray-200 w-100">
                <i className="far fa-plus-square"></i>&nbsp;
                Add a Todo
            </button>
        </div>
    )
}

function TodoForm({submit, formName}) {
    return (
        <form id={formName} onSubmit={submit}>
            <input type="hidden" name="id"/>
            <input type="text" className="form-control mb-2" name="title" placeholder="Title"/>
            <textarea name="description" className="form-control mb-2" placeholder="Description"/>
            <Datetime inputProps={{
                name: "deadline",
                placeholder: "Deadline"
            }}/>
        </form>
    )
}

// Used for rendering the edit-todo form:
function EditTodoForm() {
    return <TodoForm submit={() => {}} formName="edit-todo-form"/>;
}

// Used for rendering and handling form submission for adding a Todo
function AddTodoForm({setTodoAll, todoAll}) {
    // Submit the form
    let submit = (event) => {
        event.preventDefault();
        let formData = new FormData(event.target);
        let deadline = new Date(formData.get("deadline"));
        formData.set("deadline", deadline.toISOString());
        fetch("/todos", {
            method: "POST",
            headers: {"X-CSRFToken": csrftoken},
            body: formData
            }).then(response => {
            if (response.ok) {
                response.json().then(newTodo => {
                    setTodoAll([...todoAll, newTodo])
                })
            } else {
                alert("Something is wrong")
            }
        });
        event.target.reset();
    }
    return <TodoForm submit={submit} formName="add-todo-form"/>;
}

// Used to display all of the todo items together:
function Todos() {
    const [todoAll, setTodoAll] = React.useState([]);

    // This only runs on mount (does not run on state update);
    React.useEffect(() => {
        // Fetch all todos from Django:
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
            <Modal 
                title="Add a Todo" 
                content=<AddTodoForm 
                    todoAll={todoAll}
                    setTodoAll={setTodoAll}
                />
                formName="add-todo-form"
                modal_id="add-todo"
            />
            <Modal 
                title="Edit a Todo" 
                content=<EditTodoForm />
                formName="edit-todo-form"
                modal_id="edit-todo"
            />
            {todoAll.map(todo => (
                <TodoItem 
                    key = {todo.id} 
                    todo = {todo} 
                    setTodoAll = {setTodoAll}
                    todoAll = {todoAll}
                />
            ))}
        </div>
    )
}

export default Todos;
