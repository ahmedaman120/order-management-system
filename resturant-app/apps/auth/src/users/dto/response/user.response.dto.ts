import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bio: string;

  @ApiProperty({ type: Date })
  readonly createdDate: Date;

  @ApiProperty({ type: Date })
  readonly updatedDate: Date;
}
