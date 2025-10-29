import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface GroceryBrandFormProps {
  brand: any;
  onChange: (updates: any) => void;
  onImageUpload: (file: File, field: 'logo_url', retailerId: string) => Promise<string | null>;
  errors?: Record<string, string>;
  isEdit?: boolean;
}

export const GroceryBrandForm = ({ 
  brand, 
  onChange, 
  onImageUpload, 
  errors = {},
  isEdit = false 
}: GroceryBrandFormProps) => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!brand.retailer_id && !isEdit) {
      alert("Please enter a Retailer ID first");
      return;
    }

    setUploading('logo_url');
    const url = await onImageUpload(file, 'logo_url', brand.retailer_id);
    if (url) {
      onChange({ logo_url: url });
    }
    setUploading(null);
  };

  // Convert HSL to Hex
  const hslToHex = (hsl: string): string => {
    if (!hsl) return '#000000';
    const parts = hsl.split(/\s+/);
    const h = parseFloat(parts[0]) || 0;
    const s = (parseFloat(parts[1]) || 0) / 100;
    const l = (parseFloat(parts[2]) || 0) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert Hex to HSL
  const hexToHsl = (hex: string): string => {
    if (!hex || !hex.startsWith('#')) return '0 0% 0%';
    
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <div className="space-y-4">
      {/* Retailer ID */}
      <div>
        <Label className="text-white">Retailer ID *</Label>
        <Input
          value={brand.retailer_id}
          onChange={(e) => onChange({ retailer_id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
          placeholder="heb, kroger, whole-foods"
          disabled={isEdit}
          className="bg-gray-700 text-white border-gray-600"
        />
        {errors.retailer_id && <p className="text-red-400 text-sm mt-1">{errors.retailer_id}</p>}
        <p className="text-xs text-gray-400 mt-1">Lowercase, alphanumeric, hyphens only</p>
      </div>

      {/* Name */}
      <div>
        <Label className="text-white">Store Name *</Label>
        <Input
          value={brand.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="H-E-B"
          className="bg-gray-700 text-white border-gray-600"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Logo Upload */}
      <div>
        <Label className="text-white">Logo Image *</Label>
        {brand.logo_url ? (
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-4 bg-gray-700 rounded border border-gray-600">
              <img src={brand.logo_url} alt="Logo" className="h-16 object-contain" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onChange({ logo_url: '' })}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading === 'logo_url'}
              className="bg-gray-700 text-white border-gray-600"
            />
            {uploading === 'logo_url' && <span className="text-sm text-gray-400">Uploading...</span>}
          </div>
        )}
        {errors.logo_url && <p className="text-red-400 text-sm mt-1">{errors.logo_url}</p>}
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Primary Color</Label>
          <Input
            type="color"
            value={hslToHex(brand.primary_color)}
            onChange={(e) => onChange({ primary_color: hexToHsl(e.target.value) })}
            className="bg-gray-700 border-gray-600 h-12 cursor-pointer"
          />
          <Input
            value={hslToHex(brand.primary_color)}
            readOnly
            className="bg-gray-700 text-white border-gray-600 mt-2 text-center font-mono"
          />
        </div>
        <div>
          <Label className="text-white">Accent Color</Label>
          <Input
            type="color"
            value={hslToHex(brand.accent_color)}
            onChange={(e) => onChange({ accent_color: hexToHsl(e.target.value) })}
            className="bg-gray-700 border-gray-600 h-12 cursor-pointer"
          />
          <Input
            value={hslToHex(brand.accent_color)}
            readOnly
            className="bg-gray-700 text-white border-gray-600 mt-2 text-center font-mono"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">City</Label>
          <Input
            value={brand.city || ''}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="San Antonio"
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <Label className="text-white">State</Label>
          <Input
            value={brand.state || ''}
            onChange={(e) => onChange({ state: e.target.value })}
            placeholder="Texas"
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <Label className="text-white">Website</Label>
        <Input
          value={brand.website || ''}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://www.heb.com"
          className="bg-gray-700 text-white border-gray-600"
        />
        {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website}</p>}
      </div>

      {/* Tagline */}
      <div>
        <Label className="text-white">Tagline</Label>
        <Input
          value={brand.tagline || ''}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="Here Everything's Better"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
    </div>
  );
};
