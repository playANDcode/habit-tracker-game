// Import csrf token:
import csrftoken from "./csrf.js"

// A single todo item:
function TodoItem({todo}) {
    return (
        <div 
            id={"todo" + todo.id} 
            className="todo-item bg-light border-bottom mb-1"
        >
            <button 
                className="btn bg-lightblue" 
                onClick={() => remove_todo(todo.id)}
            >
                <i className="bi bi-check-circle"></i>
            </button>
            <div className="py-1 overflow-hide">
                <div>{todo.title}</div>
                <small className="text-secondary">
                    {todo.description}
                </small>
            </div>
            <div className="py-1 datetime">
                <small>{time_remain(todo.deadline)}</small>
            </div>
        </div>
    )
}

// "Add a todo" button:
function AddTodo() {
    return (
        <div className="mb-1 text-center add-item">
            <button className="btn bg-light w-100">
                <i className="bi bi-plus-square"></i>&nbsp;
                Add a Todo
            </button>
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

// Used to mark a todo as completed:
function remove_todo(todo_id) {
    alert("removed");
    let todo_item_el = document.querySelector("#todo" + todo_id);
    todo_item_el.remove();

    fetch("/todos", {
        method: "PUT",
        headers: {"X-CSRFToken": csrftoken},
        body: JSON.stringify({
            id: todo_id,
            action: "check",
        })
    }).then(response => console.log(response))
}

// Used to display all of the todo items together:
export default class Todos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {todo_list: []}
    }

    componentDidMount() {
        // Fetch all todos from Django if the element mounts:
        fetch("/todos").then(response => response.json())
            .then(todo_list_all => {
                // Filter all the todos that are not yet complete:
                let todo_list_filtered = todo_list_all.filter(todo => {
                    return todo.completed == null;
                });
                console.log(todo_list_filtered);
                this.setState({todo_list: todo_list_filtered});
            });
    }

    render () {
        return (
            <div>
                <AddTodo />
                {this.state.todo_list.map(todo => (
                    <TodoItem key = {todo.id} todo = {todo} />
                ))}
            </div>
        )
    }
}

