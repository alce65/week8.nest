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
  Logger,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';
import { CryptoService } from '../core/crypto/crypto.service';
import { LoggedGuard } from '../core/auth/logged.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../core/files/files.service';
import { ImgData } from '../types/image.data';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UsersController {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly filesService: FilesService,
  ) {
    this.logger.debug('Instantiated', 'UsersController');
  }

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

  @UseInterceptors(FileInterceptor('avatar'))
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100_000 }),
          new FileTypeValidator({ fileType: 'image/' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const { email } = createUserDto;
    let avatar: ImgData | null = null;
    if (file) {
      const cloudinaryResponse = await this.filesService.uploadImage(
        email,
        file,
      );
      avatar = {
        publicId: cloudinaryResponse.public_id,
        folder: cloudinaryResponse.folder,
        fieldName: file.fieldname,
        originalName: file.originalname,
        secureUrl: cloudinaryResponse.secure_url,
        resourceType: cloudinaryResponse.resource_type,
        mimetype: file.mimetype,
        format: cloudinaryResponse.format,
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
        bytes: cloudinaryResponse.bytes,
      };
    }

    createUserDto.password = await this.cryptoService.hash(
      createUserDto.password,
    );
    return this.usersService.create(createUserDto, avatar);
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
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100_000 }),
          new FileTypeValidator({ fileType: 'image/' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const email =
      updateUserDto.email || (await this.usersService.findOne(id)).email;
    let avatar: ImgData | null = null;
    if (file) {
      const cloudinaryResponse = await this.filesService.uploadImage(
        email,
        file,
      );
      avatar = {
        publicId: cloudinaryResponse.public_id,
        folder: cloudinaryResponse.folder,
        fieldName: file.fieldname,
        originalName: file.originalname,
        secureUrl: cloudinaryResponse.secure_url,
        resourceType: cloudinaryResponse.resource_type,
        mimetype: file.mimetype,
        format: cloudinaryResponse.format,
        width: cloudinaryResponse.width,
        height: cloudinaryResponse.height,
        bytes: cloudinaryResponse.bytes,
      };
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.cryptoService.hash(
        updateUserDto.password,
      );
    }
    return this.usersService.update(id, updateUserDto, avatar);
  }

  @UseGuards(LoggedGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
