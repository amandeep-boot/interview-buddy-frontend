export default function ServicesPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
            <div className="w-full max-w-2xl space-y-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
                <ul className="text-lg text-muted-foreground space-y-2 list-disc list-inside text-left mx-auto max-w-md">
                    <li>AI-generated interview questions tailored to your role and experience</li>
                    <li>Resume and job description analysis for targeted practice</li>
                    <li>Real-time feedback and coaching during mock interviews</li>
                    <li>Session history to track your progress</li>
                </ul>
                <p className="text-base text-muted-foreground">
                    We aim to make your interview preparation simple and effective.
                </p>
            </div>
        </main>
    );
}