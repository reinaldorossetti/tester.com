import React from 'react';
import { Chip, Stack } from '@mui/material';

const BRANDS = [
  'visa',
  'mastercard',
  'elo',
  'amex',
  'hipercard',
  'hiper',
  'cabal',
  'verdecard',
  'unionpay',
  'diners',
];

const CardBrandChips = ({ activeBrand = null }) => {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
      {BRANDS.map((brand) => (
        <Chip
          key={brand}
          size="small"
          label={brand.toUpperCase()}
          color={activeBrand === brand ? 'primary' : 'default'}
          variant={activeBrand === brand ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  );
};

export default CardBrandChips;
