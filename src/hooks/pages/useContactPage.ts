import { useDispatch } from "react-redux";
import type {ContactUsRequestType} from "../../schemas/user.schema.ts";
import {clearContactUs, setContactUs} from "../../redux/user.slice.ts";
import {useUserQuery} from "../../queries/user.query.ts";

export const useContactPage = () => {
  const dispatch = useDispatch();
  const { contactUsMutation } = useUserQuery();
  
  const handleSubmit = async (data: ContactUsRequestType, resetForm: () => void) => {
    dispatch(setContactUs(data))
    const { success } = await contactUsMutation.mutateAsync();
    if (success) {
      resetForm();
      dispatch(clearContactUs());
    }
  }
  
  return {
    // Values
    
    // Functions
    handleSubmit,
  }
}