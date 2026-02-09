import { Store } from "lucide-react";

export function WelcomeMessage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 shadow-inner ring-1 ring-primary/20">
                <Store className="w-12 h-12 text-primary" />
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Welcome to Tambo Store
            </h2>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Discover premium gear curated just for you.
                <br />
                <span className="text-sm mt-4 block opacity-80">
                    Use the chat on the right to start searching or ask for recommendations.
                    To start over at any time, just say <span className="font-semibold text-primary">"start from the beginning"</span>.
                </span>
            </p>
        </div>
    );
}
