import { createContext, useEffect, useReducer } from 'react'; 
import axios from '../helpers/axios';

const AuthContext = createContext();

const AuthReducer = (state,action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user : action.payload};
        case 'LOGOUT':
            return { user : null };  
        default:
            return state;
    }
}

const AuthContextProvider = ({ children }) => {

    let [state, dispatch] = useReducer(AuthReducer, {
        user : null
    })

    useEffect(() => {
        try {
            axios.get('/api/users/me').then(res => {
                let user = res.data;
                if(user) {
                    dispatch({ type : 'LOGIN', payload : user});
                }
                else {
                    dispatch({ type : 'LOGOUT'});
                }
            }) 
        } catch (e) {
            dispatch({ type : 'LOGOUT'});
        }
    }, [])

    return ( 
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider}
