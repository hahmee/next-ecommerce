"use server";
// Import necessary modules and types
import { NextRequest } from "next/server";
import {getCookie} from "@/utils/getCookieUtil";


// Define the backend URL and the maximum time for token refresh
const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL;
const MAX_TIME_REFRESH = 60 * 1000; // Use this to determine when to refresh tokens

// Define the main function for making authenticated requests
export default async function fetchWithCredentials(
    path: string,
    init: RequestInit | undefined,
    // req: NextRequest,
) {
    // Retrieve user credentials from the request
    const userCredentials =  getCookie('member');

    // If no user credentials are available, return an unauthorized response
    if (!userCredentials) {
        return { message: "No credentials provided", statusCode: 401 };
    }

    // Create a function to make the fetch request with the appropriate credentials
    const requestToFetch = makeFetch(path, userCredentials?.accessToken, init);

    const response = await requestToFetch(userCredentials.accessToken);

    console.log('???????????dpdpdppd', response);

    // Check if the access token is about to expire, and refresh it if needed
    // if (response.ok && response.status === 200 && data && data.error === 'ERROR_ACCESS_TOKEN') {
    //     // Attempt to refresh the tokens
    //     const newTokens = await refresh(userCredentials?.accessToken, userCredentials?.refreshToken, userCredentials?.email);
    //
    //     // If successful, save the new tokens and retry the original request
    //     if ("accessToken" in newTokens) {
    //         saveUserTokens(newTokens);
    //         return await requestToFetch(newTokens.accessToken);
    //     }
    //
    //     // If token refresh fails, return the error response
    //     return newTokens;
    // }


    // Check if the access token is about to expire, and refresh it if needed
    // if (userCredentials.tokenExpires - (Date.now() + MAX_TIME_REFRESH) < 0) {
    //     // Attempt to refresh the tokens
    //     const newTokens = await refresh(userCredentials?.refreshToken);
    //
    //     // If successful, save the new tokens and retry the original request
    //     if ("accessToken" in newTokens) {
    //         saveUserTokens(newTokens);
    //         return await requestToFetch(newTokens.accessToken);
    //     }
    //
    //     // If token refresh fails, return the error response
    //     return newTokens;
    // }

    // If the access token is still valid, proceed with the original request
    return requestToFetch();
}

// Function to refresh user tokens
async function refresh(at:string|undefined, rt: string | undefined, email:string) {
    return new Promise<any>((resolve) => { //UnauthorizedResponse | Tokens
        // Make a POST request to the token refresh endpoint
        fetch(BACKEND_URL + `/api/member/refresh?refreshToken=${rt}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${at}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            }),
        })
            .then((res) => res.json())
            .then((json) => resolve(json));
    });
}

// Function to create a fetch function with the specified credentials
function makeFetch(
    path: string,
    accessToken: string | undefined,
    init: RequestInit | undefined,
): (newAccessToken?: string) => Promise<any> {
    return async function (newAccessToken?: string) {
        // Make a fetch request to the specified path with the provided or refreshed access token
        return fetch(`${BACKEND_URL}${path}`, {
            headers: {
                Authorization: `Bearer ${newAccessToken ?? accessToken}`,
            },
            ...init,
        }).then((res) => res.json());
    };
}