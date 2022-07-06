import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const logIn = async (username: string, password: string) => {

    let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);

    let errorMessage = "";

    if (user === null) user = []; // hacky thingy to prevent typescript from being a pain in the arm

    if (user.length === 0) {
        errorMessage = "The username or password is incorrect";
        return [null, errorMessage];
    } 
    else {
        let userSingle = user[0]; // user is an array of size 1
        if (userSingle.password === password) {
            //console.log(userSingle)
            return [userSingle, errorMessage];
        }
        else {
            errorMessage = "The username or password is incorrect";
            return [null, errorMessage];
        }
    }

}

export { supabase, logIn };