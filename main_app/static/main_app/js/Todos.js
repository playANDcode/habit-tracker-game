// Import csrf token:
import csrftoken from "./csrf.js"; // A single todo item:

class TodoItem extends React.Component {
  // Used to mark a todo as completed:
  remove_todo(todo_id) {
    alert("removed"); // Send a fetch request to mark the todo:

    fetch("/todos", {
      method: "PUT",
      headers: {
        "X-CSRFToken": csrftoken
      },
      body: JSON.stringify({
        id: todo_id,
        action: "check"
      })
    }).then(response => {
      if (!response.ok) {
        response.text().then(text => alert(text));
      } else {
        this.props.fetch_incomplete();
      }
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "todo" + this.props.todo.id,
      className: "todo-item bg-light border-bottom mb-1"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn bg-lightblue",
      onClick: () => this.remove_todo(this.props.todo.id)
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-check-circle"
    })), /*#__PURE__*/React.createElement("div", {
      className: "py-1 overflow-hide"
    }, /*#__PURE__*/React.createElement("div", null, this.props.todo.title), /*#__PURE__*/React.createElement("small", {
      className: "text-secondary"
    }, this.props.todo.description)), /*#__PURE__*/React.createElement("div", {
      className: "py-1 datetime"
    }, /*#__PURE__*/React.createElement("small", null, time_remain(this.props.todo.deadline))));
  }

} // "Add a todo" button:


function AddTodo() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-1 text-center add-item"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn bg-light w-100"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-plus-square"
  }), "\xA0 Add a Todo"));
} // This is used to calculate the remaining time before a deadline:


function time_remain(deadline_str) {
  let date_now = new Date();
  let date_deadline = new Date(deadline_str); // Time difference in days:

  let diff = Math.round((date_deadline - date_now) / (1000 * 60 * 60 * 24)); // Return value:

  let remain = ""; // Way past deadline:

  if (diff < -1) {
    remain = -diff + " days overdue"; // Deadline is not yet near:
  } else if (diff > 1) {
    remain = diff + " days left";
  } else {
    // Less than 24 hours left:
    // Time difference in hours:
    diff = Math.round((date_deadline - date_now) / (1000 * 60 * 60));

    if (diff == 0) {
      remain = "Less than 30 mins left";
    } else if (diff == 1) {
      remain = "1 hour left";
    } else if (diff > 1) {
      remain = diff + " hours left";
    } else {
      // Less than 1 day overdue:
      remain = "Overdue";
    }
  }

  ;
  return remain;
} // Used to display all of the INCOMPLETE todo items together:


class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo_list: []
    };
    this.fetch_incomplete = this.fetch_incomplete.bind(this);
  }

  fetch_incomplete() {
    // Fetch all todos from Django if the element mounts:
    fetch("/todos").then(response => response.json()).then(todo_list_all => {
      // Filter all the todos that are not yet complete:
      let todo_list_filtered = todo_list_all.filter(todo => {
        return todo.completed == null;
      });
      console.log(todo_list_filtered);
      this.setState({
        todo_list: todo_list_filtered
      });
    });
  }

  componentDidMount() {
    this.fetch_incomplete();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AddTodo, null), this.state.todo_list.map(todo => /*#__PURE__*/React.createElement(TodoItem, {
      key: todo.id,
      todo: todo,
      fetch_incomplete: this.fetch_incomplete
    })));
  }

}

export default function TodoAll() {
  ReactDOM.render( /*#__PURE__*/React.createElement(Todos, null), document.querySelector("#todos"));
  return null;
}