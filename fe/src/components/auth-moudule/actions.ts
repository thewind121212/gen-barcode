import { toast } from "react-hot-toast";
import { signIn, signUp } from "supertokens-web-js/recipe/emailpassword";

export async function signInWithCallback(email: string, password: string, successCallback: () => void) {
    try {
        let response = await signIn({
            formFields: [{
                id: "email",
                value: email
            }, {
                id: "password",
                value: password
            }]
        })

        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach(formField => {
                if (formField.id === "email") {
                    toast.error(formField.error)
                }
            })
        } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
            toast.error("Email password combination is incorrect.")
        } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
            toast.error(response.reason)
        } else {
            successCallback()
        }
    } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
            toast.error(err.message);
        } else {
            toast.error("Oops! Something went wrong.");
        }
    }
}

export async function signUpWithCallback(email: string, password: string, successCallback: () => void) {
    try {
        let response = await signUp({
            formFields: [{
                id: "email",
                value: email
            }, {
                id: "password",
                value: password
            }]
        })

        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach(formField => {
                if (formField.id === "email") {
                    toast.error(formField.error)
                } else if (formField.id === "password") {
                    toast.error(formField.error)
                }
            })
        } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
            toast.error(response.reason)
        } else {
            successCallback()
        }
    } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
            toast.error(err.message);
        } else {
            toast.error("Oops! Something went wrong.");
        }
    }
}
