import React, { useEffect, useState } from "react";

export const Agenda = () => {

    let [task, setTask] = useState("")
    let [todos, setTodos] = useState([])


    const API_URL = "https://playground.4geeks.com/todo";
    function handleTask(event) {
        setTask(event.target.value)
    }


    const crearUsuario = () => {
        fetch(API_URL + "/users/felipeg", {
            method: "POST",
            headers: { "Content-type": "application/json", }
        })
            .then(response => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.log(error))
    }

    const traerLista = () => {
        fetch(API_URL + "/users/felipeg")
            .then(response => {
                if (response.status === 404) {
                    crearUsuario()
                }
                return response.json()
            })
            .then((data) => setTodos(data.todos))
            .catch((error) => console.log(error))
    }
    useEffect(() => {
        traerLista()
    }, [])

    const crearTarea = (task) => {
        fetch(API_URL + "/todos/felipeg", {
            method: "POST",
            headers: { "Content-type": "application/json", },
            body: JSON.stringify({
                "label": task,
                "is_done": false
            })
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                traerLista();
            })
            .catch((error) => console.error(error));
    }

    const handleFormEnter = (event) => {
        event.preventDefault();
        if (task.trim() === '') {
            return;
        }
        crearTarea(task)
        setTask('');
    }

    const handleDeleteTask = (taskId) => {
        fetch(`${API_URL}/todos/${taskId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la tarea: ' + response.statusText);
                }
                const actualizarLista = todos.filter(taskItem => taskItem.id !== taskId);
                setTodos(actualizarLista);
            })
            .catch((error) => console.error(error));
    }
    const borrarTareas = () => {
        fetch(API_URL + "/users/felipeg", {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al borrar todas las tareas/usuario: ' + response.statusText);
                }
                setTodos([]);
                crearUsuario();

            })
            .catch((error) => console.error("Hubo un error al borrar todo:", error));
    }

    return (
        <div className="todos container">
            <h1 className="title">todos</h1>
            <div className="todo-list container">

                <form onSubmit={handleFormEnter}>
                    <input type="text" className="form-control" id="exampleInputText" placeholder="What needs to be done?" autoComplete="off" value={task} onChange={handleTask} />
                </form>

                <ul className="container">

                    {todos.map((todos) => (
                        <li key={todos.id}>
                            <span>{todos.label}</span>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteTask(todos.id)}
                            >
                                &times;
                            </button>
                        </li>

                    ))}
                </ul>
                <p className="numero-items">{todos.length} items left</p>
                <button className="btn btn-danger mt-3" onClick={borrarTareas}>
                    Borrar todas las tareas
                </button>

            </div>
        </div>
    )
}