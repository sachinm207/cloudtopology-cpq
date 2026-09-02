import { ResourceSKU } from '../types/topology';

export interface CustomRateSheet {
  version: string;
  enterpriseName?: string;
  blanketDiscountPercent?: number; // e.g. 15 for 15% EDA
  customEgressRatePerGb?: number; // e.g. 0.04 for $0.04/GB
  skuOverrides?: Array<{
    skuId: string;
    customHourlyPrice: number;
    customSavingsPlan1YrDiscount?: number;
    customSavingsPlan3YrDiscount?: number;
  }>;
}

/**
 * Parses and validates an uploaded JSON rate sheet in client RAM
 */
export function parseCustomRateSheetJSON(jsonString: string): { success: boolean; data?: CustomRateSheet; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON format. Expected an object.' };
    }

    const rateSheet: CustomRateSheet = {
      version: parsed.version || '1.0',
      enterpriseName: parsed.enterpriseName || 'Custom Enterprise',
      blanketDiscountPercent: typeof parsed.blanketDiscountPercent === 'number' ? parsed.blanketDiscountPercent : 0,
      customEgressRatePerGb: typeof parsed.customEgressRatePerGb === 'number' ? parsed.customEgressRatePerGb : undefined,
      skuOverrides: Array.isArray(parsed.skuOverrides) ? parsed.skuOverrides : [],
    };

    return { success: true, data: rateSheet };
  } catch (err: any) {
    return { success: false, error: `JSON Parse Error: ${err.message}` };
  }
}

/**
 * Generates a clean JSON template that enterprises can download and populate
 */
export function generateSampleRateSheetTemplate(): string {
  const sample: CustomRateSheet = {
    version: '1.0',
    enterpriseName: 'Acme Corp Private Enterprise Agreement',
    blanketDiscountPercent: 12.5,
    customEgressRatePerGb: 0.045,
    skuOverrides: [
      {
        skuId: 'aws-ec2-c6i-2xlarge',
        customHourlyPrice: 0.285,
        customSavingsPlan1YrDiscount: 0.40,
        customSavingsPlan3YrDiscount: 0.62,
      },
      {
        skuId: 'aws-rds-aurora-postgres-large',
        customHourlyPrice: 0.750,
        customSavingsPlan1YrDiscount: 0.35,
        customSavingsPlan3YrDiscount: 0.52,
      },
    ],
  };

  return JSON.stringify(sample, null, 2);
}

/**
 * Applies custom rate overrides to the active SKU catalog in memory
 */
export function applyRateSheetToCatalog(baseSkus: ResourceSKU[], rateSheet: CustomRateSheet): ResourceSKU[] {
  const overrideMap = new Map(rateSheet.skuOverrides?.map(o => [o.skuId, o]) || []);
  const blanketMultiplier = (100 - (rateSheet.blanketDiscountPercent || 0)) / 100;

  return baseSkus.map(sku => {
    const override = overrideMap.get(sku.id);
    if (override) {
      const hourly = override.customHourlyPrice;
      return {
        ...sku,
        hourlyPrice: hourly,
        monthlyPrice: Math.round(hourly * 730 * 100) / 100,
        savingsPlan1YrDiscount: override.customSavingsPlan1YrDiscount ?? sku.savingsPlan1YrDiscount,
        savingsPlan3YrDiscount: override.customSavingsPlan3YrDiscount ?? sku.savingsPlan3YrDiscount,
      };
    }

    if (rateSheet.blanketDiscountPercent && rateSheet.blanketDiscountPercent > 0) {
      const discountedHourly = sku.hourlyPrice * blanketMultiplier;
      return {
        ...sku,
        hourlyPrice: Math.round(discountedHourly * 10000) / 10000,
        monthlyPrice: Math.round(discountedHourly * 730 * 100) / 100,
      };
    }

    return sku;
  });
}
