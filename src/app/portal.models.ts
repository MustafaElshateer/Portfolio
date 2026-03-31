export type PortalColor = 'red' | 'blue';
export type PortalIconType = 'img' | 'inline';

export interface PortalItem {
  id: string;
  labelKey: string;
  url: string;
  color: PortalColor;
  external: boolean;
  iconType: PortalIconType;
  iconSrc?: string;
  iconName?: string;
}
