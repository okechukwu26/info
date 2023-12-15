import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../Request/axiosInstance";

import { FaEdit } from "react-icons/fa";
import EditModal from "./EditModal";

export interface DATA {
  _id: string;
  name: string;
  sector: Array<string>;
  term: boolean;
}
const Details = () => {
  const [data, setData] = useState([] as DATA[]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({} as DATA);
  const [user, setUser] = useState({});
  const getMyData = async () => {
    try {
      const res = await axiosInstance.get("user");
      console.log(res.data);
      setData(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMyData();
  }, [user]);
  const handleClickOpen = (item: DATA) => {
    setOpen(true);
    setSelected(item);
  };
  const handleClose = () => setOpen(false);
  return (
    <>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        Edit My Info
      </Typography>
      {data.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>No Details Yet</Typography>
      ) : (
        <Box
          sx={{
            marginTop: "7rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 3rem",
          }}
        >
          <TableContainer>
            <Table>
              <thead>
                <StyledTr>
                  <StyledTh>ID</StyledTh>
                  <StyledTh>Name</StyledTh>
                  <StyledTh>Sector</StyledTh>
                  <StyledTh>Edit</StyledTh>
                </StyledTr>
              </thead>
              <tbody>
                {data.map((item: DATA) => (
                  <StyledTr key={item._id}>
                    <StyledTd>{item._id}</StyledTd>
                    <StyledTd>{item.name}</StyledTd>
                    <StyledTd>
                      {item.sector.map((sector) => (
                        <Box
                          key={sector}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography>{sector}</Typography>
                        </Box>
                      ))}
                    </StyledTd>
                    <StyledTd>
                      <Icon onClick={() => handleClickOpen(item)} />
                    </StyledTd>
                  </StyledTr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          <EditModal
            open={open}
            select={selected}
            onClose={handleClose}
            data={data}
            setData={setData}
            setUser={setUser}
          />
        </Box>
      )}
    </>
  );
};
export const Thead = styled.thead`
  font-family: Work Sans;
  background: grey;
`;
export const TableContainer = styled.div`
  overflow: auto;
  width: 100%;
  display:flex;
  align-items: center;
  justify-content: center;

  //box-shadow

  @media screen and (max-width: 762px) {
    width: 40rem;
  
  }
`;
export const Table = styled.table`
  background: #fff;
  border-collapse: collapse;
  margin: 20px;
  border-radius: 10px;
 min-width:80%;


  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  @media screen and (max-width: 762px) {
    margin-left:100px;
    margin-top:5px
  }
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.01);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`;

export const StyledTh = styled.th`
  padding: 4px;
  text-align: left;
  background-color: #fff;
  border-radius: 10px;
  width: 123px;
  @media screen and (max-width: 762px) {
    padding: 1px;
    text-align: center;
    width: 80px;
    /* font-size: 9px; */
  }
`;

export const StyledTd = styled.td`
  border-top: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-family: Work Sans;
  @media screen and (max-width: 762px) {
    padding: 3px;
  }
`;
export const StyledTr = styled.tr`
  @media screen and (max-width: 762px) {
    font-size: 0.8rem;
    text-align: center;
    justify-content: center;
    font-family: Work Sans;
  }
  &:hover {
    background-color: #ecfdf3;
  }
`;
const Icon = styled(FaEdit)`
  color: #2076d2;
  &:hover {
    cursor: pointer;
  }
`;

export default Details;
