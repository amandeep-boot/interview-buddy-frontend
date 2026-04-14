import { NextResponse } from "next/server";
type GoogleAuthSuccess ={
    access_token : string;
    token_type?:string;
    expires_in?:number;
    refresh_token?:string;
}

const ParseJsonSafely = (value : string)=>{
    try{
        return JSON.parse(value);
    }
    catch{
        return null; 
    }
}

export async function POST(request:Request){
    const backendUrl = process.env.BACKEND_API_URL;

    if(!backendUrl){
        return NextResponse.json(
            {message:"Server auth configuration is missing."},
            {status : 500}
        )
    }

    let body :{id_token?:string} ; 
    try{
        body = await request.json();
    }catch{
        return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
    }

    const idToken = body.id_token;
    if (!idToken || typeof idToken !== "string") {
        return NextResponse.json({ message: "id_token is required." }, { status: 400 });
    }

    let backendRes: Response;

    try {
        backendRes = await fetch(`${backendUrl}/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ id_token: idToken }),
        cache: "no-store",
        });
    } catch {
        return NextResponse.json(
        { message: "Auth service is unavailable. Please try again." },
        { status: 502 }
      );
    }

    const rawText = await backendRes.text();
   const parsed = ParseJsonSafely(rawText);
 
   if (!backendRes.ok) {
     const detail =
       (parsed && (parsed.detail || parsed.message || parsed.error)) ||
       rawText ||
       "Google authentication failed.";
     return NextResponse.json({ message: detail }, { status: backendRes.status });
   }
 
   const data = parsed as GoogleAuthSuccess | null;
   if (!data?.access_token) {
     return NextResponse.json(
       { message: "Invalid response from auth service." },
       { status: 502 }
     );
   }
 
   return NextResponse.json({
     access_token: data.access_token,
     token_type: data.token_type ?? "bearer",
     expires_in: data.expires_in,
     refresh_token: data.refresh_token,
   });
}