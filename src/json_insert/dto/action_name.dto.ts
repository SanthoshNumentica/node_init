import { IsNotEmpty, IsString } from "class-validator";

export class ActionNameDto{
    @IsString()
    @IsNotEmpty()
    action_name:string

    @IsString()
    @IsNotEmpty()
    actionDes:string
}