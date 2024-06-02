import React, { createContext, useContext, useEffect, useState } from 'react';
import getAxios from './AuthAxios';

const AuthContext = createContext();

const AuthContextComponent = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await getAxios().get('/api/account/getcurrentuser');
                setUser(data);
            }
            catch {
            }
            setIsLoading(false);
        }

        getUser();
    }, []);


    if (isLoading) {
        return <div className='container' style={{ marginTop: 300 }}>
            <div className='d-flex w-100 justify-content-center align-self-center'>
                <img src='/src/loadingimage/Spin@1x-1.0s-200px-200px.gif' />
            </div>
        </div>
    }

    return <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>

}

const useAuth = () => useContext(AuthContext);


export { AuthContextComponent, useAuth };