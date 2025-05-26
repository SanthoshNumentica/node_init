import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class module{
    @IsString()
    @IsNotEmpty()
    moduleName : String

    @IsNumber()
    status : Number

    @IsString()
    moduleDes : string
    
}
    
