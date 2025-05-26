import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class payment_mode {
    @IsString()
    @IsNotEmpty()
    payment_modeName : string

    @IsNumber()
    status : string 

    @IsString()
    created_at : String
}