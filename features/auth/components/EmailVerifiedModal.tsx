import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
interface EmailVerifiedModalProps {
  onClose: () => void;
}

export default function EmailVerifiedModal({ onClose}: EmailVerifiedModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"onClick={onClose}></div>
            <div className="relative bg-[#F4D35E] rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-[scale-in_0.2s_ease-out]">
                <Button
                onClick={onClose}
                className="absolute top-6 right-6 text-accent-blue hover:text-hover-orange transition-colors"
                >
                <X className="w-8 h-8" />
                </Button>

                <div className="text-center space-y-8">
                <div className="flex items-center justify-center gap-4">
                    <CheckCircle2 className="w-16 h-16 text-accent-orange flex-shrink-0" strokeWidth={2.5} />
                    <p className="text-2xl md:text-3xl text-accent-blue leading-relaxed text-left">
                    Your email has now been verified and you can now log in
                    </p>
                </div>

                <div className="pt-4">
                    <Button
                    onClick={onClose}
                    className="w-full sm:w-auto px-12 py-4 bg-foreground hover:bg-accent-black text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                    Log In
                    </Button>
                </div>
                </div>
            </div>
        </div>
    );
}