import React from "react";

// Content can be a react app
export default function Modal({title, content}) {
    return (
      <div className="modal fade" id="add-todo" tabIndex="-1" aria-labelledby="addTodoModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTodoModal">
                {title}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {content}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}
