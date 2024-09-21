
import { Form, Link, useNavigation, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { zx } from "zodix";
import { z } from "zod";
import { authenticator } from "~/services/authenticator.server";
import { commitSession, getSession } from "~/services/session.server";
import { signUp, handleSignUpError } from "~/services/db/users.server";
import InputField from "~/components/InputField";
import { zodErrors } from "~/libs/utils";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";


export async function loader({ request }: LoaderFunctionArgs) {
    return await authenticator.isAuthenticated(request, {
      successRedirect: "/",
    });
}

export async function action({ request }: ActionFunctionArgs) {
    const result  = await zx.parseFormSafe(request, {
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        address1: z.string(),
        city: z.string(),
        state: z.string().length(2),
        postalCode: z.string().min(5),
        dateOfBirth: z.string().length(10),
        ssn: z.string(),
    });

    if (result.error) {
        return json({
            success: false,
            errors: zodErrors(result.error),
        });
    }

    try {
        const userSession = await signUp(result.data);

        if (userSession) {
            const cokieSession = await getSession(request.headers.get("cookie"));
            cokieSession.set(authenticator.sessionKey, userSession);
    
            return redirect("/", {
                headers: { "Set-Cookie": await commitSession(cokieSession) },
            });
        }
    } catch (error) {
        console.log("Cannot create a new account:", error);
        return json(handleSignUpError(error));
    }
}

export default function SignUp() {
    const actionData = useActionData<typeof action>();
    const transition = useNavigation();
    const errors: Record<string, string> = actionData && "errors" in actionData? actionData.errors : {};

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
                        <InputField label="First Name" name="firstName" required error={errors.firstName} />
                        <InputField label="Last Name"  name="lastName" required error={errors.lastName} />
                    </div>
                    <InputField label="Address" name="address1" required error={errors.address1} />
                    <InputField label="City" name="city" required error={errors.city} />
                    <div className="flex gap-4">
                        <InputField label="State" name="state" required error={errors.state} />
                        <InputField label="Postal Code" name="postalCode" required error={errors.postalCode} />
                    </div>
                    <div className="flex gap-4 justify-between">
                        <InputField label="Date of Birth" type="date" name="dateOfBirth" required error={errors.dateOfBirth} />
                        <InputField label="SSN" name="ssn" required error={errors.ssn} />
                    </div>
                    <InputField label="Email"  type="email" name="email" required error={errors.email} />
                    <InputField label="Password"  type="password" name="password" required error={errors.password} />
                    {
                        actionData && "errorMessage" in actionData?
                            (<em className="text-red-600">{actionData["errorMessage"]}</em>)
                            :
                            null
                    }
                    <div className="flex flex-col gap-4">
                        <button type="submit" className="form-btn" disabled={transition.state == "submitting"}>Sign Up</button>
                    </div>
                </Form>
            </section>
        </section>
    );
}