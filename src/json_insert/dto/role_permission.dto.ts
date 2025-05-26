import { IsNotEmpty, IsNumber } from "class-validator";

export class role_permission {
    @IsNumber()
    @IsNotEmpty()
    moduleActionId : Number

    @IsNumber()
    role_id : Number
}