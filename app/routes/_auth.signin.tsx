
import { Form, Link } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator, EMAIL_PASSWORD_STRATEGY } from "~/services/authenticator.server";
import InputField from "~/components/InputField";

export async function loader({ request }: LoaderFunctionArgs) {
    return await authenticator.isAuthenticated(request, {
      successRedirect: "/",
    });
}

export async function action({ request }: ActionFunctionArgs) {
    return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
        successRedirect: "/",
        failureRedirect: "/signin",
    });
}

export default function SignIn() {
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
                    <InputField label="Email"  type="email" name="email" required  />
                    <InputField label="Password"  type="password" name="password" required autoComplete="current-password" />
                    <div className="flex flex-col gap-4">
                        <button type="submit" className="form-btn">Sign In</button>
                    </div>
                </Form>
            </section>
        </section>
    );
}