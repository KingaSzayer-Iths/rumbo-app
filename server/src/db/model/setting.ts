import { Schema, model } from 'mongoose';

export interface SettingType {
    _id: string;
    key: string,
    value: string,
}

const schema = new Schema <SettingType>({
    // _id: {type: String, required: true},
    key: { type:String, required: true },
    value: { type:String, required: true },
})

export const SettingModel = model <SettingType> ('setting', schema)

export default SettingModel;
