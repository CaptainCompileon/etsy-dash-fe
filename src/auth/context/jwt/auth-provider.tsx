'use client';

import {useMemo, useEffect, useCallback} from 'react';

import {useSetState} from 'src/hooks/use-set-state';

import axios, {endpoints} from 'src/utils/axios';

import {AuthContext} from '../auth-context';

import type {AuthState} from '../../types';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({children}: Props) {
    const {state, setState} = useSetState<AuthState>({
        user: null,
        loading: true,
    });

    const checkUserSession = useCallback(async () => {
        // TODO: The way I've done it before is somewhat similar to what you describe:
        // On initial page load make an API call to see if the user is authenticated. If they are, store isLoggedIn=true somewhere that your app can access it
        // If not logged in, show the login page
        // If logged in, you're good
        // All API endpoints that require the user to be logged in should return a correct error code if the user is not authenticated with the cookie (eg 401). If you receive a 401, redirect the user to the login page and set isLoggedIn to false

        try {
            const res = await axios.get(endpoints.auth.me);

            const {user} = res.data;

            setState({user: {...user}, loading: false});
        } catch (error) {
            console.error(error);
            setState({user: null, loading: false});
        }
    }, [setState]);

    useEffect(() => {
        checkUserSession();
    }, []);

    // ----------------------------------------------------------------------

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue = useMemo(
        () => ({
            user: state.user
                ? {
                    ...state.user,
                    role: state.user?.role ?? 'admin',
                }
                : null,
            checkUserSession,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
        }),
        [checkUserSession, state.user, status]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
