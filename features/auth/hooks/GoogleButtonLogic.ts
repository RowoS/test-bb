import { LoginWithGoogle } from "../lib/auth-actions";
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";


export function GoogleButtonLogic(nextRoute: string) {
    const {isLoading,error: globalError,success: globalSuccess,setError,setSuccess,run,} = useAsyncForm();
  
    const handleLogin = async () => {
      
      await run(async () => {
        const { error } = await LoginWithGoogle(nextRoute);
        if (error) throw error;


      });
    };

    return {
        isLoading,
        error: globalError,
        success: globalSuccess,
        handleLogin,
    }


}

