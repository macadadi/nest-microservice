import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dataSource from '../libs/common/src/database/data-source';
import { UserEntity } from '../apps/auth/src/users/model/user.entity';
import { hashUserPassword } from '../apps/auth/src/users/password.helper';

async function seedUsers() {
  const ds: DataSource = await (dataSource as DataSource).initialize();

  try {
    const userRepo = ds.getRepository(UserEntity);

    const usersToSeed = [
      {
        email: 'mac1@test.com',
        password: '!ggggQ7872828',
      },
      {
        email: 'mac@test.com',
        password: '!ggggQ7872828',
      },
    ];

    for (const u of usersToSeed) {
      const existing = await userRepo.findOne({ where: { email: u.email } });
      if (existing) {
        console.log(`User ${u.email} already exists, skipping`);
        continue;
      }

      const hashedPassword = await hashUserPassword(u.password);
      const user = userRepo.create({
        email: u.email,
        password: hashedPassword,
      });

      await userRepo.save(user);
      console.log(`Created user ${u.email}`);
    }
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    await ds.destroy();
  }
}

void seedUsers()
  .then(() => {
    console.log('Seeding completed');
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  });
