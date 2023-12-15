
import { AxiosError } from "axios";
import axiosInstance from "../Request/axiosInstance";
import { ErrorFunction } from "../utils";
import { DATA } from "./Details";

const GetHook = async (setLoading:(text:boolean) => void,setSelect:(text:DATA[]) => void, setError:(text:string) => void) =>{
    
 
        try {
          setLoading(true);
          const res = await axiosInstance.get("sector");
    
          setSelect(res.data);
          setLoading(false);
        } catch (error) {
          const err = error as AxiosError;
          ErrorFunction(err, setLoading, setError);
        }
      

}
export default GetHook