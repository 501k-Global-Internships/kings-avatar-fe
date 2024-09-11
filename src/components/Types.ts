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
  setModalOpen: (open: boolean) => void;
}

export type FrameType = 'circle' | 'square';
export interface Frame {
  id: number;
  type: FrameType;
  size: number;
  position: { top: number; left: number };
  innerImage: string | null;
}
export interface ImageText {
  id: number;
  textFrameSize: number;
  textFrameHeight: number;
  framePosition: { top: number; left: number };
}

export interface HeaderProps {
  loginSignUp: boolean;
  setLoginSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLink: string
  getStarted: boolean;
}

export interface FooterProps {
  backgroundImage: boolean;
}

export interface LoginSignUpModalProps {
  closeModal: () => void;
}

export interface DownloadModalProps {
  setModalOpen: (open: boolean) => void;
  setTexts: (open: boolean) => void;
  handleDownloadClick: () => void;
}

export interface UntitledProjectProps {
  onSave: () => void;
  onShare: () => void;
  actions: boolean;
  untitled: boolean;
}

export type ResizeCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
