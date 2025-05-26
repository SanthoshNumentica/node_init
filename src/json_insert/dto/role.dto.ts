import { IsNotEmpty, IsNumber, IsString, isString } from "class-validator";

export class role {
    @IsString()
    @IsNotEmpty()
    roleName: String

    @IsNumber()
    status: Number


}