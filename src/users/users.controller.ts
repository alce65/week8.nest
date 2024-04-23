import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/core/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('login')
  async TokenLogin(@Headers('Authorization') auth: string) {
    console.log(auth);
  }

  @Post('login')
  async Login(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findForLogin(email);

    if (!user) {
      throw new ForbiddenException('Email and password invalid');
    }

    if (!(await this.cryptoService.compare(password, user.password!))) {
      throw new ForbiddenException('Email and password invalid');
    }

    const token = await this.jwtService.signAsync(
      { id: user.id, role: user.role },
      { secret: this.configService.get('SECRET_JWT') },
    );

    return { token };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await this.cryptoService.hash(
      createUserDto.password,
    );
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.cryptoService.hash(
        updateUserDto.password,
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
