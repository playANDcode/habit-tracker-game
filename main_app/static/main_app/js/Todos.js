// Import csrf token:
import csrftoken from "./csrf.js";
import ReactDOM from "react-dom";
import React from "react"; // A single todo item:

function TodoItem(props) {
  const [todo, setTodo] = React.useState(props.todo); // Used to mark/unmark a todo as completed:

  function markTodo(action) {
    // "action" parameter can be "mark" or "unmark"
    // Send a fetch request to mark the todo in Django:
    fetch("/todos", {
      method: "PUT",
      headers: {
        "X-CSRFToken": csrftoken
      },
      body: JSON.stringify({
        id: todo.id,
        action: action // "mark" or "unmark"

      })
    }).then(response => {
      if (!response.ok) {
        // If something is wrong
        response.text().then(text => alert(text));
      } else {
        alert("Success!"); // Update the todo element:

        response.json().then(json => {
          setTodo(json);
        });
      }
    });
  }

  return (
    /*#__PURE__*/
    // Classes of some element changes based on task completion 
    React.createElement("div", {
      id: "todo" + todo.id,
      className: todo.completed ? "todo-item bg-light border-bottom mb-1 completed" : "todo-item bg-light border-bottom mb-1"
    }, todo.completed ? /*#__PURE__*/React.createElement("button", {
      className: "btn bg-gray",
      onClick: () => markTodo("unmark")
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-check-circle-fill text-secondary"
    })) : /*#__PURE__*/React.createElement("button", {
      className: "btn bg-lightblue",
      onClick: () => markTodo("mark")
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-check-circle"
    })), /*#__PURE__*/React.createElement("div", {
      className: "py-1 overflow-hide"
    }, /*#__PURE__*/React.createElement("div", null, todo.title), /*#__PURE__*/React.createElement("small", {
      className: "text-secondary"
    }, todo.description)), /*#__PURE__*/React.createElement("div", {
      className: "py-1 datetime"
    }, /*#__PURE__*/React.createElement("small", null, time_remain(todo.deadline))))
  );
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
} // For adding todos:


function AddTodoButton() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-1 text-center add-item"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-bs-toggle": "modal",
    "data-bs-target": "#add-todo",
    className: "btn bg-light w-100"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-plus-square"
  }), "\xA0 Add a Todo"));
}

function AddTodoModal() {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal fade",
    id: "add-todo",
    tabindex: "-1",
    "aria-labelledby": "addTodoModal",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title",
    id: "addTodoModal"
  }, "Add a Todo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    "data-bs-dismiss": "modal",
    "aria-label": "Close"
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("form", {
    action: ""
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control mb-2",
    name: "title",
    placeholder: "Title"
  }), /*#__PURE__*/React.createElement("textarea", {
    name: "description",
    className: "form-control mb-2",
    placeholder: "Description"
  }), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    className: "form-control",
    placeholder: "Deadline"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-success"
  }, "Save")))));
} // Used to display all of the todo items together:


function Todos() {
  const [todoAll, setTodoAll] = React.useState([]); // This only runs on mount (does not run on state update);

  React.useEffect(() => {
    fetch("/todos").then(response => response.json()).then(todoAllFetched => {
      setTodoAll(todoAllFetched);
    });
    return () => {
      setTodoAll([]);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AddTodoButton, null), /*#__PURE__*/React.createElement(AddTodoModal, null), todoAll.map(todo => /*#__PURE__*/React.createElement(TodoItem, {
    key: todo.id,
    todo: todo,
    setTodoAll: setTodoAll
  })));
}

export default Todos;