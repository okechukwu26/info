import { AxiosError } from "axios";
import { toast } from "react-toastify";
export const ErrorFunction = (
  error: AxiosError,
  Loading: (text: boolean) => void,
  setError: (text: string) => void
) => {
  const customErr = error;
  const err = customErr.response?.data as { error: string };
  customErr.response ? setError(err.error) : setError("Something went wrong");
  toast.error(err.error ? err.error : "Something went wrong");
  Loading(false);
};
