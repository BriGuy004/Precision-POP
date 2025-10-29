import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface GroceryBrandFormProps {
  brand: any;
  onChange: (updates: any) => void;
  onImageUpload: (file: File, field: 'logo_url' | 'hero_image_url', retailerId: string) => Promise<string | null>;
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'hero_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!brand.retailer_id && !isEdit) {
      alert("Please enter a Retailer ID first");
      return;
    }

    setUploading(field);
    const url = await onImageUpload(file, field, brand.retailer_id);
    if (url) {
      onChange({ [field]: url });
    }
    setUploading(null);
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
              onChange={(e) => handleFileUpload(e, 'logo_url')}
              disabled={uploading === 'logo_url'}
              className="bg-gray-700 text-white border-gray-600"
            />
            {uploading === 'logo_url' && <span className="text-sm text-gray-400">Uploading...</span>}
          </div>
        )}
        {errors.logo_url && <p className="text-red-400 text-sm mt-1">{errors.logo_url}</p>}
      </div>

      {/* Hero Image Upload */}
      <div>
        <Label className="text-white">Hero/Store Image *</Label>
        {brand.hero_image_url ? (
          <div className="space-y-2">
            <div className="aspect-video bg-gray-700 rounded overflow-hidden border border-gray-600">
              <img src={brand.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onChange({ hero_image_url: '' })}
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'hero_image_url')}
              disabled={uploading === 'hero_image_url'}
              className="bg-gray-700 text-white border-gray-600"
            />
            {uploading === 'hero_image_url' && <span className="text-sm text-gray-400">Uploading...</span>}
          </div>
        )}
        {errors.hero_image_url && <p className="text-red-400 text-sm mt-1">{errors.hero_image_url}</p>}
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Primary Color (HSL)</Label>
          <Input
            value={brand.primary_color}
            onChange={(e) => onChange({ primary_color: e.target.value })}
            placeholder="142 71% 45%"
            className="bg-gray-700 text-white border-gray-600"
          />
          <div 
            className="mt-2 h-10 rounded border border-gray-600" 
            style={{ backgroundColor: `hsl(${brand.primary_color})` }}
          />
        </div>
        <div>
          <Label className="text-white">Accent Color (HSL)</Label>
          <Input
            value={brand.accent_color}
            onChange={(e) => onChange({ accent_color: e.target.value })}
            placeholder="25 95% 53%"
            className="bg-gray-700 text-white border-gray-600"
          />
          <div 
            className="mt-2 h-10 rounded border border-gray-600" 
            style={{ backgroundColor: `hsl(${brand.accent_color})` }}
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

      {/* Description */}
      <div>
        <Label className="text-white">Description</Label>
        <Textarea
          value={brand.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Store description or tagline"
          className="bg-gray-700 text-white border-gray-600"
          rows={3}
        />
      </div>
    </div>
  );
};
