import { useNavigation, Form } from "@remix-run/react";
import ErrorMessage from "~/components/ErrorMessage";
import { formatAmount } from "~/libs/utils";

export default function PaymentTransferForm({ accounts, errorMessage }: PaymentTransferFormProps) {
    const transition = useNavigation();
    const isSubmitting = transition.state === "submitting";

    return (
        <Form className="flex flex-col" method="post">
            <fieldset className="flex flex-col">
                <legend className="font-bold text-2xl">Transfer details</legend>
                <label className="payment-transfer_form-item pb-6 pt-5">
                    <span className="payment-transfer_form-content">Select Source Bank</span>

                    <select 
                        name="senderBankId"
                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    >
                        <option>Select Account</option>

                        {
                            accounts.map((account) => 
                                <option 
                                    key={account.id} 
                                    value={account.appwriteItemId}
                                    className="appearance-none"
                                >
                                    {`${account.name} ${formatAmount(account.currentBalance)}`}
                                </option>)
                        }
                    </select>
                </label>

                <label className="payment-transfer_form-item pb-6 pt-5">
                    <span className="payment-transfer_form-content">Transfer Note (Optional)</span>
                    <textarea 
                        name="note"
                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"                       
                    ></textarea>
                </label>
            </fieldset>

            <fieldset className="flex flex-col">
                <legend className="font-bold text-2xl">Bank account details</legend>
                <label className="payment-transfer_form-item pb-6 pt-5">
                    <span className="payment-transfer_form-content">Recipient&apos;s Email Address</span>
                    <input
                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="email"
                        name="email"
                        placeholder="ex: johndoe@gmail.com"
                        required
                    />
                </label>

                <label className="payment-transfer_form-item pb-6 pt-5">
                    <span className="payment-transfer_form-content">Receiver&apos;s Plaid Sharable Id</span>
                    <input
                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="sharableId"
                        placeholder="Enter the public account number"
                        required
                    />
                </label>

                <label className="payment-transfer_form-item pb-6 pt-5">
                    <span className="payment-transfer_form-content">Amount</span>
                    <input
                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="amount"
                        placeholder="ex: 5.00"
                        required
                    />
                </label>
            </fieldset>

            <div className="payment-transfer_btn-box">
                <button type="submit" className="payment-transfer_btn p-2 rounded" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Transfer Funds"}
                </button>

                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </div>
        </Form>
    );
}