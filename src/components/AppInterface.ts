export interface ErrorResponse {
  message: string;
  errors?: { msg: string }[];
}
export interface SideNavProps {
  currentTab: string;
  onDownloadClick: () => void;
}