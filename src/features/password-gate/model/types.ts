export interface PasswordGateProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  error: boolean;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}
