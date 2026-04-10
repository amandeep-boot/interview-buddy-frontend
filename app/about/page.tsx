export default function AboutPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
            <div className="w-full max-w-2xl space-y-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight">About Interview Buddy</h1>
                <p className="text-lg text-muted-foreground">
                    Interview Buddy is an AI-powered platform designed to help you prepare for job interviews with confidence. Our mission is to make interview practice accessible, effective, and stress-free for everyone.
                </p>
                <p className="text-base text-muted-foreground">
                    Whether you are a student, a professional, or changing careers, Interview Buddy provides personalized questions, resume analysis, and real-time feedback to support your journey.
                </p>
            </div>
        </main>
    );
}