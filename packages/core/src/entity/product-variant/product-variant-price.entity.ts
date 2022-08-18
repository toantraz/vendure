import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { DecimalTransformer } from '../value-transformers';

import { ProductVariant } from './product-variant.entity';

/**
 * @description
 * A ProductVariantPrice is a Channel-specific price for a ProductVariant. For every Channel to
 * which a ProductVariant is assigned, there will be a corresponding ProductVariantPrice entity.
 *
 * @docsCategory entities
 */
@Entity()
export class ProductVariantPrice extends VendureEntity {
    constructor(input?: DeepPartial<ProductVariantPrice>) {
        super(input);
    }

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: new DecimalTransformer() }) price: number;

    @EntityId() channelId: ID;

    @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices)
    variant: ProductVariant;
}
