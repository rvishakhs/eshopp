import crypto from 'crypto';
import { ValidationError } from '../../../../packages/error-handler';
import redis from '../../../../packages/lib/redis';
import { sendEmail } from './sendMail';
import { NextFunction } from 'express';


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

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    // Multiiple OTP requests in short time
    if (await redis.get(`otp_lock:${email}`)) {
        return next(new ValidationError("Account is locked due to multiple failed OTP attempts."))
    }

    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(new ValidationError("Too many OTP requests. Please try again later."))
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError("Please wait before requesting another OTP."))
    }


}

export const trackOtpRequests = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

    if (otpRequests >= 3 ) {
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600) // if more than 3 requests the account will be locked for 1 hour 
        return next(new ValidationError("Too many OTP requests. Please try again later after 1 hour."))
    }

    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600) // Tracking requests and reset the count after 1 hour
}

export const sendotp = async (name: string, email: string, template:string)  => {
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, "Verify Your Email", template, {name, otp} )
    await redis.set(`otp:${email}`, otp, "EX", 300)
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60)


}
