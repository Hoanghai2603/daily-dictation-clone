import Link from "next/link";

export function Footer(): React.ReactNode {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="inline-block font-heading text-xl font-bold text-primary mb-4">
                            DailyDictation
                        </Link>
                        <p className="text-sm text-foreground/60 max-w-xs mb-6">
                            Improve your English listening skills with our free online dictation exercises. All levels from basic to advanced.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Exercises</h3>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><Link href="/exercises/short-stories" className="hover:text-primary transition-colors">Short Stories</Link></li>
                            <li><Link href="/exercises/conversations" className="hover:text-primary transition-colors">Conversations</Link></li>
                            <li><Link href="/exercises/toeic" className="hover:text-primary transition-colors">TOEIC</Link></li>
                            <li><Link href="/exercises/ielts" className="hover:text-primary transition-colors">IELTS</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Community</h3>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><Link href="/top-users" className="hover:text-primary transition-colors">Top Users</Link></li>
                            <li><Link href="/discussions" className="hover:text-primary transition-colors">Discussions</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Links</h3>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-foreground/40">
                    <p>© {new Date().getFullYear()} DailyDictation Clone. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
