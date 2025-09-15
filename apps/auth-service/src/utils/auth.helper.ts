import crypto from 'crypto';
import { ValidationError } from '../../../../packages/error-handler';

const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const {name, email, password, phone_number, country } = data;

    if (!name || !email || !password || (userType === 'seller' && (!phone_number || !country) )) {
        throw new ValidationError(`Missing Required Fields`)         
    }

    if (!emailregex.test(email)) {
        throw new ValidationError(`Invalid Email format`)
    }
}

export const checkOtpRestrictions = (email: string, next:NewableFunction) => {
    throw new Error("Function not implemented.");
}

export const sendotp = async (name: string, email: string, template:string)  => {
    const otp = crypto.randomInt(1000, 9999).toString();

}
