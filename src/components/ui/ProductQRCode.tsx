import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ProductQRCodeProps {
  product: {
    id: string;
    name: string;
    rfidTag: string;
    manufacturer: string;
    status: string;
  };
  size?: number;
}

const ProductQRCode: React.FC<ProductQRCodeProps> = ({ product, size = 128 }) => {
  // Create a data object that includes essential product information
  const qrData = {
    id: product.id,
    name: product.name,
    rfidTag: product.rfidTag,
    manufacturer: product.manufacturer,
    status: product.status
  };

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG
        value={JSON.stringify(qrData)}
        size={size}
        level="H"
        includeMargin
        className="rounded-lg"
      />
      <p className="mt-2 text-xs text-neutral-500 font-mono">{product.rfidTag}</p>
    </div>
  );
};

export default ProductQRCode;