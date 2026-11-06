import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync, type ValidationError } from 'class-validator';
import { MovementItemInput } from './movement-item.input.js';

export type NormalizedMovementItem = {
  name: string;
  price: number;
  subcategory: string;
  position: number;
};

// Compare in integer cents. `amount` and `price` stay `real`, same unit as the movement header.
function toCents(value: number): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined;
  }
  return Math.round(value * 100);
}

export function normalizeMovementItems(
  items: MovementItemInput[],
): NormalizedMovementItem[] {
  return items.map((item, index) => {
    const instance = plainToInstance(MovementItemInput, item);
    const errors = validateSync(instance, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException(
        firstConstraintMessage(errors) ?? 'Invalid movement item',
      );
    }
    const priceCents = toCents(instance.price);
    if (priceCents === undefined || priceCents <= 0) {
      throw new BadRequestException('Item price must be greater than zero');
    }
    return {
      name: instance.name,
      price: instance.price,
      subcategory: instance.subcategory,
      position: index,
    };
  });
}

export function assertItemsWithinAmount(prices: number[], amount: number): void {
  const amountCents = toCents(amount);
  if (amountCents === undefined) {
    throw new BadRequestException('Movement amount must be a finite number');
  }
  const totalCents = prices.reduce((sum, price) => {
    const priceCents = toCents(price);
    if (priceCents === undefined || priceCents <= 0) {
      throw new BadRequestException('Item price must be greater than zero');
    }
    return sum + priceCents;
  }, 0);
  if (totalCents > amountCents) {
    throw new BadRequestException('Item total exceeds movement amount');
  }
}

function firstConstraintMessage(errors: ValidationError[]): string | undefined {
  for (const error of errors) {
    if (error.constraints) {
      const message = Object.values(error.constraints)[0];
      if (message) {
        return message;
      }
    }
  }
  return undefined;
}
