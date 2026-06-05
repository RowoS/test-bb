import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { resendEmailConfirmation } from "../lib/auth-actions";

export function VerificationModalLogic() {
    const {isLoading,error: globalError,success: globalSuccess,setError,setSuccess,run,} = useAsyncForm();

    const handleResend = async (email: string) => {
        await run(async () => {
            const { error } = await resendEmailConfirmation(email);
            if (error) throw error;
            setSuccess("Verification email resent successfully.");
        });
    };

    const gotoEmailProvider = (email: string) => {
        const domain = email.split("@")[1];
        const url = `https://www.${domain}`;
        window.open(url, "_blank");
    };

    return {
        isLoading,
        error: globalError,
        success: globalSuccess,
        handleResend,
        gotoEmailProvider,
    };
}