'use client';

import axios, {endpoints} from 'src/utils/axios';

// ----------------------------------------------------------------------

export type SignInParams = {
    email: string;
    password: string;
};

export type SignUpParams = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({email, password}: SignInParams): Promise<void> => {
    try {
        const params = {email, password};

        await axios.post(endpoints.auth.signIn, params);

    } catch (error) {
        console.error('Error during sign in:', error);
        throw error;
    }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
                                 email,
                                 password,
                                 firstName,
                                 lastName,
                             }: SignUpParams): Promise<void> => {
    const params = {
        email,
        password,
        name: `${firstName} ${lastName}` as string,
    };

    try {
        await axios.post(endpoints.auth.signUp, params);
    } catch (error) {
        console.error('Error during sign up:', error);
        throw error;
    }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
    try {
        await axios.post(endpoints.auth.signOut);

    } catch (error) {
        console.error('Error during sign out:', error);
        throw error;
    }
};
