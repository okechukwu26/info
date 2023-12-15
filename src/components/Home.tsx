/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Typography,
  Box,
  OutlinedInput,
  Card,
  TextField,
  FormControl,
  MenuItem,
  ListItemText,
  InputLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { ErrorFunction } from "../utils";
import axiosInstance from "../Request/axiosInstance";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Checkbox from "@mui/material/Checkbox";
import { AxiosError } from "axios";
import GetHook from "./Hook";

export interface SECTOR {
  _id: string;
  name: string;
}
export interface FORM {
  term: boolean;
  fullName: string;
}
interface ERROR {
  fullName: string;
  sector: string;
  term: string;
}
const Home = () => {
  const [sector, setSector] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState([] as SECTOR[]);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({} as ERROR);
  const [axiosError, setAxiosError] = useState("");
  const [form, setForm] = useState({
    term: false,
  } as FORM);
//   const getSector = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("sector");

//       setSelect(res.data);
//       setLoading(false);
//     } catch (error) {
//       const err = error as AxiosError;
//       ErrorFunction(err, setLoading, setError);
//     }
//   };
  useEffect(() => {
    // getSector();
    GetHook(setLoading, setSelect, setError)
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof sector>) => {
    const {
      target: { value },
    } = event;
    setSector(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setErrors((prev) => ({ ...prev, sector: "" }));
  };
  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (checked) {
      setErrors((prev) => ({ ...prev, term: "" }));
    }
    if (value) {
      setErrors((prev) => ({ ...prev, fullName: "" }));
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.term === false) {
      return setErrors((prev) => ({
        ...prev,
        term: "Please agree to the terms and conditions to proceed ",
      }));
    }
    if (sector.length === 0) {
      return setErrors((prev) => ({
        ...prev,
        sector: "choose atleast one sector",
      }));
    } else {
      setErrors((prev) => ({ ...prev, sector: "" }));
    }

    if (form.fullName === "") {
      return setErrors((prev) => ({
        ...prev,
        fullName: "This field is required",
      }));
    }
    try {
      setLoading(true);
      await axiosInstance.post("/user", { ...form, sector });
      toast.success("Saved!");
      setLoading(false);
      setForm((prev) =>({...prev,fullName:"", term:false}))
    } catch (error) {
      const err = error as AxiosError;
      ErrorFunction(err, setLoading, setAxiosError);
    }
    setForm(() =>({fullName:"", term:false}))
  };
  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: { sm: "2rem", md: "7rem" },
          marginLeft: { xs: "2rem" },
          marginRight: { xs: "2rem" },
        }}
      >
        <Card
          sx={{
            maxWidth: "37rem",
          }}
        >
          {error && (
            <Typography
              variant="body1"
              color="red"
              sx={{ textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
          {axiosError && (
            <Typography
              variant="body1"
              color="red"
              sx={{ textAlign: "center" }}
            >
              {axiosError}
            </Typography>
          )}
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.3rem" },
            }}
          >
            Occupational Data
          </Typography>
          <Typography
            variant="body2"
            color="grey"
            sx={{
              fontSize: { xs: ".7rem", sm: ".9rem", md: "1rem" },
              textAlign: { xs: "center" },
              padding: "5px",
            }}
          >
            Please enter your name and pick the sector you are currently
            involved in.
          </Typography>

          <Box
            sx={{
              margin: "1rem",
            }}
          >
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <TextField
                  id="outlined-basic"
                  label="fullName"
                  variant="outlined"
                  onChange={handleSelect}
                  name="name"
                  error={errors.fullName ? true : false}
                  helperText={errors?.fullName}
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{ m: 1, maxWidth: "35rem" }}
                variant="standard"
              >
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
                  {select.map((name: SECTOR) => (
                    <MenuItem key={name._id} value={name.name}>
                      <ListItemText primary={name.name} />
                      <Checkbox checked={sector.indexOf(name.name) > -1} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.sector && (
                  <Typography sx={{ textAlign: "center", color: "red" }}>
                    {errors.sector}
                  </Typography>
                )}
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Checkbox name="term" onChange={handleSelect} />
                <Typography>Agree to term</Typography>
              </Box>
              {errors.term && (
                <Typography sx={{ textAlign: "center", color: "red" }}>
                  {errors.term}
                </Typography>
              )}
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
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Home;
