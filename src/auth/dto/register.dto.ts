import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ required: true })
    name: string;
    @ApiProperty({ required: true })
    mobile: string;
    @ApiProperty({ required: true })
    email: string;
    @ApiProperty({ required: true })
    username: string;
    @ApiProperty({ required: true })
    password: string;
}