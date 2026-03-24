import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './entities/receipt.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    private readonly notifications: NotificationsService,
  ) {}

  async findAll() {
    return this.receiptRepository.find({ order: { issuedAt: 'DESC' } });
  }

  async findOne(id: string) {
    const receipt = await this.receiptRepository.findOne({ where: { id } });
    if (!receipt) {
      throw new NotFoundException(`Receipt with ID ${id} not found`);
    }
    return receipt;
  }

  async create(dto: CreateReceiptDto) {
    const receipt = this.receiptRepository.create({
      issuedAt: new Date(dto.issuedAt),
      name: dto.name,
      price: dto.price,
    });

    const savedReceipt = await this.receiptRepository.save(receipt);
    this.notifications.notify('receipt.created', {
      id: savedReceipt.id,
      name: savedReceipt.name,
      price: savedReceipt.price,
    });
    return savedReceipt;
  }

  async update(id: string, dto: UpdateReceiptDto) {
    const receipt = await this.findOne(id);
    if (dto.issuedAt !== undefined) {
      receipt.issuedAt = new Date(dto.issuedAt);
    }
    if (dto.name !== undefined) {
      receipt.name = dto.name;
    }
    if (dto.price !== undefined) {
      receipt.price = dto.price;
    }
    return this.receiptRepository.save(receipt);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.receiptRepository.delete(id);
    return { deleted: true, receiptId: id };
  }
}
