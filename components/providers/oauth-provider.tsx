"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export const OAuthProvider = ({ children }: { children: ReactNode })=>{
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if(!clientId){
        if(process.env.NODE_ENV !== "production"){
            throw new Error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in environment variables.");
        }
        return <>{children}</>
    }
    return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
}