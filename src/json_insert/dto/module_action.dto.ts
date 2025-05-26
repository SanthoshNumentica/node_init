import { IsNotEmpty, IsNumber } from "class-validator";

export class ModuleAction{
    @IsNumber()
    @IsNotEmpty()
    module_id : number

    @IsNumber()
    @IsNotEmpty()
    action_id : number
}