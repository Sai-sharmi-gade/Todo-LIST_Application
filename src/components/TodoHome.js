import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoHome.css';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const TodoHome = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [message, setMessage] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const navigate = useNavigate();

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', { name: newTask });
            setTasks([...tasks, response.data]);
            setMessage('Task added successfully!');
            setTimeout(() => setMessage(''), 2000);
            setNewTask('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
            setMessage('Task deleted successfully!');
            setTimeout(() => setMessage(''), 2000);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const toggleTaskCompletion = async (id, completed) => {
        await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed });
        const updatedTasks = tasks.map(task => 
            task._id === id ? { ...task, completed: !completed } : task
        );
        setTasks(updatedTasks);

        if (!completed) {
            setMessage('Hooray!! You completed your task!!');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="todo-home">
            {showConfetti && <Confetti />}
            <button className="logout-btn" onClick={logout}>Logout</button>
            <h1 className="todo-heading">My Tasks</h1>
            {message && <div className="popup-message">{message}</div>}
            <form onSubmit={addTask} className="task-form">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter new task"
                    className="task-input"
                />
                <button type="submit" className="task-button">Add Task</button>
            </form>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task._id} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task._id, task.completed)}
                            className="task-checkbox"
                        />
                        <span className={`task-name ${task.completed ? 'completed' : ''}`}>
                            {task.name}
                        </span>
                        <i className="fas fa-trash" onClick={() => deleteTask(task._id)}></i>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoHome;
