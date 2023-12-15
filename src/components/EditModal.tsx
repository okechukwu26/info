/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATA } from "./Details";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import GetHook from "./Hook";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FORM, SECTOR } from "./Home";
import Checkbox from "@mui/material/Checkbox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  OutlinedInput,
  MenuItem,
  ListItemText,
  InputLabel,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import axiosInstance from "../Request/axiosInstance";
import { AxiosError } from "axios";
interface props {
  open: boolean;
  onClose: () => void;
  select: DATA;
  setData: (item: DATA[]) => void;
  data: DATA[];
  setUser: (item: any) => void;
}
const EditModal = ({
  open,
  onClose,
  select,
  data,
  setData,
  setUser,
}: props) => {
  console.log(select.sector);
  const [sector, setSector] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selects, setSelect] = useState([] as SECTOR[]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    term: false,
  } as FORM);
  useEffect(() => {
    GetHook(setLoading, setSelect, setError);
    if (select.sector) {
      setSector(select.sector);
      setForm((prev) => ({
        ...prev,
        fullName: select.name,
        term: select.term,
      }));
    }
  }, [select]);
  const handleChange = (event: SelectChangeEvent<typeof sector>) => {
    const {
      target: { value },
    } = event;
    setSector(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, checked, type } = e.target;

    setForm((prev: FORM) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const info = {
        name: form.fullName,
        term: form.term,
        sector,
      };
      const res = await axiosInstance.patch(`/user/${select._id}`, info);

      setUser(res.data.user);
      toast.success("Updated");
      setLoading(false);
      onClose();
      const index = data.findIndex((item) => item._id === res.data.user._id);
      if (index !== -1) {
        // Element found in the array, update it
        const updatedSelects = [...data]; // Create a copy of the original array
       

        // Update the element at the found index with the updated data
     
        console.log(updatedSelects[index]);

        // Update the state with the modified array
           setData(updatedSelects);
      }
    } catch (error) {
      setLoading(false);
      const custom = error as AxiosError;

      const err = custom.response?.data as { error: string };
      toast.error(err.error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Dialog onClose={onClose} open={open}>
        {error && (
          <Typography variant="body1" color="red" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        )}
        <DialogTitle sx={{ textAlign: "center" }}>Edit Details</DialogTitle>
        <Card sx={{ maxWidth: "37rem", padding: "4px" }}>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1 }} variant="standard">
              <TextField
                id="outlined-basic"
                label="fullName"
                variant="outlined"
                value={form.fullName}
                onChange={handleSelect}
                name="fullName"
                //   error={errors.fullName ? true : false}
                //   helperText={errors?.fullName}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "20rem" }} variant="standard">
              <InputLabel
                sx={{ paddingLeft: "10px" }}
                id="demo-multiple-checkbox-label"
              >
                Sectors
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={sector}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                disabled={loading}
              >
                {selects &&
                  selects.map((name: SECTOR) => (
                    <MenuItem key={name._id} value={name.name}>
                      <ListItemText primary={name.name} />
                      <Checkbox checked={sector.indexOf(name.name) > -1} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Checkbox checked={form.term} name="term" onChange={handleSelect} />
              <Typography>Agree to term</Typography>
            </Box>

            <Button type="submit" variant="contained">
              {loading && (
                <CircularProgress
                  sx={{ color: "#fff", padding: "3px" }}
                  size={20}
                />
              )}
              Save
            </Button>
          </form>
        </Card>
      </Dialog>
    </>
  );
};

export default EditModal;
