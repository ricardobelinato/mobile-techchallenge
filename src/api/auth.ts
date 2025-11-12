import axios from 'axios';

export async function auth(email: string, password: string) {
    try {
        const response = await axios.post('http://localhost:3000/auth/login', {
            email,
            senha: password,
        });
        
        return response.data;
    } catch(err) {
        console.error(err);
        throw err;
    }
}
