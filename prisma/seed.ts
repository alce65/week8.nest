import { PrismaClient, Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

const usersData: Prisma.UserCreateInput[] = [
  {
    // name: 'admin',
    email: 'ernestina@sample.es',
    password: hashSync('12345', 10),
    role: 'admin',
    tasks: {
      create: [
        {
          title: 'Configure the project',
          isDone: true,
        },
        {
          title: 'Seed the database',
          isDone: true,
        },
      ],
    },
  },
  {
    // name: 'pepe',
    email: 'pepe@sampl.com',
    password: hashSync('12345', 10),
    role: 'admin',
    tasks: {
      create: [
        {
          title: 'Prepare a presentation for the team',
        },
        {
          title: 'Add a README to the project',
        },
      ],
    },
    avatar: {
      create: {
        publicId: 'nest_2024_1/pepe@sample.com_avatar_pepe.png',
        folder: 'nest_2024_1',
        fieldName: 'avatar',
        originalName: 'pepe.png',
        secureUrl:
          'https://res.cloudinary.com/dip7gfqzk/image/upload/v1714246458/nest_2024_1/pepe%40sample.com_avatar_pepe.png.png',
        resourceType: 'image',
        mimetype: 'image/png',
        format: 'png',
        height: 1263,
        width: 860,
        bytes: 94675,
      },
    },
  },
  {
    email: 'luis@sample.com',
    role: 'user',
    password: hashSync('12345', 10),
    tasks: {
      create: [
        {
          title: 'Prepare a course for the team',
          isDone: true,
        },
        {
          title: 'Add documentation to the course',
        },
      ],
    },
    avatar: {
      create: {
        publicId: 'nest_2024_1/luis@sample.com_avatar_luis.png',
        folder: 'nest_2024_1',
        fieldName: 'avatar',
        originalName: 'luis.png',
        secureUrl:
          'https://res.cloudinary.com/dip7gfqzk/image/upload/v1714290142/nest_2024_1/luis%40sample.com_avatar_luis.png.png',
        resourceType: 'image',
        mimetype: 'image/png',
        format: 'png',
        height: 800,
        width: 800,
        bytes: 83939,
      },
    },
  },
  {
    // name: 'juan',
    email: 'juan@sample.io',
    password: hashSync('12345', 10),
    tasks: {
      create: [
        {
          title: 'Join the Prisma Slack',
        },
        {
          title: 'Follow Prisma on Twitter',
        },
      ],
    },
    avatar: {},
  },
  {
    // name: 'helena',
    email: 'helena@acme.com',
    password: hashSync('12345', 10),
    tasks: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
        },
      ],
    },
  },
  {
    // name: 'sara',
    email: 'sara@prisma.io',
    password: hashSync('12345', 10),
    tasks: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
        },
        {
          title: 'Review Prisma on YouTube',
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);

  const deleteAvatars = await prisma.avatar.deleteMany({});
  console.log(`Deleted ${deleteAvatars.count} avatars`);
  const deleteTasks = await prisma.task.deleteMany({});
  console.log(`Deleted ${deleteTasks.count} tasks`);
  const deleteUsers = await prisma.user.deleteMany({});
  console.log(`Deleted ${deleteUsers.count} users`);

  await Promise.all(
    usersData.map(async (userData) => {
      console.log(`Creating user: ${userData.email}`);
      const user = await prisma.user.create({
        data: userData,
      });
      console.log(`Created user with id: ${user.id}`);
    }),
  );
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
