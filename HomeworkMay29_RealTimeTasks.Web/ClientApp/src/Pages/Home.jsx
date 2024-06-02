import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import getAxios from '../AuthAxios';
import { useAuth } from '../AuthContext';
import { HubConnectionBuilder } from '@microsoft/signalr';

const Home = () => {

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');

    const connectionRef = useRef(null);

    const { user } = useAuth();

    const getTasks = async () => {
        const { data } = await getAxios().get('/api/task/getall');
        setTasks(data);
        setIsLoading(false);
    }

    useEffect(() => {
        getTasks();
    }, []);
    useEffect(() => {
        const connectToHub = async () => {
            const connection = new HubConnectionBuilder().withUrl("/api/task").build();
            await connection.start();
            connectionRef.current = connection;

            connection.on('newTask', value => {
                setTasks(tasks => [...tasks, value]);
            });

            connection.on('taskUpdate', value => {
                setTasks(value);
            });
        }
        connectToHub();
    }, []);

    if (isLoading) {
        return <div className='container' style={{ marginTop: 300 }}>
            <div className='d-flex w-100 justify-content-center align-self-center'>
                <img src='/src/loadingimage/Spin@1x-1.0s-200px-200px.gif' />
            </div>
        </div>
    }

    const onAddClick = async () => {
        await getAxios().post('/api/task/add', { title });
        setTitle('');
    }

    const onStatusButtonClick = async (taskId, userId) => {
        !userId && await getAxios().post('/api/task/assign', { id: taskId, userId: user.id });
        userId === user.id && await getAxios().post('/api/task/finish', { id: taskId, userId });
    }

    return (
        <>
            <div className='container' style={{ marginTop: 80 }}>
                <div style={{ marginTop: 70 }}>
                    <div className='row'>
                        <div className='col-md-10'>
                            <input value={title} onChange={e => setTitle(e.target.value)} type='text' className='form-control' placeholder='Task Title' />
                        </div>
                        <div className='col-md-2'>
                            <button onClick={onAddClick} className='btn btn-outline-dark w-100'>Add Task</button>
                        </div>
                    </div>
                </div>
            </div>
            <table className='table table-hover table-striped table-bordered mt-3'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(t =>
                        <tr key={t.id}>
                            <td className='col-md-9'>{t.title}</td>
                            <td>
                                <button className={!t.userID ? 'btn btn-outline-dark w-100'
                                    : (t.userID === user.id) ? 'btn btn-outline-success w-100' : 'btn btn-outline-warning w-100'}
                                    disabled={t.userID && t.userID !== user.id}
                                    onClick={() => onStatusButtonClick(t.id, t.userID)}>
                                    {!t.userID ? 'Assign' : t.userID === user.id ? 'Finish' : `${t.user.firstName} ${t.user.lastName} is doing this one`}
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default Home;