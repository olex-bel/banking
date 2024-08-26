
import { Form, Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator, signUpWithEmail } from "~/services/authenticator.server";
import { commitSession, getSession } from "~/services/session.server";
import InputField from "~/components/InputField";

export async function loader({ request }: LoaderFunctionArgs) {
    return await authenticator.isAuthenticated(request, {
      successRedirect: "/",
    });
}

export async function action({ request }: ActionFunctionArgs) {
    const userSession = await signUpWithEmail(request);
    
    if (userSession) {
        const cokieSession = await getSession(request.headers.get("cookie"));
        cokieSession.set(authenticator.sessionKey, userSession);

        return redirect("/", {
            headers: { "Set-Cookie": await commitSession(cokieSession) },
        });
    }

    return redirect("/signup");
}

export default function SignUp() {
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
                        <h1 className="text-24 lg:text-36 font-semibold text-gray-900">Sign Up</h1>
                        <p className="text-16 font-normal text-gray-600">Please enter your details.</p>  
                    </div>
                </header>

                <Form method="post" className="space-y-8">
                    <div className="flex gap-4">
                        <InputField label="First Name" name="firstName" required  />
                        <InputField label="Last Name"  name="lastName" required  />
                    </div>
                    <InputField label="Address" name="address1" required  />
                    <div className="flex gap-4">
                        <InputField label="State" name="state" required  />
                        <InputField label="Postal Code" name="postalCode" required  />
                    </div>
                    <div className="flex gap-4 justify-between">
                        <InputField label="Date of Birth" type="date" name="dateOfBirth" required  />
                        <InputField label="SNN" name="snn" required  />
                    </div>
                    <InputField label="Email"  type="email" name="email" required  />
                    <InputField label="Password"  type="password" name="password" required />
                    <div className="flex flex-col gap-4">
                        <button type="submit" className="form-btn">Sign Up</button>
                    </div>
                </Form>
            </section>
        </section>
    );
}