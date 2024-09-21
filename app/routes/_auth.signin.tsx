
import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { Form, Link, useNavigation, useLoaderData } from "@remix-run/react";
import { authenticator, EMAIL_PASSWORD_STRATEGY } from "~/services/authenticator.server";
import { getSession, commitSession } from "~/services/session.server";
import InputField from "~/components/InputField";
import ErrorMessage from "~/components/ErrorMessage";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Sign in" },
        { name: "description", content: "Sign in to manage your bank accounts securely." },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    await authenticator.isAuthenticated(request, {
        successRedirect: "/",
    });

    const session = await getSession(request.headers.get("cookie"));
    const error: { message: string  } | undefined = session.get(authenticator.sessionErrorKey);

    return json({ error } , {
        headers:{
            'Set-Cookie': await commitSession(session),
        }
    });
}

export async function action({ request }: ActionFunctionArgs) {
    return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
        failureRedirect: "/signin",
        successRedirect: "/",
    });
}

export default function SignIn() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const transition = useNavigation();
    const data = useLoaderData<typeof loader>();
    const isSubmitting = transition.state == "submitting";

    useEffect(() => {
        if (transition.state === "submitting" || transition.state === "loading") {
            setErrorMessage(null)
        } else if (data && data.error?.message) {
            setErrorMessage(data.error.message);
        }
    }, [data, transition.state])

    return (
        <section className="flex-center size-full max-sm:px-6">
            <section className="auth-form">
                <header className='flex flex-col gap-5 md:gap-8'>
                    <Link to="/" className="cursor-pointer flex items-center gap-1">
                        <img
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="Horizon logo"
                        />
                        <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                    </Link>

                    <div className="flex flex-col gap-1 md:gap-3">
                        <h1 className="text-24 lg:text-36 font-semibold text-gray-900">Sign In</h1>
                        <p className="text-16 font-normal text-gray-600">Please enter your details.</p>
                    </div>
                </header>

                <Form method="post" className="space-y-8">
                    <InputField label="Email" type="email" name="email" required />
                    <InputField label="Password" type="password" name="password" required autoComplete="current-password" />

                    <div className="flex flex-col gap-4">
                        <button type="submit" className="form-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </button>
                    </div>

                    {
                        errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>
                    }
                </Form>
            </section>
        </section>
    );
}