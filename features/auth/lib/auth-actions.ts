"use client";

import { createClient } from "@/lib/supabase/client";


export async function loginUser(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { user: null, error, requiresMFA: false };

  // check if MFA is required by comparing assurance levels
  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  
  if (aalData && aalData.nextLevel === "aal2" && aalData.nextLevel !== aalData.currentLevel) {
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const totpFactor = factorsData?.totp?.[0];
    
    if (totpFactor) {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });
      if (challengeError) return { user: null, error: challengeError, requiresMFA: false };
      return {
        user: data.user,
        requiresMFA: true,
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        error: null,
      };
    }
  }

  const { profile, profileError } = await getUserWithProfile(data.user.id);
  return { user: data.user, profile, error: null, profileError, requiresMFA: false };
}

export async function verifyMFA(factorId: string, challengeId: string, code: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
  if (error) return { error };
  const { profile, profileError } = await getUserWithProfile(data.user.id);
  return { user: data.user, profile, profileError, error: null };
}

export async function getUserWithProfile(id: string) {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", id)
  .single();

  return {profile, profileError};
}

export async function signUpUser(email: string,password: string,username: string) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login?verified=true`,
      data: { "display_name": username },

    },
  });
}

export async function forgetPassword(email: string) {
  const supabase = createClient();

  return supabase.auth.resetPasswordForEmail(email,
    {redirectTo: `${window.location.origin}/update-password`}
  );

}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  return supabase.auth.updateUser(
    { password: newPassword }
  );
}

export async function updateRole(role: "customer" | "vendor") {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }


  return supabase.from("profiles")
    .update({ role })
    .eq("id", user.id)
    .select()
    .single();
}

export async function resendEmailConfirmation(UserEmail: string) {
  const supabase = createClient();

  return supabase.auth.resend({ 
    type: "signup", 
    email:UserEmail,
    options: {
      emailRedirectTo: `${window.location.origin}/sign-up/role-select`
    }
  });
}

export async function LoginWithGoogle(nextRoute: string) {
  const supabase = createClient();
    
  const redirectTo = `${window.location.origin}/auth/callback?next=${nextRoute}`;

  return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
  });

}

export async function LogOutUser()
{
  const supabase = createClient();
  return supabase.auth.signOut();
}
