export interface ErrorResponse {
  message: string;
  errors?: { msg: string }[];
}
export interface SideNavProps {
  currentTab: string;
  onDownloadClick: () => void;
  onShapesClick: () => void;
  onTextsClick: () => void;
  onEditClick: () => void;
}

export type FrameType = 'circle' | 'square';
export interface Frame {
  id: number;
  type: FrameType;
  frameSize: number;
  framePosition: { top: number; left: number };
  innerImage: string | null;
}
export interface ImageText {
  id: number;
  textFrameSize: number;
  textFrameHeight: number;
  framePosition: { top: number; left: number };
}

export interface LandingPageProps {
  LoginSIgnUp?: React.FC;
}

export interface HeaderProps {
  loginSignUp: boolean;
  setLoginSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LoginSignUpModalProps {
  closeModal: () => void;
}

