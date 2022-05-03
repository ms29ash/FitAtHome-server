import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import moment from 'moment';

const date = moment().utc('+05:30');
const edate = moment().add(15, 'm').utc('+05:30')


const UserVerificationSchema = Schema({
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 4
    },
    createdAt: {
        type: Date,
        default: date,
    },
    expireAt: {
        type: Date,
        default: edate,
    }
})

const User = model('UserVerify', UserVerificationSchema);

export default User;