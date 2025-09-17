import { NextFunction, Request, Response  } from "express" 
import { checkOtpRestrictions, sendotp, trackOtpRequests, validateRegistrationData } from "../utils/auth.helper"
import prisma from "../../../../packages/lib/prisma";

//  Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {
        validateRegistrationData(req.body, 'user');
        const {email, name  } = req.body

        const existingUser =  await prisma.users.findUnique({
            where: email
        })

        if(existingUser) {
            return next(new Error('User already exists'))
        }

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendotp(name , email, "user-activation-email");

        res.status(200).send({
            message: "Registration successful. Please check your email for the OTP to verify your account."
        });
    } catch (error) {
        return next(error);
    }
};

