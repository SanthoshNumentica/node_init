import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';  // <-- Fixed import here
import { PrismaService } from '../prisma/prisma.service';
import { MainDto } from './dto/main.dto';

@Injectable()
export class JsonInsertService {
  constructor(private readonly prisma: PrismaService) { }

  async insertJsonData(data: any[], tableName: string): Promise<number> {
    if (!Array.isArray(data)) {
      throw new BadRequestException('Invalid data format: Expected an array');
    }

    const validTables = [
      'action_name', 'module_action', 'module', 'payment_mode', 'role'
    ];
    for (const table of validTables) {
      await this.prisma.$executeRawUnsafe(`DELETE FROM \`${table}\``);
      await this.prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
    }

    if (!validTables.includes(tableName)) {
      throw new BadRequestException('Invalid table name');
    }

    const BATCH_SIZE = 500; // Adjust batch size based on DB performance

    try {
      const insertBatch = async (batch: any[]) => {
        try {
          let insertResult;

          switch (tableName) {
            case 'action_name':
              insertResult = await this.prisma.action_name.createMany({
                data: batch.map(item => ({
                  action_name: item.actionName,
                  actionDes: item.actionDes
                })),
              });
              break;
            case 'module_action':
              insertResult = await this.prisma.module_action.createMany({
                data: batch.map(item => ({
                  module_id: item.module_id,
                  action_id: item.action_id
                })),
              });
              break;

            case 'module':
              insertResult = await this.prisma.module.createMany({
                data: batch.map(item => ({
                  moduleName: item.moduleName,
                  status: item.status,
                  moduleDes: item.moduleDes
                })),
              });
              break;

            case 'payment_mode':
              insertResult = await this.prisma.payment_mode.createMany({
                data: batch.map(item => ({
                  payment_modeName: item.payment_modeName,
                  status: item.status,
                  created_at: String(item.created_at)
                })),
              });
              break;

            case 'role':
              insertResult = await this.prisma.role.createMany({
                data: batch.map(item => ({
                  roleName: item.roleName,
                  status: item.status,
                })),
              });
              break;

            case 'role_permission':
              insertResult = await this.prisma.role_permission.createMany({
                data: batch.map(item => ({
                  moduleActionId: item.moduleActionId,
                  role_id: item.role_id,
                })),
              });
              break;

            default:
              throw new Error('Unexpected table name');
          }

          return insertResult.count; // Return count of inserted rows
        } catch (error) {
          console.error(`Failed to insert batch for ${tableName}`, error);
          return 0;
        }
      };

      let successCount = 0;

      // Process data in batches
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const batchSuccessCount = await insertBatch(batch);
        successCount += batchSuccessCount;
        console.log(
          `Batch ${Math.ceil((i + 1) / BATCH_SIZE)} inserted successfully: ${batchSuccessCount} items`,
        );
      }

      console.log(`All data inserted successfully: ${successCount}`);
      return successCount;
    } catch (error) {
      console.error('Batch insert failed:', error);
      throw new BadRequestException('Failed to insert data');
    }
  }

  async loadJsonAndInsertData(
    filePath: string,
    tableName: string,
  ): Promise<number> {
    console.log('tableName', tableName);
    try {
      const fileData = fs.readFileSync(path.resolve(filePath), 'utf-8');
      const jsonData: MainDto[] = JSON.parse(fileData);
      const count = await this.insertJsonData(jsonData, tableName);
      console.log(`Successfully inserted ${count} records from JSON file.`);
      return count;
    } catch (error) {
      console.error('Error loading or inserting data:', error);
      throw new BadRequestException(
        'Failed to load or insert data from JSON file',
      );
    }
  }
}
