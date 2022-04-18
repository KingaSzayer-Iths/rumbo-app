import { Schema, model } from 'mongoose';
import {v4 as uuidv4} from 'uuid'

export interface TimereportsType {
    id:string,
    email: string,
    time: Date,
    hours: number,
    description: string,
    created_at?: Date,
    project_id: string
}

const schema = new Schema <TimereportsType>({
    id:{
        type: String,
        default: () => {
            return uuidv4()
        }
    },
    email: { type:String, required: true },
    time: { type:Date, required: true },
    hours: { type:Number, required: true },
    description: { type:String, requred: true },
    created_at: { type:Date },
    project_id: { type: String, required: true }
});

// schema.set('toJSON',{virtuals:true});

const TimereportsModel = model <TimereportsType> ('timereports', schema)

export default TimereportsModel;
