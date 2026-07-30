import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";


export const supabase =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null;

export async function signUpWithEmail(email, password, username = "") {
    if (!supabase) {
        return { success: false, user: null, message: "Supabase is not configured yet." };
    }

    const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: username ? { username } : {},
            ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
        },
    });

    if (error) {
        console.error("Supabase sign up error", error);
        return { success: false, user: null, message: error.message || "Sign up failed. Please try again." };
    }

    if (data?.session) {
        return {
            success: true,
            user: data.user ?? null,
            session: true,
            message: "Account created. You are logged in.",
        };
    }

    if (data?.user) {
        return {
            success: true,
            user: data.user,
            session: false,
            message: "Account created. Please check your email and spam folder to confirm it, then log in.",
        };
    }

    return { success: false, user: null, message: "Sign up did not return an account. Please try again." };
}

export async function signInWithEmail(email, password) {
    if (!supabase) {
        return { success: false, user: null, message: "Supabase is not configured yet." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error("Supabase sign in error", error);
        return { success: false, user: null, message: error.message || "Log in failed. Check your email and password." };
    }

    return { success: true, user: data?.user ?? null, message: "You are logged in." };
}

export async function signInWithGoogle() {
    if (!supabase) {
        return { success: false, message: "Supabase is not configured yet." };
    }

    const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    });

    if (error) {
        console.error("Supabase Google sign in error", error);
        return { success: false, message: error.message || "Google sign-in failed." };
    }

    if (data?.url) {
        window.location.assign(data.url);
    }

    return { success: true, message: "Redirecting to Google sign-in..." };
}

export async function getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getHotDogEntries() {
    if (!supabase) return [];
    console.log(supabase, 'supabase')
    const { data, error } = await supabase
        .from("hotdog_entries")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase fetch error", error);
        return [];
    }

    return data || [];
}

export async function saveHotDogEntry(entry) {
    if (!supabase) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("hotdog_entries")
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();

    if (error) {
        console.error("Supabase insert error", error);
        return null;
    }

    return data;
}

export async function deleteHotDogEntry(id) {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase.from("hotdog_entries").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
        console.error("Supabase delete error", error);
        return false;
    }

    return true;
}
