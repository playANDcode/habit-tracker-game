// A single todo item:
function TodoItem({
  todo
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "item bg-light border-bottom mb-1"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn bg-lightblue",
    onClick: remove_todo
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-check-circle"
  })), /*#__PURE__*/React.createElement("div", {
    className: "py-1 overflow-hide"
  }, /*#__PURE__*/React.createElement("div", null, todo.title), /*#__PURE__*/React.createElement("small", {
    className: "text-secondary"
  }, todo.description)), /*#__PURE__*/React.createElement("div", {
    className: "py-1 datetime"
  }, /*#__PURE__*/React.createElement("small", null, time_remain(todo.deadline))));
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
} // Used to mark a todo as completed:


function remove_todo() {
  alert("removed");
} // Used to display all of the todo items together:


export default class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo_list: []
    };
  }

  componentDidMount() {
    fetch("/todo").then(response => response.json()).then(todo_list => {
      this.setState({
        todo_list: todo_list
      });
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AddTodo, null), this.state.todo_list.map(todo => /*#__PURE__*/React.createElement(TodoItem, {
      key: todo.id,
      todo: todo
    })));
  }

}
ReactDOM.render( /*#__PURE__*/React.createElement(Todos, null), document.querySelector("#todos"));