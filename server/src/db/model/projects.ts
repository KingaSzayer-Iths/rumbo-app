import { Schema, model } from 'mongoose';

export interface ProjectType {
    customer_name: string,
    project_name: string,
    agreement_ref: string,
    active: Boolean,
    created_at:Number
}

const schema = new Schema <ProjectType>({
    customer_name: { type:String, required: true },
    project_name: { type:String, required: true },
    agreement_ref: { type:String, required: true },
    active: { type:Boolean, requred: true },
    created_at: { type:Number, requred: true }
})

const ProjectModel = model <ProjectType> ('project', schema)

export default ProjectModel;
