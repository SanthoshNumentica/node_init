import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../src/prisma/prisma.service';
import { JsonInsertService } from '../src/json_insert/json_insert.service';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const jsonInsertService = new JsonInsertService(
  new PrismaService(new ConfigService()),
);

const INSERTDATA_LIST = ['action_name'];

const FILE_PATH_TEMPLATE = (dataType: string) =>
  path.resolve(__dirname, '../src/json_files', `${dataType}.json`);
const ADMIN = {
  email: 'admin@gmail.com',
  phoneNumber: BigInt(0),
  password: 'admin@123',
};

const createAdmin = async () => {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN.email },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: ADMIN.email,
        phone_number: ADMIN.phoneNumber,
        password: ADMIN.password,
        first_name: 'Admin',
        dob: '2000-01-01',
        address: 'Test Address',
        country: 'India',
        state: 'Tamil Nadu',
        last_name: '',
      },
    });
    Logger.log('Admin created successfully.');
  } else {
    Logger.log('Admin already exists.');
  }
};

const loadJsonData = async (dataType: string) => {
  const filePath = FILE_PATH_TEMPLATE(dataType);
  if (!fs.existsSync(filePath)) {
    throw new NotFoundException(`File not found: ${filePath}`);
  }

  try {
    const count = await jsonInsertService.loadJsonAndInsertData(
      filePath,
      dataType,
    );
    Logger.log(`${dataType}: ${count} records inserted successfully.`);
  } catch (error) {
    throw new InternalServerErrorException(
      `Failed to load ${dataType}: ${error.message}`,
    );
  }
};

const main = async () => {
  try {
    await createAdmin();
    await Promise.all(INSERTDATA_LIST.map(loadJsonData));
    Logger.log('All data inserted successfully.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
