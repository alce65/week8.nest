import {
  Controller,
  Get,
  Post,
  Body,
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
import { CryptoService } from '../core/crypto/crypto.service';
import { LoggedGuard } from '../core/auth/logged.guard';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
  ) {}

  @UseGuards(LoggedGuard)
  @Get('login')
  async loginWithToken(@Body() validData: { payload: { id: string } }) {
    const userId = validData.payload.id;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new ForbiddenException('Email and password invalid');
    }

    return { token: await this.cryptoService.createToken(user) };
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
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

    return { token: await this.cryptoService.createToken(user) };
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

  @UseGuards(LoggedGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.cryptoService.hash(
        updateUserDto.password,
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(LoggedGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
