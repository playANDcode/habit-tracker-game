// Import csrf token:
import csrftoken from "./csrf.js"

// A single todo item:
class TodoItem extends React.Component {
    // Used to mark a todo as completed:
    remove_todo(todo_id) {
        alert("removed");

        // Send a fetch request to mark the todo:
        fetch("/todos", {
            method: "PUT",
            headers: {"X-CSRFToken": csrftoken},
            body: JSON.stringify({
                id: todo_id,
                action: "check",
            })
        }).then(response => {
            if (!response.ok) {
                response.text().then(text => alert(text));
            } else {
                this.props.fetch_incomplete();
            }
        })
    }
    render () {
        return (
            <div 
                id={"todo" + this.props.todo.id} 
                className="todo-item bg-light border-bottom mb-1"
            >
                <button 
                    className="btn bg-lightblue" 
                    onClick={() => this.remove_todo(this.props.todo.id)}
                >
                    <i className="bi bi-check-circle"></i>
                </button>
                <div className="py-1 overflow-hide">
                    <div>{this.props.todo.title}</div>
                    <small className="text-secondary">
                        {this.props.todo.description}
                    </small>
                </div>
                <div className="py-1 datetime">
                    <small>
                        {time_remain(this.props.todo.deadline)}
                    </small>
                </div>
            </div>
        )
    }
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


// Used to display all of the INCOMPLETE todo items together:
class Todos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {todo_list: []}
        this.fetch_incomplete = this.fetch_incomplete.bind(this);
    }

    fetch_incomplete() {
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

    componentDidMount() {
        this.fetch_incomplete();
    }

    render () {
        return (
            <div>
                <AddTodo />
                {this.state.todo_list.map(todo => (
                    <TodoItem 
                        key = {todo.id} 
                        todo = {todo} 
                        fetch_incomplete = {this.fetch_incomplete}
                    />
                ))}
            </div>
        )
    }
}

export default function TodoAll() {
    ReactDOM.render(<Todos />, document.querySelector("#todos"));
    return null;
}

